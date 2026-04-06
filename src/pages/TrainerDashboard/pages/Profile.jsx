import React from 'react';

const Profile = ({ openVideoModal }) => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const userName = loggedUser.username || "Trainer";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'T';

  return (
    <div className="page active" id="page-profile">
      <div className="profile-hero">
        <div className="p-avatar">{userInitial}</div>
        <div className="p-info">
          <h2>{userName}</h2>
          <p>Senior Trainer · Full Stack & DevOps Specialist</p>
          <div className="p-tags">
            <span className="p-tag">✅ Verified</span>
            <span className="p-tag">📍 Hyderabad</span>
            <span className="p-tag">⏳ 8 Yrs Experience</span>
            <span className="p-tag">⭐ 4.8 Rating</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card">
          <div className="card-header"><div className="card-title">📌 Personal Information</div></div>
          <div className="card-body">
            <div className="info-group"><div className="info-label">Full Name</div><div className="info-val">{userName}</div></div>
            <div className="info-group"><div className="info-label">Email</div><div className="info-val">ravi.kumar@infycode.in</div></div>
            <div className="info-group"><div className="info-label">Phone</div><div className="info-val">+91 98765 43210</div></div>
            <div className="info-group"><div className="info-label">Location</div><div className="info-val">Hyderabad, Telangana</div></div>
            <div className="info-group"><div className="info-label">Preferred Mode</div><div className="info-val">Online & Offline</div></div>
            <div className="info-group"><div className="info-label">Years of Experience</div><div className="info-val">8 Years</div></div>
            <div className="info-group" style={{ marginTop: '6px' }}>
              <div className="info-label">Demo Video</div>
              <div style={{ marginTop: '6px' }}>
                <a className="demo-video-link" onClick={openVideoModal}>
                  <span className="play-icon">▶</span>
                  <span>Watch Trainer Demo Session</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">💻 Assigned Courses</div></div>
          <div className="card-body">
            <div className="info-group"><div className="info-label">Current Courses</div></div>
            <div>
              <span className="skill-chip">Full Stack Development</span>
              <span className="skill-chip">Python & Data Science</span>
              <span className="skill-chip">UI/UX Design</span>
              <span className="skill-chip">DevOps Fundamentals</span>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="info-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Technical Skills</div>
            </div>
            <div style={{ marginTop: '6px' }}>
              <span className="skill-chip">React.js</span>
              <span className="skill-chip">Node.js</span>
              <span className="skill-chip">Python</span>
              <span className="skill-chip">Docker</span>
              <span className="skill-chip">Kubernetes</span>
              <span className="skill-chip">MongoDB</span>
              <span className="skill-chip">AWS</span>
              <span className="skill-chip">Figma</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header"><div className="card-title">🏅 Certifications</div></div>
        <div className="card-body">
          <div className="cert-item"><span className="cert-icon">🎖️</span><div><div className="cert-name">AWS Certified Solutions Architect</div><div className="cert-org">Amazon Web Services</div></div><span className="cert-year">2024</span></div>
          <div className="cert-item"><span className="cert-icon">🎖️</span><div><div className="cert-name">Google Professional Cloud Developer</div><div className="cert-org">Google Cloud</div></div><span className="cert-year">2023</span></div>
          <div className="cert-item"><span className="cert-icon">🎖️</span><div><div className="cert-name">Certified Kubernetes Administrator</div><div className="cert-org">CNCF</div></div><span className="cert-year">2023</span></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
