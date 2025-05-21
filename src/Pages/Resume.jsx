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
    <div className="min-h-screen bg-white text-black font-montserrat px-4 md:px-10 py-16 max-w-full overflow-x-hidden pt-20">
      <main className="max-w-5xl mx-auto">
        {/* Heading — no animation */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-black tracking-tight drop-shadow-sm text-left">
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
                  <FaCircle className="text-green-500 text-sm bg-white rounded-full" />
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <h3 className="text-2xl font-bold mb-2">Summary</h3>
                  <p className="text-gray-700">
                    <strong>Muhammad Marjan K.K</strong> — Passionate Full Stack Developer with 1 year of experience building user-friendly web apps using React, Node.js, and modern technologies.
                  </p>
                  <ul className="mt-2 text-gray-600 text-sm space-y-1">
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
              viewport={{ once:false, amount: 0.3 }}
            >
              <div className="relative pl-8">
                <div className="absolute -left-1 top-0">
                  <FaCircle className="text-green-500 text-sm bg-white rounded-full" />
                </div>
                <div className="border-l-2 border-green-500 pl-4 space-y-4">
                  <h3 className="text-2xl font-bold mb-2">Education</h3>
                  <div>
                    <h4 className="text-lg font-semibold">
                      B.A. Economics <span className="text-sm text-gray-500">| 2020 - 2023</span>
                    </h4>
                    <p className="italic text-gray-700">University of Calicut</p>
                    <p className="text-gray-600">
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
                  <FaCircle className="text-green-500 text-sm bg-white rounded-full" />
                </div>
                <div className="border-l-2 border-green-500 pl-4 space-y-6">
                  <h3 className="text-2xl font-bold mb-2">Professional Experience</h3>
                  <div>
                    <h4 className="text-lg font-semibold">
                      Full Stack Developer <span className="text-sm text-gray-500">| 2023 - Present</span>
                    </h4>
                    <p className="italic text-gray-700">Freelance / Remote</p>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Built responsive web apps using React, Node.js, and Tailwind CSS</li>
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
                  <FaCircle className="text-green-500 text-sm bg-white rounded-full" />
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <h3 className="text-2xl font-bold mb-2">Personal</h3>
                  <p className="text-gray-600">
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
