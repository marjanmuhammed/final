import { motion } from "framer-motion";
import { 
  FaPhoneAlt, FaMapMarkerAlt, FaGraduationCap, FaEnvelope, FaLaptopCode, FaClock,
  FaHtml5, FaCss3Alt, FaBootstrap, FaJs, FaReact, FaGitAlt, FaHashtag
} from "react-icons/fa";
import { SiTailwindcss, SiRedux } from "react-icons/si";

export default function About() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: "easeOut" }
    },
  };

  const skills = [
    { name: "HTML", level: 95, Icon: FaHtml5, color: "#E34F26" },
    { name: "CSS", level: 90, Icon: FaCss3Alt, color: "#1572B6" },
    { name: "Bootstrap", level: 85, Icon: FaBootstrap, color: "#7952B3" },
    { name: "JavaScript", level: 90, Icon: FaJs, color: "#F7DF1E" },
    { name: "React", level: 90, Icon: FaReact, color: "#61DAFB" },
    { name: "Tailwind", level: 85, Icon: SiTailwindcss, color: "#38B2AC" },
    { name: "Redux", level: 80, Icon: SiRedux, color: "#764ABC" },
    { name: "C#", level: 75, Icon: FaHashtag, color: "#239120" },  // changed here
  ];

  return (
    <div
      id="about"
      className="min-h-screen bg-white font-montserrat px-4 md:px-10 py-16 max-w-full overflow-x-hidden pt-20"
    >
      <motion.main
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        {/* About Me Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold mb-10 text-black tracking-tight drop-shadow-sm"
          variants={fadeUpVariant}
        >
          About Me
        </motion.h2>

        {/* About Me Paragraph */}
        <motion.p
          className="text-lg text-gray-700 mb-16 leading-relaxed max-w-3xl drop-shadow-sm"
          variants={fadeUpVariant}
          transition={{ delay: 0.3, duration: 1.2 }}
        >
          Hello! I'm <strong>Muhammad Marjan K.K</strong>, a passionate Full Stack Developer with 1 year of experience building scalable and user-friendly web applications. Skilled in React, Node.js, and modern web technologies, I am continuously learning and improving my craft. Based in Calicut, Kerala, I enjoy turning complex problems into elegant solutions and working collaboratively in teams.
        </motion.p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-full">
          {[ 
            { icon: <FaPhoneAlt />, label: "Phone", value: "+91 7902480917" },
            { icon: <FaMapMarkerAlt />, label: "City", value: "Calicut, Kerala, India" },
            { icon: <FaGraduationCap />, label: "Degree", value: "B.A. Economics" },
            { icon: <FaEnvelope />, label: "Email", value: "marjanmuhammad790@gmail.com" },
            { icon: <FaLaptopCode />, label: "Freelance", value: "Available" },
            { icon: <FaClock />, label: "Experience", value: "1 Year" },
          ].map(({ icon, label, value }, i) => (
            <motion.div
              key={label}
              className="flex items-center bg-white rounded-xl shadow-lg p-6 space-x-5 hover:bg-blue-50 cursor-default select-none"
              variants={fadeUpVariant}
              transition={{ delay: 0.2 + i * 0.25, duration: 1.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(147, 197, 253, 0.3)" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="text-blue-500 text-3xl">{icon}</div>
              <div>
                <p className="text-sm text-blue-400 font-semibold tracking-wide">{label}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Section */}
        <motion.div
          className="mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h3
            className="text-3xl font-extrabold mb-8 text-black tracking-tight"
            variants={fadeUpVariant}
          >
            Skills
          </motion.h3>

          <motion.p
            className="text-gray-600 text-sm mb-10 max-w-xl"
            variants={fadeUpVariant}
          >
            These are the core skills I specialize in. Each bar represents my confidence and experience level. I'm always learning and improving!
          </motion.p>

          <div className="space-y-6">
            {skills.map(({ name, level, Icon, color }, i) => (
              <motion.div
                key={name}
                className="w-full"
                variants={fadeUpVariant}
                transition={{ delay: 0.2 + i * 0.2, duration: 1 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <Icon size={24} color={color} />
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                {/* fixed light blue color */}
<motion.div
  className="h-3 rounded-full"
  style={{ backgroundColor: "#60A5FA" }}
  initial={{ width: 0 }}
  whileInView={{ width: `${level}%` }}
  transition={{ duration: 1.2, ease: "easeOut" }}
></motion.div>

                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
