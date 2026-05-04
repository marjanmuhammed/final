import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Monitor, Activity, Info } from "lucide-react";
import { usePerformance } from "../context/PerformanceContext";

export default function PerformanceToggle() {
  const { isLowEnd, setIsLowEnd } = usePerformance();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[1000] pointer-events-auto flex items-center gap-1.5">
      {/* Sleek Minimal Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsLowEnd(!isLowEnd);
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        className={`group relative flex items-center gap-2 p-1.5 rounded-full border transition-all duration-500 shadow-2xl ${
          isLowEnd 
            ? "bg-black/60 border-amber-500/30 text-amber-500" 
            : "bg-black/60 border-blue-500/30 text-blue-400"
        }`}
      >
        <div className={`p-1.5 rounded-full transition-all duration-500 ${
          isLowEnd ? "bg-amber-500 text-black" : "bg-blue-500 text-black"
        }`}>
          {isLowEnd ? <Monitor size={12} /> : <Zap size={12} />}
        </div>
        
        <span className="text-[9px] font-black uppercase tracking-tighter pr-2">
          {isLowEnd ? "Low" : "High"}
        </span>

        {/* Animated Background Pulse */}
        {!isLowEnd && (
          <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping pointer-events-none" />
        )}
      </motion.button>

      {/* Info Icon with Updated Tooltip */}
      <div 
        className="relative"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white/30 hover:text-white hover:bg-black/60 transition-all">
          <Info size={14} />
        </button>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              className="absolute bottom-full left-0 mb-3 w-[300px] p-5 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[1001]"
            >
              <div className="flex flex-col gap-4">
                {/* High End Section */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Zap size={14} />
                    <h4 className="text-[11px] font-black uppercase tracking-wider">High-End Mode</h4>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed pl-5">
                    Full cinematic experience. The <span className="text-blue-400/80 font-bold">adaptive engine</span> monitors live FPS and auto-adjusts quality — smooth 60fps on capable hardware.
                  </p>
                </div>

                <div className="h-[1px] bg-white/5" />

                {/* Low End Section */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Monitor size={14} />
                    <h4 className="text-[11px] font-black uppercase tracking-wider">Low-End Mode</h4>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed pl-5">
                    Replaces video with particles for devices with <span className="text-amber-500/80 font-bold">less than 4GB RAM</span>. The engine still adapts rendering quality in real-time to prevent stutter.
                  </p>
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute bottom-[-6px] left-3 w-3 h-3 bg-black border-r border-b border-white/10 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>




  );
}

