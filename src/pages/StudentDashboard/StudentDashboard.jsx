import React from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import DashboardTopbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// Sub-pages from the 'pages' subdirectory
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
import Logout from "./pages/Logout";
function StudentDashboard() {
  const navigate = useNavigate();

  const location = useLocation();
  const isCourseExplore = location.pathname.includes('/course-explore');

  const handleExploreCourse = (courseId) => {
    navigate(`/student-dashboard/course-explore`, { state: { courseId } });
  };


  return (
    <div className="student-dashboard-layout" style={{ display: "flex", minHeight: "100vh", fontFamily: '"Urbanist", sans-serif' }}>
      
      {/* Sidebar with fixed width */}
      {!isCourseExplore && (
        <div className="sidebar-container" style={{ width: "250px", flexShrink: 0 }}>
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-content-wrapper" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DashboardTopbar />
        <main className="dashboard-content" style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#f8fafc" }}>
          <Routes>
            <Route index element={<Navigate to="counselling" replace />} />
            <Route path="counselling" element={<Counselling />} />
            <Route path="skill-test" element={<SkillTest />} />
            <Route path="course" element={<CourseDiscovery />} />
            <Route path="course-topics" element={<CourseTopics />} />
            <Route path="courses" element={<Courses onExploreCourse={handleExploreCourse} />} />
            <Route path="mock-interview" element={<MockInterview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="profile" element={<Profile />} />
            <Route path="course-explore" element={<CourseExplore />} />
            <Route path="course-overview" element={<CourseOverview />} />
            <Route path="logout" element={<Logout />} />
          </Routes>
        </main>
      </div>

    </div>
  );
}

export default StudentDashboard;