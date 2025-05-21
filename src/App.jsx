import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Serices";
import Work from "./Pages/Works";
import Resume from "./Pages/Resume";
import Contact from "./Pages/Contact";
import Footer from "./Pages/Footer";



export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="p-6">
        <section id="home">
          <Home />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="works">
          <Work />
        </section>
        <section id="resume">
          <Resume />
        </section> <section id="contact">
          <Contact />
        </section>
        <section id="footer">
          <Footer />
        </section>
       
        
        {/* You can add more sections here */}
      </main>
    </Router>
  );
}
