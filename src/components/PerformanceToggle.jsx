import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Monitor, Activity } from "lucide-react";
import { usePerformance } from "../context/PerformanceContext";

export default function PerformanceToggle() {
  const { isLowEnd, setIsLowEnd } = usePerformance();

  return (
    <div className="fixed bottom-6 right-6 z-[1000] pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsLowEnd(!isLowEnd)}
        className={`group flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-2xl transition-all duration-500 shadow-xl ${
          isLowEnd 
            ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-amber-500/5" 
            : "bg-white/5 border-white/20 text-white shadow-blue-500/5"
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



        {/* Status Indicator */}
        <div className="ml-2 w-2 h-2 rounded-full relative">
          <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${
            isLowEnd ? "bg-amber-500" : "bg-blue-500"
          }`} />
          <div className={`relative w-full h-full rounded-full ${
            isLowEnd ? "bg-amber-500" : "bg-blue-500"
          }`} />
        </div>
      </motion.button>
    </div>
  );
}

