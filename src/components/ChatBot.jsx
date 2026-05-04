import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Code, UserCircle, Briefcase, Github, Instagram, Linkedin, FileText, Download, Eye, ExternalLink } from "lucide-react";
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
    text: "Here are some of my featured projects that I've delivered recently:",
    type: "projects",
    items: [
      {
        title: "7 Up Website",
        description: "A visually appealing and interactive website for the 7 Up brand with smooth animations.",
        image: work1,
        link: ""
      },
      {
        title: "Booking.com Clone",
        description: "A robust travel booking platform with extensive search options and responsive UI.",
        image: work2,
        link: ""
      },
      {
        title: "Bridgeon Student Management",
        description: "A full-stack system built to manage student data and enrollment efficiently.",
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
    text: "You can view or download my latest resume here. It's updated with my latest projects and skills.",
    type: "resume",
    fileUrl: "/images/marjan-resume.pdf",
    suggestions: ["Projects?", "Contact Info"]
  },
  default: {
    text: "Hello! I'm your AI assistant. How can I help you today?",
    suggestions: ["About Me", "Skills", "Projects", "Contact", "Resume"]
  }
};

const TypingMessage = ({ text, onComplete, isBot }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isBot) {
      setDisplayedText(text);
      return;
    }
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete, isBot]);

  return <p className="whitespace-pre-line text-sm leading-relaxed">{displayedText}</p>;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: CHAT_DATA.default.text, type: "text", suggestions: CHAT_DATA.default.suggestions }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = (query) => {
    const userQuery = query || inputValue;
    if (!userQuery.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: userQuery, type: "text" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const q = userQuery.toLowerCase();
      let response;

      if (q.includes("about") || q.includes("who")) {
        response = { ...CHAT_DATA.about, type: "text" };
      } else if (q.includes("skill") || q.includes("tech")) {
        response = { ...CHAT_DATA.skills, type: "text" };
      } else if (q.includes("project") || q.includes("work")) {
        response = { ...CHAT_DATA.projects, type: "projects" };
      } else if (q.includes("contact") || q.includes("call") || q.includes("social")) {
        response = { ...CHAT_DATA.contact, type: "contact" };
      } else if (q.includes("resume") || q.includes("cv")) {
        response = { ...CHAT_DATA.resume, type: "resume" };
      } else {
        response = { ...CHAT_DATA.default, type: "text" };
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        ...response,
        role: "bot" 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center z-[1000] ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-[95vw] md:w-[400px] h-[600px] max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl z-[1001] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Suggestions */}
            <div 
              data-lenis-prevent
              className="px-4 py-3 bg-white/5 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar"
            >
              {["About", "Skills", "Projects", "Contact", "Resume"].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSend(item)}
                  className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold whitespace-nowrap hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-transparent to-black/20 custom-scrollbar"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white/10 backdrop-blur-md border border-white/10 text-gray-200 rounded-tl-none"
                    }`}
                  >
                    <TypingMessage 
                      text={msg.text} 
                      isBot={msg.role === "bot" && idx === messages.length - 1} 
                    />
                    
                    {msg.type === "contact" && (
                      <div className="mt-4 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {msg.socials.map((social, i) => (
                            <a
                              key={i}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/20 border border-white/5 transition-all text-[11px] font-medium"
                            >
                              {social.icon} {social.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.type === "resume" && (
                      <div className="mt-4 space-y-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FileText className="text-blue-400" size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">marjan-resume.pdf</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Professional CV</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <a 
                            href="/images/marjan-resume.pdf"
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] font-bold transition-all text-white"
                          >
                            <Eye size={14} /> View
                          </a>
                          <a 
                            href="/images/marjan-resume.pdf"
                            download="marjan-resume.pdf"
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[11px] font-bold transition-all text-white"
                          >
                            <Download size={14} /> Download
                          </a>
                        </div>
                      </div>
                    )}

                    {msg.type === "projects" && (
                      <div className="mt-4 space-y-4">
                        {msg.items.map((project, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                            <img src={project.image} alt={project.title} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="p-3">
                              <h4 className="text-xs font-bold text-white mb-1">{project.title}</h4>
                              <p className="text-[10px] text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                              {project.link && (
                                <a 
                                  href={project.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  View Project <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                    <Sparkles size={14} className="text-blue-400" />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/80 border-t border-white/5 backdrop-blur-xl">
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                <button onClick={() => handleSend("About")} className="flex-shrink-0 p-2.5 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all" title="About"><UserCircle size={18} /></button>
                <button onClick={() => handleSend("Skills")} className="flex-shrink-0 p-2.5 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all" title="Skills"><Code size={18} /></button>
                <button onClick={() => handleSend("Projects")} className="flex-shrink-0 p-2.5 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all" title="Projects"><Briefcase size={18} /></button>
                <button onClick={() => handleSend("Resume")} className="flex-shrink-0 p-2.5 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all" title="Resume"><FileText size={18} /></button>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about projects, skills..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 pr-14 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all shadow-inner"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1.5 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </>
  );
}
