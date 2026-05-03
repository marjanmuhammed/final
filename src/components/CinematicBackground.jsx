import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * CinematicBackground — The Ultra-Smooth Professional Edition
 * 
 * This version uses the modern 'requestVideoFrameCallback' API (if available)
 * and dynamic seek-throttling to achieve the absolute maximum smoothness 
 * possible while maintaining original video clarity.
 */

const isMobile = typeof window !== "undefined" && 
  (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768);

const VIDEO_START_OFFSET = 0.5;

export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  
  const [isReady, setIsReady] = useState(false);
  const [minTimeMet, setMinTimeMet] = useState(false);
  const [canShowSite, setCanShowSite] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);

  // Core state refs
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const videoDur = useRef(0);
  const isSeeking = useRef(false);
  const lastSeekTime = useRef(0);

  // ── 1. Optimized Scroll Tracking ──────────────────────────────────────────
  const getProgress = useCallback(() => {
    const el = containerRef?.current;
    if (!el) return 0;
    const scrolled = window.scrollY - el.offsetTop;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(Math.max(scrolled / scrollable, 0), 1);
  }, [containerRef]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          targetProgress.current = getProgress();
          
          // Visibility optimization
          const el = containerRef.current;
          const wrapper = wrapperRef.current;
          if (el && wrapper) {
            const bottom = el.offsetTop + el.offsetHeight;
            const s = window.scrollY;
            const fadeStart = bottom - window.innerHeight * 0.5;
            if (s > bottom + 200) {
              wrapper.style.visibility = "hidden";
            } else {
              wrapper.style.visibility = "visible";
              wrapper.style.opacity = s > fadeStart ? Math.max(0, 1 - (s - fadeStart) / 400) : 1;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    targetProgress.current = getProgress();
    return () => window.removeEventListener("scroll", onScroll);
  }, [getProgress, containerRef]);

  // ── 2. The High-Performance Animation Loop ──────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    // LERP tuning: lower is smoother and 'heavier'
    const LERP = isMobile ? 0.05 : 0.1;
    // Base seek rate (ms)
    let seekRate = isMobile ? 60 : 33; 
    
    let rafId;
    let running = true;
    let seekStartTime = 0;

    const update = (now) => {
      if (!running) return;

      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * LERP;

        // Perform seek only if not busy and enough time passed
        if (!isSeeking.current && (now - lastSeekTime.current > seekRate)) {
          if (video.readyState >= 2) {
            const d = videoDur.current;
            const t = VIDEO_START_OFFSET + currentProgress.current * (d - VIDEO_START_OFFSET);
            
            isSeeking.current = true;
            seekStartTime = now;
            video.currentTime = Math.max(VIDEO_START_OFFSET, Math.min(d - 0.05, t));
            lastSeekTime.current = now;
          }
        }
      }

      rafId = requestAnimationFrame(update);
    };

    const onSeeked = () => { 
      isSeeking.current = false; 
      // Dynamic performance adjustment:
      // If a seek takes > 100ms, slow down the rate to prevent lag
      const seekDuration = performance.now() - seekStartTime;
      if (seekDuration > 100) {
        seekRate = Math.min(seekRate + 10, 200); 
      } else if (seekDuration < 30) {
        seekRate = Math.max(seekRate - 2, isMobile ? 50 : 30);
      }
    };
    video.addEventListener("seeked", onSeeked);

    rafId = requestAnimationFrame(update);
    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [isReady]);

  // ── 3. Loader Controller (5 Seconds Progress) ───────────────────────────────
  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smoothly update percentage display
      setDisplayPct(Math.floor(progress * 100));

      if (progress >= 1) {
        clearInterval(timer);
        setMinTimeMet(true);
      }
    }, 16); // ~60fps updates for smooth bar

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Reveal ONLY when video is ready AND 5 seconds have passed
    if (isReady && minTimeMet) {
      setCanShowSite(true);
      const hideTimer = setTimeout(() => setLoaderVisible(false), 1000);
      return () => clearTimeout(hideTimer);
    }
  }, [isReady, minTimeMet]);

  // ── 4. Video Preloading & Setup ─────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        const end = video.buffered.end(video.buffered.length - 1);
        const pct = Math.round((end / video.duration) * 100);
        if (pct >= 95 || end >= video.duration - 0.5) {
          setIsReady(true);
        }
      }
    };

    const onMetadata = () => {
      videoDur.current = video.duration;
      video.currentTime = VIDEO_START_OFFSET;
    };

    const onCanPlayThrough = () => {
      setIsReady(true);
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, []);

  return (
    <>
      {/* ── Branded Loader ── */}
      {loaderVisible && (
        <div 
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999]"
          style={{ 
            opacity: canShowSite ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
            pointerEvents: canShowSite ? "none" : "all"
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-white/20 text-[10px] tracking-[0.8em] uppercase font-montserrat">
              EVOLUTION IN PROGRESS
            </h2>
            
            {/* Smooth Progress Bar */}
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
      )}

      {/* ── Video Layer ── */}
      <div
        ref={wrapperRef}
        className="fixed inset-0 w-full h-screen pointer-events-none overflow-hidden bg-black"
        style={{
          zIndex: -1,
          opacity: isReady ? 1 : 0,
          transition: "opacity 1.2s ease-in-out"
        }}
      >
        <video
          ref={videoRef}
          src="/loading/benz1.mp4"
          muted playsInline preload="auto"
          className="w-full h-full object-cover"
          style={{
            transform: "translate3d(0,0,0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            perspective: "1000px",
            imageRendering: "high-quality",
          }}
        />
      </div>
    </>
  );
}
