import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_START_OFFSET = 0.5;

export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  
  const [isReady, setIsReady] = useState(false);

  const videoDur = useRef(0);

  // ── 1. Optimized Scroll Tracking & Animation via GSAP ───────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    let requestID;
    let targetTime = VIDEO_START_OFFSET;

    const updateVideo = () => {
      if (video.readyState >= 2) {
        // Smoothly interpolate towards the target time for ultra-smooth scrubbing
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.001) {
          video.currentTime += diff * 0.15; // Smooth damping
        }
      }
      requestID = requestAnimationFrame(updateVideo);
    };

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom", 
        scrub: 0.8, // Reduced for better responsiveness
        onUpdate: (self) => {
          const d = videoDur.current || video.duration;
          if (d) {
            targetTime = VIDEO_START_OFFSET + self.progress * (d - VIDEO_START_OFFSET - 0.1);
          }
        }
      });

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

    requestID = requestAnimationFrame(updateVideo);

    return () => {
      ctx.revert(); 
      cancelAnimationFrame(requestID);
    };
  }, [isReady, containerRef]);

  // ── 4. Native Video Loading (Optimized for Streaming) ───────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = "/loading/benz1_optimized.mp4";
    
    const handleReady = () => {
      videoDur.current = video.duration;
      video.currentTime = VIDEO_START_OFFSET;
      setIsReady(true);
    };

    video.onloadedmetadata = handleReady;
    video.onloadeddata = handleReady;
    
    video.load();

    // Prime the video for scrubbing (crucial for some browsers/mobile)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        video.pause();
      }).catch(() => {
        // Auto-play was prevented, which is fine for scrubbing
      });
    }

    // Fallback: If metadata doesn't load within 2.5s, show the wrapper anyway 
    // to ensure text/content isn't hidden by opacity: 0
    const fallback = setTimeout(() => setIsReady(true), 2500);

    return () => {
      video.onloadedmetadata = null;
      video.onloadeddata = null;
      clearTimeout(fallback);
    };
  }, []);

  return (
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
        disableRemotePlayback
        disablePictureInPicture
        className="w-full h-full object-cover"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          imageRendering: "high-quality",
        }}
      />
    </div>
  );
}
