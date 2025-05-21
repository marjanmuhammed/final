import { motion } from "framer-motion";
import { FaCode, FaServer, FaTools, FaCogs, FaPlug, FaWrench } from "react-icons/fa";

export default function Services() {
  const fadeFrom = {
    hidden: { opacity: 0, x: 0, y: 0 },
    visible: (i) => {
      const direction = i % 4;
      let x = 0, y = 0;
      if (direction === 0) x = -50; // left
      if (direction === 1) x = 50;  // right
      if (direction === 2) y = -50; // top
      if (direction === 3) y = 50;  // bottom
      return {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.8 },
      };
    },
  };

  const services = [
    {
      title: "Web Development",
      icon: FaCode,
      desc: "I create responsive, scalable, and fast websites using modern frameworks like React and Node.js. Clean code, reusable components, and performance are my focus.",
      color: "#3B82F6",
    },
    {
      title: "Hosting & Deployment",
      icon: FaServer,
      desc: "Deploying applications on trusted platforms like Vercel, Netlify, or traditional cPanel with domain and SSL setup. CI/CD integration for automatic builds.",
      color: "#10B981",
    },
    {
      title: "Maintenance",
      icon: FaTools,
      desc: "Regular updates, performance monitoring, bug fixing, and keeping your project up-to-date with the latest security patches and technology improvements.",
      color: "#F59E0B",
    },
    {
      title: "Automation",
      icon: FaCogs,
      desc: "Automating workflows like backups, email notifications, and scheduled tasks using tools like GitHub Actions or cron jobs to improve efficiency.",
      color: "#8B5CF6",
    },
    {
      title: "API Integration",
      icon: FaPlug,
      desc: "Integrating third-party APIs like payment gateways, weather APIs, and social media logins using REST and GraphQL with proper error handling.",
      color: "#EF4444",
    },
    {
      title: "Bug Fixing & Optimization",
      icon: FaWrench,
      desc: "Debugging complex issues and optimizing website performance with tools like Lighthouse, ensuring fast load time, accessibility, and better UX.",
      color: "#0EA5E9",
    },
  ];

  return (<div
    className="min-h-screen bg-white font-montserrat px-4 md:px-10 pt-20 pb-16 max-w-full overflow-x-hidden"
    id="services"
  >
    <motion.main
      className="max-w-4xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-extrabold mb-10 text-black tracking-tight drop-shadow-sm text-left"
        variants={fadeFrom}
      >
        Services
      </motion.h2>
  
      <motion.p
        className="text-lg text-gray-700 mb-16 leading-relaxed max-w-3xl drop-shadow-sm text-left"
        variants={fadeFrom}
        custom={1}
      >
        I offer end-to-end development services — from building fast, modern websites to deploying,
        automating, and maintaining them. Each service is crafted to deliver real value and reliability.
      </motion.p>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {services.map(({ title, icon: Icon, desc, color }, i) => (
          <motion.div
            key={title}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:bg-gray-50 transform transition duration-300 border border-gray-100"
            variants={fadeFrom}
            custom={i + 2}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-4">
              <Icon size={32} color={color} className="mr-3" />
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">{desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.main>
  </div>
  
  );
}