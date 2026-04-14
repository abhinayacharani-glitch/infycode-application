import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIChatbot.css';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [hasGreeted, setHasGreeted] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

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
            }, 1500);
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

        // Mock AI Response (API integration ready)
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
        }, 2000);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        // Optional: Auto send when clicked by uncommenting below
        // setInputValue(suggestion); 
        // Wait for state to update, or just use suggestion directly in handleSend equivalent
    };

    return (
        <div className="ai-chatbot-container">
            {/* Chat Window */}
            <div className={`ai-chat-window ${isOpen ? 'open' : ''}`}>
                <div className="ai-chat-header">
                    <div className="ai-chat-header-info">
                        <div className="ai-avatar">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3>AI Assistant</h3>
                            <span className="ai-status">Online</span>
                        </div>
                    </div>
                    <button className="ai-close-btn" onClick={toggleChat} aria-label="Close Chat">
                        <X size={20} />
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
                        placeholder="Type your message..."
                        aria-label="Chat input"
                    />
                    <button type="submit" disabled={!inputValue.trim()} className="ai-send-btn">
                        <Send size={18} />
                    </button>
                </form>
            </div>

            {/* Floating Button */}
            {!isOpen && (
                <motion.button
                    className="ai-floating-btn shadow-glow"
                    onClick={toggleChat}
                    aria-label="Open AI Assistant"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="ai-btn-icon-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageCircle className="ai-btn-icon" size={36} fill="white" color="white" />
                        <Bot size={20} color="#2563eb" style={{ position: 'absolute', top: '7px' }} />
                    </div>
                </motion.button>
            )}
        </div>
    );
};

export default AIChatbot;