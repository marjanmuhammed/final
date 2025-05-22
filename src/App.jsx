import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Serices";
import Work from "./Pages/Works";
import Resume from "./Pages/Resume";
import Contact from "./Pages/Contact";
import Footer from "./Pages/Footer";
import "./App.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function App() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: { value: "#000000" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
        resize: true,
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 1.0,
        width: 1.5,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: "out",
        speed: 0.9,
      },
      number: {
        value: 150,
        density: { enable: true, area: 800 },
      },
      opacity: { value: 1.0 },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 4 } },
    },
    detectRetina: true,
  };

  return (
    <>
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      <Navbar />
      <main className="relative">
        <section id="home"><Home /></section>
        <section id="about"><About /></section>
        <section id="services"><Services /></section>
        <section id="work"><Work /></section>
        <section id="resume"><Resume /></section>
        <section id="contact"><Contact /></section>
        <section id="footer"><Footer /></section>
      </main>
    </>
  );
}
