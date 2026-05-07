import { motion } from 'framer-motion'
import ShaderCanvas from './ShaderCanvas'

const Arrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 20H17.6C14.2397 20 12.5595 20 11.2761 19.346C10.1471 18.7708 9.2292 17.8529 8.65396 16.7239C8 15.4405 8 13.7603 8 10.4V4M8 4L13 9M8 4L3 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)

const Hero = () => {
  return (
    <header id='header' className="relative flex h-screen w-full items-center justify-around bg-black bg-opacity-30">
      <ShaderCanvas />
      <div
        className="z-10 flex flex-col gap-4 text-center"
      >
        <motion.h1 initial={{ opacity: 0, translateY: -25 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ ease: 'easeOut', duration: 1, delay: 0.7 }}
          className="text-4xl font-semibold text-white md:text-6xl">
          Matías Valtolina
        </motion.h1>
        <motion.p initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'easeOut', duration: 1, delay: 2 }}
          className="text-xl font-light text-white">
          Software developer & Systems engineering student
        </motion.p>
      </div>

      <div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-10 z-20 hidden md:flex items-center gap-4 text-white"
      >
        <Arrow />
        <div className="flex flex-col gap-1">
          <a 
            target='_blank'
            href="https://github.com/nooiise/noizportfolio/blob/main/components/ShaderCanvas.jsx" 
            className="font-light italic leading-none underline underline-offset-4">
              Yes, this is a shader
          </a>
        </div>
      </div>
    </header>
  )
}

export default Hero
