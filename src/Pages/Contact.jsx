import React, { useRef } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Hyperspeed from "../components/Hyperspeed";
import Terminal from "../components/Terminal";
import { usePerformance } from "../context/PerformanceContext";

const hyperspeedOptions = {

  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3
  }
};

const liteHyperspeedOptions = {
  ...hyperspeedOptions,
  length: 150,
  lanesPerRoad: 1,
  totalSideLightSticks: 2,
  lightPairsPerRoadWay: 5,
  carLightsFade: 0.1,
  colors: {
    ...hyperspeedOptions.colors,
    leftCars: [0xd856bf],
    rightCars: [0x03b3c3],
  }
};

export default function Contact() {
  const { isLowEnd } = usePerformance();
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);

    fetch("https://formsubmit.co/ajax/marjanmuhammad790@gmail.com", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("Email Sent Successfully!", {
            position: "top-center",
          });
          e.target.reset();
        } else {
          throw new Error("FormSubmit Error");
        }
      })
      .catch((error) => {
        console.error("Email sending error:", error);
        toast.error("Failed to send message. Please try again.", {
          position: "top-center",
        });
      });
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      text: "Calicut, Kerala, India",
    },
    {
      icon: <FaPhoneAlt />,
      title: "Call Us",
      text: "+91 7902480917",
    },
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      text: <>marjanmuhammad790<br />@gmail.com</>,
    }

  ];

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden pt-20 font-montserrat text-white bg-black z-[1]">
      {/* Main Section */}
      <main className="relative max-w-7xl mx-auto bg-white/5 rounded-lg shadow-lg px-6 md:px-12 py-16 flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-24">

        {/* Left Section (Form) */}
        <div className="flex-1 w-full max-w-xl space-y-12 z-20">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact
          </motion.h2>

          <motion.p
            className="text-gray-300 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have a project in mind or want to collaborate? Feel free to reach
            out through the form or contact details below.
          </motion.p>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                className="bg-transparent border border-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + i * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white bg-opacity-20 p-4 rounded-full inline-block mb-4">
                  {React.cloneElement(info.icon, {
                    className: "text-blue-500 text-2xl drop-shadow-md",
                  })}
                </div>
                <h4 className="font-semibold mb-1 text-white">{info.title}</h4>
                <p className="text-gray-300 text-sm">{info.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden group">
            {/* Hyperspeed Effect Background - Ultra Lite for Low-End Mode */}
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
              <Hyperspeed effectOptions={isLowEnd ? liteHyperspeedOptions : hyperspeedOptions} />
            </div>



            <form ref={form} onSubmit={sendEmail} className="relative z-10 space-y-6">
              <div>
                <label className="block text-white/80 font-medium mb-1.5 text-sm uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  className="w-full px-5 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-white/80 font-medium mb-1.5 text-sm uppercase tracking-wider">
                  Your Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className="w-full px-5 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="hello@example.com"
                />
              </div>
              <div>
                <label className="block text-white/80 font-medium mb-1.5 text-sm uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="w-full px-5 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                  placeholder="Text Here..."
                ></textarea>
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section (Terminal Loop) */}
        <motion.div
          className="w-full md:flex-1 h-[250px] md:h-[500px] z-10 flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full h-full max-w-[700px] bg-black/20 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Terminal />
          </div>
        </motion.div>
      </main>

      <ToastContainer />
    </div>
  );
}
