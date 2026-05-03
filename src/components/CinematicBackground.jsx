import React, { useRef, useEffect, useState } from "react";

/**
 * CinematicBackground — Final Polished Edition
 *
 * Fixes:
 * 1. Black first frame → video starts at 0.5s offset (skips black intro frames)
 * 2. Video hidden on Contact page → fades out when user scrolls past About section
 */

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// Skip the first N seconds to avoid black intro frames in the video
const VIDEO_START_OFFSET = 0.5;

export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const targetTime = useRef(VIDEO_START_OFFSET);
  const currentTime = useRef(VIDEO_START_OFFSET);
  const videoDur = useRef(0);
  const rafId = useRef(null);

  // ── Progress → Video Time ─────────────────────────────────────────────────────
  // Maps scroll 0→1 to video offset→duration (skips black first frames)
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
    // Map scroll 0→1 to video offset→duration
    if (p >= 0.99) return d;
    return VIDEO_START_OFFSET + p * (d - VIDEO_START_OFFSET);
  };

  // ── Video Visibility (hide on Contact/Services) ───────────────────────────────
  // Fades out smoothly when user scrolls past the cinematic container
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
    } else if (scrollY > fadeEnd) {
      wrapper.style.opacity = "0";
    } else {
      const t = (scrollY - fadeStart) / (fadeEnd - fadeStart);
      wrapper.style.opacity = String(1 - t);
    }
  };

  // ── Scroll Listener (RAF-throttled) ──────────────────────────────────────────
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

    const LERP = isMobile ? 0.12 : 0.18;
    const SEEK_RATE = isMobile ? 40 : 33;
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

  // ── Video Setup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMetadata = () => {
      const d = video.duration;
      if (d && !isNaN(d)) {
        videoDur.current = d;
        // Start at offset to skip black intro frames
        video.currentTime = VIDEO_START_OFFSET;
        currentTime.current = VIDEO_START_OFFSET;
        targetTime.current = VIDEO_START_OFFSET;
      }
    };

    const onCanPlay = async () => {
      const d = video.duration;
      if (d && !isNaN(d)) videoDur.current = d;
      try {
        await video.play();
        video.pause();
        video.currentTime = VIDEO_START_OFFSET;
        currentTime.current = VIDEO_START_OFFSET;
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
      {/* Auto-fading black overlay — hides first 0.4s while video decodes */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "black",
          zIndex: 9998,
          pointerEvents: "none",
          animation: "fadeOutBlack 0.4s ease 0.1s forwards",
        }}
      />

      {/* Video wrapper — fades out when user scrolls past About section */}
      <div
        ref={wrapperRef}
        className="fixed inset-0 w-full h-screen pointer-events-none overflow-hidden"
        style={{
          zIndex: -1,
          opacity: 1,
          transition: "opacity 0.4s ease",
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
