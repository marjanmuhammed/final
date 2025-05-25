import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaInstagram, FaGithub, FaLinkedin, FaCopy, FaThumbsUp, FaThumbsDown, FaPause, FaPlay, FaTimes } from 'react-icons/fa';

const roles = ["Full Stack Developer", "Freelancer", "Designer"];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your AI assistant. Ask me about:\n- About me\n- My skills\n- My projects\n- Contact info",
      icons: ["👋"]
    },
  ]);
  const [input, setInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [robotVisible, setRobotVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const typingIntervalRef = useRef(null);
  const [messageRatings, setMessageRatings] = useState({});
  const [currentMessageIndex, setCurrentMessageIndex] = useState(null);

  // For the "How can I help you?" animation
  const [helpText, setHelpText] = useState("");
  const [helpIndex, setHelpIndex] = useState(0);
  const helpPhrase = "How can I help you?";
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const currentWord = roles[index];
    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setCharIndex(0);
        setDisplayedText("");
        setIndex((prev) => (prev + 1) % roles.length);
      }, 2000);
      return () => clearTimeout(pause);
    }
  }, [charIndex, index]);

  useEffect(() => {
    if (!isAnimating || chatOpen) return;

    if (helpIndex < helpPhrase.length) {
      const timeout = setTimeout(() => {
        setHelpText((prev) => prev + helpPhrase[helpIndex]);
        setHelpIndex((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      const resetTimeout = setTimeout(() => {
        setHelpText("");
        setHelpIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [helpIndex, isAnimating, chatOpen]);

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
      setIsAnimating(false);
    } else {
      setIsAnimating(true);
    }
  }, [messages, chatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewWork = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const typeMessage = (message, callback) => {
    let i = 0;
    let currentText = "";

    // Clear any existing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (isPaused) return;

      if (i < message.length) {
        currentText += message[i];
        callback(currentText);
        i++;
        scrollToBottom();
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 30);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);

    if (!isPaused) {
      // Pausing - just clear the interval
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    } else {
      // Resuming - get the last bot message and continue typing
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot" && lastMessage.text !== lastMessage.fullText) {
        // Calculate the remaining text to type
        const remainingText = lastMessage.fullText.slice(lastMessage.text.length);

        typeMessage(remainingText, (typedText) => {
          setMessages(prev => prev.map(msg =>
            msg.id === lastMessage.id ? {
              ...msg,
              text: lastMessage.text + typedText
            } : msg
          ));
        });
      }
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { id: Date.now(), sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);
    setIsPaused(false);

    setTimeout(() => {
      const reply = generateSearchEngineReply(input.trim());
      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: "",
        fullText: reply.text,
        icons: reply.icons,
        links: reply.links,
        images: reply.images
      };

      setMessages((prev) => [...prev, botReply]);
      setIsLoading(false);
      setCurrentMessageIndex(botReply.id);

      // Start typing the full message
      typeMessage(botReply.fullText, (typedText) => {
        setMessages(prev => prev.map(msg =>
          msg.id === botReply.id ? {...msg, text: typedText} : msg
        ));
      });
    }, 800);
  };

  const generateSearchEngineReply = (message) => {
    const lowerMsg = message.toLowerCase();
    let reply = { text: "", icons: [], links: [], images: [] };

    if (lowerMsg.includes("about") || lowerMsg.includes("who are you") || lowerMsg.includes("introduce")) {
      reply.text = `About Me 👤\n\nI am Muhammad Marjan K.K., from Kannur, Kerala, and currently residing in Calicut.\n\nI hold a Bachelor's degree in Economics from Kannur University. After graduation, I developed a strong interest in web development and began learning HTML, CSS, Bootstrap, Tailwind CSS, JavaScript, React, Redux, and C# through self-study and online platforms.\n\nAs part of my learning journey, I completed several front-end projects, including an online shopping website, a 7 Up landing page, and a clone of Booking.com. These projects helped me gain hands-on experience and improve my practical development skills.\n\nI also worked as a Front-end Intern at Bridgeone Solution, where I gained real-world exposure to working in a professional development environment.\n\nCurrently, I am focusing on backend development using .NET and continuing to study C# and the .NET framework to strengthen my skills as a full-stack developer.\n\nThank you.`;
      reply.icons = ["👤", "🎓", "💻"];
    }
    else if (lowerMsg.includes("skill") || lowerMsg.includes("expert") || lowerMsg.includes("what can you do")) {
      reply.text = `Skills 🛠️\n\nI have strong skills in front-end technologies like:\n- HTML\n- CSS\n- Bootstrap\n- Tailwind CSS\n- JavaScript\n- React\n- Redux\n\nI also know C# and am focusing on .NET backend development. I use Git for version control and deploy projects on Vercel and AWS. Additionally, I have a basic understanding of UI/UX design to create user-friendly interfaces.`;
      reply.icons = ["🛠️", "💻", "🎨"];
    }
    else if (lowerMsg.includes("project") || lowerMsg.includes("portfolio") || lowerMsg.includes("work")) {
      reply.text = `Projects 📂\n\nI have developed several web projects that demonstrate my front-end development skills:\n\n1. Online Shopping Website for Shoes 👟\n- A fully responsive e-commerce site\n- Features product listings and shopping cart functionality\n- User-friendly interface designed to enhance the online shopping experience\n\n2. 7 Up Landing Page 🥤\n- A visually appealing, modern landing page\n- Replicates the official 7 Up website\n- Focuses on clean design and responsiveness\n\n3. Booking.com Clone 🏨\n- A functional clone of Booking.com\n- Showcases ability to build complex UI layouts\n- Implements search and filtering features\n- Creates a seamless booking interface`;
      reply.icons = ["📂", "👟", "🥤", "🏨"];
      reply.images = [
        { url: "/video/Image 29-09-1946 Saka at 1.28 AM.jpg", alt: "Booking.com Clone" },
        { url: "/video/Image 30-02-1947 Saka at 7.25 PM.jpg", alt: "7 Up Landing Page" },
        { url: "/video/Image 04-03-1947 Saka at 4.46 PM.jpg", alt: "E-commerce Website" }
      ];
      reply.links = [
        { text: "E-commerce Website", url: "https://shoe-ecommerce-beige.vercel.app/" }
      ];
    }
    else if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("number") || lowerMsg.includes("hire") || lowerMsg.includes("social")) {
      reply.text = `Contact Information 📞\n\n📱 Phone: 7902480917\n📧 Email: marjanmuhammad790@gmail.com\n\n🌐 Social Media:\n📸 Instagram: https://instagram.com/marjan__mhmd\n💻 GitHub: https://github.com/marjanmuhammed\n🔗 LinkedIn: https://linkedin.com/in/marjan-muhammad`;
      reply.icons = ["📞", "📧", "🌐"];
      reply.links = [
        { text: "Instagram", url: "https://instagram.com/marjan__mhmd" },
        { text: "GitHub", url: "https://github.com/marjanmuhammed" },
        { text: "LinkedIn", url: "https://linkedin.com/in/marjan-muhammad" }
      ];
    }
    else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      reply.text = "Hello! 👋 I'm here to help you learn about Muhammad Marjan KK's professional background. You can ask about:\n- About me\n- My skills\n- My projects\n- Contact info";
      reply.icons = ["👋"];
    }
    else {
      reply.text = `I'm not sure I understand. Here are some things you can ask about:\n\n- "Tell me about yourself"\n- "What skills do you have?"\n- "Show me your projects"\n- "How can I contact you?"`;
      reply.icons = ["❓"];
    }

    return reply;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const rateMessage = (messageId, rating) => {
    setMessageRatings(prev => ({
      ...prev,
      [messageId]: rating
    }));
    toast.success('Thank you for your feedback!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <motion.div
        id="home"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 md:px-10 max-w-full overflow-x-hidden pt-20"
      >
        <h1 className="text-center text-4xl md:text-6xl font-extrabold mb-4">
          <span className="text-white drop-shadow-lg mr-2">I am</span>
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,255,255,0.4)]">
            Muhammad Marjan KK
          </span>
        </h1>

        <div className="flex flex-wrap justify-center items-center mb-4 md:mb-6 text-2xl md:text-4xl font-semibold whitespace-nowrap">
          <span className="mr-2 text-white drop-shadow-md">I am</span>
          <motion.span
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="underline decoration-cyan-300 underline-offset-4 bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent font-bold drop-shadow-[0_3px_6px_rgba(0,255,255,0.5)]"
          >
            {displayedText}
            <span className="animate-pulse text-white">|</span>
          </motion.span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-base md:text-lg italic text-center max-w-xs md:max-w-xl mb-6 md:mb-8 text-white drop-shadow-[0_2px_6px_rgba(0,255,255,0.3)]"
        >
          Let's create something amazing together.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#2563eb", color: "white", boxShadow: "0 0 30px rgba(37, 99, 235, 0.9)" }}
          whileTap={{ scale: 0.95, boxShadow: "0 0 15px rgba(37, 99, 235, 0.7)" }}
          onClick={handleViewWork}
          className="px-5 py-2 md:px-6 md:py-3 border-2 border-blue-500 text-blue-500 bg-white font-semibold cursor-pointer text-sm md:text-base soft-glow-button"
        >
          View My Work
        </motion.button>
      </motion.div>

      {robotVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="fixed bottom-4 right-4 md:right-8 z-30 flex flex-col items-end gap-2"
        >
          <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatOpen((prev) => !prev)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img
              src="/video/vecteezy-robot-assistant-3d-an-unscreen.gif"
              alt="Robot Animation"
              className="w-32 md:w-40 lg:w-48 pointer-events-none select-none"
            />
            <motion.div
              animate={{
                opacity: isAnimating && !chatOpen ? [0.8, 1, 0.8] : 0,
                y: isAnimating && !chatOpen ? [0, -3, 0] : 0
              }}
              transition={{
                duration: 2,
                repeat: isAnimating && !chatOpen ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="text-white text-sm md:text-base font-medium px-2 py-1 rounded-md group-hover:bg-gray-800/50 transition-colors"
            >
              {helpText}
              <span className="animate-pulse">|</span>
            </motion.div>
          </motion.div>
          <button
            onClick={() => setRobotVisible(false)}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors flex items-center gap-1"
          >
            <FaTimes className="h-3 w-3" />
          </button>
        </motion.div>
      )}

      {!robotVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setRobotVisible(true)}
          className="fixed bottom-4 right-4 md:right-8 z-30 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.button>
      )}

      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed right-4 bottom-24 md:right-8 md:bottom-28 w-80 md:w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-40 backdrop-blur-sm"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex justify-between items-center bg-gradient-to-r from-cyan-800 to-blue-900 px-4 py-3 rounded-t-lg text-white font-semibold select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="font-mono">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatOpen(false)}
                className="hover:text-gray-300 text-lg font-bold transition-colors p-1"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 py-3 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 font-sans">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-3 flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`rounded-xl px-4 py-2 max-w-[85%] break-words whitespace-pre-line relative ${
                    msg.sender === "bot"
                      ? "bg-gray-800 text-gray-100 border border-gray-700"
                      : "bg-cyan-600 text-white border border-cyan-500"
                  } ${
                    msg.sender === "bot" ? "font-medium" : "font-semibold"
                  }`}
                  style={{
                    boxShadow: msg.sender === "bot"
                      ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                      : "0 2px 8px rgba(34, 211, 238, 0.2)"
                  }}
                >
                  {msg.sender === "bot" && msg.icons && (
                    <div className="absolute -left-8 top-0 flex flex-col items-center gap-1">
                      {msg.icons.map((icon, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 10 }}
                        >
                          {icon}
                        </motion.span>
                      ))}
                    </div>
                  )}
                  {msg.text}
                  {msg.sender === "bot" && isTyping && msg.id === messages[messages.length-1]?.id && (
                    <span className="animate-pulse">|</span>
                  )}
                  {msg.sender === "bot" && msg.images && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.images.map((image, i) => (
                        <img key={i} src={image.url} alt={image.alt} className="w-20 h-20 object-cover rounded" />
                      ))}
                    </div>
                  )}
                  {msg.sender === "bot" && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.links?.map((link, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openLink(link.url)}
                          className="text-xs bg-cyan-800 hover:bg-cyan-700 text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                          {link.text.includes("Instagram") && <FaInstagram className="h-3 w-3" />}
                          {link.text.includes("GitHub") && <FaGithub className="h-3 w-3" />}
                          {link.text.includes("LinkedIn") && <FaLinkedin className="h-3 w-3" />}
                          {link.text}
                        </motion.button>
                      ))}
                      {(msg.text.includes("Phone") || msg.text.includes("Email")) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(msg.text.includes("Phone") ? "7902480917" : "marjanmuhammad790@gmail.com")}
                          className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                          <FaCopy className="h-3 w-3" />
                          Copy
                        </motion.button>
                      )}
                    </div>
                  )}

                  {msg.sender === "bot" && (
                    <div className="flex justify-end mt-2 gap-2">
                      <button
                        onClick={() => rateMessage(msg.id, 'like')}
                        className={`p-1 rounded-full transition-colors ${
                          messageRatings[msg.id] === 'like'
                            ? 'text-blue-500 bg-blue-100/20'
                            : 'text-gray-400 hover:text-blue-500 hover:bg-gray-700'
                        }`}
                      >
                        <FaThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => rateMessage(msg.id, 'dislike')}
                        className={`p-1 rounded-full transition-colors ${
                          messageRatings[msg.id] === 'dislike'
                            ? 'text-red-500 bg-red-100/20'
                            : 'text-gray-400 hover:text-red-500 hover:bg-gray-700'
                        }`}
                      >
                        <FaThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="rounded-xl px-4 py-2 max-w-[85%] bg-gray-800 text-gray-100 border border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-sm italic font-medium">Answering...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 bg-gray-800 border-t border-gray-700 flex flex-wrap gap-2">
            {["About me", "Skills", "Projects", "Contact"].map((question) => (
              <motion.button
                key={question}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickQuestion(question)}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition-colors"
              >
                {question}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center border-t border-gray-700 px-3 py-3 rounded-b-lg bg-gray-800">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="ml-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={!input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
