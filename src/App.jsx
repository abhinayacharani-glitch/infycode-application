import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Loader from "./components/Loader/Loader";
import Popup from "./components/popup/popup";
import Navbar from "./components/Navbar/Navbar";
import AIChatbot from "./components/AIChatbot/AIChatbot";
import { motion, AnimatePresence } from "framer-motion";
import { AdminProvider } from "./context/AdminContext";
import { CourseProvider } from "./context/CourseContext";

import {
  getAllCourses,
  updateCourse,
  deleteCourse,
  toggleCourseLike,
} from "./services/api";

import "./App.css";

// ─── Always-loaded homepage components (above the fold) ─────────────────────
import Hero from "./components/Hero/Hero";
import WhyChoose from "./components/WhyChoose/WhyChoose";
import Features from "./components/Features/Features";
import Courses from "./components/Courses/Courses";
import Achievements from "./components/Achievements/Achievements";
import Working from "./components/Working/Working";
import FAQ from "./components/FAQ/FAQ";
import Testimonals from "./components/Testimonals/Testimonals";
import Footer from "./components/Footer/Footer";

// ─── Lazy-loaded — Auth ──────────────────────────────────────────────────────
const StudentAuthRoutes = lazy(() => import("./student-auth/routes/StudentAuthRoutes"));
const TrainerAuthRoutes = lazy(() => import("./trainer-auth/routes/AuthRoutes"));
const AdminLogin = lazy(() => import("./pages/Auth/Admin/AdminLogin"));
const AdminSignup = lazy(() => import("./pages/Auth/Admin/AdminSignup"));
const AdminForgotPassword = lazy(() => import("./pages/Auth/Admin/ForgotPassword"));
const AdminVerifyEmail = lazy(() => import("./pages/Auth/Admin/VerifyEmail"));
const AdminVerifyOTP = lazy(() => import("./pages/Auth/Admin/VerifyOTP"));
const AdminResetPassword = lazy(() => import("./pages/Auth/Admin/ResetPassword"));

// ─── Lazy-loaded — Dashboards ────────────────────────────────────────────────
const StudentDashboard = lazy(() => import("./pages/StudentDashboard/StudentDashboard"));
const TrainerDashboard = lazy(() => import("./pages/TrainerDashboard/TrainerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const TestApp = lazy(() => import("./pages/StudentDashboard/pages/Test/src/App"));
const CoreTestApp = lazy(() => import("./pages/StudentDashboard/pages/core-test/CoreTest"));

// ─── Lazy-loaded — Internal Pages ────────────────────────────────────────────
const CoursesPage = lazy(() => import("./pages/InternalPages/CoursesPage"));
const TrainingsPage = lazy(() => import("./pages/InternalPages/TrainingsPage"));
const ResourcesPage = lazy(() => import("./pages/InternalPages/ResourcesPage"));
const ContactPage = lazy(() => import("./pages/InternalPages/ContactPage"));
const BecomeTrainerPage = lazy(() => import("./pages/InternalPages/BecomeTrainerPage"));
const VideoCoursesPage = lazy(() => import("./pages/InternalPages/VideoCourses/VideoCoursesPage"));
const VideoModulesPage = lazy(() => import("./pages/InternalPages/VideoCourses/VideoModulesPage"));
const VideoPaymentPage = lazy(() => import("./pages/InternalPages/VideoCourses/VideoPaymentPage"));
const VideoPlayerPage = lazy(() => import("./pages/InternalPages/VideoCourses/VideoPlayerPage"));
const PopularCoursesPage = lazy(() => import("./pages/InternalPages/SubPages/PopularCoursesPage"));
const TrendingCoursesPage = lazy(() => import("./pages/InternalPages/SubPages/TrendingCoursesPage"));
const CorporateTrainingPage = lazy(() => import("./pages/InternalPages/SubPages/CorporateTrainingPage"));
const InstitutionalTrainingPage = lazy(() => import("./pages/InternalPages/SubPages/InstitutionalTrainingPage"));
const ArticlesPage = lazy(() => import("./pages/InternalPages/SubPages/ArticlesPage"));
const EbooksPage = lazy(() => import("./pages/InternalPages/SubPages/EbooksPage"));
const AboutPage = lazy(() => import("./pages/InternalPages/AboutPage"));
const GalleryPage = lazy(() => import("./pages/InternalPages/GalleryPage"));
const InstagramPage = lazy(() => import("./pages/InternalPages/InstagramPage"));
const CourseDetailsPage = lazy(() => import("./pages/CourseDetails/CourseDetails"));
const FAQPage = lazy(() => import("./pages/InternalPages/FAQPage"));
const MentorshipPage = lazy(() => import("./pages/Features/MentorshipPage"));
const PracticalLearningPage = lazy(() => import("./pages/Features/PracticalLearningPage"));
const SkillEvaluationPage = lazy(() => import("./pages/Features/SkillEvaluationPage"));
const CareerPreparationPage = lazy(() => import("./pages/Features/CareerPreparationPage"));
const LaunchEvent = lazy(() => import("./pages/LaunchEvent/LaunchEvent"));

// ─── Lazy-loaded — Other ─────────────────────────────────────────────────────
const BatchCreation = lazy(() => import("./pages/AdminDashboard/pages/BatchCreation"));

// ─── Page-level Suspense fallback ────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8fafc" }}>
      <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Page Helpers ────────────────────────────────────────────────────────────

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

const FadeInView = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function HomePage() {
  const [showFloaters, setShowFloaters] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Get the height of the first section (Hero) to set the threshold
      const threshold = window.innerHeight * 0.8; // Hide when 80% through the first section

      // Show ONLY on the first section and hide immediately after
      if (scrollY < threshold) {
        setShowFloaters(true);
      } else {
        setShowFloaters(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Hero />
      <FadeInView><WhyChoose /></FadeInView>
      <FadeInView><Features /></FadeInView>
      <FadeInView><Courses /></FadeInView>
      <FadeInView><Achievements /></FadeInView>
      <FadeInView><Working /></FadeInView>
      <FadeInView><FAQ /></FadeInView>
      <FadeInView><Testimonals /></FadeInView>
      <div id="footer-trigger-zone">
        <Footer />
      </div>
      <AnimatePresence>
        {showFloaters && (
          <motion.div
            className="floating-buttons-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              y: [0, -6, 0],
              opacity: 1
            }}
            exit={{ opacity: 0, y: 20 }}
            style={{ pointerEvents: "auto" }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.3 }
            }}
          >
            <AIChatbot />
            <WhatsAppFloat />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token || localStorage.getItem("token"); // Fallback for safety

  if (!token) return <Navigate to="/student/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user has a token but wrong role, redirect to their default dashboard
    console.warn(`Access denied for role: ${user.role}. Allowed: ${allowedRoles}`);
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'trainer') return <Navigate to="/trainer-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

function Layout({ courses, setCourses, onToggleLike, onUpdateCourse, onDeleteCourse }) {
  const location = useLocation();

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

      <div style={{ paddingTop: hideNavbar ? "0px" : "84px", width: "100%" }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public ── */}
            <Route path="/" element={<HomePage />} />

            {/* Student Auth */}
            <Route path="/student/*" element={<StudentAuthRoutes />} />
            <Route path="/login" element={<Navigate to="/student/login" replace />} />
            <Route path="/register" element={<Navigate to="/student/signup" replace />} />

            {/* Trainer Auth */}
            <Route path="/trainer/*" element={<TrainerAuthRoutes />} />

            {/* Admin Auth */}
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
            <Route path="/instagram" element={<InstagramPage />} />
            <Route path="/course-details/:id" element={<CourseDetailsPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* ── Feature Pages ── */}
            <Route path="/features/mentorship" element={<MentorshipPage />} />
            <Route path="/features/practical-learning" element={<PracticalLearningPage />} />
            <Route path="/features/skill-evaluation" element={<SkillEvaluationPage />} />
            <Route path="/features/career-preparation" element={<CareerPreparationPage />} />

            {/* ── Protected ── */}
            <Route path="/student/test/*" element={<ProtectedRoute allowedRoles={['student']}><TestApp /></ProtectedRoute>} />
            <Route path="/student/core-test/*" element={<ProtectedRoute allowedRoles={['student']}><CoreTestApp /></ProtectedRoute>} />
            <Route path="/student-dashboard/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/trainer-dashboard/*" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminProvider><AdminDashboard /></AdminProvider></ProtectedRoute>} />

            {/* ── Misc ── */}
            <Route path="/batchcreation" element={<BatchCreation />} />
            <Route path="/loading" element={<LoadingPage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [courses, setCourses] = useState([]);
  const [showLaunchEvent, setShowLaunchEvent] = useState(true);

  const handleEnterSite = (targetId) => {
    setShowLaunchEvent(false);
    if (targetId) {
      setTimeout(() => {
        if (targetId === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(targetId.replace('#', ''));
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 500);
    }
  };

  useEffect(() => {
    // Show launch event on every load for now as requested
    setShowLaunchEvent(true);

    getAllCourses()
      .then((data) => setCourses(data.courses || []))
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  const handleToggleLike = async (courseId) => {
    try {
      const data = await toggleCourseLike(courseId);
      setCourses((prev) =>
        prev.map((c) => c.id === courseId ? { ...c, isLiked: data.isLiked, likes: data.likes } : c)
      );
    } catch (err) {
      console.error("Like toggle failed:", err.message);
    }
  };

  const handleUpdateCourse = async (courseId, updatedFields) => {
    try {
      const data = await updateCourse(courseId, updatedFields);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? data.course : c)));
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
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
    <CourseProvider>
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
    </CourseProvider>
  );
}

export default App;