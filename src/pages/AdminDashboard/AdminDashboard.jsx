import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./AdminDashboard.css"; // ✅ Dedicated scoped CSS — no shared conflicts

// Sub-pages
import Dashboard from "./pages/Dashboard";
import StudentVerification from "./pages/StudentVerification";
import CourseConfig from "./pages/CourseConfig";
import TrainerApproval from "./pages/TrainerApproval";
import BatchSetup from "./pages/BatchSetup";
import EnrollmentMapping from "./pages/EnrollmentMapping";
import Analytics from "./pages/Analytics";
import LearningActivation from "./pages/LearningActivation";
import Reports from "./pages/Reports";
import Logout from "./pages/Logout";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-layout">

      {/* ── Sticky Sidebar Container ── */}
      <div className="admin-sidebar-container">
        <Sidebar />
      </div>

      {/* ── Main Content ── */}
      <div className="admin-main-wrapper">
        <Topbar />
        <main className="adm-content adm-page">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"            element={<Dashboard />} />
            <Route path="student-verification" element={<StudentVerification />} />
            <Route path="course-config"        element={<CourseConfig />} />
            <Route path="trainer-approval"     element={<TrainerApproval />} />
            <Route path="batch-setup"          element={<BatchSetup />} />
            <Route path="enrollment"           element={<EnrollmentMapping />} />
            <Route path="analytics"            element={<Analytics />} />
            <Route path="activation"           element={<LearningActivation />} />
            <Route path="reports"              element={<Reports />} />
            <Route path="logout"               element={<Logout />} />
          </Routes>
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
