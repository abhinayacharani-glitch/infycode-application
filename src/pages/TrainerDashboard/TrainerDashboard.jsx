import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Messages from "./pages/Messages";
import LiveSession from "./pages/LiveSession";
import Logout from "./pages/Logout";

const TrainerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="trainer-dashboard-layout">
      
      {/* Sidebar - Fixed width */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
