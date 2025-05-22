import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navItems = ["home", "about", "resume", "services", "work", "contact"];

  const inputRef = useRef(null);

  // Smooth scroll to section
  const handleClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const filteredSuggestions = navItems.filter((item) =>
    item.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (navItems.includes(searchQuery.toLowerCase())) {
        handleClick(searchQuery.toLowerCase());
      }
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

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
    <>
      {/* Overlay background */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-[-1]" />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-transparent shadow-md"
      >
        {/* Logo with white-blue mix color */}
        <div
          className="text-2xl font-extrabold tracking-wide cursor-pointer flex-shrink-0"
          onClick={() => handleClick("home")}
        >
          <span className="bg-gradient-to-r from-white via-blue-400 to-white bg-clip-text text-transparent">
            My
          </span>
          <span className="text-blue-400">Portfolio</span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleClick(item)}
              className="font-medium capitalize text-white transition duration-200 hover:bg-gradient-to-r hover:from-blue-400 hover:via-white hover:to-blue-400 hover:bg-clip-text hover:text-transparent"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search Box (Desktop) */}
        <div className="hidden md:block relative" ref={inputRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            autoComplete="off"
            className="px-3 py-1 rounded-md bg-black/40 border border-blue-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FiSearch className="absolute right-2 top-2.5 text-blue-400 pointer-events-none" />

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-black/80 border border-blue-400 rounded-md mt-1 max-h-48 overflow-auto shadow-lg text-white">
              {filteredSuggestions.map((item) => (
                <li
                  key={item}
                  onClick={() => handleClick(item)}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-900 capitalize"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-black/90 shadow-lg px-4 py-2 z-40 text-white"
            >
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className="block w-full text-left py-2 hover:bg-gradient-to-r hover:from-blue-400 hover:via-white hover:to-blue-400 hover:bg-clip-text hover:text-transparent font-medium capitalize"
                >
                  {item}
                </button>
              ))}

              {/* Mobile search */}
              <div className="flex items-center mt-2 border-t border-blue-400 pt-2 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  autoComplete="off"
                  className="flex-1 px-2 py-1 rounded-md bg-black/40 border border-blue-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <FiSearch className="ml-2 text-blue-400" />

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 z-50 bg-black/90 border border-blue-400 rounded-md mt-1 max-h-48 overflow-auto shadow-lg text-white">
                    {filteredSuggestions.map((item) => (
                      <li
                        key={item}
                        onClick={() => {
                          handleClick(item);
                          setIsMenuOpen(false);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-900 capitalize"
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
    </>
  );
}
