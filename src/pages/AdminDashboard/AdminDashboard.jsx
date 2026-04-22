import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigationLock } from "../../hooks/useNavigationLock";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./AdminDashboard.css"; // ✅ Dedicated scoped CSS — no shared conflicts

// Sub-pages
import Dashboard from "./pages/Dashboard";
import StudentVerification from "./pages/StudentVerification";
import CourseConfig from "./pages/CourseConfig";
import TrainerApproval from "./pages/TrainerApproval";
import BatchCreation from "./pages/BatchCreation";
import EnrollmentMapping from "./pages/EnrollmentMapping";
import Analytics from "./pages/Analytics";
import LearningActivation from "./pages/LearningActivation";
import Reports from "./pages/Reports";
import Logout from "./pages/Logout";
import AccountSettings from "./pages/AccountSettings";
import SecuritySettings from "./pages/SecuritySettings";
import PreferenceSettings from "./pages/PreferenceSettings";
import AdminProfile from "./pages/AdminProfile";
import FAQManagement from "./pages/FAQManagement";

const AdminDashboard = () => {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Hook to catch browser "Back" button
  useNavigationLock(true, () => {
    setShowLogoutModal(true);
  });

  return (
    <div className="admin-dashboard-layout">
      {/* ── Topbar (Now Spanning Full Width) ── */}
      <Topbar />

      <div className="admin-bottom-container">
        {/* ── Sticky Sidebar Container ── */}
        <div className="admin-sidebar-container">
          <Sidebar 
            isCollapsed={false} 
            externalShowLogoutModal={showLogoutModal}
            setExternalShowLogoutModal={setShowLogoutModal}
          />
        </div>

        {/* ── Main Content ── */}
        <div className="admin-main-wrapper">
          <main className="adm-content adm-page">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"            element={<Dashboard />} />
              <Route path="student-verification" element={<StudentVerification />} />
              <Route path="course-config"        element={<CourseConfig />} />
              <Route path="trainer-approval"     element={<TrainerApproval />} />
              <Route path="batch-setup"          element={<BatchCreation />} />
              <Route path="enrollment"           element={<EnrollmentMapping />} />
              <Route path="analytics"            element={<Analytics />} />
              <Route path="activation"           element={<LearningActivation />} />
              <Route path="reports"              element={<Reports />} />
              <Route path="faq-management"       element={<FAQManagement />} />
              <Route path="settings/account"     element={<AccountSettings />} />
              <Route path="settings/account"     element={<AccountSettings />} />
              <Route path="settings/security"    element={<SecuritySettings />} />
              <Route path="settings/preferences" element={<PreferenceSettings />} />
              <Route path="logout"               element={<Logout />} />
              <Route path="profile"              element={<AdminProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
