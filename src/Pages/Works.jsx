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
    {
      title: "Online Shopping Website",
      description: "An e-commerce shopping website with smooth animations and video integration. Features include product showcases, cart functionality, and a modern responsive UI for a seamless shopping experience",
      videoUrl: "/public/video/B740FB9B D30E 4A23 9D28 A03FE83A0F2F.mp4", // ✅ renamed and cleaned path
      type: "video",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.8 },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-12 pt-20 pb-20 font-montserrat max-w-4xl mx-auto">
      <motion.h2
        className="text-4xl font-extrabold mb-12 text-gray-900 tracking-tight text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        custom={0}
      >
        Delivered Projects
      </motion.h2>

      <div className="flex flex-col space-y-12">
        {projects.map(({ title, description, imageUrl, videoUrl, type }, i) => (
          <motion.div
            key={title}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={i + 1}
          >
            <div className="relative aspect-video overflow-hidden w-full">
              {type === "image" ? (
                <motion.img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
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
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h3>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
