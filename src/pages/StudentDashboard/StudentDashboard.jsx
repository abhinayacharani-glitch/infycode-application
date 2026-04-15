import React from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
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
import Logout from "./pages/Logout";
import "./StudentDashboard.css"; // We'll create this to store the layout styles

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCourseExplore = location.pathname.includes('/course-explore');

  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };

  return (
    <div className={`student-dashboard-layout ${isCourseExplore ? 'full-screen' : ''}`}>
      
      {/* Sidebar - Positioned naturally in the flex flow */}
      {!isCourseExplore && <Sidebar />}

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {!isCourseExplore && <Navbar />}
        
        <main className={`dashboard-content ${isCourseExplore ? 'course-view' : ''}`}>
          <Routes>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="dashboard" element={<Navigate to="courses" replace />} />
            <Route path="counselling" element={<Counselling />} />
            <Route path="skill-test" element={<SkillTest />} />
            <Route path="course" element={<CourseDiscovery />} />
            <Route path="course-topics" element={<CourseTopics />} />
            <Route path="courses" element={<Courses onNavigate={handleNavigate} />} />
            <Route path="course-overview" element={<CourseOverview />} />
            <Route path="mock-interview" element={<MockInterview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="profile" element={<Profile />} />
            <Route path="course-explore" element={<CourseExplore />} />
            <Route path="mentor-connection" element={<MentorConnection />} />
            <Route path="logout" element={<Logout />} />
          </Routes>
        </main>
      </div>

    </div>
  );
}

export default StudentDashboard;