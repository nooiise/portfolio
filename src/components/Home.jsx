import { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Portfolio from './Portfolio'
import About from './About'
import Contact from './Contact'

const Home = () => {
  const [clientWindowHeight, setClientWindowHeight] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const [imageIndex1, setImageIndex1] = useState(0)
  const projectRef = useRef(null)
  const projectRef1 = useRef(null)

  const handleScroll = () => {
    const header = document.getElementById("header")
    const hr = document.getElementById("projectSep")
    if(!header || !hr || !projectRef.current || !projectRef1.current) return;
    
    const scrollOfEachImg = (projectRef.current.clientHeight / 4) - 100
    const scrollOfEachImg1 = (projectRef1.current.clientHeight / 4) + 300
    
    setImageIndex(Math.min(Math.max(Math.floor((window.scrollY - header.clientHeight) / scrollOfEachImg), 0), 3))
    setImageIndex1(Math.min(Math.max(Math.floor((window.scrollY - hr.offsetTop) / scrollOfEachImg1), 0), 2))
    setClientWindowHeight(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col scroll-smooth">
      <Navbar clientWindowHeight={clientWindowHeight} />
      <main id="home" className="flex h-full w-full flex-1 flex-col">
        <Hero />
        <Portfolio 
          projectRef={projectRef} 
          projectRef1={projectRef1} 
          imageIndex={imageIndex} 
          imageIndex1={imageIndex1} 
        />
        <About />
        <Contact />
      </main>
    </div>
  )
}

export default Home
