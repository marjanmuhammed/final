import React from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
 
         <footer className="sticky bottom-0 z-10 py-10 font-montserrat text-center text-white">
 
  {/* Overlay */}
  <div className="absolute bottom-0 left-0 w-full h-full bg-black/60 -z-10" />

  {/* Social Icons */}
  <div className="flex justify-center gap-6 text-2xl mb-4">
    <a
      href="https://github.com/marjanmuhammed"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-gray-300 transition"
    >
      <FaGithub />
    </a>
    <a
      href="https://instagram.com/marjan__mhmd"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-pink-400 transition"
    >
      <FaInstagram />
    </a>
    <a
      href="https://linkedin.com/in/marjan-muhammad"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-400 transition"
    >
      <FaLinkedin />
    </a>
    <a
      href="https://x.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-sky-400 transition"
    >
      <FaXTwitter />
    </a>
  </div>

  {/* Copyright */}
  <p className="text-sm text-gray-300">
    © {new Date().getFullYear()} Marjan Muhammad. All rights reserved.
  </p>
</footer>

  );
}
