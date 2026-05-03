import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * CinematicBackground — Final Adaptive Hybrid Edition
 * 
 * Optimized for:
 * 1. HIGH-END (Desktop/iPhone): Ultra-smooth scroll-synced video.
 * 2. LOW-END ANDROID: Video is disabled. Uses 60 WebP frames on Canvas for zero lag.
 */

const VIDEO_START_OFFSET = 0.5;
const LOW_END_FRAME_COUNT = 60; // 60 frames for maximum memory safety on 2GB devices
const LOW_END_DIR = "/frames/mobile";

// Utility to pad frame numbers (e.g., 0 -> "001")
const pad = (n) => String(n + 1).padStart(3, "0");

export default function CinematicBackground({ containerRef }) {
  const [tier, setTier] = useState(null); // 'HIGH' (Video) vs 'LOW' (Canvas)
  const [engine, setEngine] = useState(null); // 'video' | 'canvas'
  const [isReady, setIsReady] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  // Shared state tracking
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  // ── 1. Device Performance Detection ──────────────────────────────────────────
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const ram = navigator.deviceMemory || 4;
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIPhone = /iPhone|iPad|iPod/i.test(ua);

    // CRITICAL: Low-end Android detection
    const isLowEndAndroid = isAndroid && (ram <= 3 || cores <= 4);

    if (isLowEndAndroid) {
      setTier('LOW');
      setEngine('canvas');
    } else {
      setTier('HIGH');
      setEngine('video');
    }
  }, []);

  // ── 2. Shared Scroll Progress Logic ──────────────────────────────────────────
  const getScrollProgress = useCallback(() => {
    const el = containerRef?.current;
    if (!el) return 0;
    const scrolled = window.scrollY - el.offsetTop;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(Math.max(scrolled / scrollable, 0), 1);
  }, [containerRef]);

  useEffect(() => {
    const onScroll = () => {
      targetProgress.current = getScrollProgress();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    targetProgress.current = getScrollProgress();
    return () => window.removeEventListener("scroll", onScroll);
  }, [getScrollProgress]);

  // ── 3. Loader Controller ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isReady) {
      const t = setTimeout(() => setLoaderVisible(false), 800);
      return () => clearTimeout(t);
    }
  }, [isReady]);

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
                style={{ transform: `scaleX(${isReady ? 1 : 0.4})` }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Conditional Engines ── */}
      {engine === 'video' && (
        <VideoEngine 
          containerRef={containerRef}
          targetProgress={targetProgress}
          currentProgress={currentProgress}
          onReady={() => setIsReady(true)}
          onFail={() => setEngine('canvas')} // Automatic fail-safe fallback
        />
      )}

      {engine === 'canvas' && (
        <CanvasEngine 
          containerRef={containerRef}
          targetProgress={targetProgress}
          currentProgress={currentProgress}
          onReady={() => setIsReady(true)}
        />
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// A) VIDEO ENGINE (High-End: Desktop & iPhone)
// ──────────────────────────────────────────────────────────────────────────────
function VideoEngine({ containerRef, targetProgress, currentProgress, onReady, onFail }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const videoDur = useRef(0);
  const lastSeek = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fail-safe: 2-second timeout for video metadata
    const timeout = setTimeout(() => {
      if (video.readyState < 1) {
        console.warn("Video too slow, falling back to canvas.");
        onFail();
      }
    }, 2000);

    const onMetadata = () => {
      clearTimeout(timeout);
      videoDur.current = video.duration;
      video.currentTime = VIDEO_START_OFFSET;
      onReady();
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.load();
    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      clearTimeout(timeout);
    };
  }, [onReady, onFail]);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video) return;

    const LERP = 0.15;
    const SEEK_RATE = 33; // 30 FPS updates

    const loop = (time) => {
      const diff = targetProgress.current - currentProgress.current;
      currentProgress.current += diff * LERP;

      // Visibility & Opacity Logic
      const el = containerRef.current;
      if (el && wrapper) {
        const bottom = el.offsetTop + el.offsetHeight;
        const s = window.scrollY;
        if (s > bottom + 100) {
          wrapper.style.visibility = 'hidden';
        } else {
          wrapper.style.visibility = 'visible';
          const fadeStart = bottom - window.innerHeight * 0.5;
          wrapper.style.opacity = s > fadeStart ? Math.max(0, 1 - (s - fadeStart) / 400) : 1;
        }
      }

      // Perform Video Seek
      if (time - lastSeek.current > SEEK_RATE && video.readyState >= 2) {
        const d = videoDur.current;
        const t = VIDEO_START_OFFSET + currentProgress.current * (d - VIDEO_START_OFFSET);
        video.currentTime = Math.max(VIDEO_START_OFFSET, Math.min(d - 0.05, t));
        lastSeek.current = time;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [containerRef]);

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-[-1] bg-black pointer-events-none transition-opacity duration-700">
      <video
        ref={videoRef}
        src="/loading/benz1.mp4"
        muted playsInline preload="metadata"
        className="w-full h-full object-cover"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// B) CANVAS ENGINE (Low-End Android: Lightweight Image Sequence)
// ──────────────────────────────────────────────────────────────────────────────
function CanvasEngine({ containerRef, targetProgress, currentProgress, onReady }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const frames = useRef([]);
  const lastDrawnFrame = useRef(-1);
  const rafId = useRef(null);

  // 1. Preload first frame to trigger loader exit
  useEffect(() => {
    const img = new Image();
    img.src = `${LOW_END_DIR}/frame_001.webp`;
    img.onload = () => {
      frames.current[0] = img;
      onReady();
      
      // 2. Progressive background load of 60 frames (every 2nd frame from the 120 set)
      const loadFrames = async () => {
        for (let i = 1; i < LOW_END_FRAME_COUNT; i++) {
          const frameNum = i * 2; // Use every 2nd frame to hit 60 count
          const img = new Image();
          img.src = `${LOW_END_DIR}/frame_${pad(frameNum)}.webp`;
          img.onload = () => { frames.current[i] = img; };
          if (i % 10 === 0) await new Promise(r => setTimeout(r, 60)); // Sleep to keep CPU free
        }
      };
      loadFrames();
    };
  }, [onReady]);

  // 2. Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    const LERP = 0.08; // Slower LERP on low-end for visual stability

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const diff = targetProgress.current - currentProgress.current;
      currentProgress.current += diff * LERP;

      const idx = Math.round(currentProgress.current * (LOW_END_FRAME_COUNT - 1));
      const img = frames.current[idx];

      if (img && idx !== lastDrawnFrame.current) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        lastDrawnFrame.current = idx;
      }

      // visibility logic
      const el = containerRef.current;
      if (el && wrapper) {
        const bottom = el.offsetTop + el.offsetHeight;
        const s = window.scrollY;
        if (s > bottom + 100) wrapper.style.visibility = 'hidden';
        else {
          wrapper.style.visibility = 'visible';
          const fadeStart = bottom - window.innerHeight * 0.5;
          wrapper.style.opacity = s > fadeStart ? Math.max(0, 1 - (s - fadeStart) / 400) : 1;
        }
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
    };
  }, [containerRef]);

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-[-1] bg-black pointer-events-none transition-opacity duration-700">
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
}
