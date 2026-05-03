import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles, Code, UserCircle, Briefcase, Github, Instagram, Linkedin, Twitter, FileText, Download, Eye } from "lucide-react";
import work1 from "../assets/works-1.jpg";
import work2 from "../assets/works-2.jpg";
import work3 from "../assets/works-3.png";



const CHAT_DATA = {
  about: {
    text: "I am Marjan Muhammad, a passionate Full Stack Developer from Calicut, Kerala. I specialize in building scalable web applications using React, .NET Microservices, and modern UI/UX principles. I love turning complex problems into simple, beautiful, and intuitive designs.",
    suggestions: ["What are your skills?", "Show me your projects"]
  },
  skills: {
    text: "I have expertise in:\n• Frontend: React, JavaScript, Tailwind CSS, Framer Motion\n• Backend: .NET, C#, SQL Server, Microservices\n• Tools: Git, Docker, Vercel, Azure\nI focus on writing clean, maintainable, and performance-optimized code.",
    suggestions: ["Tell me about yourself", "Latest projects?"]
  },
  projects: {
    text: "Here are some of my featured projects:",
    items: [
      {
        title: "7 Up Website",
        description: "A visually appealing and interactive website for the 7 Up brand.",
        image: work1,
        link: "#"
      },
      {
        title: "Booking.com Website",
        description: "A robust travel booking platform with extensive search options.",
        image: work2,
        link: "#"
      },
      {
        title: "Bridgeon Student Management",
        description: "A full-stack system built to manage student data and enrollment.",
        image: work3,
        link: "https://bridgeonfrontend.vercel.app/"
      }
    ],
    suggestions: ["How can I contact you?", "Tell me about yourself"]
  },

  contact: {
    text: "You can reach me at:\n📧 marjanmuhammad790@gmail.com\n📞 +91 7902480917",
    type: "contact",
    socials: [
      { name: "GitHub", icon: <Github size={16} />, url: "https://github.com/marjanmuhammed" },
      { name: "Instagram", icon: <Instagram size={16} />, url: "https://www.instagram.com/marjan__mhmd" },
      { name: "LinkedIn", icon: <Linkedin size={16} />, url: "https://www.linkedin.com/in/marjan-muhammad-831672294" }
    ],
    suggestions: ["Tell me about yourself", "Resume?"]
  },
  resume: {
    text: "You can view or download my latest resume here:",
    type: "resume",
    fileUrl: "/images/resume.pdf",
    suggestions: ["Projects?", "Contact Info"]
  },
  default: {
    text: "Hello! I'm your AI assistant. How can I help you today?",
    suggestions: ["About Me", "Skills", "Projects", "Contact", "Resume"]
  }
};

const TypingMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!text) return;
    if (index < text.length) {

      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 25); // Slower typing = smoother performance
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  return <p className="whitespace-pre-line">{displayedText}</p>;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: CHAT_DATA.default.text, type: "text", suggestions: CHAT_DATA.default.suggestions }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen || messages.length || isTyping) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (query) => {
    const userQuery = query || inputValue;
    if (!userQuery.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userQuery, type: "text" }]);
    setInputValue("");
    setIsTyping(true);

    // AI Logic
    setTimeout(() => {
      let response;
      const q = userQuery.toLowerCase();
      
      if (q.includes("about") || q.includes("who")) {
        response = { role: "bot", ...CHAT_DATA.about, type: "text" };
      } else if (q.includes("skill") || q.includes("tech")) {
        response = { role: "bot", ...CHAT_DATA.skills, type: "text" };
      } else if (q.includes("project") || q.includes("work")) {
        response = { role: "bot", ...CHAT_DATA.projects, type: "projects" };
      } else if (q.includes("contact") || q.includes("call") || q.includes("email")) {
        response = { role: "bot", ...CHAT_DATA.contact, type: "text" };
      } else if (q.includes("resume") || q.includes("cv")) {
        response = { role: "bot", ...CHAT_DATA.resume, type: "resume" };
      } else {
        response = { role: "bot", text: "I can't reply for this general question, ask me about me.", suggestions: CHAT_DATA.default.suggestions, type: "text" };
      }

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[2000] p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center border border-white/20 will-change-transform"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[550px] bg-[#0a0a0a] border border-white/10 rounded-3xl z-[2000] flex flex-col shadow-2xl overflow-hidden font-montserrat will-change-transform"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">AI Portfolio Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>


            {/* Top Quick Actions */}
            <div className="bg-white/5 border-b border-white/5 px-4 py-3 overflow-x-auto scrollbar-hide flex gap-2 whitespace-nowrap">
              {["About Me", "Skills", "Projects", "Contact", "Resume"].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-blue-600/20 border border-white/10 rounded-full text-[10px] text-white/70 hover:text-white transition-all active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}>
                  {msg.role === "bot" && (
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                      <Sparkles size={14} className="text-blue-400" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === "user" ? "bg-blue-600 text-white rounded-2xl rounded-tr-none" : "bg-white/5 text-white/90 rounded-2xl rounded-tl-none border border-white/5"} p-4 shadow-xl`}>
                    {msg.role === "bot" ? (
                      <TypingMessage text={msg.text} />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}

                    {/* Project Items (if applicable) */}
                    {msg.type === "projects" && msg.items && (
                      <div className="mt-4 space-y-3">
                        {msg.items.map((item, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.5 }}
                            className="bg-black/40 rounded-xl overflow-hidden border border-white/5"
                          >
                            <img src={item.image} alt={item.title} className="w-full h-24 object-cover opacity-80" />
                            <div className="p-3">
                              <h4 className="text-xs font-bold text-white">{item.title}</h4>
                              <p className="text-[10px] text-white/50 mt-1">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Social Links (if contact type) */}
                    {(msg.type === "contact" || msg.socials) && (
                      <div className="mt-4 flex gap-3">
                        {msg.socials.map((social, i) => (
                          <a 
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/5 hover:bg-blue-600/20 border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg active:scale-90"
                            title={social.name}
                          >
                            {social.icon}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Resume Card (if resume type) */}
                    {msg.type === "resume" && (
                      <div className="mt-4 bg-black/40 rounded-xl border border-white/10 p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                            <FileText size={24} className="text-red-500" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Marjan_Resume.pdf</h4>
                            <p className="text-[10px] text-white/40">Latest Version • PDF</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <a 
                            href={msg.fileUrl} 
                            target="_blank" 
                            className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-white transition-all"
                          >
                            <Eye size={14} /> View
                          </a>
                          <a 
                            href={msg.fileUrl} 
                            download 
                            className="flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] text-white transition-all"
                          >
                            <Download size={14} /> Download
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Suggestions Chips */}
                    {msg.role === "bot" && msg.suggestions && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-blue-400 transition-all active:scale-95"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                    <Sparkles size={14} className="text-blue-400" />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest animate-pulse">Typing...</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/50 border-t border-white/5">
              <div className="flex gap-2 mb-3">
                <button onClick={() => handleSend("About")} className="p-2 bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors" title="About Me"><UserCircle size={18} /></button>
                <button onClick={() => handleSend("Skills")} className="p-2 bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors" title="Skills"><Code size={18} /></button>
                <button onClick={() => handleSend("Projects")} className="p-2 bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors" title="Projects"><Briefcase size={18} /></button>
                <button onClick={() => handleSend("Resume")} className="p-2 bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors" title="Resume"><FileText size={18} /></button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                />
                <button
                  onClick={() => handleSend()}
                  className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-90 shadow-lg shadow-blue-500/20"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
}
