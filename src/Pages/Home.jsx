import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const roles = ["Full Stack Developer", "Freelancer", "Designer"];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // --- High-End Playback Animation ---
  const TOTAL_FRAMES = 240;
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Removed useSpring to fix the "slow response" and "have to scroll continuously" issue.
  // Direct mapping gives immediate 1:1 hardware-accelerated feedback like Apple's website.
  // This also instantly resets the animation to the first image when navigating back.
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  const canvasZoom = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.15], [30, 0]);

  useEffect(() => {
    let isMounted = true;
    
    // Progressive Loading: Load the first frame immediately to fix initial delay
    const loadImages = () => {
      const firstImg = new window.Image();
      firstImg.src = `/images/herosection/ezgif-frame-001.png`;
      firstImg.onload = () => {
        if (!isMounted) return;
        imagesRef.current[1] = firstImg;
        renderFrame(1);
        
        // PROGRESSIVE INTERLEAVED LOADING FOR INSTANT FEEL
        // 1. Sparse frames (every 10th frame) load first so the whole scroll range has images
        // 2. The rest load afterwards.
        let sparseIndices = [];
        let detailedIndices = [];
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          if (i % 10 === 0) sparseIndices.push(i);
          else detailedIndices.push(i);
        }
        const loadList = [...sparseIndices, ...detailedIndices];
        
        setTimeout(() => {
          if (!isMounted) return;
          let listIndex = 0;
          const loadBatch = () => {
            if (!isMounted || listIndex >= loadList.length) return;
            // Load in small batches to leave network open for Works/Contact videos
            const batchSize = 6;
            for (let b = 0; b < batchSize && listIndex < loadList.length; b++, listIndex++) {
              const frameNum = loadList[listIndex];
              const img = new window.Image();
              const paddedIndex = frameNum.toString().padStart(3, '0');
              img.src = `/images/herosection/ezgif-frame-${paddedIndex}.png`;
              imagesRef.current[frameNum] = img;
            }
            setTimeout(loadBatch, 30); 
          };
          loadBatch();
        }, 300); // Small 0.3s delay is enough to let Works images & Contact video start downloading
      };
    };
    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderFrame = (idx) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // Disable alpha for better performance
    
    const roundedIdx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(idx)));
    const img = imagesRef.current[roundedIdx];
    
    // Fallback: If scrolling extremely fast and image isn't loaded yet, 
    // find the nearest loaded image to prevent blank screen drops (FPS fix).
    if (!img || !img.complete) {
        let fallbackImg = null;
        for (let i = roundedIdx; i >= 1; i--) {
            if (imagesRef.current[i] && imagesRef.current[i].complete) {
                fallbackImg = imagesRef.current[i];
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
    // Match canvas to window resolution while accounting for device pixel ratio (Clarity Fix)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Scale the context to account for DPR
    ctx.scale(dpr, dpr);

    const canvasRatio = window.innerWidth / window.innerHeight;
    const imgRatio = img.width / img.height;
    let drawWidth = window.innerWidth;
    let drawHeight = window.innerHeight;

    // Mobile Responsive natural object-cover logic
    if (canvasRatio > imgRatio) {
      drawHeight = window.innerWidth / imgRatio;
    } else {
      drawWidth = window.innerHeight * imgRatio;
    }
    
    const offsetX = (window.innerWidth - drawWidth) / 2;
    const offsetY = (window.innerHeight - drawHeight) / 2;

    // Enhance image smoothing quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Modern performant way to bind Framer Motion values to native APIs without React re-renders
  useMotionValueEvent(frameIndex, "change", (latest) => {
    requestAnimationFrame(() => renderFrame(latest));
  });

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(() => renderFrame(frameIndex.get()));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex]);

  useEffect(() => {
    const currentWord = roles[index];
    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setCharIndex(0);
        setDisplayedText("");
        setIndex((prev) => (prev + 1) % roles.length);
      }, 2000);
      return () => clearTimeout(pause);
    }
  }, [charIndex, index]);

  return (
    <div 
      ref={containerRef} 
      className="h-[300vh] relative w-full bg-black"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-black">
        <motion.canvas 
          ref={canvasRef} 
          style={{ scale: canvasZoom }}
          className="absolute inset-0 w-full h-full z-0 object-cover pointer-events-none" 
        />
        <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>

        <motion.div
          id="home"
          style={{ opacity: textOpacity, y: textY }}
          className="relative z-10 flex flex-col justify-center items-center px-4 md:px-10 max-w-full overflow-x-hidden pointer-events-none"
        >
          <h1 className="text-center text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight">
            <span className="text-white drop-shadow-lg mr-2 md:mr-3">I am</span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,255,255,0.4)] block sm:inline mt-2 sm:mt-0">
              Muhammad Marjan KK
            </span>
          </h1>

          <div className="flex flex-wrap justify-center items-center mb-6 md:mb-8 text-lg md:text-3xl font-light whitespace-nowrap tracking-wide">
            <span className="mr-2 md:mr-3 text-gray-300 drop-shadow-md">I am</span>
            <motion.span
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent font-medium drop-shadow-[0_3px_6px_rgba(0,255,255,0.5)]"
            >
              {displayedText}
              <span className="animate-pulse text-white">|</span>
            </motion.span>
          </div>

          <motion.p
            className="text-xs md:text-lg text-center max-w-xs md:max-w-xl text-gray-400 font-light tracking-wider drop-shadow-[0_2px_6px_rgba(0,255,255,0.3)]"
          >
            Let's create something amazing together.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
