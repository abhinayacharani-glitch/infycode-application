import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, Calendar, ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';
import './MentorConnection.css';

const MentorConnection = () => {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const mentors = [
    { n: 'Charani', preview: 'Sure, I will share the resources with the batch.', time: '10:20 AM', unread: false, color: '#2563eb', role: 'Senior Java Architect', spec: ['Java', 'Spring Boot', 'Microservices'], availability: 'Mon-Fri, 6PM-8PM' },
    { n: 'Charani', preview: 'When are you available for a 1:1?', time: 'Yesterday', unread: true, color: '#10b981', role: 'Lead Python Developer', spec: ['Python', 'Django', 'AI'], availability: 'Tue, Thu, 4PM-7PM' },
    { n: 'Charani', preview: 'Let me look at your AWS architecture diagram.', time: 'Mar 12', unread: false, color: '#f59e0b', role: 'Cloud Solutions Architect', spec: ['AWS', 'Terraform', 'Kubernetes'], availability: 'Weekends, 10AM-12PM' }
  ];

  const [activeThreads, setActiveThreads] = useState([
    [
      { from: 'You', text: 'Hello sir, I have a doubt regarding the React useEffect hook. Can you help me?', time: '10:15 AM', self: true },
      { from: 'Charani', text: 'Sure! useEffect runs after every render by default. Adding an empty dependency array [] makes it run only once on mount. I\'ll share resources with the batch.', time: '10:20 AM', self: false },
    ],
    [
      { from: 'You', text: 'Hi Charani, I am struggling with the Django ORM queries for the assignment.', time: 'Yesterday', self: true },
      { from: 'Charani', text: 'Hi! That is a common hurdle. When are you available for a 1:1?', time: 'Yesterday', self: false },
    ],
    [
      { from: 'You', text: 'Hi Charani, can you review my AWS architecture diagram?', time: 'Mar 12', self: true },
      { from: 'Charani', text: 'Let me look at your AWS architecture diagram. Send over the link.', time: 'Mar 12', self: false },
    ]
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThreads, isTyping, selected]);

  const handleSend = () => {
    if (!message.trim() || selected === null) return;
    
    const newMessage = {
      from: 'You',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true
    };

    const newThreads = [...activeThreads];
    newThreads[selected] = [...newThreads[selected], newMessage];
    setActiveThreads(newThreads);
    setMessage('');
    setIsTyping(true);

    // Simulate mentor reply
    setTimeout(() => {
      const replyMessage = {
        from: mentors[selected].n,
        text: "That's a great question! Let me review that and I'll explain it during our 1:1 call.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false
      };
      
      setActiveThreads(prev => {
        const updated = [...prev];
        updated[selected] = [...updated[selected], replyMessage];
        return updated;
      });
      setIsTyping(false);
    }, 1500);
  };

  const openZoomMeeting = () => {
     window.open('https://zoom.us/test', '_blank');
  };

  if (selected === null) {
      // Directory View
      return (
        <div className="mentor-viewport">
          <div className="mentor-top-header directory-header">
            <div className="header-text-content">
              <h1 className="mentor-top-title">Mentor Directory</h1>
              <p className="mentor-top-subtitle">Browse professional profiles and connect directly with industry experts.</p>
            </div>
          </div>
          
          <div className="mentor-directory-grid">
            {mentors.map((m, i) => (
              <div className="dir-card-premium" key={i}>
                 <div className="dir-card-banner" style={{ background: `linear-gradient(135deg, ${m.color}e6, ${m.color})` }}>
                 </div>
                 
                 <div className="dir-avatar-wrapper">
                    <div className="dir-avatar-circle" style={{ color: m.color }}>
                      {m.n.split(' ').map(x => x[0]).join('').slice(0, 2)}
                    </div>
                 </div>
                 
                 <div className="dir-card-body">
                    <div className="dir-title-section">
                       <h2 className="dir-name">{m.n}</h2>
                       <p className="dir-role">{m.role}</p>
                    </div>

                    <div className="dir-tags-group">
                      {m.spec.map((tag, j) => (
                        <span key={j} className="dir-tag-pill">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="dir-separator"></div>
                    
                    <div className="dir-footer-section">
                       <div className="dir-availability-pill">
                         <Calendar size={14} className="avail-icon" />
                         <span>{m.availability}</span>
                       </div>

                       <button className="dir-connect-action-btn" onClick={() => setSelected(i)}>
                          <MessageCircle size={18} />
                          <span>Connect</span>
                       </button>
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      );
  }

  return (
    <div className="mentor-viewport">
      <div className="mentor-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="back-to-dir-btn" onClick={() => setSelected(null)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="mentor-top-title">Mentor Connect</h1>
            <p className="mentor-top-subtitle">Chat with industry experts and get your technical doubts resolved 1:1.</p>
          </div>
        </div>
      </div>

      <div className="mentor-chat-layout">
        {/* Chat Thread */}
        <div className="mentor-card-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="mentor-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="mentor-avatar-box" style={{ background: mentors[selected].color, width: '36px', height: '36px', fontSize: '0.9rem', margin: 0 }}>
                {mentors[selected].n.split(' ').map(x => x[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="mentor-card-title" style={{ fontSize: '1.05rem' }}>{mentors[selected].n}</h2>
                <div className="mentor-card-sub" style={{ fontSize: '0.8rem' }}>{mentors[selected].role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="zoom-join-btn-small" 
                onClick={openZoomMeeting}
                title="Join Live Meeting"
              >
                <Video size={16} />
                Join Zoom
              </button>
            </div>
          </div>
          
          <div className="mentor-card-body chat-messages">
            {activeThreads[selected].map((msg, i) => (
              <div key={i} className={`msg-wrapper ${msg.self ? 'msg-right' : 'msg-left'}`}>
                {!msg.self && <div className="msg-sender">{msg.from}</div>}
                <div className="msg-bubble">
                  {msg.text}
                </div>
                <div className="msg-meta">{msg.time}</div>
              </div>
            ))}
            
            {isTyping && (
              <div className="msg-wrapper msg-left">
                <div className="msg-sender">{mentors[selected].n}</div>
                <div className="msg-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input-box" 
              placeholder="Type your doubt or message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Contact Info / Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
          <div className="mentor-card-panel">
             <div className="zoom-highlight-banner" onClick={openZoomMeeting}>
                <div className="zoom-icon-wrapper">
                   <Video size={24} color="#fff" />
                </div>
                <div className="zoom-text-wrapper">
                   <h4>Live 1:1 Meeting</h4>
                   <p>Join secure Zoom room</p>
                </div>
                <ExternalLink size={20} color="rgba(255,255,255,0.8)" />
             </div>

             <div className="mentor-card-body" style={{ padding: '24px 20px' }}>
               <div className="profile-avatar-large" style={{ background: mentors[selected].color }}>
                 {mentors[selected].n.split(' ').map(x => x[0]).join('').slice(0, 2)}
                 <div className="status-indicator-online"></div>
               </div>
               <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', margin: '0 0 4px' }}>{mentors[selected].n}</h3>
                 <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>{mentors[selected].role}</p>
               </div>
               
               <div className="mentor-info-row">
                 <span className="mentor-info-label">Specialization</span>
                 <span className="mentor-info-val">{mentors[selected].spec[0]}</span>
               </div>
               <div className="mentor-info-row">
                 <span className="mentor-info-label">Avg. Response Time</span>
                 <span className="mentor-info-val">~ 15 mins</span>
               </div>
             </div>
          </div>

          <div className="mentor-card-panel">
            <div className="mentor-card-header">
               <h2 className="mentor-card-title">Quick Replies</h2>
            </div>
            <div className="mentor-card-body" style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
              {[
                "I have a doubt in today's topic.",
                "Can we schedule a call?",
                "Could you review my assignment?",
                "Thank you for the explanation!"
              ].map((text, i) => (
                <button 
                  key={i} 
                  className="quick-reply-btn"
                  onClick={() => {
                    setMessage(text);
                    setTimeout(() => document.querySelector('.chat-input-box')?.focus(), 0);
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorConnection;
