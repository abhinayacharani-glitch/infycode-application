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
  Calendar,
  Upload,
  Trash2
} from 'lucide-react';
import './Profile.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red', padding: '20px'}}><h2>Something went wrong.</h2><pre>{this.state.error.toString()}</pre></div>;
    }
    return this.props.children;
  }
}

const Profile = () => {
  const { trainerData, profileImage, updateTrainerProfile } = useTrainer();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const photoMenuRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const safeData = trainerData || {};
  const [tempData, setTempData] = useState({
    name: safeData.fullName || safeData.fullname || safeData.name || "",
    role: safeData.role ? safeData.role.toUpperCase() : "",
    email: safeData.email || "",
    phone: safeData.phone || "",
    location: safeData.location || "",
    experience: safeData.experience || "",
    expertise: safeData.expertise || "",
    courses: safeData.courses || "",
    mode: safeData.mode || "",
    about: safeData.about || ""
  });

  const [localImage, setLocalImage] = useState(profileImage);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (photoMenuRef.current && !photoMenuRef.current.contains(event.target)) {
        setShowPhotoMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync with context if it changes elsewhere (like after backend fetch)
  useEffect(() => {
    console.log("[Profile] trainerData updated:", safeData);
    if (!isEditing && safeData && (safeData.email || safeData.fullName || safeData.name)) {
      setTempData({
        name: safeData.fullName || safeData.fullname || safeData.name || "",
        role: safeData.role ? String(safeData.role).toUpperCase() : "TRAINER",
        email: safeData.email || "",
        phone: safeData.phone || safeData.phno || "",
        location: safeData.location || "",
        experience: safeData.experience || "",
        expertise: safeData.expertise || "",
        courses: safeData.courses || "",
        mode: safeData.mode || "",
        about: safeData.about || ""
      });
      setIsDataLoaded(true);
    }
    setLocalImage(profileImage);
  }, [trainerData, profileImage, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      setTempData({
        name: safeData.fullName || safeData.fullname || safeData.name || "",
        role: safeData.role ? String(safeData.role).toUpperCase() : "",
        email: safeData.email || "",
        phone: safeData.phone || "",
        location: safeData.location || "",
        experience: safeData.experience || "",
        expertise: safeData.expertise || "",
        courses: safeData.courses || "",
        mode: safeData.mode || "",
        about: safeData.about || ""
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImage(reader.result);
        setShowPhotoMenu(false);
        updateTrainerProfile(null, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = async () => {
    setShowPhotoMenu(false);
    setLocalImage(null);
    try {
      await updateTrainerProfile(null, null);
    } catch (err) {
      console.error(err);
    }
  };

  const openCamera = async () => {
    setShowPhotoMenu(false);
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Unable to access camera. Please check permissions.");
      setShowCameraModal(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const b64 = canvas.toDataURL("image/jpeg");
      
      closeCamera();
      setLocalImage(b64);
      updateTrainerProfile(null, b64).catch(console.error);
    }
  };

  const stats = [
    { label: 'Active Batches', value: safeData.activeBatches || '4', icon: <Layers size={18} />, color: 'blue' },
    { label: 'Total Students', value: safeData.totalStudents || '128', icon: <Users size={18} />, color: 'green' },
    { label: 'Avg Attendance', value: (safeData.avgAttendance || '92') + '%', icon: <Star size={18} />, color: 'purple' }
  ];

  const displayName = safeData.fullName || safeData.fullname || safeData.name || "";

  return (
    <div className="profile-saas-container">
      {/* ── CAMERA MODAL ── */}
      {showCameraModal && (
        <div className="camera-modal-overlay">
          <div className="camera-modal">
            <div className="camera-modal-header">
              <h3>Take Photo</h3>
              <button className="camera-close-btn" onClick={closeCamera}>
                <X size={20} />
              </button>
            </div>
            <div className="camera-view-container">
              <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
            </div>
            <div className="camera-modal-footer">
              <button className="camera-capture-btn" onClick={capturePhoto}>
                <Camera size={18} /> Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0. HEADER */}
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">View and update your trainer profile</p>
      </div>

      {/* 1. CLEAN & CENTERED PROFILE HEADER */}
      <div className="profile-layout">
        <div className="profile-card-container">
          <div className="profile-header-card shadow-sm minimal">
            <div className="profile-image-container-minimal" ref={photoMenuRef}>
              {localImage ? (
                <img src={localImage} alt="Profile" className="profile-img-centered" />
              ) : (
                <div className="profile-img-centered placeholder">
                  <User size={40} className="text-muted" />
                </div>
              )}
              <div className="camera-overlay-minimal" onClick={() => setShowPhotoMenu(!showPhotoMenu)}>
                <Camera size={14} color="white" />
              </div>
              
              {showPhotoMenu && (
                <div className="photo-options-menu">
                  <button className="photo-menu-item" onClick={openCamera}>
                    <Camera size={16} /> Take photo
                  </button>
                  <button className="photo-menu-item" onClick={() => fileInputRef.current.click()}>
                    <Upload size={16} /> Upload photo
                  </button>
                  {localImage && (
                    <button className="photo-menu-item danger" onClick={handleRemovePhoto}>
                      <Trash2 size={16} /> Remove photo
                    </button>
                  )}
                </div>
              )}

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
              <p className="trainer-role-minimal">{safeData.role ? String(safeData.role).toUpperCase() : ""}</p>
              <p className="trainer-email-centered">{safeData.email || ""}</p>
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
              <div className="value-box-saas read-only-info">{displayName}</div>
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Mail size={14} /> Email</div>
<<<<<<< HEAD
              {isEditing ? (
                <input name="email" value={tempData.email} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas text-blue">{safeData.email || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Phone size={14} /> Phone</div>
              {isEditing ? (
                <input name="phone" value={tempData.phone} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{safeData.phone || ""}</div>
              )}
=======
              <div className="value-box-saas text-blue read-only-info">{trainerData.email || ""}</div>
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Phone size={14} /> Phone</div>
              <div className="value-box-saas read-only-info">{trainerData.phone || trainerData.phno || ""}</div>
>>>>>>> ba3d1cf8b1b3fb048223d1e788fc020a5bbb16a1
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><MapPin size={14} /> Location</div>
              {isEditing ? (
                <input name="location" value={tempData.location} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{safeData.location || ""}</div>
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
                <div className="value-box-saas">{safeData.experience || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Code size={14} /> Expertise</div>
              {isEditing ? (
                <input name="expertise" value={tempData.expertise} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{safeData.expertise || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Layers size={14} /> Courses Handling</div>
              {isEditing ? (
                <input name="courses" value={tempData.courses} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{safeData.courses || ""}</div>
              )}
            </div>
            <div className="info-item-saas">
              <div className="item-label-saas"><Monitor size={14} /> Training Mode</div>
              {isEditing ? (
                <input name="mode" value={tempData.mode} onChange={handleChange} className="edit-input-saas" />
              ) : (
                <div className="value-box-saas">{safeData.mode || ""}</div>
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
            <p className="about-text-saas">{safeData.about || ""}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default function ProfileWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Profile {...props} />
    </ErrorBoundary>
  );
}
