import React, { useState } from 'react'
import data from '../data/carousel.json'
import Swipe from 'react-easy-swipe'
import chroma from "chroma-js";

const Carousel = ({ setSlideHex }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHoverPrev, setIsHoverPrev] = useState(false)
  const [isHoverNext, setIsHoverNext] = useState(false)

  const handleSetSlideHex = (hex) => {
    setSlideHex(hex)
  }

  const nextSlide = () => {
    let newSlide =
      currentSlide === data.projects.length - 1
        ? 0
        : currentSlide + 1
    setCurrentSlide(newSlide)
    handleSetSlideHex(data.projects[newSlide].hex)
  }

  const prevSlide = () => {
    let newSlide =
      currentSlide === 0
        ? data.projects.length - 1
        : currentSlide - 1
    setCurrentSlide(newSlide)
    handleSetSlideHex(data.projects[newSlide].hex)
  }

  const handleSetCurrentSlide = (index) => {
    setCurrentSlide(index)
    handleSetSlideHex(data.projects[index].hex)
  }

  return (
    <div className="h-full w-full ">
      <div className="relative flex h-full w-full overflow-hidden ">
        <div
          onClick={prevSlide}
          onMouseEnter={() => setIsHoverPrev(true)}
          onMouseLeave={() => setIsHoverPrev(false)}
          className="prevSlide absolute left-0 z-10 flex h-full w-24 cursor-pointer items-center justify-center text-3xl text-white transition opacity-50"
          style={{
            backgroundColor: isHoverPrev ? chroma(data.projects[currentSlide].hex).darken(0.7).hex() : 'transparent'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            fill="currentColor"
            className="bi bi-arrow-left-short"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
            />
          </svg>
        </div>
        <Swipe onSwipeLeft={nextSlide} onSwipeRight={prevSlide}>
          {data.projects.map((slide, index) => (
            <a
              href={slide.link}
              key={index}
              target="_blank"
              rel="noopener noreferrer "
              className={`group w-full ${index === currentSlide ? 'block' : 'hidden'}`}
              style={{ backgroundColor: slide.hex }}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                aria-label={slide.title}
                loading="lazy"
                className="absolute h-full w-full object-contain hidden lg:block transition duration-500 group-hover:opacity-30"
              />
              <img
                src={slide.imageSMUrl}
                alt={slide.title}
                aria-label={slide.title}
                loading="lazy"
                className="absolute h-full w-full object-contain block lg:hidden transition duration-500 group-hover:opacity-30"
              />
              <div
                className="absolute flex gap-4 h-full w-full flex-col items-center justify-center text-white opacity-0 transition delay-200 duration-500 group-hover:opacity-100"
              >
                <h3 className={chroma.contrast(slide.hex, "white") > 2 ? "text-3xl font-bold text-white" : "text-3xl font-bold text-black"}>
                  {slide.title}
                </h3>
                <p className={chroma.contrast(slide.hex, "white") > 2 ? "text-white font-semibold" : "text-black font-semibold"}>Tech Stack: {slide.techStack}</p>
              </div>
            </a>
          ))}
        </Swipe>

        <div className="absolute bottom-0 flex w-full justify-center">
          {data.projects.map((slide, index) => {
            return (
              <div
                key={index}
                className="mx-2 mb-4 h-4 w-4 cursor-pointer rounded-full border border-black"
                style={{ backgroundColor: index === currentSlide ? chroma(data.projects[currentSlide].hex).darken(0.8).hex() : "white" }}
                onClick={() => {
                  handleSetCurrentSlide(index)
                }}
              ></div>
            )
          })}
        </div>
        <div
          onClick={nextSlide}
          onMouseEnter={() => setIsHoverNext(true)}
          onMouseLeave={() => setIsHoverNext(false)}
          className="nextSlide absolute right-0 z-10 flex h-full w-24 cursor-pointer items-center justify-center text-3xl text-white transition opacity-50"
          style={{
            backgroundColor: isHoverNext ? chroma(data.projects[currentSlide].hex).darken(0.7).hex() : 'transparent'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            fill="currentColor"
            className="bi bi-arrow-right-short"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Carousel
