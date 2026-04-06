import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
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
import AdminPage from "./pages/CourseManagement/AdminPage";
import CourseFeed from "./pages/CourseManagement/CourseFeed";
import { CourseForm, CourseFeed as SocialFeed } from "./pages/CourseManagement/CourseForm";
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

          {/* ── Course Management ── */}
          <Route
            path="/coursepage"
            element={
              <CourseFeed
                courses={courses}
                onToggleLike={onToggleLike}
                onUpdateCourse={onUpdateCourse}
                onDeleteCourse={onDeleteCourse}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                onCoursePublished={(newCourse) =>
                  setCourses((prev) => [newCourse, ...prev])
                }
              />
            }
          />
          <Route
            path="/social-feed"
            element={
              <div className="social-feed-page">
                <div className="form-wrapper">
                  <h2 style={{ marginBottom: "20px" }}>Publish Course</h2>
                  <CourseForm
                    onAddCourse={(c) => setCourses((prev) => [c, ...prev])}
                  />
                </div>
                <SocialFeed
                  courses={courses}
                  onToggleLike={onToggleLike}
                  onUpdateCourse={onUpdateCourse}
                  onDeleteCourse={onDeleteCourse}
                />
              </div>
            }
          />
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