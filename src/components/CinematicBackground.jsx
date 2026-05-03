import React, { useRef, useEffect, useState } from "react";

/**
 * CinematicBackground — Final Maximum Smoothness Edition
 *
 * This version uses a professional loader that preloads the video fully
 * before revealing the site. It skip-starts the video at 0.5s to avoid
 * black frames and handles visibility to save resources on low-end devices.
 */

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const VIDEO_START_OFFSET = 0.5;

export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  
  const [isReady, setIsReady] = useState(false);
  const [bufferPct, setBufferPct] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);

  const targetTime = useRef(VIDEO_START_OFFSET);
  const currentTime = useRef(VIDEO_START_OFFSET);
  const videoDur = useRef(0);
  const rafId = useRef(null);

  // ── Progress & Visibility ───────────────────────────────────────────────────
  const getProgress = () => {
    const el = containerRef?.current;
    if (!el) return 0;
    const scrolled = window.scrollY - el.offsetTop;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(Math.max(scrolled / scrollable, 0), 1);
  };

  const getVideoTime = (p) => {
    const d = videoDur.current;
    if (!d) return VIDEO_START_OFFSET;
    if (p >= 0.99) return d;
    return VIDEO_START_OFFSET + p * (d - VIDEO_START_OFFSET);
  };

  const updateVisibility = () => {
    const el = containerRef?.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    const containerBottom = el.offsetTop + el.offsetHeight;
    const scrollY = window.scrollY;
    const fadeStart = containerBottom - window.innerHeight * 0.5;
    const fadeEnd = containerBottom + window.innerHeight * 0.3;

    if (scrollY < fadeStart) {
      wrapper.style.opacity = "1";
      wrapper.style.visibility = "visible";
    } else if (scrollY > fadeEnd) {
      wrapper.style.opacity = "0";
      wrapper.style.visibility = "hidden";
    } else {
      const t = (scrollY - fadeStart) / (fadeEnd - fadeStart);
      wrapper.style.opacity = String(1 - t);
      wrapper.style.visibility = "visible";
    }
  };

  // ── Scroll Listener ───────────────────────────────────────────────────────────
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          targetTime.current = getVideoTime(getProgress());
          updateVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    targetTime.current = getVideoTime(getProgress());
    updateVisibility();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Smooth RAF Render Loop ────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    // Tuning for low-end vs desktop
    const LERP = isMobile ? 0.08 : 0.15;
    const SEEK_RATE = isMobile ? 40 : 33; // 25fps vs 30fps seeks
    
    let lastSeek = 0;
    let running = true;

    const loop = (timestamp) => {
      if (!running) return;

      const d = videoDur.current;
      if (d > 0 && video.readyState >= 2) {
        const diff = targetTime.current - currentTime.current;

        if (Math.abs(diff) > 0.001) {
          if (Math.abs(diff) > 2) {
            currentTime.current = targetTime.current;
          } else {
            currentTime.current += diff * LERP;
          }

          if (currentTime.current >= d - 0.08) {
            currentTime.current = d;
            targetTime.current = d;
          }

          if (timestamp - lastSeek >= SEEK_RATE) {
            video.currentTime = Math.max(
              VIDEO_START_OFFSET,
              Math.min(d - 0.04, currentTime.current)
            );
            lastSeek = timestamp;
          }
        }
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isReady]);

  // ── Video Preloading Logic ────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        const end = video.buffered.end(video.buffered.length - 1);
        const pct = Math.round((end / video.duration) * 100);
        setBufferPct(pct);
        
        // If buffered enough, or fully buffered
        if (pct >= 95 || (end >= video.duration - 0.5)) {
           setIsReady(true);
           setTimeout(() => setLoaderVisible(false), 500);
        }
      }
    };

    const onMetadata = () => {
      const d = video.duration;
      if (d && !isNaN(d)) {
        videoDur.current = d;
        video.currentTime = VIDEO_START_OFFSET;
        currentTime.current = VIDEO_START_OFFSET;
        targetTime.current = VIDEO_START_OFFSET;
      }
    };

    const onCanPlayThrough = () => {
      setIsReady(true);
      setBufferPct(100);
      setTimeout(() => setLoaderVisible(false), 500);
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplaythrough", onCanPlayThrough);

    if (video.readyState >= 4) {
      onCanPlayThrough();
    } else {
      video.load();
    }

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, []);

  return (
    <>
      {/* ── Branded Preloader ── */}
      {loaderVisible && (
        <div
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999]"
          style={{ 
            opacity: isReady ? 0 : 1,
            transition: "opacity 0.6s ease-in-out",
            pointerEvents: isReady ? "none" : "all"
          }}
        >
          <div className="flex flex-col items-center gap-6">
             <h2 className="text-white/20 text-[10px] tracking-[0.8em] uppercase animate-pulse font-montserrat">
                EVOLUTION IN PROGRESS
             </h2>
             
             {/* Progress Bar Container */}
             <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-blue-500 origin-left transition-transform duration-300"
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
          opacity: 0, // Starts invisible, revealed by updateVisibility/load
          transition: "opacity 0.8s ease-in-out"
        }}
      >
        <video
          ref={videoRef}
          src="/loading/benz1.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
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
