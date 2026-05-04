/**
 * useAdaptiveEngine
 * ─────────────────────────────────────────────────────────────────
 * Real-time adaptive rendering engine for scroll-synced video.
 *
 * Responsibilities:
 *  • Monitor live FPS via requestAnimationFrame timestamps
 *  • Classify device into TIERS: HIGH / MID / LOW / ULTRA_LOW
 *  • Auto-downgrade/upgrade tier as FPS drifts
 *  • Return tier-specific render hints (skipRate, lerpFactor, fpsTarget)
 *
 * Usage:
 *   const { tier, renderHints } = useAdaptiveEngine();
 */

import { useEffect, useRef, useState, useCallback } from "react";

// ── Tier definitions ──────────────────────────────────────────────
export const TIERS = {
  HIGH:       "HIGH",       // 55+ fps  → render every frame
  MID:        "MID",        // 40–54    → render every 2nd frame
  LOW:        "LOW",        // 28–39    → render every 3rd frame
  ULTRA_LOW:  "ULTRA_LOW",  // <28      → render every 4th frame + lowest res
};

export const RENDER_HINTS = {
  [TIERS.HIGH]:      { skipRate: 1, lerpFactor: 0.12, fpsTarget: 60, resMultiplier: 1.0 },
  [TIERS.MID]:       { skipRate: 2, lerpFactor: 0.10, fpsTarget: 45, resMultiplier: 0.70 },
  [TIERS.LOW]:       { skipRate: 3, lerpFactor: 0.08, fpsTarget: 30, resMultiplier: 0.50 },
  [TIERS.ULTRA_LOW]: { skipRate: 4, lerpFactor: 0.06, fpsTarget: 24, resMultiplier: 0.40 },
};

// How quickly we allow a tier DOWNGRADE vs UPGRADE
//  → fast downgrade (protect against sudden spikes)
//  → slow upgrade   (avoid thrashing)
const DOWNGRADE_WINDOW = 1500; // ms – re-evaluate every 1.5 s for downgrade
const UPGRADE_WINDOW   = 4000; // ms – only upgrade after 4 s of stable fps

// FPS thresholds
const FPS_HIGH      = 55;
const FPS_MID       = 40;
const FPS_LOW       = 28;

function classifyFPS(fps) {
  if (fps >= FPS_HIGH)  return TIERS.HIGH;
  if (fps >= FPS_MID)   return TIERS.MID;
  if (fps >= FPS_LOW)   return TIERS.LOW;
  return TIERS.ULTRA_LOW;
}

export function useAdaptiveEngine() {
  const [tier, setTier]         = useState(TIERS.HIGH);
  const fpsRef                  = useRef(60);
  const tierRef                 = useRef(TIERS.HIGH);
  const frameTimesRef           = useRef([]); // rolling window of last N frame-deltas
  const lastFrameRef            = useRef(performance.now());
  const rafRef                  = useRef(null);
  const lastDowngradeCheck      = useRef(performance.now());
  const lastUpgradeCheck        = useRef(performance.now());

  // Keep tierRef in sync with state so callbacks see latest value without
  // triggering re-renders on every fps sample.
  const applyTier = useCallback((newTier) => {
    if (tierRef.current !== newTier) {
      tierRef.current = newTier;
      setTier(newTier);
    }
  }, []);

  useEffect(() => {
    let frameCount = 0;
    const SAMPLE_SIZE = 30; // measure over 30 frames for a rolling average

    function measure(now) {
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;

      // Guard against tab-hidden huge deltas
      if (delta > 0 && delta < 200) {
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > SAMPLE_SIZE) {
          frameTimesRef.current.shift();
        }
      }

      frameCount++;

      // Evaluate every SAMPLE_SIZE frames
      if (frameCount >= SAMPLE_SIZE && frameTimesRef.current.length >= 10) {
        frameCount = 0;
        const avg = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const measuredFps = 1000 / avg;
        fpsRef.current = measuredFps;

        const now2 = performance.now();
        const candidate = classifyFPS(measuredFps);

        // DOWNGRADE: act fast
        const tierOrder = [TIERS.HIGH, TIERS.MID, TIERS.LOW, TIERS.ULTRA_LOW];
        const currentIdx  = tierOrder.indexOf(tierRef.current);
        const candidateIdx = tierOrder.indexOf(candidate);

        if (candidateIdx > currentIdx) {
          // Performance got worse
          if (now2 - lastDowngradeCheck.current > DOWNGRADE_WINDOW) {
            lastDowngradeCheck.current = now2;
            applyTier(candidate);
          }
        } else if (candidateIdx < currentIdx) {
          // Performance improved — upgrade slowly
          if (now2 - lastUpgradeCheck.current > UPGRADE_WINDOW) {
            lastUpgradeCheck.current = now2;
            // Upgrade only one tier at a time to avoid flicker
            const nextTierIdx = Math.max(currentIdx - 1, candidateIdx);
            applyTier(tierOrder[nextTierIdx]);
          }
        }
      }

      rafRef.current = requestAnimationFrame(measure);
    }

    rafRef.current = requestAnimationFrame(measure);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyTier]);

  return {
    tier,
    tierRef,       // mutable ref – safe to read inside rAF loops without stale closures
    fpsRef,        // live fps reading (not reactive, to avoid re-renders)
    renderHints: RENDER_HINTS[tier],
  };
}
