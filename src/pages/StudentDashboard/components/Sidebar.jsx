import { GraduationCap } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

// ✅ COMMON SVG STYLE
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

// ICONS
const CounsellingIcon = () => (
  <svg {...svgProps}>
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
  </svg>
);

const SkillIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="4" width="18" height="14" rx="2"/>
    <line x1="8" y1="20" x2="16" y2="20"/>
  </svg>
);

const CoursesIcon = () => (
  <svg {...svgProps}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const InterviewIcon = () => (
  <svg {...svgProps}>
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
  </svg>
);

const ProjectIcon = () => (
  <svg {...svgProps}>
    <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z"/>
  </svg>
);

const ProfileIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
  </svg>
);

const LogoutIcon = () => (
  <svg {...svgProps}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ✅ BULLETPROOF INLINE STYLES
// This forces your layout to be perfect regardless of broken global CSS files
const navBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '14px',
  padding: '12px 18px',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  width: '100%',
  boxSizing: 'border-box'
};

const iconWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '20px',
  height: '20px',
  color: 'inherit'
};

// Custom NavItem to perfectly handle active states with inline styles
const NavItem = ({ to, icon, label }) => (
  <NavLink to={to} style={{ textDecoration: 'none', display: 'block', margin: '4px 20px' }}>
    {({ isActive }) => (
      <div style={{
        ...navBoxStyle,
        background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
        borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
        color: isActive ? '#3b82f6' : '#475569',
      }}>
        <span style={iconWrapStyle}>{icon}</span>
        <span style={{ whiteSpace: 'nowrap', display: 'block', margin: 0 }}>{label}</span>
      </div>
    )}
  </NavLink>
);

const Sidebar = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { username: "Student", role: "Student" };
  const userName = user?.username || "Student";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'S';

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      background: '#f8fafc',
      borderRight: '1px solid #e2e8f0',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '10px 0',
      zIndex: 1000,
      fontFamily: "'Urbanist', sans-serif"
    }}>

      {/* BRAND */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="https://image2url.com/r2/default/images/1773904682881-8c279e0e-742e-4d5d-9f55-df1bf46bce45.png" 
            alt="InfyCode Logo" 
            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#0f172a', fontSize: '18px', fontWeight: '800', lineHeight: 1.1 }}>INFYCODE</span>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', marginTop: '2px' }}>Student Portal</span>
          </div>
        </div>
      </div>

      {/* USER CARD (Fixed layout) */}
      <div style={{ padding: '10px 20px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffffff',
            flexShrink: 0
          }}>{userInitial}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>{userName}</span>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
              Active Student
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAV SECTION */}
      <div style={{ padding: '8px 20px', fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', color: '#94a3b8', textTransform: 'uppercase' }}>Main</div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
        <NavItem to="/student-dashboard/counselling" icon={<CounsellingIcon />} label="Counselling" />
        <NavItem to="/student-dashboard/skill-test" icon={<SkillIcon />} label="Skill Based Test" />
        <NavItem to="/student-dashboard/course" icon={<GraduationCap size={18} strokeWidth={2.5} />} label="Courses" />
        <NavItem to="/student-dashboard/courses" icon={<CoursesIcon />} label="Enrolled Courses" />
        <NavItem to="/student-dashboard/mock-interview" icon={<InterviewIcon />} label="Mock Tests" />

        <div style={{ padding: '16px 20px 8px', fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', color: '#94a3b8', textTransform: 'uppercase' }}>Achievements</div>

        <NavItem to="/student-dashboard/projects" icon={<ProjectIcon />} label="Projects" />
        <NavItem to="/student-dashboard/profile" icon={<ProfileIcon />} label="My Profile" />
      </div>

      {/* FOOTER */}
      <div style={{ padding: '16px 20px', marginTop: 'auto', borderTop: '1px solid #f1f5f9' }}>
        <NavLink to="/student-dashboard/logout" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: '#fff1f2',
            color: '#e11d48',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <span style={iconWrapStyle}><LogoutIcon /></span>
            <span>Logout</span>
          </div>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;
