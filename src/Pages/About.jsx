import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import {
  FaPhoneAlt, FaMapMarkerAlt, FaGraduationCap, FaEnvelope,
  FaLaptopCode, FaClock, FaHtml5, FaCss3Alt, FaBootstrap,
  FaJs, FaReact, FaGitAlt, FaHashtag
} from "react-icons/fa";
import { SiTailwindcss, SiRedux } from "react-icons/si";

export default function About() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const TOTAL_FRAMES = 240;
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Snap instantly to opacity 1 at the exact boundary to perfectly hide the Hero car sliding up underneath
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  useEffect(() => {
    let isMounted = true;
    const images = [];
    let loadedCount = 0;

    const loadImages = async () => {
      // Load critical first frame immediately
      const firstImg = new Image();
      firstImg.src = `/images/about/ezgif-frame-001.png`;
      firstImg.onload = () => {
        if (isMounted) {
          images[1] = firstImg;
          renderFrame(1, images);
        }
      };

      // Load rest in batches to avoid crashing mobile browsers
      const batchSize = 10;
      for (let i = 1; i <= TOTAL_FRAMES; i += batchSize) {
        if (!isMounted) break;
        const batch = [];
        for (let j = i; j < i + batchSize && j <= TOTAL_FRAMES; j++) {
          if (images[j]) continue;
          batch.push(new Promise((resolve) => {
            const img = new Image();
            const paddedIndex = j.toString().padStart(3, '0');
            img.src = `/images/about/ezgif-frame-${paddedIndex}.png`;
            img.onload = () => {
              if (isMounted) images[j] = img;
              resolve();
            };
            img.onerror = () => resolve();
          }));
        }
        await Promise.all(batch);
        loadedCount += batch.length;
        if (loadedCount >= TOTAL_FRAMES) setImagesLoaded(true);
      }
    };
    loadImages();

    // Store images in a ref to access them in the render loop without triggering re-renders
    window.aboutImages = images;

    return () => {
      isMounted = false;
    };
  }, []);

  const renderFrame = (idx, forcedImages = null) => {
    if (!canvasRef.current) return;
    const images = forcedImages || window.aboutImages;
    if (!images) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    const roundedIdx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(idx)));
    const img = images[roundedIdx];

    if (!img || !img.complete) {
      let fallbackImg = null;
      for (let i = roundedIdx; i >= 1; i--) {
        if (images[i] && images[i].complete) {
          fallbackImg = images[i];
          break;
        }
      }
      if (!fallbackImg) return;
      drawToCanvas(canvas, fallbackImg);
      return;
    }

    drawToCanvas(canvas, img);
  };

  const updateCanvasSize = (canvas) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
  };

  const drawToCanvas = (canvas, img) => {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    updateCanvasSize(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = img.width / img.height;
    
    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
    } else {
      drawWidth = canvasHeight * imgRatio;
    }

    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium"; // Use medium for better performance

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    requestAnimationFrame(() => renderFrame(latest));
  });

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(() => renderFrame(frameIndex.get()));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex]);

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
    { name: "C#", level: 75, Icon: FaHashtag, color: "#239120" },
  ];

  return (
    <div ref={containerRef} id="about" className="relative w-full min-h-[250dvh] bg-transparent font-montserrat text-white pb-[15vh]">
      {/* Background Canvas */}
      <motion.div 
        style={{ opacity: canvasOpacity }}
        className="absolute top-0 left-0 w-full h-[calc(100%+100dvh)] z-0 pointer-events-none mt-[-100dvh]"
      >
        <div className="sticky top-0 w-full h-[100dvh] overflow-hidden">
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        </div>
      </motion.div>

      <div className="relative z-10 px-4 md:px-10 py-16 pt-[15vh]">
        <motion.main
          className="relative max-w-5xl mx-auto z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"
          variants={fadeUpVariant}
        >
          About Me
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          className="text-lg text-gray-200 mb-16 leading-relaxed max-w-3xl drop-shadow-sm"
          variants={fadeUpVariant}
          transition={{ delay: 0.3, duration: 1.2 }}
        >
          Hello! I'm <strong className="text-blue-400">Muhammad Marjan K.K</strong>, a passionate Full Stack Developer with 1 year of experience building scalable and user-friendly web applications. Skilled in React, dotnet, and modern web technologies, I am continuously learning and improving my craft. Based in Calicut, Kerala, I enjoy turning complex problems into elegant solutions and working collaboratively in teams.
        </motion.p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
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
              className="flex items-center bg-white/10 backdrop-blur-md rounded-xl shadow-md p-6 space-x-5 hover:bg-white/20 transition-all duration-300"
              variants={fadeUpVariant}
              transition={{ delay: 0.2 + i * 0.25, duration: 1.2 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="text-blue-300 text-3xl">{icon}</div>
              <div>
                <p className="text-sm text-blue-200 font-semibold tracking-wide">{label}</p>
                <p className="text-lg font-semibold text-white">{value}</p>
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
          className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"

            variants={fadeUpVariant}
          >
            Skills
          </motion.h3>

          <motion.p
            className="text-gray-300 text-sm mb-10 max-w-xl"
            variants={fadeUpVariant}
          >
            These are the core skills I specialize in. Each bar shows my confidence and experience level. I'm always learning and growing!
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
                    <span className="text-sm font-medium text-white">{name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-300">{level}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
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
    </div>
  );
}
