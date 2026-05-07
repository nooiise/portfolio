import { motion, AnimatePresence } from 'framer-motion'

const textVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

const Paragraph = ({ className, children }) => {
  return <motion.p whileInView={"visible"} initial={"hidden"} viewport={{ margin: "0px 0px -30% 0px", amount: 0.5, once: true }} variants={textVariant} className={className}>{children}</motion.p>
}

const Image = ({index, prefix, alt}) => {
  return <div className="shadow-lg shadow-gray-400 relative w-full md:w-2/3 h-fit aspect-[1876/921] md:sticky md:top-32">
    <AnimatePresence>
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 w-full h-full"
      >
        <img src={`/${prefix}_${index}.png`} className="absolute inset-0 w-full h-full object-cover" alt={alt} />
      </motion.div>
    </AnimatePresence>
  </div>
}

const Portfolio = ({ projectRef, projectRef1, imageIndex, imageIndex1 }) => {

  return (
    <section id="portfolio" className="relative flex flex-col gap-8 px-8 md:px-16 py-12 w-full">
      <h2 className='font-medium tracking-wide text-4xl'>Projects</h2>
      <div className="flex flex-col gap-16">
        {/* BURAK Project */}
        <div ref={projectRef} className="w-full flex flex-col md:flex-row gap-24 relative">
          <Image prefix="burak" index={imageIndex} alt="BURAK project image" />
          <div className="flex flex-col gap-4 w-full md:w-1/3 text-xl">
            <Paragraph className='text-2xl font-bold'>BURAK</Paragraph>
            <Paragraph>The client required a web application to publish the magazine's content. Due to this, I sought a dynamic site development with a dashboard for uploading content.</Paragraph>
            <Paragraph>An attractive and modern design was created that reflects BURAK's aesthetics.</Paragraph>
            <Paragraph>The project was developed in NextJS for frontend and backend, using MongoDB as a database. This stack allowed us to create a robust and complex application.</Paragraph>
            <Paragraph>A user authentication and authorization system with roles and permissions was implemented for access to protected URLs such as the dashboard. This system also allows regular users to save, like, and comment on publications, thereby improving site interactivity.</Paragraph>
            <Paragraph className='hidden md:block'>SEO was optimized to make publications easy to find by search engines.</Paragraph>
            <Paragraph className='hidden md:block'>The administration system (dashboard) allows for the complete management of the website, while also providing analytics. It offers the ease of creating, updating, deleting, and listing the database.</Paragraph>
            <Paragraph className='hidden md:block'>With this system, multiple users can have access to different parts of the dashboard, creating a workflow where each employee can manage the area of the website they are in charge of.</Paragraph>
            <Paragraph className='hidden md:block'>Being a web application, I implemented the installation of the site in the style of a smartphone app. A notification system was also created where the user can choose to receive notifications and the administrator can choose whether or not to notify the publication that is about to be uploaded.</Paragraph>
            <Paragraph className='hidden md:block'>Upon completion, a server was configured for the database and the application, using PM2 and Nginx to maintain a lightweight and fault-tolerant infrastructure.</Paragraph>
          </div>
        </div>

        <hr id='projectSep' className='border-black w-full' />

        {/* HUGO BENJAMIN Project */}
        <div ref={projectRef1} className="w-full flex flex-col-reverse md:flex-row gap-24 relative">
          <div className="flex flex-col gap-4 w-full md:w-1/3 text-xl">
            <Paragraph className='text-2xl font-bold'>HUGO BENJAMIN</Paragraph>
            <Paragraph>Redesign and total migration of the original website.</Paragraph>
            <Paragraph>The website was previously built on a Site Builder. This site was slow, poorly structured, and had a design that did not adhere to the brand image.</Paragraph>
            <Paragraph>The migration to a static web hosting allowed us to reduce server maintenance costs by 46%.</Paragraph>
            <Paragraph>In turn, this migration to a simpler infrastructure managed to reduce loading times by 78%, giving us room for visual improvements that were impossible to make in the previous system.</Paragraph>
            <Paragraph>The visual improvement is noticeable when comparing both versions side by side. The previous site did not have a clear structure of the contents. By improving the image and separating the contents into different pages, I achieved a cleaner and clearer design for the user.</Paragraph>
            <Paragraph className='hidden md:block'>For the data loading system, we used JSON files to avoid complicating the system with databases or other unnecessary technologies for such a simple infrastructure. These JSON files are maintained by us and updated with the information provided by the client.</Paragraph>
            <Paragraph className='hidden md:block'>An SSL certificate was provided, which ensures the connection to the site. This certification was not implemented in the previous platform and was key to receiving more clients.</Paragraph>
            <Paragraph className='hidden md:block'>I conducted an analysis and report of monthly analytics using Google Analytics. Thanks to the monitoring of these analytics, I can be proud to have improved traffic to the website with 300 more monthly visits.</Paragraph>
          </div>
          <Image prefix="hugobenjamin" index={imageIndex1} alt="HUGO BENJAMIN project image" />
        </div>
      </div>
    </section>
  )
}

export default Portfolio
