import { motion } from "framer-motion";
import {
  FaCode, FaServer, FaTools, FaCogs, FaPlug, FaWrench
} from "react-icons/fa";
import { useMemo } from "react";

export default function Services() {
  const fadeFrom = {
    hidden: { opacity: 0, x: 0, y: 0 },
    visible: (i) => {
      const direction = i % 4;
      let x = 0, y = 0;
      if (direction === 0) x = -30;
      if (direction === 1) x = 30;
      if (direction === 2) y = -30;
      if (direction === 3) y = 30;
      return {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6 },
      };
    },
  };

  const services = useMemo(() => [
    {
      title: "Web Development",
      icon: FaCode,
      desc: "I create responsive, scalable, and fast websites using modern frameworks like React and Node.js. Clean code, reusable components, and performance are my focus.",
      color: "#3B82F6",
    },
    {
      title: "Hosting & Deployment",
      icon: FaServer,
      desc: "Deploying apps on platforms like Vercel, Netlify, or cPanel with domain + SSL. Includes CI/CD setup.",
      color: "#10B981",
    },
    {
      title: "Maintenance",
      icon: FaTools,
      desc: "Regular updates, bug fixes, and security patches to keep your app healthy and fast.",
      color: "#F59E0B",
    },
    {
      title: "Automation",
      icon: FaCogs,
      desc: "I automate tasks like backups, notifications, and jobs using GitHub Actions or cron scripts.",
      color: "#8B5CF6",
    },
    {
      title: "API Integration",
      icon: FaPlug,
      desc: "From payment gateways to login systems — seamless API integration using REST or GraphQL.",
      color: "#EF4444",
    },
    {
      title: "Bug Fixing & Optimization",
      icon: FaWrench,
      desc: "Speed improvements, error handling, and clean UI/UX optimization for better performance.",
      color: "#0EA5E9",
    },
  ], []);

  return (
    <div id="services" className="relative min-h-screen font-montserrat text-white px-4 md:px-10 py-16 pt-24 overflow-hidden">

   

      {/* 🟣 Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0" />

      {/* 🎯 Main Content */}
      <motion.main
        className="relative max-w-6xl mx-auto z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          My Services
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="bg-white/10 p-6 rounded-xl shadow-md transition-all duration-300"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeFrom}
            >
              <div className="flex items-center space-x-4 mb-4">
                <service.icon size={30} color={service.color} />
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
