import { motion } from "framer-motion";
import work1 from "../assets/works-1.jpg";
import work2 from "../assets/works-2.jpg";
import work3 from "../assets/works-3.png";

export default function Work() {
  const projects = [
    {
      title: "7 Up Website",
      description:
        "A visually appealing and interactive website for the 7 Up brand, focusing on vibrant design and smooth user experience.",
      imageUrl: work1,
      type: "image",
    },
    {
      title: "Booking.com Website",
      description:
        "A robust travel booking platform with extensive search and filter options, designed for easy navigation and quick booking.",
      imageUrl: work2,
      type: "image",
    },
    {
      title: "Bridgeon Student Management System",
      description:
        "A full-stack student management system built to manage student data, course enrollment, attendance, and academic records with secure backend integration and efficient data handling.",
      imageUrl: work3,
      type: "image",
      link: "https://bridgeonfrontend.vercel.app/",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative min-h-screen text-white px-6 md:px-12 pt-24 pb-20 font-montserrat overflow-hidden">
      {/* 🔲 Background Video */}

      {/* 🟣 Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0" />

      {/* 🧠 Main Content */}
      <motion.main
        className="relative max-w-5xl mx-auto z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">

          Delivered Projects
        </h2>

        <div className="flex flex-col space-y-12">
          {projects.map(({ title, description, imageUrl, videoUrl, type, link }, i) => (
            <motion.div
              key={title}
              className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              variants={fadeUp}
              custom={i}
            >
              <div className="relative aspect-video w-full group">
                {type === "image" ? (
                  <motion.img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <motion.video
                    src={videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    preload="metadata"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                  >
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all shadow-lg hover:scale-105">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white font-medium tracking-wide">View Project</span>
                    </div>
                  </a>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-white">{title}</h3>
                <p className="text-gray-200 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}


////////////////////