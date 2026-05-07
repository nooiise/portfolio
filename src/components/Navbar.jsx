import { motion } from 'framer-motion'

const Navbar = ({ clientWindowHeight }) => {
  return (
    <nav
      className={
        clientWindowHeight < 100
          ? 'navbar fixed top-0 z-[999] flex items-center w-full p-8 text-white transition-all duration-300 ease-in-out h-32'
          : 'navbar fixed top-0 z-[999] flex items-center w-full bg-white p-4 text-black transition-all duration-300 ease-in-out md:h-16'
      }
    >
      <div
        className={
          clientWindowHeight < 100
            ? 'px-16 flex w-full flex-col items-center *:leading-none justify-center gap-4 md:flex-row md:gap-8'
            : 'px-16 flex w-full flex-col items-center *:leading-none justify-center gap-2 md:flex-row'
        }
      >
        <a href="/#home" className='w-fit md:w-full flex items-center gap-2 text-3xl font-sans font-bold h-fit text-center md:text-left'>{"</noise>"}</a>
        <motion.ul
          initial={{ y: '-100px', opacity: 0 }}
          animate={{ y: '0', opacity: 1 }}
          transition={{ ease: 'easeOut', duration: 1 }}
          className="flex gap-4 text-light md:gap-14 md:text-xl "
        >
          <li className="w-full">
            <a href="/#home" className={
              clientWindowHeight < 100
                ? 'decoration-white underline-offset-2 hover:underline'
                : 'decoration-black underline-offset-2 hover:underline'
            }>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/#portfolio" className={
              clientWindowHeight < 100
                ? 'decoration-white underline-offset-2 hover:underline'
                : 'decoration-black underline-offset-2 hover:underline'
            }>
              Projects
            </a>
          </li>
          <li className="nav-item">
            <a href="/#about" className={
              clientWindowHeight < 100
                ? 'decoration-white underline-offset-2 hover:underline'
                : 'decoration-black underline-offset-2 hover:underline'
            }>
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="/blog" className={
              clientWindowHeight < 100
                ? 'decoration-white underline-offset-2 hover:underline'
                : 'decoration-black underline-offset-2 hover:underline'
            }>
              Blog
            </a>
          </li>
          <li className="nav-item">
            <a href="/#contact" className={
              clientWindowHeight < 100
                ? 'decoration-white underline-offset-2 hover:underline'
                : 'decoration-black underline-offset-2 hover:underline'
            }>
              Contact
            </a>
          </li>
        </motion.ul>
        <div className="w-full flex justify-end items-center">
          <a target='__blank' href="https://github.com/nooiise">
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
