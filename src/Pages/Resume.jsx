import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";

export default function Resume() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 1.2, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-20 font-montserrat text-white">
      {/* Background Video */}
     

      {/* Overlay to darken the video but lighter for transparency */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 -z-5" />

      {/* Content Container */}
      <main className="relative max-w-5xl mx-auto bg-black/40 rounded-lg shadow-lg px-6 md:px-12 py-16">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          Resume
        </h2>

        {/* Resume Layout */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-10">
            {/* Summary */}
            <motion.div
              custom={1}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="relative pl-8">
                <div className="absolute -left-1 top-0">
                  <FaCircle className="text-green-400 text-sm bg-black/40 rounded-full" />
                </div>
                <div className="border-l-2 border-green-400 pl-4">
                  <h3 className="text-2xl font-bold mb-2 text-green-300">Summary</h3>
                  <p className="text-gray-300">
                    <strong>Muhammad Marjan K.K</strong> — Passionate Full Stack Developer with 1 year of experience building user-friendly web apps using React, dotnet, and modern technologies.
                  </p>
                  <ul className="mt-2 text-gray-400 text-sm space-y-1">
                    <li>📍 Calicut, Kerala, India</li>
                    <li>📞 +91 7902480917</li>
                    <li>✉️ marjanmuhammad790@gmail.com</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              custom={2}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="relative pl-8">
                <div className="absolute -left-1 top-0">
                  <FaCircle className="text-green-400 text-sm bg-black/40 rounded-full" />
                </div>
                <div className="border-l-2 border-green-400 pl-4 space-y-4">
                  <h3 className="text-2xl font-bold mb-2 text-green-300">Education</h3>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200">
                      B.A. Economics <span className="text-sm text-gray-400">| 2020 - 2023</span>
                    </h4>
                    <p className="italic text-gray-300">University of Calicut</p>
                    <p className="text-gray-400">
                      Developed analytical skills, logical reasoning and economics background helpful for full-stack development.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {/* Experience */}
            <motion.div
              custom={3}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="relative pl-8">
                <div className="absolute -left-1 top-0">
                  <FaCircle className="text-green-400 text-sm bg-black/40 rounded-full" />
                </div>
                <div className="border-l-2 border-green-400 pl-4 space-y-6">
                  <h3 className="text-2xl font-bold mb-2 text-green-300">Professional Experience</h3>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200">
                      Full Stack Developer <span className="text-sm text-gray-400">| 2023 - Present</span>
                    </h4>
                    <p className="italic text-gray-300">Freelance / Remote</p>
                    <ul className="list-disc pl-5 text-gray-400">
                      <li>Built responsive web apps using React, Dotnet, and Tailwind CSS</li>
                      <li>Integrated REST APIs and built authentication systems</li>
                      <li>Managed Git-based version control and team collaboration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal */}
            <motion.div
              custom={4}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="relative pl-8">
                <div className="absolute -left-1 top-0">
                  <FaCircle className="text-green-400 text-sm bg-black/40 rounded-full" />
                </div>
                <div className="border-l-2 border-green-400 pl-4">
                  <h3 className="text-2xl font-bold mb-2 text-green-300">Personal</h3>
                  <p className="text-gray-400">
                    Enthusiastic learner and team player who enjoys solving complex challenges through clean and maintainable code. Passionate about design and performance optimization.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
