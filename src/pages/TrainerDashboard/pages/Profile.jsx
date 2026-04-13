import React, { useState, useRef } from 'react';
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Code,
  Layers,
  Monitor,
  Edit3,
  Check,
  X,
  User,
  Star,
  Users,
  Calendar
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "Charani",
    role: "Senior Trainer",
    email: "charani@infycode.com",
    phone: "+91 98765 43210",
    location: "Vijayawada, AP",
    experience: "5+ Years",
    expertise: "Full Stack Development, React, Node.js",
    courses: "3 Active Batches",
    mode: "Online & Offline",
    about: "Experienced trainer focused on building industry-ready developers with practical skills and real-world projects."
  });

  const [tempData, setTempData] = useState({ ...profileData });
  const [profileImage, setProfileImage] = useState(null);

  const handleEditToggle = () => {
    if (isEditing) {
      setTempData({ ...profileData });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Active Batches', value: '4', icon: <Layers size={18} />, color: 'blue' },
    { label: 'Total Students', value: '128', icon: <Users size={18} />, color: 'green' },
    { label: 'Avg Attendance', value: '92%', icon: <Star size={18} />, color: 'purple' }
  ];

  return (
    <div className="profile-saas-container">
      {/* 0. HEADER */}
      <div class="profile-header">
        <h1 class="profile-title">My Profile</h1>
        <p class="profile-subtitle">View and update your trainer profile</p>
      </div>

      {/* 1. CLEAN & CENTERED PROFILE HEADER */}
      <div className="profile-header-card shadow-sm minimal">
        <div className="profile-image-container-minimal" onClick={handleImageClick}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-img-centered" />
          ) : (
            <div className="profile-img-centered placeholder">
              <User size={40} className="text-muted" />
            </div>
          )}
          <div className="camera-overlay-minimal">
            <Camera size={14} color="white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="profile-identity-centered">
          <h1 className="trainer-name-centered">{profileData.name}</h1>
          <p className="trainer-role-minimal">Senior Trainer</p>
          <p className="trainer-email-centered">{profileData.email}</p>
          <div className="trainer-id-status-row">
            <span className="trainer-id-centered">TRN-1024</span>
            <span className="trainer-status-pill">
              <span className="status-dot-green"></span>
              Active
            </span>
          </div>
        </div>

        <div className="profile-header-actions-minimal">
          {!isEditing ? (
            <button className="btn-edit-primary" onClick={handleEditToggle}>
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="edit-mode-btns-centered">
              <button className="btn-cancel-saas" onClick={handleEditToggle}>
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button className="btn-save-saas" onClick={handleSave}>
                <Check size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. QUICK STATS ROW */}
      <div className="profile-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card-min ${stat.color}`}>
            <div className={`stat-icon-box ${stat.color}`}>{stat.icon}</div>
            <div className="stat-info-min">
              <h3 className="stat-value-min">{stat.value}</h3>
              <p className="stat-label-min">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. DETAILS SECTION */}
      <div className="profile-details-grid-saas">

        {/* PERSONAL INFO */}
        <div className="details-card-saas shadow-sm">
          <h2 className="details-title-saas">Personal Information</h2>
          <div className="info-list-items">
            <div className="info-item-saas">
              <div className="item-label-saas"><User size={14} /> Full Name</div>
              {isEditing ? (
                <input name="name" value={tempData.name} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas">{profileData.name}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Mail size={14} /> Email</div>
              {isEditing ? (
                <input name="email" value={tempData.email} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas text-blue">{profileData.email}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Phone size={14} /> Phone</div>
              {isEditing ? (
                <input name="phone" value={tempData.phone} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas">{profileData.phone}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><MapPin size={14} /> Location</div>
              <div className="item-value-saas">{profileData.location}</div>
            </div>
          </div>
        </div>

        {/* PROFESSIONAL INFO */}
        <div className="details-card-saas shadow-sm">
          <h2 className="details-title-saas">Professional Details</h2>
          <div className="info-list-items">
            <div className="info-item-saas">
              <div className="item-label-saas"><Briefcase size={14} /> Experience</div>
              {isEditing ? (
                <input name="experience" value={tempData.experience} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas">{profileData.experience}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Code size={14} /> Expertise</div>
              {isEditing ? (
                <input name="expertise" value={tempData.expertise} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas">{profileData.expertise}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Layers size={14} /> Courses Handling</div>
              <div className="item-value-saas">{profileData.courses}</div>
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Monitor size={14} /> Training Mode</div>
              <div className="item-value-saas">{profileData.mode}</div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION (FULL WIDTH) */}
        <div className="details-card-saas shadow-sm full-width">
          <h2 className="details-title-saas">About Trainer</h2>
          {isEditing ? (
            <textarea
              name="about"
              value={tempData.about}
              onChange={handleChange}
              className="edit-textarea-saas"
              rows="4"
            />
          ) : (
            <p className="about-text-saas">{profileData.about}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
