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

  const toggleChat = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    
    // Clear chat every time it is opened
    if (willOpen) {
      setMessages([]);
      setHasGreeted(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      {/* Background Dark Blue Circle */}
      <circle cx="50" cy="50" r="48" fill="#0c112b" />
      
      {/* Robot Face/Body */}
      <path d="M50 90 L50 78 C25 78 20 65 20 48 Q20 30 50 30 Q80 30 80 48 Q80 65 75 78 L75 90 Z" fill="#f8fafc" />
      <rect x="25" y="44" width="50" height="26" rx="13" fill="#040921" />
      
      {/* Eyes (Cyan) */}
      <circle cx="38" cy="57" r="5" fill="#22d3ee" className="robot-eye" />
      <circle cx="62" cy="57" r="5" fill="#22d3ee" className="robot-eye" />
      
      {/* Antenna */}
      <line x1="50" y1="30" x2="50" y2="20" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="18" r="4" fill="#f8fafc" />

      {/* HI! Bubble (Cyan) */}
      <rect x="58" y="5" width="38" height="28" rx="14" fill="#22d3ee" className="hi-bubble-rect" />
      <path d="M 68 32 L 64 42 L 78 32 Z" fill="#22d3ee" className="hi-bubble-tail" />
      <text x="77" y="24" fontSize="13" fontWeight="900" textAnchor="middle" fill="#0c112b" fontFamily="'Inter', 'Arial', sans-serif">HI!</text>
    </svg>
  );

  return (
    <div className="ai-chatbot-container">
      {/* Greeting Tooltip Container */}
      <div className="ai-bot-wrapper">
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