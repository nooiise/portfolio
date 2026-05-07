const About = () => {
  return (
    <section
      id="about"
      className="relative flex h-fit w-full  bg-black bg-opacity-80 py-8  md:p-12"
    >
      <img
        className="absolute -z-10 object-cover inset-0 w-full h-full"
        src={'/hero-bg-04.png'}
        alt="Hero Background"
      />
      <div className="z-10 flex flex-col w-full p-8 gap-12 text-white md:gap-12">
        <h2 className="text-7xl font-medium ">About me</h2>

        <p className="text-justify text-base w-full font-light md:max-w-[750px] md:text-2xl">
          Hello! I'm Matías Valtolina, a Software Developer and current Information Systems Engineering student at UTN.
        </p>
        <p className=" text-justify text-base font-light md:max-w-[750px] md:text-2xl">
          I actively work on diverse projects, including public contributions on GitHub and private solutions for clients. This hands-on experience complements my academic studies, reinforcing my skills and pushing me to learn new technologies.
        </p>
        <p className=" text-justify text-base font-light md:max-w-[750px] md:text-2xl">
          My technical expertise spans multiple domains:
        </p>
        <ul className='pl-4 text-justify text-base font-light md:max-w-[750px] md:text-2xl list-disc list-inside'>
          <li>Languages: Javascript/Typescript, Python, Rust, C/C++, among others.</li>
          <li>Databases: SQL, MongoDB.</li>
        </ul>
        <p className=' text-justify text-base font-light md:max-w-[750px] md:text-2xl'>I'm a quick learner and highly adaptable, always looking for new technical challenges.</p>
      </div>
    </section>
  )
}

export default About
