import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navItems = ["home", "about","resume","services", "works", "contact"];

  const inputRef = useRef(null);

  useEffect(() => {
    const id = location.pathname === "/" ? "home" : location.pathname.substring(1);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Close menu on navigation
    setShowSuggestions(false);
    setSearchQuery("");
  }, [location]);

  const handleClick = (id) => {
    navigate(id === "home" ? "/" : `/${id}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  // Filter nav items based on search query
  const filteredSuggestions = navItems.filter((item) =>
    item.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  // Handle search enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (navItems.includes(searchQuery.toLowerCase())) {
        handleClick(searchQuery.toLowerCase());
      } else {
       
      }
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  // Close suggestions if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-white text-gray-800 shadow-md"
    >
      {/* Logo */}
      <div
        className="text-2xl font-extrabold text-pink-600 tracking-wide cursor-pointer flex-shrink-0"
        onClick={() => handleClick("home")}
      >
        My<span className="text-gray-800">Portfolio</span>
      </div>

      {/* Desktop Nav Items */}
      <div className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className="hover:text-pink-600 font-medium transition duration-200 capitalize"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Search Box (Desktop Only) */}
      <div className="hidden md:block relative" ref={inputRef}>
        <input
          type="text"
          placeholder="Search..."
          className="px-2 py-1 rounded-md bg-gray-100 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => setShowSuggestions(searchQuery.length > 0)}
          autoComplete="off"
        />
        <FiSearch className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
            {filteredSuggestions.map((item) => (
              <li
                key={item}
                onClick={() => handleClick(item)}
                className="cursor-pointer px-4 py-2 hover:bg-pink-100 capitalize"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-800 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Menu (Slides Down) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg px-4 py-2 z-40"
          >
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleClick(item)}
                className="block w-full text-left py-2 hover:text-pink-600 font-medium transition duration-200 capitalize"
              >
                {item}
              </button>
            ))}

            {/* Mobile Search Box */}
            <div className="flex items-center mt-2 border-t pt-2">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-2 py-1 rounded-md bg-gray-100 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                autoComplete="off"
              />
              <FiSearch className="ml-2 text-gray-500" />

              {/* Mobile suggestions dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
                  {filteredSuggestions.map((item) => (
                    <li
                      key={item}
                      onClick={() => {
                        handleClick(item);
                        setIsMenuOpen(false);
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-pink-100 capitalize"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
