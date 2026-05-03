import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Monitor, Activity } from "lucide-react";
import { usePerformance } from "../context/PerformanceContext";

export default function PerformanceToggle() {
  const { isLowEnd, setIsLowEnd } = usePerformance();

  return (
    <div className="fixed bottom-6 left-6 z-[1000] pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsLowEnd(!isLowEnd);
          window.scrollTo({ top: 0, behavior: "instant" });
        }}

        className={`group relative flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-500 will-change-transform ${
          isLowEnd 
            ? "bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-lg shadow-amber-500/5" 
            : "bg-white/10 border-white/20 text-white shadow-lg"
        }`}
      >
        <div className={`p-1.5 rounded-full transition-all duration-500 ${
          isLowEnd ? "bg-amber-500/20 rotate-180" : "bg-blue-500/20 text-blue-400"
        }`}>
          {isLowEnd ? <Monitor size={14} /> : <Zap size={14} />}
        </div>

        <div className="flex flex-col items-start pr-1">
          <span className="text-[7px] font-bold uppercase tracking-widest opacity-40 leading-none mb-1">
            {isLowEnd ? "Low End Active" : "High End Active"}
          </span>
          <span className="text-[10px] font-bold tracking-tight leading-none">
            {isLowEnd ? "High End Device Mode" : "Low End Device Mode"}
          </span>
        </div>

        {/* Subtle Ring */}
        {!isLowEnd && (
          <div className="absolute inset-0 rounded-xl border border-blue-400/10 animate-ping opacity-10 pointer-events-none" />
        )}
      </motion.button>
    </div>


  );
}

