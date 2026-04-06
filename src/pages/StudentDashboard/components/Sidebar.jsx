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

const Sidebar = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { username: "Student" };

  const userEmail = "charani.student@gmail.com";
  const userName = "Charani Student";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <aside className="sd-sidebar">

      {/* BRAND */}
      <div className="sd-brand">
        <div className="sd-logo-wrap">
          <img src={icLogo}
            alt="logo" className="sd-logo" />
          <div className="sd-brand-text">
            <img src={bannerLogo} alt="InfyCode Banner" style={{ width: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} className="sd-title" />
          </div>
        </div>
      </div>

      {/* USER */}
      <Link to="/student-dashboard/profile" className="sd-user-link">
        <div className="sd-user">
          <div className="sd-avatar">{userInitial}</div>
          <div>
            <div className="sd-name">{userName}</div>
            <div className="sd-role">{userEmail}</div>
          </div>
        </div>
      </Link>

      {/* NAV */}
      <div className="sd-nav">

        {[
          { to: "/student-dashboard/counselling", icon: <CounsellingIcon />, label: "Counselling" },
          { to: "/student-dashboard/skill-test", icon: <SkillIcon />, label: "Skill Based Test" },
          { to: "/student-dashboard/course", icon: <GraduationCap />, label: "Courses" },
          { to: "/student-dashboard/courses", icon: <CoursesIcon />, label: "Enrolled Courses" },
          { to: "/student-dashboard/mock-interview", icon: <InterviewIcon />, label: "Mock Tests & Interviews" },
          { to: "/student-dashboard/projects", icon: <ProjectIcon />, label: "Projects & Certificates" },
          { to: "/student-dashboard/profile", icon: <ProfileIcon />, label: "My Profile" }
        ].map((item, i) => (
          <NavLink key={i} to={item.to}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon">{item.icon}</span>
              <span className="sd-text">{item.label}</span>
            </div>
          </NavLink>
        ))}

      </div>

      {/* FOOTER */}
      <div className="sd-footer">
        <NavLink to="/student-dashboard/logout" className="sd-logout">
          <span className="sd-icon"><LogoutIcon /></span>
          <span className="sd-text">Logout</span>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;