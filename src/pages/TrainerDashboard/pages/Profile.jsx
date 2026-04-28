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
    name: trainerData.fullName || trainerData.fullname || trainerData.name || "",
    role: trainerData.role ? trainerData.role.toUpperCase() : "",
    email: trainerData.email || "",
    phone: trainerData.phone || "",
    location: trainerData.location || "",
    experience: trainerData.experience || "",
    expertise: trainerData.expertise || "",
    courses: trainerData.courses || "",
    mode: trainerData.mode || "",
    about: trainerData.about || ""
  });

  const [localImage, setLocalImage] = useState(profileImage);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Sync with context if it changes elsewhere (like after backend fetch)
  useEffect(() => {
    console.log("[Profile] trainerData updated:", trainerData);
    if (!isEditing && trainerData && (trainerData.email || trainerData.fullName || trainerData.name)) {
      setTempData({
        name: trainerData.fullName || trainerData.fullname || trainerData.name || "",
        role: trainerData.role ? trainerData.role.toUpperCase() : "TRAINER",
        email: trainerData.email || "",
        phone: trainerData.phone || trainerData.phno || "",
        location: trainerData.location || "",
        experience: trainerData.experience || "",
        expertise: trainerData.expertise || "",
        courses: trainerData.courses || "",
        mode: trainerData.mode || "",
        about: trainerData.about || ""
      });
      setIsDataLoaded(true);
    }
    setLocalImage(profileImage);
  }, [trainerData, profileImage, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      setTempData({
        name: trainerData.fullName || trainerData.fullname || trainerData.name || "",
        role: trainerData.role ? trainerData.role.toUpperCase() : "",
        email: trainerData.email || "",
        phone: trainerData.phone || "",
        location: trainerData.location || "",
        experience: trainerData.experience || "",
        expertise: trainerData.expertise || "",
        courses: trainerData.courses || "",
        mode: trainerData.mode || "",
        about: trainerData.about || ""
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const result = await updateTrainerProfile({ ...tempData, fullName: tempData.name, phone: tempData.phone }, localImage);
      setIsEditing(false);
      // Optional: Show success toast/alert here if result is successful
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile: " + (error.message || "Unknown error"));
    }
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
    { label: 'Active Batches', value: trainerData.activeBatches || '4', icon: <Layers size={18} />, color: 'blue' },
    { label: 'Total Students', value: trainerData.totalStudents || '128', icon: <Users size={18} />, color: 'green' },
    { label: 'Avg Attendance', value: (trainerData.avgAttendance || '92') + '%', icon: <Star size={18} />, color: 'purple' }
  ];

  const displayName = trainerData.fullName || trainerData.fullname || trainerData.name || "";

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
              <p className="trainer-role-minimal">{trainerData.role ? trainerData.role.toUpperCase() : ""}</p>
              <p className="trainer-email-centered">{trainerData.email || ""}</p>
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
                <div className="value-box-saas">{displayName}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Mail size={14} /> Email</div>
              {isEditing ? (
                <input name="email" value={tempData.email} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas text-blue">{trainerData.email || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Phone size={14} /> Phone</div>
              {isEditing ? (
                <input name="phone" value={tempData.phone} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{trainerData.phone || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><MapPin size={14} /> Location</div>
              {isEditing ? (
                <input name="location" value={tempData.location} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{trainerData.location || ""}</div>
              )}
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
                <div className="value-box-saas">{trainerData.experience || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Code size={14} /> Expertise</div>
              {isEditing ? (
                <input name="expertise" value={tempData.expertise} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{trainerData.expertise || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Layers size={14} /> Courses Handling</div>
              {isEditing ? (
                <input name="courses" value={tempData.courses} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{trainerData.courses || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Monitor size={14} /> Training Mode</div>
              {isEditing ? (
                <input name="mode" value={tempData.mode} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{trainerData.mode || ""}</div>
              )}
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
            <p className="about-text-saas">{trainerData.about || ""}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
