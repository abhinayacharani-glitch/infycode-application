AIChatbot.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showGreetingTooltip, setShowGreetingTooltip] = useState(false);

  const toggleChat = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    
    // Clear chat every time it is opened
    if (willOpen) {
      setMessages([]);
      setHasGreeted(false);
    }
    
    setShowGreetingTooltip(false); 
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Show greeting tooltip 1 second after mount, hide after 4.5s
    const showTimer = setTimeout(() => {
      setShowGreetingTooltip(true);
    }, 1000);

    const hideTimer = setTimeout(() => {
      setShowGreetingTooltip(false);
    }, 5500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{
          id: 1,
          type: 'bot',
          text: 'Hi there! 👋 I am your AI Assistant. How can I help you navigate this page today?'
        }]);
        setIsTyping(false);
        setHasGreeted(true);
      }, 1000);
    }
  }, [isOpen, hasGreeted]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I can definitely help with that! Is there a specific section or topic you're looking for?";

      const lowerInput = newUserMsg.text.toLowerCase();
      if (lowerInput.includes('course') || lowerInput.includes('learn')) {
        botResponse = "We have many great courses. Check out the 'Courses' section in the navigation menu!";
      } else if (lowerInput.includes('contact') || lowerInput.includes('help')) {
        botResponse = "You can reach out to us via the Contact page or ask me specific questions right here.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const RobotIcon = () => (
    <svg viewBox="0 0 100 100" className="robot-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Very light colors instead of dark themes */}
        <linearGradient id="robotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <filter id="neonGlowLight" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Head - Light & Transparent like */}
      <rect x="20" y="25" width="60" height="50" rx="25" fill="url(#robotGrad)" stroke="#cbd5e1" strokeWidth="2" className="robot-head" />
      
      {/* Antenna */}
      <line x1="50" y1="25" x2="50" y2="12" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="10" r="4" fill="#0ea5e9" filter="url(#neonGlowLight)" className="antenna-glow" />
      
      {/* Ears */}
      <rect x="15" y="40" width="8" height="20" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="77" y="40" width="8" height="20" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      
      {/* Face Screen */}
      <rect x="28" y="35" width="44" height="30" rx="12" fill="url(#faceGrad)" stroke="#e2e8f0" strokeWidth="1" />
      
      {/* Glowing Eyes */}
      <rect x="36" y="42" width="6" height="12" rx="3" fill="#0ea5e9" filter="url(#neonGlowLight)" className="robot-eye" />
      <rect x="58" y="42" width="6" height="12" rx="3" fill="#0ea5e9" filter="url(#neonGlowLight)" className="robot-eye" />
      
      {/* Small Smile */}
      <path d="M 44 56 Q 50 60 56 56" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="ai-chatbot-container">
      {/* Greeting Tooltip Container */}
      <div className="ai-bot-wrapper">
        <AnimatePresence>
          {showGreetingTooltip && !isOpen && (
            <motion.div 
              className="ai-greeting-popup"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
               Hi there! 👋 I am your AI Assistant. How can I help you navigate this page today?
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Window placed relative to wrapper */}
        <div className={`ai-chat-window ${isOpen ? 'open' : ''}`}>
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-avatar">
                <Bot size={20} color="#0ea5e9" />
              </div>
              <div>
                <h3>AI Assistant</h3>
                <span className="ai-status">Online</span>
              </div>
            </div>
            <button className="ai-close-btn" onClick={toggleChat} aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.length === 0 && !isTyping && (
              <div className="ai-chat-welcome">
                <Sparkles className="sparkle-icon" size={24} />
                <p>Welcome! Ask me anything about this page.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message-wrapper ${msg.type}`}>
                <div className="ai-message">
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-wrapper bot">
                <div className="ai-message typing">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length > 0 && messages.length < 3 && (
            <div className="ai-suggestions">
              <button onClick={() => setInputValue("What courses do you offer?")}>What courses do you offer?</button>
              <button onClick={() => setInputValue("How can I contact support?")}>How can I contact support?</button>
            </div>
          )}

          <form className="ai-chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message..."
              aria-label="Chat input"
            />
            <button type="submit" disabled={!inputValue.trim()} className="ai-send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Floating Button */}
        <motion.button
          className={`ai-floating-btn ${isOpen ? 'hidden' : ''}`}
          onClick={toggleChat}
          aria-label="Open AI Assistant"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        >
          <RobotIcon />
        </motion.button>
      </div>
    </div>
  );
};

export default AIChatbot;