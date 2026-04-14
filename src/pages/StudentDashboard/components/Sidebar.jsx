import { GraduationCap } from 'lucide-react';
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import "./Sidebar.css";
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';

const svgProps = {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// ICONS (unchanged)
const CounsellingIcon = () => (
  <svg {...svgProps}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const SkillIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
);

const CoursesIcon = () => (
  <svg {...svgProps}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const InterviewIcon = () => (
  <svg {...svgProps}>
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

const ProjectIcon = () => (
  <svg {...svgProps}>
    <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z" />
  </svg>
);

const ProfileIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg {...svgProps}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MentorConnectIcon = () => (
  <svg {...svgProps}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const Sidebar = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { username: "Charani", role: "STUDENT" };

  const userName = user.username || "Charani";
  const userRole = user.role || "STUDENT";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className="student-sd-sidebar">

      {/* BRAND */}
      <div className="student-sd-brand">
        <div className="student-sd-logo-wrap">
          <img src={icLogo} alt="logo" className="student-sd-logo" />
          <div className="student-sd-brand-text">
            <img src={bannerLogo} alt="InfyCode Banner" style={{ width: '100%', objectFit: 'contain' }} className="student-sd-title" />
          </div>
        </div>
      </div>

      {/* USER */}
      <Link to="/student-dashboard/profile" className="student-sd-user-link">
        <div className="student-sd-user">
          <div className="student-sd-avatar">{userInitial}</div>
          <div>
            <div className="student-sd-name">{userName}</div>
            <div className="student-sd-role">{userRole}</div>
          </div>
        </div>
      </Link>

      {/* NAV */}
      <div className="student-sd-nav">

        {[
          { to: "/student-dashboard/counselling", icon: <CounsellingIcon />, label: "Counselling" },
          { to: "/student-dashboard/skill-test", icon: <SkillIcon />, label: "Skill Based Test" },
          { to: "/student-dashboard/course", icon: <GraduationCap />, label: "Courses" },
          { to: "/student-dashboard/courses", icon: <CoursesIcon />, label: "Enrolled Courses" },
          { to: "/student-dashboard/mentor-connection", icon: <MentorConnectIcon />, label: "Mentor Connect" },
          { to: "/student-dashboard/mock-interview", icon: <InterviewIcon />, label: "Mock Tests & Interviews" },
          { to: "/student-dashboard/projects", icon: <ProjectIcon />, label: "Projects & Certificates" },
          { to: "/student-dashboard/profile", icon: <ProfileIcon />, label: "My Profile" }
        ].map((item, i) => (
          <NavLink key={i} to={item.to}
            className={({ isActive }) => `student-sd-item ${isActive ? 'active' : ''}`}>
            <div className="student-sd-box">
              <span className="student-sd-icon">{item.icon}</span>
              <span className="student-sd-text">{item.label}</span>
            </div>
          </NavLink>
        ))}

      </div>

      {/* FOOTER */}
      <div className="student-sd-footer">
        <div className="student-sd-logout-divider"></div>
        <NavLink to="/student-dashboard/logout" className="student-sd-logout">
          <span className="student-sd-icon"><LogoutIcon /></span>
          <span className="student-sd-text">Logout</span>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;