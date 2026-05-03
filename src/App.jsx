import React, { useRef, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Serices"
import Work from "./Pages/Works";
import Resume from "./Pages/Resume";
import Contact from "./Pages/Contact";
import Footer from "./Pages/Footer";
import Hummingbird from "./components/Hummingbird";
import CinematicBackground from "./components/CinematicBackground";
import PerformanceGuard from "./components/PerformanceGuard";
import ParticlesBackground from "./components/ParticlesBackground";
import { PerformanceProvider, usePerformance } from "./context/PerformanceContext";

import "./App.css";

// Always start at the top on refresh — ensures video plays from frame 0
if (typeof window !== "undefined") {
  history.scrollRestoration = "manual";
}

function AppContent() {
  const { isLowEnd } = usePerformance();
  const cinematicContainerRef = useRef(null);

  // Force scroll to top on every mount (page load / refresh)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <PerformanceGuard>
      <div className={`app-container ${isLowEnd ? "low-end-mode" : ""}`}>
        {isLowEnd ? (
          <ParticlesBackground />
        ) : (
          <CinematicBackground containerRef={cinematicContainerRef} />
        )}
        
        {!isLowEnd && <Hummingbird />}

        
        <Navbar />

        
        <main className="relative">
          <div ref={cinematicContainerRef} className={isLowEnd ? "min-h-screen" : "h-[800dvh]"}>
            <section id="home"><Home /></section>
            <section id="about"><About /></section>
          </div>
          <section id="services"><Services /></section>
          <section id="work"><Work /></section>
          <section id="resume"><Resume /></section>
          <section id="contact"><Contact /></section>
          <section id="footer"><Footer /></section>
        </main>
      </div>
    </PerformanceGuard>
  );
}

export default function App() {
  return (
    <PerformanceProvider>
      <AppContent />
    </PerformanceProvider>
  );
}


