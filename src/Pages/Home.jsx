import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";

const roles = ["Full Stack Developer", "Freelancer", "Designer"];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const navigate=useNavigate()

  // Typing effect
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
    <motion.div
      id="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 px-4 md:px-10 max-w-full overflow-x-hidden font-montserrat pt-20"
    >
      {/* Name */}
      <h1 className="text-sm md:text-base font-semibold mb-2 md:mb-3 tracking-wide">
        I am Muhammad Marjan KK
      </h1>

      {/* Typing Role */}
      <div className="flex flex-wrap justify-center items-center mb-4 md:mb-6 text-2xl md:text-4xl font-bold whitespace-nowrap">
        <span className="mr-2">I am</span>
        <motion.span
          key={index}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="underline decoration-pink-500 underline-offset-4 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
        >
          {displayedText}
          <span className="animate-pulse">|</span>
        </motion.span>
      </div>

      {/* Quote */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-base md:text-lg font-poppins text-gray-700 italic text-center max-w-xs md:max-w-xl mb-6 md:mb-8"
      >
        Let's create something amazing together.
      </motion.p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#3b82f6", color: "white" }}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-2 md:px-6 md:py-3 border-2 border-blue-500 text-blue-500 rounded-full bg-transparent font-semibold transition-colors duration-300 cursor-pointer text-sm md:text-base"
        onClick={()=>navigate('/works')}
      >
        View My Work
      </motion.button>
    </motion.div>
  );
}
