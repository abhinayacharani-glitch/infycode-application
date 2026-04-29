import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { TrainerProvider } from "../../context/TrainerContext";
import { useNavigationLock } from "../../hooks/useNavigationLock";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./TrainerDashboard.css";

// Import all trainer pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Batches from "./pages/Batches";
import BatchDetails from "./pages/BatchDetails"; // New Page
import Schedule from "./pages/Schedule";
import Materials from "./pages/Materials";
import Attendance from "./pages/Attendance";
import Feedback from "./pages/Feedback";
import TrainerCounselling from "./pages/TrainerCounselling";
import Messages from "./pages/Messages";
import LiveSession from "./pages/LiveSession";
import Calendar from "./pages/Calendar";
import Logout from "./pages/Logout";

const TrainerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Hook to catch browser "Back" button
  useNavigationLock(true, () => {
    setShowLogoutModal(true);
  });

  return (
    <TrainerProvider>
      <div className="trainer-dashboard-layout">
        
        {/* Sidebar - Fixed width */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          externalShowLogoutModal={showLogoutModal}
          setExternalShowLogoutModal={setShowLogoutModal}
        />

        {/* Main Content Area */}
        <div className="main-content-wrapper">
          <Topbar />
          
          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>

          <main className="dashboard-content">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="batches" element={<Batches />} />
              <Route path="batches/:batchId" element={<BatchDetails />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="materials" element={<Materials />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="counselling" element={<TrainerCounselling />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="messages" element={<Messages />} />
              <Route path="live-session" element={<LiveSession />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="logout" element={<Logout />} />
            </Routes>
          </main>
        </div>

      </div>
    </TrainerProvider>
  );
};

export default TrainerDashboard;
