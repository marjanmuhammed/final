import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, FileText } from "lucide-react";

export default function FloatingResumeButton() {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div 
      className="fixed top-[82px] md:top-[88px] right-4 md:right-6 z-[1000] pointer-events-auto"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Main Resume Button (Round & Professional) */}
        <button 
          onClick={() => setShowOptions(!showOptions)}
          className="group relative flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-black/60 backdrop-blur-xl text-white rounded-full border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-blue-500/50 hover:bg-black/80 active:scale-95 overflow-hidden"
        >
          {/* Subtle Rotating Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative flex flex-col items-center">
            <FileText size={18} className="text-blue-400 mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase font-montserrat">
              Resume
            </span>
          </div>

          {/* Indicator Dot */}
          <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${showOptions ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-white/20'}`} />
        </button>

        {/* Options Dropdown (Centered below round button) */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="flex flex-col gap-2 w-28 md:w-32"
            >
              <a 
                href="/images/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowOptions(false)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full text-[9px] md:text-[10px] text-white/70 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/40 transition-all font-bold"
              >
                <Eye size={12} className="text-blue-400" />
                <span>View</span>
              </a>
              <a 
                href="/images/resume.pdf"
                download="Marjan_Resume.pdf"
                onClick={() => setShowOptions(false)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full text-[9px] md:text-[10px] text-white/70 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/40 transition-all font-bold"
              >
                <Download size={12} className="text-blue-400" />
                <span>Download</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>




  );

}
