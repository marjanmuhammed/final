import React, { useState, useEffect } from "react";
import { AlertTriangle, Zap } from "lucide-react";


import { usePerformance } from "../context/PerformanceContext";

export default function PerformanceGuard({ children }) {
  const { isLowEnd, setIsLowEnd } = usePerformance();
  const [showModal, setShowModal] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);

  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

  useEffect(() => {
    // 1. Detection Logic
    const memory = navigator.deviceMemory || 8; 
    const cores = navigator.hardwareConcurrency || 8; 
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    // URL override for testing: ?performance=low or ?performance=reset
    const urlParams = new URLSearchParams(window.location.search);
    const forceLow = urlParams.get("performance") === "low";
    const forceReset = urlParams.get("performance") === "reset";

    if (forceReset) {
      localStorage.removeItem("performance_choice");
    }

    // Target only Android for the low-end check. iPhones are excluded.
    const isLowEndDevice = forceLow || (isAndroid && (memory <= 4 || cores <= 6));
    
    console.log("Device Specs:", { memory, cores, isAndroid, isMobile, forceLow, isLowEndDevice });

    // We no longer check savedChoice for showing the modal if it's a low-end device.
    // This ensures it shows on every refresh as requested.
    if (isLowEndDevice) {
      setShowModal(true);
    } else if (isMobile) {
      setIsLowEnd(true); // Force low-end (particles) for all mobiles to prevent video stuck
      setHasChoice(true);
    } else {
      setIsLowEnd(false);
      setHasChoice(true);
    }
  }, [setIsLowEnd]);


  const handleContinue = () => {
    setIsLowEnd(true);
    setShowModal(false);
    setHasChoice(true);
  };


  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (showModal) {
    return (
      <div className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 ${isAndroid ? "" : "font-montserrat"} text-white`}>
        <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 blur-[100px] rounded-full" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="text-amber-500 w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Performance Check
            </h2>
            
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              ⚠️ Optimized experience is best viewed on a PC or High-End Device. <br/>
              Continuing on this device will activate Low-End mode for stability.
            </p>

            <div className="grid grid-cols-1 gap-4 w-full">
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl"
              >
                <Zap className="w-4 h-4" />
                Continue to Portfolio
              </button>
              
              <button
                onClick={handleExit}
                className="w-full py-4 bg-transparent text-white/40 font-medium rounded-xl border border-white/5 hover:bg-white/5 hover:text-white transition-all active:scale-95"
              >
                Exit
              </button>
            </div>

            <p className="mt-8 text-[10px] text-white/20 uppercase tracking-[0.2em]">
              Performance Optimization Active
            </p>

          </div>


        </div>
      </div>
    );
  }

  return hasChoice ? children : null;
}

