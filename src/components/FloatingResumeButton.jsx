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
      <div className="flex flex-col items-end gap-2">
        {/* Main Resume Button (Sleek Dark Style) */}
        <button 
          onClick={() => setShowOptions(!showOptions)}
          className="group relative flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-black/60 backdrop-blur-xl text-white rounded-full border border-white/20 shadow-2xl transition-all duration-300 hover:border-blue-500/50 hover:bg-black/80 active:scale-95"
        >
          <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 bg-white/5 rounded-full border border-white/10">
            <FileText size={12} className="text-blue-400 md:hidden" />
            <FileText size={14} className="text-blue-400 hidden md:block" />
          </div>
          
          <span className="text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase">Resume</span>

          <motion.div
            animate={{ rotate: showOptions ? 180 : 0 }}
            className="ml-1 text-white/30 group-hover:text-blue-400"
          >
            <svg
              className="w-2.5 h-2.5 md:w-3 md:h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.div>
        </button>

        {/* Options Dropdown */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.98 }}
              className="flex flex-col gap-1.5 w-full pt-1"
            >
              <a 
                href="/images/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowOptions(false)}
                className="flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl text-[10px] text-white/70 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Eye size={12} className="text-blue-400" />
                  <span>View</span>
                </div>
              </a>
              <a 
                href="/images/resume.pdf"
                download="Marjan_Resume.pdf"
                onClick={() => setShowOptions(false)}
                className="flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl text-[10px] text-white/70 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Download size={12} className="text-blue-400" />
                  <span>Download</span>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>



  );

}
