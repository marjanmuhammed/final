import { motion } from "framer-motion";

export default function Work() {
  const projects = [
    {
      title: "7 Up Website",
      description:
        "A visually appealing and interactive website for the 7 Up brand, focusing on vibrant design and smooth user experience.",
      imageUrl: "https://i.postimg.cc/Df5cs38c/166-CFDAF-198-A-4-BD1-B07-F-B1-F39-E0-D776-D-1-201-a.jpg",
      type: "image",
    },
    {
      title: "Booking.com Website",
      description:
        "A robust travel booking platform with extensive search and filter options, designed for easy navigation and quick booking.",
      imageUrl: "https://i.postimg.cc/Kzxnk0bV/1-F9-DF900-BB10-4-D81-B8-D7-2-B5-B099-C27-BD-1-201-a.jpg",
      type: "image",
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
        <h2  className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">

          Delivered Projects
        </h2>

        <div className="flex flex-col space-y-12">
          {projects.map(({ title, description, imageUrl, videoUrl, type }, i) => (
            <motion.div
              key={title}
              className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              variants={fadeUp}
              custom={i}
            >
              <div className="relative aspect-video w-full">
                {type === "image" ? (
                  <motion.img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
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
