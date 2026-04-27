import React from "react";
import { cn } from "../../lib/utils";

export function FlippingCard({
  className,
  frontContent,
  backContent,
  height = 300,
  width = 350,
}) {
  return (
    <div
      className="group/flipping-card [perspective:1000px] w-full"
      style={{
        "--height": `${height}px`,
        "--width": `${width}px`,
      }}
    >
      <div
        className={cn(
          "relative rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-700 [transform-style:preserve-3d] group-hover/flipping-card:[transform:rotateY(180deg)]",
          "h-[var(--height)] w-full max-w-[var(--width)] mx-auto",
          className
        )}
      >
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-white text-slate-900 [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(0deg)]">
          <div className="h-full w-full [transform:translateZ(70px)_scale(.93)]">
            {frontContent}
          </div>
        </div>
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-white text-slate-900 [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full w-full [transform:translateZ(70px)_scale(.93)]">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
