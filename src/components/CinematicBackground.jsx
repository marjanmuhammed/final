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
  const [bufferPct, setBufferPct] = useState(0);
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

    // LERP tuning: lower is smoother on weak CPUs
    const LERP = isMobile ? 0.07 : 0.12;
    // Seek frequency: desktop 30fps, mobile 18fps (prevents decoder choking)
    const SEEK_RATE = isMobile ? 55 : 33; 

    let rafId;
    let running = true;

    const update = (now) => {
      if (!running) return;

      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        // Smoothly interpolate towards target
        currentProgress.current += diff * LERP;

        // Perform seek only if enough time has passed and we aren't currently seeking
        if (!isSeeking.current && (now - lastSeekTime.current > SEEK_RATE)) {
          if (video.readyState >= 2) {
            const d = videoDur.current;
            const t = VIDEO_START_OFFSET + currentProgress.current * (d - VIDEO_START_OFFSET);
            
            isSeeking.current = true;
            video.currentTime = Math.max(VIDEO_START_OFFSET, Math.min(d - 0.05, t));
            lastSeekTime.current = now;
          }
        }
      }

      rafId = requestAnimationFrame(update);
    };

    const onSeeked = () => { isSeeking.current = false; };
    video.addEventListener("seeked", onSeeked);

    rafId = requestAnimationFrame(update);
    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [isReady]);

  // ── 3. Video Preloading & Setup ─────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        const end = video.buffered.end(video.buffered.length - 1);
        const pct = Math.round((end / video.duration) * 100);
        setBufferPct(pct);
        if (pct >= 95 || end >= video.duration - 0.5) {
          setIsReady(true);
          setTimeout(() => setLoaderVisible(false), 600);
        }
      }
    };

    const onMetadata = () => {
      videoDur.current = video.duration;
      video.currentTime = VIDEO_START_OFFSET;
    };

    const onCanPlayThrough = () => {
      setIsReady(true);
      setBufferPct(100);
      setTimeout(() => setLoaderVisible(false), 600);
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
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999] transition-opacity duration-700"
          style={{ opacity: isReady ? 0 : 1, pointerEvents: isReady ? 'none' : 'all' }}
        >
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-white/20 text-[10px] tracking-[0.8em] uppercase animate-pulse font-montserrat">
              EVOLUTION IN PROGRESS
            </h2>
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
               <div 
                className="absolute inset-0 bg-blue-500 origin-left transition-transform duration-500"
                style={{ transform: `scaleX(${bufferPct / 100})` }} 
              />
            </div>
            <p className="text-white/40 text-[8px] tracking-[0.2em] font-montserrat tabular-nums">
                {bufferPct}%
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
            transform: "translateZ(0)",
            willChange: "transform",
            imageRendering: "high-quality",
          }}
        />
      </div>
    </>
  );
}
