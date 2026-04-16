import React, { useState, useEffect } from "react";
import { Edit2, Mail, Phone, User, Calendar } from 'lucide-react';
import { useLocation } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const location = useLocation();

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser") || "{}")
  );
  const [open, setOpen] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'true') {
      setIsEditing(true);
      setOpen("personal");
    }
  }, [location]);

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
        <div className="profile-avatar">{personalDetails.fullName ? personalDetails.fullName.charAt(0).toUpperCase() : 'S'}</div>

        <h1 className="profile-name">{personalDetails.fullName}</h1>

        <div className="profile-id-box">INFY-2024-0892</div>

        <div className="profile-tags">
          <span>Web Development</span>
          <span>Joined Aug 2024</span>
        </div>
      </div>

      {/* 🔷 STATS */}
      <div className="profile-stats">
        <div className="stat-card">
          <h2>10</h2>
          <p>Courses Enrolled</p>
        </div>

        <div className="stat-card">
          <h2>45</h2>
          <p>Assessments Taken</p>
        </div>

        <div className="stat-card">
          <h2>25</h2>
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
            <div className="content-card">
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

    </div>
  );
};

export default Profile;