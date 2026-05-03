import React, { useRef, useEffect, useState } from "react";

/**
 * CinematicBackground — Simple & Reliable Final Edition
 *
 * Strategy:
 * - NO body height/overflow manipulation (causes DOM reflow bugs)
 * - Simple window.scrollY / totalHeight calculation — always accurate
 * - Hard force to video.duration when progress >= 0.99
 * - Loader overlay blocks clicks but video syncs to scroll from the start
 */
export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [bufferPct, setBufferPct] = useState(0);

  const targetTime = useRef(0);
  const currentTime = useRef(0);
  const videoDur = useRef(0);
  const rafId = useRef(null);

  // ── Progress Calculation ──────────────────────────────────────────────────────
  // Uses window.scrollY directly — no getBoundingClientRect timing issues
  const getProgress = () => {
    const el = containerRef?.current;
    if (!el) return 0;
    const elTop = el.offsetTop;               // Distance from page top
    const elHeight = el.offsetHeight;         // Total height of container
    const scrolled = window.scrollY - elTop; // How much of container we've scrolled
    const scrollable = elHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(Math.max(scrolled / scrollable, 0), 1);
  };

  // ── Video Time Mapping ────────────────────────────────────────────────────────
  const getVideoTime = (progress) => {
    const d = videoDur.current;
    if (!d) return 0;
    // Hard force to end at 99% — LERP can never stall here
    if (progress >= 0.99) return d;
    return progress * d;
  };

  // ── Scroll Listener ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const p = getProgress();
      targetTime.current = getVideoTime(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Sync immediately on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── RAF Render Loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    let lastSeek = 0;
    let running = true;

    const loop = () => {
      if (!running) return;

      const d = videoDur.current;
      if (d > 0) {
        const diff = targetTime.current - currentTime.current;

        if (Math.abs(diff) > 0.001) {
          // Snap for large jumps (navbar), LERP for scroll
          if (Math.abs(diff) > 1.5) {
            currentTime.current = targetTime.current;
          } else {
            currentTime.current += diff * 0.08;
          }

          // Safety: snap to end if within 0.1s
          if (currentTime.current >= d - 0.1) {
            currentTime.current = d;
            targetTime.current = d;
          }

          const now = performance.now();
          if (now - lastSeek > 20 && video.readyState >= 2) {
            video.currentTime = Math.max(0, Math.min(d - 0.05, currentTime.current));
            lastSeek = now;
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

  // ── Video Loading ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onProgress = () => {
      try {
        if (video.buffered.length > 0 && video.duration) {
          const end = video.buffered.end(video.buffered.length - 1);
          setBufferPct(Math.min(100, Math.round((end / video.duration) * 100)));
        }
      } catch (_) {}
    };

    const onReady = async () => {
      const d = video.duration;
      if (!d || isNaN(d)) return;

      videoDur.current = d;
      video.currentTime = 0;
      currentTime.current = 0;
      targetTime.current = 0;

      // Force buffer entire file
      try {
        await video.play();
        video.pause();
        video.currentTime = 0;
      } catch (_) {}

      setBufferPct(100);
      setIsReady(true);
    };

    if (video.readyState >= 3 && video.duration) {
      onReady();
    } else {
      video.addEventListener("canplaythrough", onReady, { once: true });
      video.load();
    }

    video.addEventListener("progress", onProgress);

    return () => {
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("canplaythrough", onReady);
    };
  }, []);

  return (
    <>
      {/* Loader — blocks UI while buffering, but does NOT lock scroll */}
      {!isReady && (
        <div
          className="fixed inset-0 bg-black flex flex-col items-center justify-center font-montserrat"
          style={{ zIndex: 99999, pointerEvents: "all" }}
        >
          <p className="text-white/15 text-[9px] tracking-[0.8em] uppercase mb-10">
            Muhammad Marjan KK
          </p>
          <div className="w-52 h-px bg-white/10 overflow-hidden mb-3 relative">
            <div
              className="absolute inset-y-0 left-0 bg-blue-500 transition-[width] duration-300"
              style={{ width: `${bufferPct}%` }}
            />
          </div>
          <p className="text-white/25 text-[8px] tracking-[0.5em] uppercase">
            {bufferPct < 100 ? `Buffering ${bufferPct}%` : "Starting..."}
          </p>
        </div>
      )}

      {/* Video layer */}
      <div
        className="fixed inset-0 w-full h-screen pointer-events-none overflow-hidden bg-black"
        style={{ zIndex: -1 }}
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
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            opacity: isReady ? 1 : 0,
            filter: "none",
          }}
        />
      </div>
    </>
  );
}
