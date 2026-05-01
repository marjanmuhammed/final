import React, { useState, useEffect, useRef } from "react";
import { motion as Motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// Import the Lottie animation JSON file
import evolutionAnimationData from "../loading/evolution.json";

const roles = ["Full Stack Developer", "Freelancer", "Designer"];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isFirstVisit] = useState(() => sessionStorage.getItem("hasSeenLoader") !== "true");
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [showLottieLoader, setShowLottieLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // --- Lottie Playback Handler ---
  useEffect(() => {
    if (!showLottieLoader || isAnimationFinished) return;

    // Set a timeout as a fallback to finish the loader
    const animationDuration = 4000; 
    const timer = setTimeout(() => {
      setIsAnimationFinished(true);
      if (isFirstVisit) {
        sessionStorage.setItem("hasSeenLoader", "true");
      }
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [showLottieLoader, isAnimationFinished, isFirstVisit]);

  // Signal for Chatbot to appear after loader finishes
  useEffect(() => {
    const isLoaderVisible = showLottieLoader && (isLoading || !isAnimationFinished);
    if (!isLoaderVisible) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('loaderFinished'));
      }, 800);
    }
  }, [showLottieLoader, isAnimationFinished, isLoading]);

  // Handle returning users - show for 3 seconds as requested
  useEffect(() => {
    if (!isFirstVisit) {
      const timer = setTimeout(() => {
        setIsAnimationFinished(true);
        setShowLottieLoader(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  // --- High-End Playback Animation (Scroll Canvas) ---
  const TOTAL_FRAMES = 120;
  const IMAGE_LOAD_TIMEOUT = 6000;
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: textScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);
  const canvasZoom = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  
  // Fades out deep into the About section scroll to cover the transition (stays visible for roughly ~80vh into About section)
  const textOpacity = useTransform(textScrollProgress, [0, 0.1, 0.92, 0.98], [0, 1, 1, 0]);
  const textY = useTransform(textScrollProgress, [0, 0.1], [30, 0]);

  useEffect(() => {
    let isMounted = true;
    const images = [];
    const loadingFallback = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, IMAGE_LOAD_TIMEOUT);

    const finishLoading = () => {
      clearTimeout(loadingFallback);
      if (isMounted) setIsLoading(false);
    };

    const loadImages = async () => {
      let loadedCount = 0;
      const totalImages = TOTAL_FRAMES;

      // Load first frame immediately
      const firstImg = new Image();
      firstImg.src = `/images/herosection-webp/ezgif-frame-001.webp`;
      firstImg.onload = () => {
        if (isMounted) {
          images[1] = firstImg;
          renderFrame(1, images);
        }
      };

      // Load rest in batches
      const batchSize = 10;
      for (let i = 1; i <= totalImages; i += batchSize) {
        if (!isMounted) break;
        const batch = [];
        for (let j = i; j < i + batchSize && j <= totalImages; j++) {
          if (images[j]) continue;
          batch.push(new Promise((resolve) => {
            const img = new Image();
            const paddedIndex = j.toString().padStart(3, '0');
            img.src = `/images/herosection-webp/ezgif-frame-${paddedIndex}.webp`;
            img.onload = () => {
              if (isMounted) images[j] = img;
              resolve();
            };
            img.onerror = () => resolve();
          }));
        }
        await Promise.all(batch);
        loadedCount += batch.length;
        if (loadedCount >= totalImages) finishLoading();
      }
    };
    loadImages();

    window.heroImages = images;

    return () => {
      isMounted = false;
      clearTimeout(loadingFallback);
    };
  }, []);

  const renderFrame = (idx, forcedImages = null) => {
    if (!canvasRef.current) return;
    const images = forcedImages || window.heroImages;
    if (!images) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    const roundedIdx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(idx)));
    const img = images[roundedIdx];

    if (!img || !img.complete) {
      let fallbackImg = null;
      for (let i = roundedIdx; i >= 1; i--) {
        if (images[i] && images[i].complete) {
          fallbackImg = images[i];
          break;
        }
      }
      if (!fallbackImg) return;
      drawToCanvas(canvas, fallbackImg);
      return;
    }

    drawToCanvas(canvas, img);
  };

  const updateCanvasSize = (canvas) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
  };

  const drawToCanvas = (canvas, img) => {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    updateCanvasSize(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = img.width / img.height;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
    } else {
      drawWidth = canvasHeight * imgRatio;
    }

    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium"; // Use medium for better performance

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    requestAnimationFrame(() => renderFrame(latest));
  });

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(() => renderFrame(frameIndex.get()));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex]);

  // Typing animation effect
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

  const handleLoaderExit = () => {
    setShowLottieLoader(false);
  };

  return (
    <div
      ref={containerRef}
      className="h-[300dvh] relative w-full bg-black"
    >
      <AnimatePresence onExitComplete={handleLoaderExit}>
        {showLottieLoader && (isLoading || !isAnimationFinished) && (
          <Motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-md md:max-w-xl px-6 flex flex-col items-center"
            >
              <div className="w-full mb-8 flex justify-center pointer-events-none select-none">
                <Lottie
                  animationData={evolutionAnimationData}
                  loop={false}
                  autoplay={true}
                  onComplete={() => {
                    setIsAnimationFinished(true);
                    if (isFirstVisit) {
                      sessionStorage.setItem("hasSeenLoader", "true");
                    }
                  }}
                  style={{ width: '100%', height: 'auto' }}
                  className="pointer-events-none select-none"
                />
              </div>
              <div className="text-white font-sans text-xs md:text-sm tracking-[0.2em] uppercase opacity-80 text-center">
                Evolution in Progress
                <span className="tracking-normal inline-flex">
                  <Motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                  >
                    .
                  </Motion.span>
                  <Motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  >
                    .
                  </Motion.span>
                  <Motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                  >
                    .
                  </Motion.span>
                </span>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-center items-center bg-black">
        <Motion.canvas
          ref={canvasRef}
          style={{ scale: canvasZoom }}
          className="absolute inset-0 w-full h-full z-0 object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>

        <Motion.div
          id="home"
          style={{ opacity: textOpacity, y: textY }}
          className="fixed inset-0 z-[9999] flex flex-col justify-center items-center px-4 md:px-10 max-w-full overflow-x-hidden pointer-events-none"
        >
          <h1 className="text-center text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight">
            <span className="text-white drop-shadow-lg mr-2 md:mr-3">I am</span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,255,255,0.4)] block sm:inline mt-2 sm:mt-0">
              Muhammad Marjan KK
            </span>
          </h1>

          <div className="flex flex-wrap justify-center items-center mb-6 md:mb-8 text-lg md:text-3xl font-light whitespace-nowrap tracking-wide">
            <span className="mr-2 md:mr-3 text-gray-300 drop-shadow-md">I am</span>
            <Motion.span
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent font-medium drop-shadow-[0_3px_6px_rgba(0,255,255,0.5)]"
            >
              {displayedText}
              <span className="animate-pulse text-white">|</span>
            </Motion.span>
          </div>

          <Motion.p
            className="text-xs md:text-lg text-center max-w-xs md:max-w-xl text-gray-400 font-light tracking-wider drop-shadow-[0_2px_6px_rgba(0,255,255,0.3)]"
          >
            Let's create something amazing together.
          </Motion.p>
        </Motion.div>
      </div>
    </div>
  );
}
