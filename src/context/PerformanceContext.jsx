import React, { createContext, useContext, useState, useEffect } from "react";

const PerformanceContext = createContext();

export const usePerformance = () => useContext(PerformanceContext);

export const PerformanceProvider = ({ children }) => {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) {
      setIsLowEnd(true);
    }
  }, []);

  return (
    <PerformanceContext.Provider value={{ isLowEnd, setIsLowEnd }}>
      {children}
    </PerformanceContext.Provider>
  );
};
