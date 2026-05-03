import React, { createContext, useContext, useState, useEffect } from "react";

const PerformanceContext = createContext();

export const usePerformance = () => useContext(PerformanceContext);

export const PerformanceProvider = ({ children }) => {
  const [isLowEnd, setIsLowEnd] = useState(false);

  return (
    <PerformanceContext.Provider value={{ isLowEnd, setIsLowEnd }}>
      {children}
    </PerformanceContext.Provider>
  );
};
