/**
 * CinematicBackground — Real-Time Adaptive Rendering Engine
 * ─────────────────────────────────────────────────────────────────
 *
 * Architecture overview
 * ─────────────────────
 *  SCROLL THREAD  →  targetProgressRef  (passive listener, zero rendering)
 *                          ↓
 *  RAF LOOP       →  LERP toward target  →  seek video  →  drawImage(canvas)
 *
 * Key features
 * ────────────
 *  • Canvas-only output  — no DOM image swaps, zero layout reflow
 *  • Scroll ↔ render decoupled  — scroll sets a target, RAF renders it
 *  • LERP smoothing  — eliminates jitter / sudden frame jumps
 *  • Adaptive tier engine  — monitors live FPS, classifies HIGH/MID/LOW/ULTRA_LOW
 *  • Dynamic frame skipping  — renders every N-th frame per tier
 *  • Dynamic resolution  — canvas pixel count scales with tier (100% → 40%)
 *  • FPS cap per tier  — avoids over-drawing on slow GPUs
 *  • desynchronized canvas  — removes GPU sync stalls
 *  • IntersectionObserver  — pauses draw loop when off-screen
 *  • Passive scroll listener  — never blocks the main thread
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useAdaptiveEngine, RENDER_HINTS } from "../lib/useAdaptiveEngine";

// ── Constants ─────────────────────────────────────────────────────
const VIDEO_SRC           = "/loading/benz1.mp4";
const VIDEO_START_OFFSET  = 0.5;      // seconds — skip the very first frame burst

// ── object-fit: cover on canvas ──────────────────────────────────
// Scales the video so it covers the full canvas (no black bars),
// centered — identical to CSS object-fit:cover on the old <video>.
function drawCover(ctx, video, cw, ch) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return;
  const scale  = Math.max(cw / vw, ch / vh);
  const drawW  = vw * scale;
  const drawH  = vh * scale;
  const x      = (cw - drawW) / 2;
  const y      = (ch - drawH) / 2;
  ctx.drawImage(video, x, y, drawW, drawH);
}
const SEEK_THRESHOLD      = 1 / 30;   // only seek if >1 frame's worth of drift
const FALLBACK_TIMEOUT_MS = 6000;     // give up waiting for video events after 6 s

export default function CinematicBackground({ containerRef }) {
  // ── Refs — all mutable, none trigger re-renders ───────────────────
  const canvasRef      = useRef(null);
  const videoRef       = useRef(null);
  const wrapperRef     = useRef(null);

  const isReadyRef     = useRef(false);
  const videoDurRef    = useRef(0);

  // Scroll → RAF bridge
  const targetProgressRef = useRef(0);   // updated by passive scroll listener
  const currentTimeRef    = useRef(VIDEO_START_OFFSET); // LERP accumulator

  // Render cadence
  const frameCountRef  = useRef(0);
  const lastDrawRef    = useRef(0);      // timestamp of last canvas draw

  // Canvas resolution in use
  const currentResRef  = useRef(1.0);

  // Off-screen guard
  const isVisibleRef   = useRef(true);

  // RAF handle for cleanup
  const rafRef         = useRef(null);

  // ── State ─────────────────────────────────────────────────────────
  const [isReady, setIsReady] = useState(false);

  // ── Adaptive engine (FPS monitor + tier classifier) ───────────────
  const { tierRef } = useAdaptiveEngine();

  // ─────────────────────────────────────────────────────────────────
  // 1. VIDEO LOADING
  //    Same events as before; we still use the <video> as the frame
  //    source — the browser handles its own decode pipeline.
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      if (isReadyRef.current) return;
      if (!video.duration || isNaN(video.duration) || video.duration <= 0) return;
      isReadyRef.current = true;
      videoDurRef.current = video.duration;
      video.currentTime = VIDEO_START_OFFSET;
      setIsReady(true);
    };

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("loadeddata",     markReady);
    video.addEventListener("canplay",        markReady);

    video.src = VIDEO_SRC;
    video.load();

    // Safety net for browsers that silently skip these events
    const fallback = setTimeout(() => {
      if (!isReadyRef.current) {
        isReadyRef.current  = true;
        videoDurRef.current = video.duration || 10;
        setIsReady(true);
      }
    }, FALLBACK_TIMEOUT_MS);

    return () => {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("loadeddata",     markReady);
      video.removeEventListener("canplay",        markReady);
      clearTimeout(fallback);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // 2. CANVAS RESOLUTION MANAGER
  //    Sets physical pixel dimensions of the canvas.
  //    CSS always stretches it to 100% × 100% via style.
  //    Lower tiers → smaller pixel buffer → much cheaper to draw into.
  // ─────────────────────────────────────────────────────────────────
  const resizeCanvas = useCallback((multiplier) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = Math.round(window.innerWidth  * window.devicePixelRatio * multiplier);
    const h = Math.round(window.innerHeight * window.devicePixelRatio * multiplier);

    // Avoid unnecessary buffer reallocations
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
    }
    currentResRef.current = multiplier;
  }, []);

  // Initial size + react to viewport changes
  useEffect(() => {
    resizeCanvas(1.0);
    const onResize = () => resizeCanvas(currentResRef.current);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [resizeCanvas]);

  // ─────────────────────────────────────────────────────────────────
  // 3. SCROLL → TARGET PROGRESS  (DECOUPLED FROM RENDERING)
  //
  //    This is the most important architectural change.
  //    The scroll handler does ONE thing: write a number.
  //    It never reads the DOM, never draws, never seeks the video.
  //    The passive flag means the browser never waits for it.
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef?.current) return;

    const syncProgress = () => {
      const container = containerRef.current;
      if (!container) return;

      // Use offsetTop + scrollY to avoid getBoundingClientRect reflows
      const containerTop    = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const scrollableRange = containerHeight - window.innerHeight;
      if (scrollableRange <= 0) return;

      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - containerTop) / scrollableRange)
      );
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", syncProgress, { passive: true });
    syncProgress(); // seed on mount
    return () => window.removeEventListener("scroll", syncProgress);
  }, [containerRef, isReady]);

  // ─────────────────────────────────────────────────────────────────
  // 4. VISIBILITY GUARD  (IntersectionObserver)
  //    Pauses the draw loop the moment the container leaves viewport.
  //    Saves significant GPU + CPU budget on low-end devices.
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const target = containerRef?.current;
    if (!target) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (wrapperRef.current) {
          wrapperRef.current.style.visibility =
            entry.isIntersecting ? "visible" : "hidden";
        }
      },
      { threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [containerRef]);

  // ─────────────────────────────────────────────────────────────────
  // 5. MAIN RAF RENDER LOOP
  //
  //    Every tick:
  //      a) Check frame-skip counter (tier-based)
  //      b) Check FPS-cap interval (tier-based)
  //      c) Update canvas resolution if tier changed
  //      d) LERP currentTime toward targetTime
  //      e) Seek video to smoothed time
  //      f) Draw video frame to canvas
  //
  //    Nothing here touches the DOM or causes layout.
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;

    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // desynchronized: true removes the GPU fence that normally forces
    // canvas draws to block until the GPU is done — big win on mobile.
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    function renderLoop(now) {
      rafRef.current = requestAnimationFrame(renderLoop);

      // ── Guard: skip when off-screen ────────────────────────────
      if (!isVisibleRef.current) return;

      // ── Lookup current tier hints (reads mutable ref → no stale closure) ──
      const hints = RENDER_HINTS[tierRef.current];

      // ── a) Frame skipping ──────────────────────────────────────
      //    HIGH → every frame, MID → every 2nd, LOW → every 3rd, etc.
      frameCountRef.current = (frameCountRef.current + 1) % hints.skipRate;
      if (frameCountRef.current !== 0) return;

      // ── b) FPS cap — avoid over-drawing on slow hardware ───────
      const minInterval = 1000 / hints.fpsTarget;
      if (now - lastDrawRef.current < minInterval - 1) return;
      lastDrawRef.current = now;

      // ── c) Dynamic resolution switch ───────────────────────────
      //    Only resize if the tier's multiplier differs from what's live.
      //    Hysteresis: only switch if delta > 0.05 to avoid thrash.
      if (Math.abs(currentResRef.current - hints.resMultiplier) > 0.05) {
        resizeCanvas(hints.resMultiplier);
      }

      // ── d) LERP: smoothly chase the target time ─────────────────
      //    lerpFactor is small → buttery motion; large → snappier response
      const dur = videoDurRef.current;
      if (!dur || isNaN(dur) || dur <= 0) return;

      const targetTime =
        VIDEO_START_OFFSET +
        targetProgressRef.current * (dur - VIDEO_START_OFFSET - 0.05);

      // Core LERP — this is what removes jitter and scroll spikes
      currentTimeRef.current +=
        (targetTime - currentTimeRef.current) * hints.lerpFactor;

      const smoothedTime = Math.max(
        VIDEO_START_OFFSET,
        Math.min(currentTimeRef.current, dur - 0.05)
      );

      // ── e) Seek only when meaningfully different ────────────────
      //    Avoids thrashing the video decoder every single frame.
      if (video.readyState >= 2) {
        if (Math.abs(video.currentTime - smoothedTime) > SEEK_THRESHOLD) {
          video.currentTime = smoothedTime;
        }

        // ── f) Blit video frame to canvas (object-fit: cover) ──────
        //    Scales to fill the full canvas with no black bars.
        drawCover(ctx, video, canvas.width, canvas.height);
      }
    }

    rafRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, resizeCanvas, tierRef]);

  // ─────────────────────────────────────────────────────────────────
  // RENDER — single canvas, no DOM image swaps, no layout triggers
  // ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 w-full h-screen pointer-events-none overflow-hidden bg-black"
      style={{
        zIndex: -1,
        opacity: isReady ? 1 : 0,
        transition: "opacity 1.2s ease-in-out",
      }}
    >
      {/*
        Hidden <video> — acts as a decoded frame source.
        The browser handles its own decode pipeline off-thread.
        We never display this element; only canvas is shown.
      */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/loading/benz1_poster.jpg"
        style={{ display: "none" }}
      />

      {/*
        Single <canvas> — the only surface shown to the user.
        CSS width/height: 100% stretches it to fill the viewport.
        Actual pixel dimensions are controlled by resizeCanvas().
      */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          transform: "translate3d(0,0,0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}
