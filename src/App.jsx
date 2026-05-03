import React, { useRef } from "react";

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

import "./App.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function App() {
  const cinematicContainerRef = useRef(null);
  
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const particlesOptions = {
    background: { color: { value: "#000000" } },
    fpsLimit: isMobile ? 30 : 60, // Limit FPS on mobile
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: !isMobile, mode: "push" }, // Disable click on mobile
        onHover: { enable: !isMobile, mode: "repulse" }, // Disable hover on mobile
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          quantity: 4,
        },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 100,
        enable: !isMobile, // DISABLE links on mobile - big performance win
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: "out",
        speed: isMobile ? 0.3 : 0.5, // Slower movement on mobile
      },
      number: {
        value: isMobile ? 20 : 60, // Significantly fewer particles for better performance
        density: { enable: true, area: 1000 },
      },
      opacity: { value: 0.6 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: false, // Disable retina for particles on mobile
  };

  return (
    <>
      {!isMobile && <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />}
      <CinematicBackground containerRef={cinematicContainerRef} />
      <Hummingbird />
      <Navbar />
      <main className="relative">
        <div ref={cinematicContainerRef}>
          <section id="home"><Home /></section>
          <section id="about"><About /></section>
        </div>
        <section id="services"><Services /></section>
      
        <section id="work"><Work /></section>
        <section id="resume"><Resume /></section>
        <section id="contact"><Contact /></section>
        <section id="footer"><Footer /></section>
      </main>
    </>
  );
}
