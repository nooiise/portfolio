/**
 * generate-blog-images.mjs
 *
 * Reads .mdx files from ./src/content/blog, hashes their content,
 * and renders a unique hero image for each post using a headless WebGL shader.
 *
 * Usage:  node generate-blog-images.mjs
 * Deps:   npm install gl sharp gray-matter
 */

import fs   from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import gl    from 'gl';
import sharp from 'sharp';

// ─── Config ──────────────────────────────────────────────────────────────────

const BLOG_DIR   = './src/content/blog';
const OUTPUT_DIR = './public/blog-images';
const IMG_WIDTH  = 2400;
const IMG_HEIGHT = 1260;  // 2× retina OG size (same 1.91:1 ratio, hi-DPI social sharing)

// ─── Shader sources ──────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

/**
 * The original ShaderCanvas fragment shader, extended with four hash-driven
 * uniforms so every post gets a visually distinct but deterministic result:
 *
 *   uTime        — replaces the clock; shifts the overall animation frame
 *   uColorMult   — per-channel multiplier on the cos() palette transform
 *   uColorShift  — per-channel additive offset on the same transform
 *   uUVScale     — stretches / compresses the UV coordinates
 */
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec2  iResolution;
  uniform float uTime;
  uniform vec3  uColorMult;
  uniform vec3  uColorShift;
  uniform float uUVScale;

  void mainImage(out vec4 fragColor, vec2 fragCoord) {
    float mr = min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord * uUVScale - iResolution.xy) / mr;

    float d = -uTime * 0.3;
    float a = 1.0;
    for (float i = 0.0; i < 10.0; ++i) {
      a += cos(i - d - a * uv.x);
      d += sin(uv.y * i + a);
    }
    d += uTime * 0.9;

    vec3 col = vec3(
      cos(uv.x * d) * 0.1 + 0.1,
      sin(uv.y * a) * 0.4 + 1.0,
      cos(a + d)    * 0.1 + 1.0
    );
    col = cos(
      col
      * cos(vec3(d, a * 0.5, 2.5))
      * (vec3(0.8, 0.4, 1.8) * uColorMult)
      + uColorShift
    );

    fragColor = vec4(col.rgb * vec3(2.0, 0.5, 1.2), 1.0);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * SHA-256 of the post body → hex string.
 */
function hashContent(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Converts the first `count * 8` hex chars of a hash into floats in [0, 1].
 * Each 8-char chunk → one 32-bit int → divided by 0xFFFFFFFF.
 */
function hashToFloats(hash, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const chunk = hash.slice(i * 8, i * 8 + 8).padEnd(8, '0');
    out.push(parseInt(chunk, 16) / 0xffffffff);
  }
  return out;
}

/**
 * WebGL readPixels returns rows bottom-to-top; flip so top is first.
 */
function flipVertically(pixels, width, height) {
  const flipped = new Uint8Array(pixels.length);
  const rowBytes = width * 4;
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * rowBytes;
    flipped.set(pixels.subarray(src, src + rowBytes), y * rowBytes);
  }
  return flipped;
}

/** Compile one shader stage; throws on error. */
function compileShader(glCtx, type, source) {
  const shader = glCtx.createShader(type);
  glCtx.shaderSource(shader, source);
  glCtx.compileShader(shader);
  if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
    throw new Error(
      `Shader compile error:\n${glCtx.getShaderInfoLog(shader)}\n\nSource:\n${source}`
    );
  }
  return shader;
}

// ─── Core renderer ───────────────────────────────────────────────────────────

/**
 * Renders the shader for a given hash and returns raw RGBA Uint8Array
 * (already vertically flipped, ready for sharp).
 */
function renderShader(hash, width, height) {
  // Derive 8 independent floats in [0, 1] from the hash
  const [f0, f1, f2, f3, f4, f5, f6, f7] = hashToFloats(hash, 8);

  // Map each float to a meaningful range
  const uTime       = f0 * 60.0 + 3.0;                    // 3 … 63  — picks a "frame"
  const uColorMult  = [f1 * 1.4 + 0.3, f2 * 1.4 + 0.3, f3 * 1.4 + 0.3]; // 0.3 … 1.7
  const uColorShift = [f4 * 1.2 - 0.6, f5 * 1.2 - 0.6, f6 * 1.2 - 0.6]; // -0.6 … 0.6
  const uUVScale    = f7 * 0.8 + 1.1;                     // 1.1 … 1.9 — zoom / stretch

  // ── Create headless GL context ──────────────────────────────────────────
  const glCtx = gl(width, height, { preserveDrawingBuffer: true });
  if (!glCtx) throw new Error('Could not create WebGL context (headless-gl).');

  try {
    // ── Program ────────────────────────────────────────────────────────────
    const program = glCtx.createProgram();
    glCtx.attachShader(program, compileShader(glCtx, glCtx.VERTEX_SHADER,   VERTEX_SHADER));
    glCtx.attachShader(program, compileShader(glCtx, glCtx.FRAGMENT_SHADER, FRAGMENT_SHADER));
    glCtx.linkProgram(program);
    if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
      throw new Error(`Program link error: ${glCtx.getProgramInfoLog(program)}`);
    }
    glCtx.useProgram(program);

    // ── Fullscreen quad ────────────────────────────────────────────────────
    const verts  = new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]);
    const buffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buffer);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, verts, glCtx.STATIC_DRAW);

    const aPos = glCtx.getAttribLocation(program, 'aPosition');
    glCtx.enableVertexAttribArray(aPos);
    glCtx.vertexAttribPointer(aPos, 2, glCtx.FLOAT, false, 0, 0);

    // ── Uniforms ────────────────────────────────────────────────────────────
    const u = (name) => glCtx.getUniformLocation(program, name);
    glCtx.uniform2f (u('iResolution'), width, height);
    glCtx.uniform1f (u('uTime'),       uTime);
    glCtx.uniform3fv(u('uColorMult'),  uColorMult);
    glCtx.uniform3fv(u('uColorShift'), uColorShift);
    glCtx.uniform1f (u('uUVScale'),    uUVScale);

    // ── Draw ────────────────────────────────────────────────────────────────
    glCtx.viewport(0, 0, width, height);
    glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);

    // ── Read pixels ─────────────────────────────────────────────────────────
    const pixels = new Uint8Array(width * height * 4);
    glCtx.readPixels(0, 0, width, height, glCtx.RGBA, glCtx.UNSIGNED_BYTE, pixels);

    return flipVertically(pixels, width, height);
  } finally {
    // Always destroy the GL context to free native resources
    const ext = glCtx.getExtension('STACKGL_destroy_context');
    if (ext) ext.destroy();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.mdxs'));

  if (files.length === 0) {
    console.warn(`No .mdx / .mdxs files found in ${BLOG_DIR}`);
    return;
  }

  console.log(`Found ${files.length} post(s). Generating hero images…\n`);

  for (const file of files) {
    const filePath  = path.join(BLOG_DIR, file);
    const raw       = fs.readFileSync(filePath, 'utf-8');
    const parsed    = matter(raw);
    const { data, content } = parsed;

    const slug          = path.basename(file, path.extname(file));
    const outFile       = path.join(OUTPUT_DIR, `${slug}.jpg`);
    const heroImagePath = `/blog-images/${slug}.jpg`;

    console.log(`  ${slug}`);

    // ── Image ────────────────────────────────────────────────────────────────
    if (fs.existsSync(outFile)) {
      console.log(`    image     skipped (already exists)`);
    } else {
      const hash   = hashContent(content);
      const pixels = renderShader(hash, IMG_WIDTH, IMG_HEIGHT);

      await sharp(Buffer.from(pixels), {
        raw: { width: IMG_WIDTH, height: IMG_HEIGHT, channels: 4 },
      })
        .jpeg({ quality: 92, mozjpeg: true })
        .toFile(outFile);

      console.log(`    image     ${outFile}`);
    }

    // ── Frontmatter ──────────────────────────────────────────────────────────
    if (data.heroImage === heroImagePath) {
      console.log(`    frontmatter skipped (heroImage already set)`);
    } else {
      data.heroImage = heroImagePath;
      fs.writeFileSync(filePath, matter.stringify(content, data), 'utf-8');
      console.log(`    frontmatter heroImage: ${heroImagePath}`);
    }
  }

  console.log('\nDone ✓');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
