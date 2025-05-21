import React from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white py-10 font-montserrat text-center">
      {/* Social Icons */}
      <div className="flex justify-center gap-6 text-2xl text-gray-800 mb-4">
        <a
          href="https://github.com/marjanmuhammed"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition"
        >
          <FaGithub />
        </a>
        <a
          href="https://instagram.com/marjan__mhmd"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition"
        >
          <FaInstagram />
        </a>
        <a
          href="https://linkedin.com/in/marjan-muhammad"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://x.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-500 transition"
        >
          <FaXTwitter />
        </a>
      </div>

      {/* Copyright */}
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Marjan Muhammad. All rights reserved.
      </p>
    </footer>
  );
}
