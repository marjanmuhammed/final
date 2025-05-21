import React, { useRef } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from "react-icons/fa";
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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-16 px-4 sm:px-6 font-montserrat"
      id="contact"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have a project in mind or want to collaborate? Feel free to reach out through the form or contact details below.
          </motion.p>
        </div>

        {/* Contact Info Cards - Horizontal on mobile */}
        <div className="mb-12">
          <div className="md:hidden overflow-x-auto pb-4">
            <div className="flex space-x-4 w-max px-4">
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 min-w-[250px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-semibold mb-1 text-gray-800">Address</h4>
                <p className="text-gray-600 text-sm">Calicut, Kerala, India</p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 min-w-[250px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <FaPhoneAlt className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-semibold mb-1 text-gray-800">Call Us</h4>
                <p className="text-gray-600 text-sm">+91 7902480917</p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 min-w-[250px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <FaEnvelope className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-semibold mb-1 text-gray-800">Email Us</h4>
                <p className="text-gray-600 text-sm">marjanmuhammad790@gmail.com</p>
              </motion.div>
            </div>
          </div>

          {/* Desktop layout (3 columns) */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold mb-1 text-gray-800">Address</h4>
              <p className="text-gray-600 text-sm">Calicut, Kerala, India</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FaPhoneAlt className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold mb-1 text-gray-800">Call Us</h4>
              <p className="text-gray-600 text-sm">+91 7902480917</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold mb-1 text-gray-800">Email Us</h4>
              <p className="text-gray-600 text-sm">marjanmuhammad790@gmail.com</p>
            </motion.div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.form
          ref={form}
          onSubmit={sendEmail}
          className="bg-white rounded-xl shadow-xl p-8 space-y-6 text-left max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="user_name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="user_email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
              placeholder="Regarding a project"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
              placeholder="Hello, I would like to discuss about..."
            ></textarea>
          </div>
          
          <motion.div 
            className="flex justify-center pt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 flex items-center gap-2"
            >
              <FaPaperPlane />
              <span>Send Message</span>
            </button>
          </motion.div>
        </motion.form>

        <ToastContainer />
      </div>
    </div>
  );
}