import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
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

  const videoDur = useRef(0);
  // ── 1. Optimized Scroll Tracking & Animation via GSAP ───────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    // We use GSAP ScrollTrigger for buttery smooth, lag-free scrubbing.
    // This avoids the choppiness of manually throttling seeked events.
    let ctx = gsap.context(() => {
      // 1. Scrubbing Trigger: Stops scrubbing when container hits the bottom of the screen.
      // This FREEZES the video before Services slides over it, preventing decoding lag!
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom", 
        scrub: 1.2, 
        onUpdate: (self) => {
          if (video.readyState >= 2) {
            const d = videoDur.current || video.duration;
            if (d) {
              const targetTime = VIDEO_START_OFFSET + self.progress * (d - VIDEO_START_OFFSET - 0.05);
              
              // Frame snapping optimization (assumes 30fps video):
              // Setting currentTime on heavily compressed MP4s causes massive decoding lag.
              // Snapping to the nearest frame (~0.033s) eliminates micro-seeking and saves CPU/GPU.
              const frameTime = 1 / 30; 
              const snappedTime = Math.round(targetTime / frameTime) * frameTime;
              
              // Only set currentTime if the snapped frame actually changed!
              if (Math.abs(video.currentTime - snappedTime) > frameTime / 2) {
                video.currentTime = Math.max(VIDEO_START_OFFSET, snappedTime);
              }
            }
          }
        }
      });

      // 2. Visibility Trigger: Hides the video completely when the container is fully off screen 
      // (meaning the black Services section has fully slid up and completely covered it).
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top", 
        onLeave: () => {
          if (wrapperRef.current) wrapperRef.current.style.visibility = "hidden";
        },
        onEnterBack: () => {
          if (wrapperRef.current) wrapperRef.current.style.visibility = "visible";
        }
      });
    });

    return () => {
      ctx.revert(); // Cleans up GSAP animations and ScrollTriggers
    };
  }, [isReady, containerRef]);

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

  // ── 4. Video Preloading into RAM (Blob) ──────────────────────────────────────
  // This is the ultimate fix for Vercel lag! 
  // By downloading the entire video into memory as a Blob, we prevent the browser 
  // from making slow HTTP Range requests every time the user scrolls/scrubs.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    fetch("/loading/benz1_optimized.mp4")
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        video.src = blobUrl;
        
        video.onloadedmetadata = () => {
          videoDur.current = video.duration;
          video.currentTime = VIDEO_START_OFFSET;
          // Video is completely in RAM now
          setIsReady(true);
        };
        video.load();
      })
      .catch(err => {
        console.error("Failed to preload video blob:", err);
        // Fallback to normal URL
        video.src = "/loading/benz1_optimized.mp4";
        setIsReady(true);
      });

    return () => {
      video.onloadedmetadata = null;
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
