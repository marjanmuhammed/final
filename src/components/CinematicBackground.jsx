import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { getCachedImage } from "../lib/preloader";

export default function CinematicBackground({ 
  totalFrames = 240, 
  scrollTarget, 
  opacity = 1,
  type = 'about'
}) {
  const canvasRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);

  const renderFrame = (idx) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    const roundedIdx = Math.min(totalFrames, Math.max(1, Math.round(idx)));
    const img = getCachedImage(type, roundedIdx);

    if (!img || !img.complete) {
      let fallbackImg = null;
      for (let i = roundedIdx; i >= 1; i--) {
        const cached = getCachedImage(type, i);
        if (cached && cached.complete) {
          fallbackImg = cached;
          break;
        }
      }
      if (!fallbackImg) return;
      drawToCanvas(canvas, ctx, fallbackImg);
      return;
    }

    drawToCanvas(canvas, ctx, img);
  };

  const drawToCanvas = (canvas, ctx, img) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const canvasRatio = window.innerWidth / window.innerHeight;
    const imgRatio = img.width / img.height;
    let drawWidth = window.innerWidth;
    let drawHeight = window.innerHeight;

    if (canvasRatio > imgRatio) {
      drawHeight = window.innerWidth / imgRatio;
    } else {
      drawWidth = window.innerHeight * imgRatio;
    }

    const offsetX = (window.innerWidth - drawWidth) / 2;
    const offsetY = (window.innerHeight - drawHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    requestAnimationFrame(() => renderFrame(latest));
  });

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(() => renderFrame(frameIndex.get()));
    window.addEventListener("resize", handleResize);
    // Initial render
    setTimeout(() => renderFrame(frameIndex.get()), 100);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex]);

  return (
    <motion.div 
      style={{ opacity }}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    >
      <div className="relative w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>
    </motion.div>
  );
}
