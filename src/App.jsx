import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Loader from "./components/Loader/Loader";
import Popup from "./components/popup/popup";
import Navbar from "./components/Navbar/Navbar";
import { AdminProvider } from "./context/AdminContext";

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
const StudentAuthRoutes     = lazy(() => import("./student-auth/routes/StudentAuthRoutes"));
const TrainerAuthRoutes     = lazy(() => import("./trainer-auth/routes/AuthRoutes"));
const AdminLogin            = lazy(() => import("./pages/Auth/Admin/AdminLogin"));
const AdminSignup           = lazy(() => import("./pages/Auth/Admin/AdminSignup"));
const AdminForgotPassword   = lazy(() => import("./pages/Auth/Admin/ForgotPassword"));
const AdminVerifyEmail      = lazy(() => import("./pages/Auth/Admin/VerifyEmail"));
const AdminVerifyOTP        = lazy(() => import("./pages/Auth/Admin/VerifyOTP"));
const AdminResetPassword    = lazy(() => import("./pages/Auth/Admin/ResetPassword"));

// ─── Lazy-loaded — Dashboards ────────────────────────────────────────────────
const StudentDashboard      = lazy(() => import("./pages/StudentDashboard/StudentDashboard"));
const TrainerDashboard      = lazy(() => import("./pages/TrainerDashboard/TrainerDashboard"));
const AdminDashboard        = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const TestApp               = lazy(() => import("./pages/StudentDashboard/pages/Test/src/App"));
const CoreTestApp           = lazy(() => import("./pages/StudentDashboard/pages/core-test/CoreTest"));

// ─── Lazy-loaded — Internal Pages ────────────────────────────────────────────
const CoursesPage               = lazy(() => import("./pages/InternalPages/CoursesPage"));
const TrainingsPage             = lazy(() => import("./pages/InternalPages/TrainingsPage"));
const ResourcesPage             = lazy(() => import("./pages/InternalPages/ResourcesPage"));
const ContactPage               = lazy(() => import("./pages/InternalPages/ContactPage"));
const BecomeTrainerPage         = lazy(() => import("./pages/InternalPages/BecomeTrainerPage"));
const VideoCoursesPage          = lazy(() => import("./pages/InternalPages/VideoCourses/VideoCoursesPage"));
const VideoModulesPage          = lazy(() => import("./pages/InternalPages/VideoCourses/VideoModulesPage"));
const VideoPaymentPage          = lazy(() => import("./pages/InternalPages/VideoCourses/VideoPaymentPage"));
const VideoPlayerPage           = lazy(() => import("./pages/InternalPages/VideoCourses/VideoPlayerPage"));
const PopularCoursesPage        = lazy(() => import("./pages/InternalPages/SubPages/PopularCoursesPage"));
const TrendingCoursesPage       = lazy(() => import("./pages/InternalPages/SubPages/TrendingCoursesPage"));
const CorporateTrainingPage     = lazy(() => import("./pages/InternalPages/SubPages/CorporateTrainingPage"));
const InstitutionalTrainingPage = lazy(() => import("./pages/InternalPages/SubPages/InstitutionalTrainingPage"));
const ArticlesPage              = lazy(() => import("./pages/InternalPages/SubPages/ArticlesPage"));
const EbooksPage                = lazy(() => import("./pages/InternalPages/SubPages/EbooksPage"));
const AboutPage                 = lazy(() => import("./pages/InternalPages/AboutPage"));
const GalleryPage               = lazy(() => import("./pages/InternalPages/GalleryPage"));
const InstagramPage             = lazy(() => import("./pages/InternalPages/InstagramPage"));

// ─── Lazy-loaded — Other ─────────────────────────────────────────────────────
const BatchCreation             = lazy(() => import("./pages/BatchCreation"));

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
      <WhatsAppFloat />
    </>
  );
}

function ProtectedRoute({ children }) {
  const userStr = localStorage.getItem("user");
  let token = null;
  if (userStr) {
    try {
      token = JSON.parse(userStr).token;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
  }
  
  if (!token) return <Navigate to="/login" replace />;
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

      <div style={{ paddingTop: hideNavbar ? "0px" : "80px", width: "100%" }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public ── */}
            <Route path="/" element={<HomePage />} />

            {/* Student Auth */}
            <Route path="/student/*" element={<StudentAuthRoutes />} />
            <Route path="/login"    element={<Navigate to="/student/login"  replace />} />
            <Route path="/register" element={<Navigate to="/student/signup" replace />} />

            {/* Trainer Auth */}
            <Route path="/trainer/*" element={<TrainerAuthRoutes />} />

            {/* Admin Auth */}
            <Route path="/admin/login"          element={<AdminLogin />} />
            <Route path="/admin/signup"         element={<AdminSignup />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/verify-email"   element={<AdminVerifyEmail />} />
            <Route path="/admin/verify-otp"     element={<AdminVerifyOTP />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />

            {/* ── Internal Pages ── */}
            <Route path="/courses"                     element={<CoursesPage />} />
            <Route path="/courses/popular"             element={<PopularCoursesPage />} />
            <Route path="/courses/trending"            element={<TrendingCoursesPage />} />
            <Route path="/trainings"                   element={<TrainingsPage />} />
            <Route path="/trainings/corporate"         element={<CorporateTrainingPage />} />
            <Route path="/trainings/institutional"     element={<InstitutionalTrainingPage />} />
            <Route path="/resources"                   element={<ResourcesPage />} />
            <Route path="/resources/articles"          element={<ArticlesPage />} />
            <Route path="/resources/ebooks"            element={<EbooksPage />} />
            <Route path="/contact"                     element={<ContactPage />} />
            <Route path="/become-trainer"              element={<BecomeTrainerPage />} />
            <Route path="/video-courses"               element={<VideoCoursesPage />} />
            <Route path="/video-courses/:courseId"     element={<VideoModulesPage />} />
            <Route path="/video-courses/:courseId/:lessonId" element={<VideoPlayerPage />} />
            <Route path="/video-courses/payment/:courseId"   element={<VideoPaymentPage />} />
            <Route path="/about"     element={<AboutPage />} />
            <Route path="/gallery"   element={<GalleryPage />} />
            <Route path="/instagram" element={<InstagramPage />} />

            {/* ── Protected ── */}
            <Route path="/student/test/*"      element={<ProtectedRoute><TestApp /></ProtectedRoute>} />
            <Route path="/student/core-test/*" element={<ProtectedRoute><CoreTestApp /></ProtectedRoute>} />
            <Route path="/student-dashboard/*" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/trainer-dashboard/*" element={<TrainerDashboard />} />
            <Route path="/admin-dashboard/*"   element={<AdminProvider><AdminDashboard /></AdminProvider>} />

            {/* ── Misc ── */}
            <Route path="/batchcreation" element={<BatchCreation />} />
            <Route path="/loading"       element={<LoadingPage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

function App() {
  const [isLoading, setIsLoading]   = useState(true);
  const [showPopup, setShowPopup]   = useState(false);
  const [courses, setCourses]       = useState([]);

  useEffect(() => {
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