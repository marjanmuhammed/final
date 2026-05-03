import React, { useState, useEffect, useRef } from "react";
import { motion as Motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { usePerformance } from "../context/PerformanceContext";

const roles = ["Full Stack Developer", "Freelancer", "Designer"];

export default function Home() {
  const { isLowEnd } = usePerformance();
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  const containerRef = useRef(null);
  const { ref: viewRef, inView } = useInView({ threshold: 0.1 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: textScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textOpacity = useTransform(textScrollProgress, [0, 0.1, 0.92, 0.98], [0, 1, 1, 0]);
  const textY = useTransform(textScrollProgress, [0, 0.1], [30, 0]);

  // Typing animation effect
  useEffect(() => {
    const currentWord = roles[index];
    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setCharIndex(0);
        setDisplayedText("");
        setIndex((prev) => (prev + 1) % roles.length);
      }, 2000);
      return () => clearTimeout(pause);
    }
  }, [charIndex, index]);

  return (
    <div
      ref={containerRef}
      className={`${isLowEnd ? "h-[100dvh]" : "h-[400dvh]"} relative w-full bg-transparent`}
    >
      <div ref={viewRef} className={`${isLowEnd ? "relative" : "sticky top-0"} w-full h-[100dvh] overflow-hidden flex flex-col justify-center items-center bg-transparent`}>
        <Motion.div
          id="home"
          style={{ 
            opacity: isLowEnd ? 1 : textOpacity, 
            y: isLowEnd ? 0 : textY 
          }}
          className={`${isLowEnd ? "relative" : "fixed inset-0"} z-[9999] flex flex-col justify-center items-center px-4 md:px-10 w-full overflow-x-hidden pointer-events-none`}
        >
          <h1 className="text-center text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight">
            <span className="text-white drop-shadow-lg mr-2 md:mr-3">I am</span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-[0_4px_8_rgba(0,255,255,0.4)] block sm:inline mt-2 sm:mt-0">
              Muhammad Marjan KK
            </span>
          </h1>


          <div className="flex flex-wrap justify-center items-center mb-6 md:mb-8 text-lg md:text-3xl font-light whitespace-nowrap tracking-wide">
            <span className="mr-2 md:mr-3 text-gray-300 drop-shadow-md">I am</span>
            <Motion.span
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent font-medium drop-shadow-[0_3px_6px_rgba(0,255,255,0.5)]"
            >
              {displayedText}
              <span className="animate-pulse text-white">|</span>
            </Motion.span>
          </div>

          <Motion.p
            className="text-xs md:text-lg text-center max-w-xs md:max-w-xl text-gray-400 font-light tracking-wider drop-shadow-[0_2px_6px_rgba(0,255,255,0.3)]"
          >
            Let's create something amazing together.
          </Motion.p>
        </Motion.div>
      </div>
    </div>
  );
}
