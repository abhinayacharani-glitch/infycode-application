import React, { useState, useRef, useEffect } from 'react';
import { useTrainer } from '../../../context/TrainerContext';
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
  const { trainerData, profileImage, updateTrainerProfile } = useTrainer();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [tempData, setTempData] = useState({
    name: trainerData.fullname || trainerData.name || "Trainer",
    role: trainerData.role || "Senior Trainer",
    email: trainerData.email || "trainer@infycode.com",
    phone: trainerData.phone || "+91 98765 43210",
    location: trainerData.location || "Vijayawada, AP",
    experience: trainerData.experience || "5+ Years",
    expertise: trainerData.expertise || "Full Stack Development, React, Node.js",
    courses: trainerData.courses || "3 Active Batches",
    mode: trainerData.mode || "Online & Offline",
    about: trainerData.about || "Experienced trainer focused on building industry-ready developers with practical skills and real-world projects."
  });

  const [localImage, setLocalImage] = useState(profileImage);

  // Sync with context if it changes elsewhere
  useEffect(() => {
    setLocalImage(profileImage);
  }, [profileImage]);

  const handleEditToggle = () => {
    if (isEditing) {
      setTempData({
        name: trainerData.fullname || trainerData.name || "Trainer",
        role: trainerData.role || "Senior Trainer",
        email: trainerData.email || "trainer@infycode.com",
        phone: trainerData.phone || "+91 98765 43210",
        location: trainerData.location || "Vijayawada, AP",
        experience: trainerData.experience || "5+ Years",
        expertise: trainerData.expertise || "Full Stack Development, React, Node.js",
        courses: trainerData.courses || "3 Active Batches",
        mode: trainerData.mode || "Online & Offline",
        about: trainerData.about || "Experienced trainer focused on building industry-ready developers with practical skills and real-world projects."
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updateTrainerProfile({ ...tempData, fullname: tempData.name }, localImage);
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
      // Basic size check (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImage(reader.result);
        // Instant update as requested
        updateTrainerProfile(null, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Active Batches', value: '4', icon: <Layers size={18} />, color: 'blue' },
    { label: 'Total Students', value: '128', icon: <Users size={18} />, color: 'green' },
    { label: 'Avg Attendance', value: '92%', icon: <Star size={18} />, color: 'purple' }
  ];

  const displayName = trainerData.fullname || trainerData.name || "Trainer";

  return (
    <div className="profile-saas-container">
      {/* 0. HEADER */}
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">View and update your trainer profile</p>
      </div>

      {/* 1. CLEAN & CENTERED PROFILE HEADER */}
      <div className="profile-layout">
        <div className="profile-card-container">
          <div className="profile-header-card shadow-sm minimal">
            <div className="profile-image-container-minimal" onClick={handleImageClick}>
              {localImage ? (
                <img src={localImage} alt="Profile" className="profile-img-centered" />
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
              <h1 className="trainer-name-centered">{displayName}</h1>
              <p className="trainer-role-minimal">{trainerData.role || "Senior Trainer"}</p>
              <p className="trainer-email-centered">{trainerData.email || "trainer@infycode.com"}</p>
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
        </div>

        {/* 2. QUICK STATS ROW */}
        <div className="stats-container">
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
                <div className="item-value-saas">{displayName}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Mail size={14} /> Email</div>
              {isEditing ? (
                <input name="email" value={tempData.email} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas text-blue">{trainerData.email || "trainer@infycode.com"}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Phone size={14} /> Phone</div>
              {isEditing ? (
                <input name="phone" value={tempData.phone} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas">{trainerData.phone || "+91 98765 43210"}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><MapPin size={14} /> Location</div>
              <div className="item-value-saas">{trainerData.location || "Vijayawada, AP"}</div>
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
                <div className="item-value-saas">{trainerData.experience || "5+ Years"}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Code size={14} /> Expertise</div>
              {isEditing ? (
                <input name="expertise" value={tempData.expertise} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="item-value-saas">{trainerData.expertise || "Full Stack Development, React, Node.js"}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Layers size={14} /> Courses Handling</div>
              <div className="item-value-saas">{trainerData.courses || "3 Active Batches"}</div>
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Monitor size={14} /> Training Mode</div>
              <div className="item-value-saas">{trainerData.mode || "Online & Offline"}</div>
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
            <p className="about-text-saas">{trainerData.about || "Experienced trainer focused on building industry-ready developers with practical skills and real-world projects."}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
