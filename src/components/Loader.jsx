import React, { useState, useEffect } from "react";

export default function Loader() {
  const [minTimeMet, setMinTimeMet] = useState(false);
  const [canShowSite, setCanShowSite] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setDisplayPct(Math.floor(progress * 100));

      if (progress >= 1) {
        clearInterval(timer);
        setMinTimeMet(true);
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (displayPct >= 100) {
      setCanShowSite(true);
      // Minimal delay to allow the 100% text to be seen for a split second before unmounting
      const hideTimer = setTimeout(() => setLoaderVisible(false), 300);
      return () => clearTimeout(hideTimer);
    }
  }, [displayPct]);

  if (!loaderVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999]"
      style={{ 
        opacity: canShowSite ? 0 : 1,
        transition: "opacity 0.3s ease-out",
        pointerEvents: canShowSite ? "none" : "all"
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-white/20 text-[10px] tracking-[0.8em] uppercase font-montserrat">
          EVOLUTION IN PROGRESS
        </h2>
        
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-blue-500 origin-left transition-transform duration-100"
              style={{ transform: `scaleX(${displayPct / 100})` }} 
            />
        </div>
        
        <p className="text-white/40 text-[8px] tracking-[0.2em] font-montserrat tabular-nums">
            {displayPct}%
        </p>
      </div>
    </div>
  );
}
