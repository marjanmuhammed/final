import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const roles = ["Full Stack Developer", "Freelancer", "Designer"];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Scroll to #work section logic
  const handleViewWork = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="">
      <motion.div
        id="home"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen flex flex-col justify-center items-center px-4 md:px-10 max-w-full overflow-x-hidden pt-20"
      >
        <h1 className="text-center text-4xl md:text-6xl font-extrabold mb-4">
          <span className="text-white drop-shadow-lg mr-2">I am</span>
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,255,255,0.4)]">
            Muhammad Marjan KK
          </span>
        </h1>

        <div className="flex flex-wrap justify-center items-center mb-4 md:mb-6 text-2xl md:text-4xl font-semibold whitespace-nowrap">
          <span className="mr-2 text-white drop-shadow-md">I am</span>
          <motion.span
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="underline decoration-cyan-300 underline-offset-4 bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent font-bold drop-shadow-[0_3px_6px_rgba(0,255,255,0.5)]"
          >
            {displayedText}
            <span className="animate-pulse text-white">|</span>
          </motion.span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-base md:text-lg italic text-center max-w-xs md:max-w-xl mb-6 md:mb-8 text-white drop-shadow-[0_2px_6px_rgba(0,255,255,0.3)]"
        >
          Let's create something amazing together.
        </motion.p>

        <motion.button
  whileHover={{
    scale: 1.07,
    backgroundColor: "#2563eb",
    color: "white",
    boxShadow: "0 0 30px rgba(37, 99, 235, 0.9)",
  }}
  whileTap={{ scale: 0.95, boxShadow: "0 0 15px rgba(37, 99, 235, 0.7)" }}
  onClick={handleViewWork}
  className="px-5 py-2 md:px-6 md:py-3 border-2 border-blue-500 text-blue-500 bg-white font-semibold cursor-pointer text-sm md:text-base soft-glow-button"
>
  View My Work
</motion.button>

      </motion.div>

    
    </div>
  );
}
