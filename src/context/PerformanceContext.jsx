import React, { createContext, useContext, useState } from "react";

const PerformanceContext = createContext();

export const usePerformance = () => useContext(PerformanceContext);

export const PerformanceProvider = ({ children }) => {
  const [isLowEnd, setIsLowEnd] = useState(false);

  // Default to High-End mode; PerformanceGuard will handle detection.
  // The adaptive engine inside CinematicBackground will further refine
  // rendering quality in real-time regardless of this flag.
  return (
    <PerformanceContext.Provider value={{ isLowEnd, setIsLowEnd }}>
      {children}
    </PerformanceContext.Provider>
  );
};
