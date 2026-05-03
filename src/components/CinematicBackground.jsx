import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";

/**
 * CinematicBackground - Ultra-Smooth Video Edition
 * Provides high-quality video scrubbing with zero lag and perfect resolution.
 */
export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const targetTime = useRef(0.15); 
  const currentTime = useRef(0.15);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [duration, setDuration] = useState(15); 

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Split point for Hero (400dvh) vs About (400dvh) = 400 / 800 = 0.5
  // Hero: 0-60% of video (Driving/Intro)
  // About: 60-100% of video (Reveal/Ending)
  const videoTimeProgress = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [0.15, duration * 0.6, duration]
  );

  useMotionValueEvent(videoTimeProgress, "change", (latest) => {
    targetTime.current = latest;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const initVideo = () => {
      handleLoadedMetadata();
      if (video.currentTime < 0.15) {
        video.currentTime = 0.15;
      }
      setIsVideoReady(true);
    };

    if (video.readyState >= 2) {
      initVideo();
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadeddata", initVideo);
    
    let animationId;
    let lastRenderedTime = 0;

    const renderLoop = () => {
      const diff = targetTime.current - currentTime.current;
      
      // Use a slightly faster LERP for "real quality" feel (0.08)
      if (Math.abs(diff) > 0.001) {
        // Instant snap for huge jumps
        if (Math.abs(diff) > 2) {
          currentTime.current = targetTime.current;
        } else {
          currentTime.current += diff * 0.08; 
        }
        
        // Performance Throttling: Only seek if we've moved enough (approx 1 frame)
        // This drastically reduces stutter
        const now = performance.now();
        if (now - lastRenderedTime > 20) { // ~50fps seek throttle
          const safeTime = Math.max(0.15, Math.min(duration - 0.02, currentTime.current));
          video.currentTime = safeTime;
          lastRenderedTime = now;
        }
      }
      
      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);
    
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", initVideo);
      cancelAnimationFrame(animationId);
    };
  }, [duration]);

  return (
    <div className="fixed inset-0 z-[-1] w-full h-screen pointer-events-none overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/loading/benz1.mp4"
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          willChange: "transform",
          transform: "translateZ(0)",
          filter: "none"
        }}
      />
    </div>
  );
}
