import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import Loader from "./components/Loader/Loader";
import Popup from "./components/popup/popup";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import WhyChoose from "./components/WhyChoose/WhyChoose";
import Features from "./components/Features/Features";
import Courses from "./components/Courses/Courses";
import Achievements from "./components/Achievements/Achievements";
import Working from "./components/Working/Working";
import FAQ from "./components/FAQ/FAQ";
import Testimonals from "./components/Testimonals/Testimonals";
import Footer from "./components/Footer/Footer";

import StudentAuthRoutes from "./student-auth/routes/StudentAuthRoutes";
import TrainerAuthRoutes from "./trainer-auth/routes/AuthRoutes";
import AdminLogin from "./pages/Auth/Admin/AdminLogin";
import AdminSignup from "./pages/Auth/Admin/AdminSignup";
import AdminForgotPassword from "./pages/Auth/Admin/ForgotPassword";
import AdminVerifyEmail from "./pages/Auth/Admin/VerifyEmail";
import AdminVerifyOTP from "./pages/Auth/Admin/VerifyOTP";
import AdminResetPassword from "./pages/Auth/Admin/ResetPassword";

import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TrainerDashboard from "./pages/TrainerDashboard/TrainerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import { AdminProvider } from "./context/AdminContext";
import TestApp from "./pages/StudentDashboard/pages/Test/src/App";

import CoursesPage from "./pages/InternalPages/CoursesPage";
import TrainingsPage from "./pages/InternalPages/TrainingsPage";
import ResourcesPage from "./pages/InternalPages/ResourcesPage";
import ContactPage from "./pages/InternalPages/ContactPage";
import BecomeTrainerPage from "./pages/InternalPages/BecomeTrainerPage";
import VideoCoursesPage from "./pages/InternalPages/VideoCourses/VideoCoursesPage";
import VideoModulesPage from "./pages/InternalPages/VideoCourses/VideoModulesPage";
import VideoPaymentPage from "./pages/InternalPages/VideoCourses/VideoPaymentPage";
import VideoPlayerPage from "./pages/InternalPages/VideoCourses/VideoPlayerPage";

import PopularCoursesPage from "./pages/InternalPages/SubPages/PopularCoursesPage";
import TrendingCoursesPage from "./pages/InternalPages/SubPages/TrendingCoursesPage";
import CorporateTrainingPage from "./pages/InternalPages/SubPages/CorporateTrainingPage";
import InstitutionalTrainingPage from "./pages/InternalPages/SubPages/InstitutionalTrainingPage";
import ArticlesPage from "./pages/InternalPages/SubPages/ArticlesPage";
import EbooksPage from "./pages/InternalPages/SubPages/EbooksPage";
import AboutPage from "./pages/InternalPages/AboutPage";
import GalleryPage from "./pages/InternalPages/GalleryPage";

import CoreTestApp from "./pages/StudentDashboard/pages/core-test/CoreTest";
// Course management is now handled in AdminDashboard
import BatchCreation from "./pages/BatchCreation";

import {
  getAllCourses,
  updateCourse,
  deleteCourse,
  toggleCourseLike,
} from "./services/api";

import "./App.css";

// ─── Page Helpers ───────────────────────────────────────────────────────────

function LoadingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return <Loader />;
}

function WhatsAppFloat() {
  return (
    <a 
      href="https://wa.me/911234567890" 
      className="whatsapp-float"
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <div className="whatsapp-content">
        <FaWhatsapp size={22} className="whatsapp-icon" />
        <span className="whatsapp-text">Chat with Us</span>
      </div>
    </a>
  );
}

const AI_KB = {
  about: `🎓 **InfyCODE** is a professional online learning platform that helps students and professionals go from *Academic to Professional* with job-ready tech skills. We offer live & recorded courses, real-world projects, mentorship, and placement support.`,

  courses: `📚 Here are our available courses:\n\n**Web Development**\n• React JS Full Stack — ₹14,999 | 6 months\n• Next.js 14 Masterclass — ₹14,999 | 4 months\n• MERN Stack Development — ₹15,499 | 5 months\n• Angular Enterprise Dev — ₹12,999 | 6 months\n• Flutter Mobile Apps — ₹11,999 | 5 months\n\n**Python**\n• Python Programming Masterclass — ₹9,999 | 4 months\n• Full Stack Python Pro — ₹15,999 | 6 months\n\n**Java**\n• Java Full Stack Development — ₹12,499 | 5 months\n\n**AI & Data**\n• Machine Learning Deep Dive — ₹18,999 | 6 months\n• Data Science & AI — ₹19,999 | 6 months\n\n**Cybersecurity**\n• Ethical Hacking & Cyber Security — ₹13,999 | 4 months\n\n**Cloud**\n• AWS Cloud Practitioner — ₹11,999 | 3 months\n\nYou can browse all courses on our Courses page! 🚀`,

  price: `💰 Course prices at InfyCODE:\n• Shortest: AWS Cloud Practitioner — ₹11,999 (3 months)\n• Most affordable: Python Masterclass — ₹9,999\n• Premium: Data Science & AI — ₹19,999\n\nAll prices include lifetime access to recordings, projects, and a completion certificate. Visit the Courses page to explore all options!`,

  webdev: `🌐 **Web Development Courses:**\n• React JS Full Stack — ₹14,999 | 6 months\n• Next.js 14 Masterclass — ₹14,999 | 4 months\n• MERN Stack Development — ₹15,499 | 5 months\n• Angular Enterprise Dev — ₹12,999 | 6 months\n• Flutter Mobile Apps — ₹11,999 | 5 months`,

  python: `🐍 **Python Courses:**\n• Python Programming Masterclass — ₹9,999 | 4 months (All levels)\n• Full Stack Python Pro — ₹15,999 | 6 months (Beginner friendly)`,

  java: `☕ **Java Course:**\n• Java Full Stack Development — ₹12,499 | 5 months\n  Rating: 4.9 ⭐ | 15,000+ students enrolled`,

  ai: `🤖 **AI & Data Science Courses:**\n• Machine Learning Deep Dive — ₹18,999 | 6 months (Advanced)\n• Data Science & AI — ₹19,999 | 6 months (Rating: 5.0 ⭐)\n\nBoth courses cover real-world projects, ML algorithms, and modern AI tools.`,

  cloud: `☁️ **Cloud Course:**\n• AWS Cloud Practitioner — ₹11,999 | 3 months\n  Beginner-friendly | 12,000+ students enrolled`,

  cyber: `🔐 **Cybersecurity Course:**\n• Ethical Hacking & Cyber Security — ₹13,999 | 4 months\n  Rating: 4.9 ⭐ | Intermediate level`,

  features: `✨ **InfyCODE Features:**\n1. 👥 **Mentorship & Guidance** — Learn from industry experts with continuous support\n2. 🎬 **Practical Learning** — Interactive video lessons + real-world projects\n3. ✅ **Skill Evaluation** — Assessments to gauge your level and personalize learning\n4. 💼 **Career Preparation** — Interview prep, resume support & structured guidance`,

  certificate: `🏆 **Yes!** InfyCODE provides a **professional certificate** upon successful completion of any course. These certificates are industry-recognized and a great boost for your resume and career!`,

  admission: `📅 **Admissions at InfyCODE are open year-round!** You can enroll anytime and start your learning journey immediately — no waiting for a new semester.`,

  access: `💻 All courses are available **100% online**. Once enrolled, you get access to:\n• Live sessions with instructors\n• Recorded video lectures\n• Project-based learning modules\n• Your personal student dashboard`,

  enroll: `🚀 To enroll:\n1. Visit the **Courses** page from the top navigation\n2. Select your desired course\n3. Click **Enroll** and create/login to your student account\n4. Complete payment and start learning immediately!\n\nNeed help? Just ask me anything! 😊`,

  login: `🔐 To log in as a **Student**, visit /student/login\nNew user? Register at /student/signup\n\nWe also support **Trainer** and **Admin** logins for instructors and administrators.`,

  trainer: `👩‍🏫 Want to **become a trainer** at InfyCODE? We welcome industry professionals who want to share their expertise. Visit the **Become a Trainer** page from the navigation menu or contact us directly!`,

  contact: `📞 **Contact InfyCODE:**\n• Use the Contact page in the top navigation\n• Or chat with us on **WhatsApp** using the green button below 👇\n• You can also email us through the website's Contact section`,

  placement: `💼 InfyCODE provides **career support** including:\n• Interview preparation with expert trainers\n• Resume building guidance\n• Industry-relevant projects for your portfolio\n• Structured mentorship throughout your course`,

  hello: `👋 Hello! I'm **InfyBot**, your AI assistant for InfyCODE! I can help you with:\n• 📚 Course details & pricing\n• 🎓 Enrollment & admission process\n• 🏆 Certificates & career support\n• 💻 Platform access & features\n\nWhat would you like to know?`,

  default: `🤔 I'm not sure about that — but here's what I **can** help with:\n\n• **Courses** — "What courses do you offer?"\n• **Pricing** — "How much does React course cost?"\n• **Enroll** — "How do I register?"\n• **Features** — "Why choose InfyCODE?"\n• **Contact** — "How to reach InfyCODE?"\n\nTry one of those! 😊`,
};

function getAIResponse(message) {
  const m = message.toLowerCase().trim();

  const INTENTS = [
    {
      key: 'hello',
      phrases: ['hi', 'hello', 'hey', 'namaste', 'hii', 'helo', 'good morning',
                'good evening', 'good afternoon', 'greetings', 'howdy', 'sup', 'yo'],
    },
    {
      key: 'about',
      phrases: ['what is infycode', 'about infycode', 'what is this site', 'what is this website',
                'who are you', 'tell me about', 'describe infycode', 'overview',
                'explain infycode', 'what do you do', 'company', 'platform', 'about this',
                'infycode kya hai', 'what is infy', 'this website', 'your website'],
    },
    {
      key: 'courses',
      phrases: ['all courses', 'list courses', 'what courses', 'which courses', 'show courses',
                'courses available', 'all programs', 'what do you teach', 'what can i learn',
                'available courses', 'course list', 'what programs', 'show all', 'all topics',
                'what subjects', 'all subjects', 'what technologies', 'full list'],
    },
    {
      key: 'webdev',
      phrases: ['web dev', 'web development', 'react', 'mern', 'nextjs', 'next.js', 'next js',
                'angular', 'flutter', 'frontend', 'fullstack', 'full stack', 'html', 'css',
                'javascript', 'node', 'nodejs', 'express', 'mongodb', 'website development',
                'web course', 'front end', 'back end', 'backend'],
    },
    {
      key: 'python',
      phrases: ['python', 'django', 'flask', 'python course', 'python programming',
                'python full stack', 'learn python'],
    },
    {
      key: 'java',
      phrases: ['java', 'spring', 'springboot', 'spring boot', 'java course',
                'java full stack', 'learn java', 'java programming'],
    },
    {
      key: 'ai',
      phrases: ['artificial intelligence', 'machine learning', 'data science', 'deep learning',
                'neural network', 'nlp', 'data analyst', 'ml course', 'ai course',
                'learn ai', 'learn ml', 'data engineering', 'ai and data', 'ai & data'],
    },
    {
      key: 'cloud',
      phrases: ['cloud', 'aws', 'amazon web services', 'azure', 'devops', 'cloud computing',
                'gcp', 'google cloud', 'cloud course', 'learn cloud', 'cloud practitioner'],
    },
    {
      key: 'cyber',
      phrases: ['cyber', 'cybersecurity', 'security', 'ethical hacking', 'hacking',
                'penetration testing', 'pen test', 'network security', 'cyber course',
                'learn hacking', 'learn security'],
    },
    {
      key: 'features',
      phrases: ['features', 'offer', 'benefit', 'what do you offer', 'why choose',
                'why infycode', 'advantages', 'what makes', 'special', 'unique',
                'what you provide', 'services', 'facilities', 'what infycode offers',
                'what are the benefits', 'highlights', 'key features'],
    },
    {
      key: 'certificate',
      phrases: ['certificate', 'certification', 'certif', 'certified', 'credential',
                'badge', 'diploma', 'proof of completion', 'get certified',
                'do you give certificate', 'course completion', 'recognition'],
    },
    {
      key: 'admission',
      phrases: ['admission', 'admissions', 'when can i join', 'when does it start',
                'when to enroll', 'batch start', 'next batch', 'when are admissions',
                'when is admission open', 'can i join now', 'is admission open'],
    },
    {
      key: 'access',
      phrases: ['how to access', 'access courses', 'dashboard', 'student dashboard',
                'where to study', 'how do i study', 'platform access', 'how to use',
                'login to course', 'study online', 'recorded classes', 'live classes'],
    },
    {
      key: 'enroll',
      phrases: ['enroll', 'how to enroll', 'how to register', 'registration', 'sign up',
                'how to join', 'get started', 'how do i join', 'apply', 'join now',
                'admission process', 'steps to join', 'how to apply', 'how do i start'],
    },
    {
      key: 'login',
      phrases: ['login', 'log in', 'sign in', 'forgot password', 'reset password',
                'create account', 'student login', 'how to login', 'account'],
    },
    {
      key: 'trainer',
      phrases: ['become a trainer', 'be a trainer', 'teach at infycode', 'trainer',
                'faculty', 'instructor', 'want to teach', 'how to become trainer',
                'teaching opportunity', 'trainer registration'],
    },
    {
      key: 'contact',
      phrases: ['contact', 'reach you', 'support', 'customer care', 'helpdesk',
                'email', 'phone number', 'call', 'get in touch', 'whatsapp',
                'how to contact', 'contact infycode', 'reach infycode'],
    },
    {
      key: 'placement',
      phrases: ['placement', 'job', 'career', 'interview', 'resume', 'hire',
                'employment', 'job ready', 'internship', 'salary', 'get a job',
                'job support', 'placement assistance', 'career support'],
    },
    {
      key: 'price',
      phrases: ['price', 'cost', 'fee', 'fees', 'pay', 'rupee', '₹', 'how much',
                'expensive', 'affordable', 'pricing', 'charges', 'amount',
                'how much does it cost', 'course fee', 'what is the fee', 'cost of course'],
    },
    {
      key: 'duration',
      phrases: ['duration', 'how long', 'weeks', 'months', 'course length',
                'how many months', 'time period', 'schedule', 'timeline',
                'how much time', 'how long does it take', 'course duration', 'long is'],
    },
  ];

  // Score every intent by counting matching phrases
  let bestScore = 0;
  let bestKey = null;

  for (const intent of INTENTS) {
    let score = 0;
    for (const phrase of intent.phrases) {
      if (m === phrase) score += 10;           // exact match
      else if (m.startsWith(phrase)) score += 6; // starts with
      else if (m.includes(phrase)) score += 3;   // contains
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = intent.key;
    }
  }

  if (bestKey === 'duration') {
    return `⏱️ **Course Durations at InfyCODE:**\n\n• 3 months — AWS Cloud Practitioner\n• 4 months — Python Masterclass, Ethical Hacking, Next.js 14\n• 5 months — Java Full Stack, MERN Stack, Flutter\n• 6 months — React JS, Angular, Machine Learning, Data Science, Full Stack Python\n\nAdmissions are open year-round — start anytime! 🚀`;
  }

  if (bestScore > 0 && bestKey && AI_KB[bestKey]) {
    return AI_KB[bestKey];
  }

  return AI_KB.default;
}


// Renders bot text: converts **bold**, newlines, bullet points into React elements
function renderBotText(text) {
  return text.split('\n').map((line, i) => {
    // Parse **bold** segments
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      // Parse *italic*
      if (/^\*[^*]+\*$/.test(part)) {
        return <em key={j}>{part.slice(1, -1)}</em>;
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <span key={i} style={{ display: 'block', marginBottom: line === '' ? '6px' : '2px' }}>
        {parts}
      </span>
    );
  });
}

function AIChatFloat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm **InfyBot**, your AI assistant for InfyCODE!\n\nAsk me about courses, fees, enrollment, certificates, features, or anything about the website!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { from: "user", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: getAIResponse(trimmed) }]);
    }, 900);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Chatbox Popup */}
      {open && (
        <div className="ai-chat-popup">
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-chat-avatar">🤖</div>
              <div>
                <div className="ai-chat-name">InfyBot AI</div>
                <div className="ai-chat-status">● Online</div>
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chat-msg ai-chat-msg--${msg.from}`}>
                {msg.from === "bot" && <span className="ai-chat-msg-avatar">🤖</span>}
                <span className="ai-chat-msg-bubble">
                  {msg.from === "bot" ? renderBotText(msg.text) : msg.text}
                </span>
              </div>
            ))}
            {typing && (
              <div className="ai-chat-msg ai-chat-msg--bot">
                <span className="ai-chat-msg-avatar">🤖</span>
                <span className="ai-chat-msg-bubble ai-chat-typing">
                  <span/><span/><span/>
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="ai-chat-input-row">
            <input
              className="ai-chat-input"
              placeholder="Type your message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
            />
            <button className="ai-chat-send" onClick={sendMessage} disabled={!input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Float Button */}
      <button
        className="ai-chat-float"
        onClick={() => {
          setOpen(o => {
            const opening = !o;
            if (opening) {
              // Reset to a fresh chat every time the chatbox is opened
              setMessages([
                { from: "bot", text: "👋 Hi! I'm **InfyBot**, your AI assistant for InfyCODE!\n\nAsk me about courses, fees, enrollment, certificates, features, or anything about the website!" }
              ]);
              setInput("");
              setTyping(false);
            }
            return opening;
          });
        }}
        aria-label="Open AI Chatbot"
      >
        <div className="ai-chat-float-content">
          <IoChatbubblesOutline size={22} className="ai-chat-float-icon" />
          <span className="ai-chat-float-text">Ask InfyBot</span>
        </div>
      </button>
    </>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <Features />
      <Courses />
      <Achievements />
      <Working />
      <FAQ />
      <Testimonals />
      <Footer />
      <AIChatFloat />
      <WhatsAppFloat />
    </>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

function Layout({ courses, setCourses, onToggleLike, onUpdateCourse, onDeleteCourse }) {
  const location = useLocation();
  const handleToggleLike = onToggleLike;
  const handleUpdateCourse = onUpdateCourse;
  const handleDeleteCourse = onDeleteCourse;

  const hideNavbar =
    location.pathname.startsWith("/student-dashboard") ||
    location.pathname.startsWith("/trainer-dashboard") ||
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/student/") ||
    location.pathname.startsWith("/trainer/") ||
    location.pathname.startsWith("/admin/") ||
    location.pathname.startsWith("/loading") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/coursepage" ||
    location.pathname === "/social-feed" ||
    location.pathname === "/batchcreation";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div style={{ paddingTop: hideNavbar ? "0px" : "80px", width: "100%" }}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<HomePage />} />
          {/* Student Auth Routes */}
          <Route path="/student/*" element={<StudentAuthRoutes />} />
          <Route path="/login" element={<Navigate to="/student/login" replace />} />
          <Route path="/register" element={<Navigate to="/student/signup" replace />} />

          {/* Trainer Auth Routes */}
          <Route path="/trainer/*" element={<TrainerAuthRoutes />} />

          {/* Admin Auth Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/verify-email" element={<AdminVerifyEmail />} />
          <Route path="/admin/verify-otp" element={<AdminVerifyOTP />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />

          {/* ── Internal Pages ── */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/popular" element={<PopularCoursesPage />} />
          <Route path="/courses/trending" element={<TrendingCoursesPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
          <Route path="/trainings/corporate" element={<CorporateTrainingPage />} />
          <Route path="/trainings/institutional" element={<InstitutionalTrainingPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/articles" element={<ArticlesPage />} />
          <Route path="/resources/ebooks" element={<EbooksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/become-trainer" element={<BecomeTrainerPage />} />
          <Route path="/video-courses" element={<VideoCoursesPage />} />
          <Route path="/video-courses/:courseId" element={<VideoModulesPage />} />
          <Route path="/video-courses/:courseId/:lessonId" element={<VideoPlayerPage />} />
          <Route path="/video-courses/payment/:courseId" element={<VideoPaymentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />

          {/* ── Protected ── */}
          <Route path="/student/test/*" element={<ProtectedRoute><TestApp /></ProtectedRoute>} />
          <Route path="/student/core-test/*" element={<ProtectedRoute><CoreTestApp /></ProtectedRoute>} />
          <Route path="/student-dashboard/*" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/trainer-dashboard/*" element={<TrainerDashboard />} />
          <Route path="/admin-dashboard/*" element={<AdminProvider><AdminDashboard /></AdminProvider>} />

          {/* ── Course Management ── moved to AdminDashboard ── */}
          <Route path="/batchcreation" element={<BatchCreation />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </div>
    </>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [courses, setCourses] = useState([]);

  // Fetch all courses from backend on mount
  useEffect(() => {
    getAllCourses()
      .then((data) => setCourses(data.courses || []))
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  // Toggle like via API, update local state optimistically
  const handleToggleLike = async (courseId) => {
    try {
      const data = await toggleCourseLike(courseId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, isLiked: data.isLiked, likes: data.likes } : c
        )
      );
    } catch (err) {
      console.error("Like toggle failed:", err.message);
    }
  };

  // Update course fields via API
  const handleUpdateCourse = async (courseId, updatedFields) => {
    try {
      const data = await updateCourse(courseId, updatedFields);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? data.course : c))
      );
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  // Delete course via API
  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  // Initial 3-second splash loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Only show popup if it hasn't been shown before
      const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
      if (!hasSeenPopup) {
        setShowPopup(true);
        sessionStorage.setItem("hasSeenPopup", "true");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <BrowserRouter>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      <Layout
        courses={courses}
        setCourses={setCourses}
        onToggleLike={handleToggleLike}
        onUpdateCourse={handleUpdateCourse}
        onDeleteCourse={handleDeleteCourse}
      />
    </BrowserRouter>
  );
}

export default App;