import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useNavigationLock } from "../../hooks/useNavigationLock";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Counselling from "./pages/Counselling";
import SkillTest from "./pages/SkillTest";
import CourseDiscovery from "./pages/Course";
import CourseTopics from "./pages/CourseTopics";
import Courses from "./pages/Courses";
import MockInterview from "./pages/MockInterview";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import CourseExplore from "./pages/CourseExplore";
import CourseOverview from "./pages/Courseoverview";
import MentorConnection from "./pages/MentorConnection";
import CounsellingDetail from "./pages/CounsellingDetail";
import MockTestDetail from "./pages/MockTestDetail";
import MockTestList from "./pages/MockTestList";
import ProjectTopics from "./pages/ProjectTopics";
import PreparationResources from "./pages/PreparationResources";
import MyQueries from "./pages/MyQueries";
import QuerySolution from "./pages/QuerySolution";
import Logout from "./pages/Logout";
import { StudentProvider } from "../../context/StudentContext";
import { getStudentNotificationsAPI, markStudentNotificationReadAPI } from "../../services/api";
import { Bell, Video } from "lucide-react";
import "./StudentDashboard.css"; // We'll create this to store the layout styles

const parse12HourToMinutes = (time12) => {
  if (!time12) return 0;
  const [time, suffix] = time12.split(' ');
  let [hour, minute] = time.split(':').map(Number);
  if (suffix === 'PM' && hour !== 12) hour += 12;
  if (suffix === 'AM' && hour === 12) hour = 0;
  return (hour * 60) + minute;
};

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Global student dashboard alerts/reminders state
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupNotif, setCurrentPopupNotif] = useState(null);

  // Periodically poll notifications for dashboard popups
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getStudentNotificationsAPI();
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
          // Find most recent unread 1-hour class reminder or cancellation
          const unreadReminder = res.notifications.find(
            (n) => (n.type === "class_reminder_1h" || n.type === "class_cancellation") && !n.read
          );
          if (unreadReminder && !showPopup) {
            setCurrentPopupNotif(unreadReminder);
            setShowPopup(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch student notifications in dashboard:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll notifications every 10s
    return () => clearInterval(interval);
  }, [showPopup]);

  const dismissPopup = async () => {
    if (currentPopupNotif) {
      try {
        await markStudentNotificationReadAPI(currentPopupNotif.id);
      } catch (err) {
        console.error("Error reading notification:", err.message);
      }
    }
    setShowPopup(false);
  };

  const handleJoinPopupClass = () => {
    if (currentPopupNotif && currentPopupNotif.sessionLink) {
      window.open(currentPopupNotif.sessionLink, "_blank");
    }
  };

  const getIsSessionLive = () => {
    if (!currentPopupNotif || !currentPopupNotif.startTime || !currentPopupNotif.endTime) return false;
    const now = new Date();
    const nowMinutes = (now.getHours() * 60) + now.getMinutes();
    const startMinutes = parse12HourToMinutes(currentPopupNotif.startTime);
    const endMinutes = parse12HourToMinutes(currentPopupNotif.endTime);
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  };

  const isSessionLive = getIsSessionLive();

  // Hook to catch browser "Back" button
  useNavigationLock(true, () => {
    setShowLogoutModal(true);
  });

  const isCourseExplore = location.pathname.includes('/course-explore');

  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };

  return (
    <StudentProvider>
      <div className={`student-dashboard-layout ${isCourseExplore ? 'full-screen' : ''}`}>
      
      {/* Sidebar - Positioned naturally in the flex flow */}
      {!isCourseExplore && (
        <Sidebar 
          externalShowLogoutModal={showLogoutModal} 
          setExternalShowLogoutModal={setShowLogoutModal} 
        />
      )}

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {!isCourseExplore && <Navbar />}
        
        <main className={`dashboard-content ${isCourseExplore ? 'course-view' : ''}`}>
          <Routes>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="dashboard" element={<Navigate to="courses" replace />} />
            <Route path="counselling" element={<Counselling />} />
            <Route path="counselling/:id" element={<CounsellingDetail />} />
            <Route path="skill-test" element={<SkillTest />} />
            <Route path="course" element={<CourseDiscovery />} />
            <Route path="course-topics" element={<CourseTopics />} />
            <Route path="courses" element={<Courses onNavigate={handleNavigate} />} />
            <Route path="course-overview" element={<CourseOverview />} />
            <Route path="mock-interview" element={<MockInterview />} />
            <Route path="mock-tests" element={<MockTestList />} />
            <Route path="mock-test/:id" element={<MockTestDetail />} />
            <Route path="preparation-resources" element={<PreparationResources />} />
            <Route path="projects" element={<Projects />} />
            <Route path="project-topics/:id" element={<ProjectTopics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="course-explore" element={<CourseExplore />} />
            <Route path="trainer-connect" element={<MentorConnection />} />
            <Route path="my-queries" element={<MyQueries />} />
            <Route path="my-queries/:ticketId/solution" element={<QuerySolution />} />
            <Route path="logout" element={<Logout />} />
          </Routes>
        </main>
      </div>
    </div>

    {/* 🔔 Student Dashboard Pop-up Alert */}
    {showPopup && currentPopupNotif && (
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: "#ffffff",
        boxShadow: currentPopupNotif.type === 'class_cancellation' ? "0 12px 40px rgba(71, 85, 105, 0.16)" : "0 12px 40px rgba(26, 115, 232, 0.18)",
        borderRadius: "14px",
        width: "380px",
        overflow: "hidden",
        animation: "slideIn 0.35s cubic-bezier(0.16,1,0.3,1)"
      }}>
        {/* Colored top bar */}
        <div style={{ 
          background: currentPopupNotif.type === 'class_cancellation' ? "linear-gradient(135deg, #475569, #1e293b)" : "linear-gradient(135deg, #1a73e8, #0d47a1)", 
          padding: "12px 16px", 
          display: "flex", 
          alignItems: "center", 
          gap: "10px" 
        }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "6px", display: "flex" }}>
            <Bell size={18} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>
            {currentPopupNotif.title}
          </span>
          <button
            onClick={dismissPopup}
            style={{ marginLeft: "auto", background: "transparent", border: "none", color: "rgba(255,255,255,0.8)", fontSize: "18px", cursor: "pointer", lineHeight: 1, padding: "0 2px" }}
            title="Dismiss"
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px" }}>
          {/* Timings row or Cancellation notice */}
          {currentPopupNotif.type === 'class_cancellation' ? (
            <div style={{ background: "#f8fafc", borderLeft: "4px solid #475569", borderRadius: "8px", padding: "12px", marginBottom: "12px", textAlign: "left" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>Class Cancellation / Holiday</div>
            </div>
          ) : (
            (currentPopupNotif.startTime || currentPopupNotif.endTime) && (
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={{ flex: 1, background: "#f0f7ff", borderRadius: "8px", padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, marginBottom: "2px", textTransform: "uppercase" }}>Starts</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a73e8" }}>{currentPopupNotif.startTime}</div>
                </div>
                <div style={{ flex: 1, background: "#f0fff4", borderRadius: "8px", padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, marginBottom: "2px", textTransform: "uppercase" }}>Ends</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#16a34a" }}>{currentPopupNotif.endTime}</div>
                </div>
              </div>
            )
          )}

          <p style={{ margin: "0 0 14px", color: "#475569", fontSize: "13px", lineHeight: 1.5 }}>
            {currentPopupNotif.text}
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            {currentPopupNotif.type === 'class_cancellation' ? (
              <button
                onClick={dismissPopup}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "linear-gradient(135deg, #475569, #1e293b)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                Acknowledge
              </button>
            ) : (
              <>
                <button
                  onClick={dismissPopup}
                  style={{ flex: 1, padding: "8px", background: "#f1f5f9", border: "none", borderRadius: "8px", color: "#475569", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}
                >
                  Dismiss
                </button>
                <button
                  onClick={() => { handleJoinPopupClass(); dismissPopup(); }}
                  title={isSessionLive ? 'Join the live class' : 'Opens class session link'}
                  style={{
                    flex: 2,
                    padding: "8px",
                    background: isSessionLive ? "linear-gradient(135deg,#1a73e8,#0d47a1)" : "#f1f5f9",
                    border: isSessionLive ? "none" : "1px solid #cbd5e1",
                    borderRadius: "8px",
                    color: isSessionLive ? "#fff" : "#475569",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Video size={14} />
                  {isSessionLive ? 'Join Now' : 'Join Class'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Styled slideIn animation */}
    <style>{`
      @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `}</style>
    </StudentProvider>
  );
}

export default StudentDashboard;