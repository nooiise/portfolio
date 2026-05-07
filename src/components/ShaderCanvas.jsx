import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const ShaderCanvas = () => {
  const mountRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false)
  const animateRef = useRef(null)
  const rendererRef = useRef(null)
  const materialRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current;
    let width, height, aspect, scene, camera;
    
    // Scene setup
    
    // Initialize Three.js elements
    const init = () => {
      scene = new THREE.Scene();
      width = mount.clientWidth;
      height = mount.clientHeight;
      aspect = width / height;

      // Camera setup
      camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
      camera.position.z = 1;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer


      // Shader setup
      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) }
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec2 iResolution;
          uniform float iTime;

          void mainImage(out vec4 fragColor, vec2 fragCoord) {
            float mr = min(iResolution.x, iResolution.y);
            vec2 uv = (fragCoord * 1.5 - iResolution.xy) / mr;

            float d = -iTime * 0.3;
            float a = 1.0;
            for (float i = 0.0; i < 10.0; ++i) {
              a += cos(i - d - a * uv.x);
              d += sin(uv.y * i + a);
            }
            d += iTime * 0.9;
            vec3 col = vec3(
                cos(uv.x * d) * 0.1 + 0.1,        // Red channel
                sin(uv.y * a) * 0.4 + 1.0,        // Green channel
                cos(a + d) * 0.1 + 1.0            // Blue channel
            );        
            col = cos(col * cos(vec3(d, a*0.5, 2.5)) * vec3(0.8, 0.4, 1.8) + 0.4);
            fragColor = vec4(col.rgb * vec3(2.0, 0.5, 1.2), 1);
          }

          void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
          }
        `
      });
      materialRef.current = material;

      // Mesh setup
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    init();

    // Animation
    const clock = new THREE.Clock();
    let lastFrameTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp) => {
      animateRef.current = requestAnimationFrame(animate);
      if(isPaused) return;

      const deltaTime = timestamp - lastFrameTime
      if(deltaTime > frameInterval) {
        if(rendererRef.current) {
          materialRef.current.uniforms.iTime.value = clock.getElapsedTime()
          rendererRef.current.render(scene, camera)
          lastFrameTime = timestamp - (deltaTime % frameInterval)
        }
      }
    };
    animateRef.current = requestAnimationFrame(animate);

    const handleVisibilityChange = () => { 
      setIsPaused(document.hidden)
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);



    // Resize handler
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        width = mount.clientWidth;
        height = mount.clientHeight;
        aspect = width / height;

        camera.left = -aspect;
        camera.right = aspect;
        camera.updateProjectionMatrix();
      
        rendererRef.current.setSize(width, height);
        materialRef.current.uniforms.iResolution.value.set(width, height);
      }, 100)
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animateRef.current)
      if (rendererRef.current) {
        rendererRef.current.dispose();

        rendererRef.current.forceContextLoss()
        mount.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isPaused]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1 // Adjust based on your needs
      }}
    />
  );
};

export default ShaderCanvas;
