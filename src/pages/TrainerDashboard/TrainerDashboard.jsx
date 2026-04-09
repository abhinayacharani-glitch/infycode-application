import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./TrainerDashboard.css";

// Import all trainer pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Batches from "./pages/Batches";
import Schedule from "./pages/Schedule";
import Materials from "./pages/Materials";
import Attendance from "./pages/Attendance";
import Feedback from "./pages/Feedback";
import Messages from "./pages/Messages";
import LiveSession from "./pages/LiveSession";
import Logout from "./pages/Logout";

const TrainerDashboard = () => {
  return (
    <div className="trainer-dashboard-layout" style={{ display: "flex", minHeight: "100vh", background: "#f0f6ff" }}>
      
      {/* Sidebar - Fixed width */}
      <div className="sidebar-container" style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="main-content-wrapper" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main className="dashboard-content" style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="batches" element={<Batches />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="materials" element={<Materials />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="messages" element={<Messages />} />
            <Route path="live-session" element={<LiveSession />} />
            <Route path="logout" element={<Logout />} />
          </Routes>
        </main>
      </div>

    </div>
  );
};

export default TrainerDashboard;
