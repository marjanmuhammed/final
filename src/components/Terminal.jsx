import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function Terminal() {
  const containerRef = useRef(null);
  const logRef = useRef(null);
  // once: false allows the animation to trigger every time it enters the viewport
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [escalation, setEscalation] = useState("");

  useEffect(() => {
    if (!isInView) {
      // Optional: Clear logs or reset state when leaving view
      setEscalation("");
      if (logRef.current) {
        logRef.current.innerHTML = "";
      }
      return;
    }

    // Reset loop variables on every entry
    let count = 0;
    let speed = 400; // starting speed
    let timeoutId;

    const messages = [
      "running…",
      "loop iteration…",
      "still running…",
      "executing again…",
      "no break condition…",
      "cycle continues…"
    ];

    function loop() {
      if (!logRef.current) return;

      const line = document.createElement("div");
      line.className = "terminal-line";
      line.textContent = `> ${messages[count % messages.length]}`;
      
      // Animation styles for the line
      line.style.opacity = "0";
      line.style.transform = "translateY(10px)";
      line.style.transition = "all 0.2s ease";
      
      logRef.current.prepend(line);
      
      // Trigger animation
      setTimeout(() => {
        if (line) {
          line.style.opacity = "1";
          line.style.transform = "translateY(0)";
        }
      }, 10);

      // contain the loop visually - dynamic limit based on screen
      const maxLines = window.innerWidth < 768 ? 10 : 25;
      if (logRef.current.children.length > maxLines) {
        logRef.current.removeChild(logRef.current.lastChild);
      }

      count++;

      /* SPEED INCREASE */
      speed *= 0.95; // gets faster every cycle
      if (speed < 40) speed = 40;

      /* VISUAL ESCALATION */
      if (count > 50) setEscalation("chaos");
      else if (count > 30) setEscalation("faster");
      else if (count > 15) setEscalation("fast");

      timeoutId = setTimeout(loop, speed);
    }

    loop();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInView]);

  // Mapping escalation states to styles
  const getContainerStyles = () => {
    let bg = "rgba(15, 23, 42, 0.8)";
    let borderColor = "rgba(255, 255, 255, 0.1)";
    let textColor = "#38bdf8";

    if (escalation === "fast") {
        bg = "rgba(59, 7, 100, 0.5)";
    } else if (escalation === "faster") {
        bg = "rgba(63, 13, 13, 0.6)";
    } else if (escalation === "chaos") {
        bg = "rgba(255, 77, 109, 0.3)";
        textColor = "#ff4d6d";
    }

    return {
      background: bg,
      border: `1px solid ${borderColor}`,
      color: textColor
    };
  };

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-transparent">
      <div 
        className={`terminal w-full h-full p-[15px] md:p-[25px] rounded-[14px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] transition-all duration-700 font-mono text-[10px] sm:text-xs md:text-lg`}
        style={getContainerStyles()}
      >
        <div 
          ref={logRef}
          id="log" 
          className="flex flex-col-reverse gap-1 md:gap-2"
        >
          {/* Lines are prepended here */}
        </div>
      </div>

      <style>{`
        .terminal-line {
          animation: appear 0.3s ease forwards;
        }
        @keyframes appear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
