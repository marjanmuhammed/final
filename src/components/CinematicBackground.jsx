import React, { useRef, useEffect, useState } from "react";

/**
 * CinematicBackground — Smooth & Fast Edition
 *
 * Fixes:
 * 1. No black screen on first view — video fades in within 0.3s of first frame
 * 2. No stuck animation — seek throttled to 30fps (video decoder sweet spot)
 *    LERP handles visual smoothness between seeks
 */

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const targetTime = useRef(0);
  const currentTime = useRef(0);
  const videoDur = useRef(0);
  const rafId = useRef(null);

  // ── Progress → Video Time ─────────────────────────────────────────────────────
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
    if (!d) return 0;
    if (p >= 0.99) return d;
    return p * d;
  };

  // ── Scroll Listener (RAF-throttled) ──────────────────────────────────────────
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          targetTime.current = getVideoTime(getProgress());
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    targetTime.current = getVideoTime(getProgress()); // sync on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Smooth RAF Loop ───────────────────────────────────────────────────────────
  // Key insight: LERP makes it visually smooth, seek throttle at 30fps
  // prevents decoder queue buildup (the actual cause of "stuck" animation)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    const LERP = isMobile ? 0.12 : 0.18;
    const SEEK_RATE = isMobile ? 40 : 33; // ms — matches video frame rate
    let lastSeek = 0;
    let running = true;

    const loop = (timestamp) => {
      if (!running) return;

      const d = videoDur.current;
      if (d > 0 && video.readyState >= 2) {
        const diff = targetTime.current - currentTime.current;

        if (Math.abs(diff) > 0.001) {
          // Large jump → snap (navbar click, etc.)
          if (Math.abs(diff) > 2) {
            currentTime.current = targetTime.current;
          } else {
            currentTime.current += diff * LERP;
          }

          // Snap to end to prevent LERP stall
          if (currentTime.current >= d - 0.08) {
            currentTime.current = d;
            targetTime.current = d;
          }

          // Seek at 30fps — decoder processes at this rate comfortably
          if (timestamp - lastSeek >= SEEK_RATE) {
            video.currentTime = Math.max(0, Math.min(d - 0.04, currentTime.current));
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

  // ── Video Setup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMetadata = () => {
      const d = video.duration;
      if (d && !isNaN(d)) {
        videoDur.current = d;
        video.currentTime = 0;
        currentTime.current = 0;
        targetTime.current = 0;
      }
    };

    const onCanPlay = async () => {
      const d = video.duration;
      if (d && !isNaN(d)) videoDur.current = d;
      try {
        await video.play();
        video.pause();
        video.currentTime = 0;
        currentTime.current = 0;
      } catch (_) {}
      setIsReady(true);
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("canplaythrough", onCanPlay, { once: true });

    if (video.readyState >= 2) {
      onMetadata();
      setIsReady(true);
    } else {
      video.load();
    }

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("canplaythrough", onCanPlay);
    };
  }, []);

  return (
    <>
      {/* Auto-fading black overlay — hides the 0.3s frame decode period */}
      {/* Pure CSS animation: no JS state, fades out automatically */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "black",
          zIndex: 9998,
          pointerEvents: "none",
          animation: "fadeOutBlack 0.3s ease 0.1s forwards",
        }}
      />

      {/* Video — always visible, first frame shows as soon as browser decodes it */}
      <div
        className="fixed inset-0 w-full h-screen pointer-events-none overflow-hidden"
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
            imageRendering: "high-quality",
            filter: "none",
            opacity: 1,
          }}
        />
      </div>
    </>
  );
}
