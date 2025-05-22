import React, { useRef } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_prj6s4g",
        "template_05slqbq",
        form.current,
        "LlWqMkvQa_2OT3RKm"
      )
      .then(
        () => {
          toast.success("Email Sent Successfully!", {
            position: "top-center",
          });
          e.target.reset();
        },
        (error) => {
          console.error("Email sending error:", error);
          toast.error("Failed to send message. Please try again.", {
            position: "top-center",
          });
        }
      );
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
      text: <>marjanmuhammad790<br/>@gmail.com</>,
    }
    
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-20 font-montserrat text-white">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/contact-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 -z-5" />

      {/* Main Section */}
      <main className="relative max-w-7xl mx-auto bg-black/40 rounded-lg shadow-lg px-6 md:px-12 py-16 flex flex-col md:flex-row items-start gap-12">

        {/* Mobile video on top */}
        <motion.div
          className="block md:hidden w-full max-w-md mx-auto mb-8 rounded-full aspect-square overflow-hidden shadow-xl"
          style={{
            boxShadow: "0 0 80px rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(4px)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <video
            src="/video/Screen Recording 1947-03-01 at 5.21.57 PM.mov"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-full bg-transparent"
            style={{
              transformStyle: "preserve-3d",
            }}
          />
        </motion.div>

        {/* Left Section */}
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
          <div className="p-8 rounded-xl bg-black/30 backdrop-blur-md border border-white/30">
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  className="w-full px-4 py-2 rounded-md bg-transparent text-white placeholder-gray-400 border border-white focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className="w-full px-4 py-2 rounded-md bg-transparent text-white placeholder-gray-400 border border-white focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  className="w-full px-4 py-2 rounded-md bg-transparent text-white placeholder-gray-400 border border-white focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md border border-blue-500 transition-colors duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section: Rounded Video for desktop */}
        <motion.div
          className="hidden md:block absolute right-10 top-1/2 transform -translate-y-1/2 rounded-full aspect-square overflow-hidden shadow-xl"
          style={{
            width: "550px",
            boxShadow: "0 0 80px rgb(0,0,0)",
            backdropFilter: "blur(4px)",
            zIndex: 10,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
         <video
  src="/video/Screen Recording 1947-03-01 at 5.21.57 PM.mov"
  autoPlay
  muted
  loop
  playsInline
  className="w-full h-full object-cover rounded-full bg-transparent"
  style={{
    transformStyle: "preserve-3d",
  }}
/>

        </motion.div>
      </main>

      <ToastContainer />
    </div>
  );
}
