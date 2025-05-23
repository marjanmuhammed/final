import React from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaServer,
  FaTools,
  FaCogs,
  FaPlug,
  FaWrench,
} from "react-icons/fa";

// Only 4 logos as per request
const techLogos = [
  {
    name: "JavaScript",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "React",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Redux",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  },
  {
    name: "C#",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  },
];

const AnimatedBox = ({ delay, src, name }) => {
  const boxStyle = {
    width: "140px",
    height: "140px",
    borderRadius: "16px",
    position: "relative",
    margin: "10px auto",
    backgroundColor: "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const borderEffectStyle = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "16px",
    padding: "2px",
    background: "conic-gradient(cyan, transparent, cyan)",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    animation: `rotateLight 6s linear infinite`,
    animationDelay: delay,
    zIndex: 2,
    pointerEvents: "none",
  };

  const imageStyle = {
    width: "60px",
    height: "60px",
    zIndex: 3,
  };

  return (
    <div style={boxStyle}>
      <div style={borderEffectStyle}></div>
      <img src={src} alt={name} style={imageStyle} />
    </div>
  );
};

const Animation = () => {
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "25px",
    padding: "30px 15px",
    backgroundColor: "#000",
    maxWidth: "800px",
    margin: "0 auto",
    boxSizing: "border-box",
  };

  React.useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.height = "100%";
    document.body.style.backgroundColor = "#000";
  }, []);

  return (
    <>
      <div style={containerStyle}>
        {techLogos.map((logo, index) => (
          <AnimatedBox
            key={logo.name}
            src={logo.src}
            name={logo.name}
            delay={`${index * 0.4}s`}
          />
        ))}
      </div>

      <style>{`
        @keyframes rotateLight {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

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

  const services = React.useMemo(
    () => [
      {
        title: "Web Development",
        icon: FaCode,
        desc: "I create responsive, scalable websites using React and Node.js. Clean code, reusable components, and performance are my focus.",
        color: "#3B82F6",
      },
      {
        title: "Hosting & Deployment",
        icon: FaServer,
        desc: "Deploy apps on Vercel, Netlify, or cPanel with domain + SSL. Includes CI/CD setup.",
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
        desc: "Automate tasks like backups, notifications, and jobs using GitHub Actions or cron scripts.",
        color: "#8B5CF6",
      },
    ],
    []
  );

  return (
    <div
      id="services"
      className="relative min-h-screen font-montserrat text-white px-4 md:px-10 py-16 pt-24 overflow-hidden bg-black"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0" />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="bg-white/10 p-5 rounded-xl shadow-md"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeFrom}
            >
              <div className="flex items-center space-x-4 mb-4">
                <service.icon size={28} color={service.color} />
                <h3 className="text-lg font-semibold text-white">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.main>

      {/* Include animation below services */}
      <Animation />
    </div>
  );
}
