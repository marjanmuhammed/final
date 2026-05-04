import React, { useState, useEffect } from "react";

export default function Loader() {
  const [canShowSite, setCanShowSite] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const pct = Math.floor(progress * 100);
      setDisplayPct(pct);

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  // The moment displayPct hits 100 → instantly begin fade → unmount after 400ms
  useEffect(() => {
    if (displayPct >= 100) {
      setCanShowSite(true);
      const hide = setTimeout(() => setLoaderVisible(false), 400);
      return () => clearTimeout(hide);
    }
  }, [displayPct]);

  if (!loaderVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999]"
      style={{
        opacity: canShowSite ? 0 : 1,
        transition: "opacity 0.4s ease-out",
        pointerEvents: canShowSite ? "none" : "all",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-white/20 text-[10px] tracking-[0.8em] uppercase font-montserrat">
          EVOLUTION IN PROGRESS
        </h2>

        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-blue-500 origin-left"
            style={{
              transform: `scaleX(${displayPct / 100})`,
              transition: "transform 0.1s linear",
            }}
          />
        </div>

        <p className="text-white/40 text-[8px] tracking-[0.2em] font-montserrat tabular-nums">
          {displayPct}%
        </p>
      </div>
    </div>
  );
}
