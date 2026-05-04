import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_START_OFFSET = 0.5;

export default function CinematicBackground({ containerRef }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const videoDur = useRef(0);
  const isReadyRef = useRef(false);

  const [isReady, setIsReady] = useState(false);

  // ── Scroll Scrubbing (30fps Frame Snapping) ──────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady || !containerRef.current) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          if (video.readyState < 2) return;
          const d = videoDur.current;
          if (!d || isNaN(d) || d <= 0) return;

          const targetTime =
            VIDEO_START_OFFSET + self.progress * (d - VIDEO_START_OFFSET - 0.05);

          const frameTime = 1 / 30;
          const snappedTime = Math.round(targetTime / frameTime) * frameTime;
          const clamped = Math.max(VIDEO_START_OFFSET, snappedTime);

          if (Math.abs(video.currentTime - clamped) > frameTime / 2) {
            video.currentTime = clamped;
          }
        },
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
        },
      });
    });

    return () => ctx.revert();
  }, [isReady, containerRef]);

  // ── Video Loading ────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      // Guard: only fire once
      if (isReadyRef.current) return;
      if (!video.duration || isNaN(video.duration) || video.duration <= 0) return;

      isReadyRef.current = true;
      videoDur.current = video.duration;
      video.currentTime = VIDEO_START_OFFSET;
      setIsReady(true);
    };

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);

    video.src = "/loading/benz1.mp4";
    video.load();

    // Safety fallback — unblock if events never fire (e.g. some mobile browsers)
    const fallback = setTimeout(() => {
      if (!isReadyRef.current) {
        isReadyRef.current = true;
        videoDur.current = video.duration || 10;
        setIsReady(true);
      }
    }, 6000);

    return () => {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
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
        transition: "opacity 1.2s ease-in-out",
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/loading/benz1_poster.jpg"
        className="w-full h-full object-cover"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}
