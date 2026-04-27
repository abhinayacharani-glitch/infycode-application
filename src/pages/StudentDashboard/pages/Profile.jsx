import React, { useState, useEffect, useRef } from "react";
import { Edit2, Mail, Phone, User, Calendar, Camera, X } from 'lucide-react';
import { useLocation } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const location = useLocation();

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser") || "{}")
  );
  const [open, setOpen] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const editSectionRef = useRef(null);
  
  const [profileImage, setProfileImage] = useState(loggedUser.profileImage || null);
  const fileInputRef = useRef(null);

  const [isCameraDropdownOpen, setIsCameraDropdownOpen] = useState(false);
  const cameraDropdownRef = useRef(null);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        const updatedUser = { ...loggedUser, profileImage: reader.result };
        localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
        setLoggedUser(updatedUser);
        setIsCameraDropdownOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    setIsCameraDropdownOpen(false);
    setIsCameraModalOpen(true);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check your permissions.");
      setIsCameraModalOpen(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraModalOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
    }
  };

  const saveCapturedPhoto = () => {
    setProfileImage(capturedImage);
    const updatedUser = { ...loggedUser, profileImage: capturedImage };
    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    setLoggedUser(updatedUser);
    closeCamera();
  };

  const removePhoto = () => {
    setProfileImage(null);
    const updatedUser = { ...loggedUser, profileImage: null };
    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    setLoggedUser(updatedUser);
    setIsCameraDropdownOpen(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cameraDropdownRef.current && !cameraDropdownRef.current.contains(event.target)) {
        setIsCameraDropdownOpen(false);
      }
    };

    if (isCameraDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCameraDropdownOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'true') {
      setIsEditing(true);
      setOpen("personal");
    }
  }, [location]);

  const handleEditClick = () => {
    setOpen("personal");
    setIsEditing(true);
    setTimeout(() => {
      editSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const fullNameInput = document.querySelector('input[name="fullName"]');
      if (fullNameInput) {
        fullNameInput.focus();
      }
    }, 100);
  };

  const [personalDetails, setPersonalDetails] = useState({
    fullName: loggedUser.username || "charanistudent",
    phone: loggedUser.phone || "9876543210",
    email: loggedUser.email || "charanistudent@gmail.com",
    dob: loggedUser.dob || "03 April 2004",
    gender: loggedUser.gender || "Female",
    location: loggedUser.location || "India"
  });

  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [academicDetails, setAcademicDetails] = useState({
    degree: loggedUser.degree || "B.Tech",
    branch: loggedUser.branch || "CSE",
    college: loggedUser.college || "SVIET",
    passOutYear: loggedUser.passOutYear || "2026",
    cgpa: loggedUser.cgpa || "8.5"
  });

  const handleAcademicChange = (e) => {
    setAcademicDetails({ ...academicDetails, [e.target.name]: e.target.value });
  };

  const handleAcademicSave = () => {
    setIsEditingAcademic(false);
    const updatedUser = { ...loggedUser, ...academicDetails };
    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    setLoggedUser(updatedUser);
  };

  const handleInputChange = (e) => {
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    const updatedUser = { ...loggedUser, ...personalDetails, username: personalDetails.fullName };
    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    setLoggedUser(updatedUser);
  };

  return (
    <div className="profile-container">



      {/* 🔷 HEADER */}
      <div className="profile-header">
        <div className="profile-avatar-container" ref={cameraDropdownRef}>
          <div className={`profile-avatar ${profileImage ? 'has-image' : ''}`}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-avatar-img" />
            ) : (
              personalDetails.fullName ? personalDetails.fullName.charAt(0).toUpperCase() : 'S'
            )}
          </div>
          <button className="avatar-edit-btn" aria-label="Edit Profile Picture" onClick={() => setIsCameraDropdownOpen(!isCameraDropdownOpen)}>
            <Camera size={16} />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />

          {isCameraDropdownOpen && (
            <div className="camera-dropdown-menu">
              <button className="camera-dropdown-item" onClick={openCamera}>
                <span>📷</span> Take a new photo using your camera
              </button>
              <button className="camera-dropdown-item" onClick={() => { setIsCameraDropdownOpen(false); fileInputRef.current?.click(); }}>
                <span>🖼️</span> Choose an existing photo from your gallery
              </button>
              <button className="camera-dropdown-item remove-photo" onClick={removePhoto}>
                <span>❌</span> Remove current profile picture
              </button>
            </div>
          )}
        </div>

        <div className="profile-name-container">
          <h1 className="profile-name">{personalDetails.fullName}</h1>
          <button className="name-edit-icon" onClick={handleEditClick} aria-label="Edit Name">
            <Edit2 size={20} />
          </button>
        </div>

        <div className="profile-id-box">INFY-260</div>

        <div className="profile-tags">
          <span>Joined Aug 2024</span>
        </div>
      </div>

      {/* 🔷 STATS */}
      <div className="profile-stats">
        <div className="stat-card">
          <h2>2</h2>
          <p>Courses Enrolled</p>
        </div>

        <div className="stat-card">
          <h2>3</h2>
          <p>Assessments Taken</p>
        </div>

        <div className="stat-card">
          <h2>2</h2>
          <p>Tasks Completed</p>
        </div>
      </div>

      {/* 🔷 MAIN CONTENT */}
      <div className="profile-main">

        {/* LEFT MENU */}
        <div className="profile-menu">
          <div
            className={open === "personal" ? "menu-item active" : "menu-item"}
            onClick={() => setOpen("personal")}
          >
            Personal Details
          </div>

          <div
            className={open === "academic" ? "menu-item active" : "menu-item"}
            onClick={() => setOpen("academic")}
          >
            Academic Details
          </div>

          <div
            className={open === "courses" ? "menu-item active" : "menu-item"}
            onClick={() => setOpen("courses")}
          >
            Courses Learned
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="profile-content">

          {/* PERSONAL */}
          {open === "personal" && (
            <div className="content-card" ref={editSectionRef}>
              <div className="content-header">
                <h3>Personal Details</h3>
                {isEditing ? (
                  <button onClick={handleSave} className="save-btn">Save</button>
                ) : (
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
              </div>

              <div className="content-grid">
                <div>
                  <label>Full Name</label>
                  {isEditing ? <input type="text" name="fullName" value={personalDetails.fullName} onChange={handleInputChange} className="profile-input" /> : <p>{personalDetails.fullName}</p>}
                </div>
                <div>
                  <label>Phone</label>
                  {isEditing ? <input type="text" name="phone" value={personalDetails.phone} onChange={handleInputChange} className="profile-input" /> : <p>{personalDetails.phone}</p>}
                </div>
                <div>
                  <label>Email</label>
                  {isEditing ? <input type="email" name="email" value={personalDetails.email} onChange={handleInputChange} className="profile-input" /> : <p>{personalDetails.email}</p>}
                </div>
                <div>
                  <label>Date of Birth</label>
                  {isEditing ? <input type="text" name="dob" value={personalDetails.dob} onChange={handleInputChange} className="profile-input" /> : <p>{personalDetails.dob}</p>}
                </div>
                <div>
                  <label>Gender</label>
                  {isEditing ? (
                    <select name="gender" value={personalDetails.gender} onChange={handleInputChange} className="profile-input">
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p>{personalDetails.gender}</p>
                  )}
                </div>
                <div>
                  <label>Location</label>
                  {isEditing ? <input type="text" name="location" value={personalDetails.location} onChange={handleInputChange} className="profile-input" /> : <p>{personalDetails.location}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ACADEMIC */}
          {open === "academic" && (
            <div className="content-card">
              <div className="content-header">
                <h3>Academic Details</h3>
                {isEditingAcademic ? (
                  <button onClick={handleAcademicSave} className="save-btn">Save</button>
                ) : (
                  <button onClick={() => setIsEditingAcademic(true)}>Edit</button>
                )}
              </div>

              <div className="content-grid">
                <div>
                  <label>Degree</label>
                  {isEditingAcademic ? <input type="text" name="degree" value={academicDetails.degree} onChange={handleAcademicChange} className="profile-input" /> : <p>{academicDetails.degree}</p>}
                </div>
                <div>
                  <label>Branch</label>
                  {isEditingAcademic ? <input type="text" name="branch" value={academicDetails.branch} onChange={handleAcademicChange} className="profile-input" /> : <p>{academicDetails.branch}</p>}
                </div>
                <div>
                  <label>College</label>
                  {isEditingAcademic ? <input type="text" name="college" value={academicDetails.college} onChange={handleAcademicChange} className="profile-input" /> : <p>{academicDetails.college}</p>}
                </div>
                <div>
                  <label>Passout Year</label>
                  {isEditingAcademic ? <input type="text" name="passOutYear" value={academicDetails.passOutYear} onChange={handleAcademicChange} className="profile-input" /> : <p>{academicDetails.passOutYear}</p>}
                </div>
                <div>
                  <label>CGPA</label>
                  {isEditingAcademic ? <input type="text" name="cgpa" value={academicDetails.cgpa} onChange={handleAcademicChange} className="profile-input" /> : <p>{academicDetails.cgpa}</p>}
                </div>
              </div>
            </div>
          )}

          {/* COURSES */}
          {open === "courses" && (
            <div className="content-card">
              <div className="content-header">
                <h3>Courses Learned</h3>
                <button>View</button>
              </div>

              <div className="course-list">
                <div className="course-item">
                  <p>Web Development</p>
                  <span>8 Lessons • 3h</span>
                </div>
                <div className="course-item">
                  <p>React JS</p>
                  <span>10 Lessons • 5h</span>
                </div>
                <div className="course-item">
                  <p>JavaScript</p>
                  <span>6 Lessons • 2h</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 📷 CAMERA MODAL */}
      {isCameraModalOpen && (
        <div className="camera-modal-overlay" onClick={closeCamera}>
          <div className="camera-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="camera-modal-header">
              <h3>Take a Profile Photo</h3>
              <button className="camera-modal-close" onClick={closeCamera}>
                <X size={20} />
              </button>
            </div>

            <div className="camera-viewfinder">
              {!capturedImage ? (
                <video ref={videoRef} autoPlay playsInline muted />
              ) : (
                <img src={capturedImage} alt="Captured preview" />
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="camera-modal-actions">
              {!capturedImage ? (
                <button className="camera-action-btn capture" onClick={capturePhoto}>
                  <Camera size={18} /> Capture Photo
                </button>
              ) : (
                <>
                  <button className="camera-action-btn retake" onClick={() => setCapturedImage(null)}>
                    Retake
                  </button>
                  <button className="camera-action-btn save" onClick={saveCapturedPhoto}>
                    Save Photo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;