import React, { useState, useEffect, useRef } from "react";
import { Edit2, Mail, Phone, MapPin, Award, BookOpen, CheckCircle, GraduationCap, Camera, User } from 'lucide-react';
import { useLocation } from "react-router-dom";
import "./Profile.css";
import { getStudentProfile, updateStudentProfile, getEnrolledCourses, getMyResults } from "../../../services/api";

const Profile = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [open, setOpen] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  const [personal, setPersonal] = useState({
    fullName: "", phone: "", email: "", dob: "", gender: "", location: "", profileImage: null
  });

  const [academic, setAcademic] = useState({
    degree: "", branch: "", college: "", passOutYear: "", cgpa: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAll();
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'true') { setIsEditing(true); setOpen("personal"); }
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const pRes = await getStudentProfile();
      if (pRes.success && pRes.profile) {
        const p = pRes.profile;
        const storedUser = JSON.parse(localStorage.getItem('loggedUser') || localStorage.getItem('user') || '{}');
        setProfileData(p);
        setPersonal({
          fullName: p.fullName || p.fullname || storedUser.fullName || storedUser.fullname || "",
          phone: p.phone || storedUser.phone || "",
          email: p.email || storedUser.email || "",
          dob: p.dob || "",
          gender: p.gender || "",
          location: p.location || "",
          profileImage: p.profileImage || null
        });
        setAcademic({ degree: p.degree || "", branch: p.branch || "", college: p.college || "", passOutYear: p.passOutYear || "", cgpa: p.cgpa || "" });
      }

      // Fetch enrolled courses (Synced with Courses.jsx logic)
      const cRes = await getEnrolledCourses();
      const enrolledIds = Array.isArray(cRes) ? cRes : (cRes.enrolledCourses || []);

      try {
        const { COURSE_MAP } = await import('./data/extraCourses');
        const { ALL_COURSES } = await import('../../../components/Courses/Courses');

        const enrolled = [];
        const seenTitles = new Set();

        enrolledIds.forEach(id => {
          let course = null;
          if (COURSE_MAP[id]) {
            course = COURSE_MAP[id];
          } else {
            const matchedAllCourse = ALL_COURSES.find(c => c.courseId === id);
            if (matchedAllCourse) {
              course = Object.values(COURSE_MAP).find(c => c.title === matchedAllCourse.title);
            }
          }

          if (course && !seenTitles.has(course.title)) {
            enrolled.push(course);
            seenTitles.add(course.title);
          }
        });

        setEnrolledCourses(enrolled);
      } catch (err) {
        console.error("Failed to sync course data:", err);
        setEnrolledCourses([]);
      }

      // Fetch test results
      const tRes = await getMyResults();
      if (tRes.success) setTestResults(tRes.testResults || {});
    } catch (err) { console.error("Profile fetch error:", err); }
    finally { setLoading(false); }
  };

  const dispatchSync = () => {
    window.dispatchEvent(new Event('profileUpdate'));
    const stored = JSON.parse(localStorage.getItem('loggedUser') || localStorage.getItem('user') || '{}');
    const updated = { ...stored, ...personal, fullName: personal.fullName, username: personal.fullName };
    localStorage.setItem('loggedUser', JSON.stringify(updated));
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const b64 = reader.result;
      setPersonal(prev => ({ ...prev, profileImage: b64 }));
      try { await updateStudentProfile({ profileImage: b64 }); dispatchSync(); } catch (err) { console.error(err); }
    };
    reader.readAsDataURL(file);
  };

  const validatePersonal = () => {
    const newErrors = {};
    if (!personal.fullName.trim()) newErrors.fullName = "Name is required";
    if (personal.phone && !/^\d{10}$/.test(personal.phone.replace(/[\s-]/g, '')))
      newErrors.phone = "Enter a valid 10-digit phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePersonal = async () => {
    if (!validatePersonal()) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }
    try {
      setSaveStatus('saving');
      const res = await updateStudentProfile(personal);
      if (res.success) {
        setSaveStatus('saved');
        setIsEditing(false);
        dispatchSync();
      } else {
        throw new Error(res.message || "Failed to update");
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  const handleSaveAcademic = async () => {
    try {
      setSaveStatus('saving');
      const res = await updateStudentProfile(academic);
      if (res.success) {
        setSaveStatus('saved');
        setIsEditingAcademic(false);
      } else {
        throw new Error(res.message || "Failed to update");
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  // Calculate profile completion %
  const profileFields = [personal.fullName, personal.phone, personal.email, personal.dob, personal.gender, personal.location, personal.profileImage, academic.degree, academic.branch, academic.college];
  const filled = profileFields.filter(f => f && f !== "").length;
  const completion = Math.round((filled / profileFields.length) * 100);

  // Calculate real-time stats with professional logic
  const foundationalPassed = testResults?.foundationalCompleted ? 1 : 0;
  const corePassed = testResults?.coreCompleted ? 1 : 0;
  const assessmentsCount = foundationalPassed + corePassed;

  // Only count projects that are 100% complete across all modules
  const completedProjects = enrolledCourses.filter(c => {
    // Check dynamic localStorage progress first
    const saved = localStorage.getItem(`course_progress_${c.id}`);
    if (saved) {
      const completedSet = new Set(JSON.parse(saved));
      // Estimate 100% if the set is populated (more logic can be added if needed)
      // For now, if the course object itself says 100 or localStorage progress is full
      return c.progress === 100 || completedSet.size > 10;
    }
    return c.progress === 100;
  }).length;

  if (loading) return (
    <div className="profile-page">
      <div className="skeleton-hero"></div>
      <div className="skeleton-stats">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-menu"></div>
        <div className="skeleton-content"></div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      {/* ── SUCCESS TOAST ── */}
      {saveStatus === 'saved' && (
        <div className="profile-toast success">
          <CheckCircle size={18} />
          <span>Profile updated successfully!</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="profile-toast error">
          <span>Failed to update profile. Please try again.</span>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div className="profile-hero-banner">
        <div className="hero-left">
          {/* Avatar */}
          <div className="hero-avatar-wrap">
            {personal.profileImage ? (
              <img src={personal.profileImage} alt="avatar" className="hero-avatar-img" />
            ) : (
              <div className="hero-avatar-initials">{personal.fullName.charAt(0) || 'S'}</div>
            )}
            <button className="hero-camera-btn" onClick={() => fileInputRef.current.click()} title="Change photo">
              <Camera size={14} />
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>

          {/* Name + Meta */}
          <div className="hero-info">
            <div className="hero-name-row">
              <h1 className="hero-name">{personal.fullName || "Student"}</h1>
              {profileData?.studentId && (
                <span className="hero-id-badge">INFY-{profileData.studentId}</span>
              )}
            </div>
            <div className="hero-meta-row">
              {personal.email && <span><Mail size={14} />{personal.email}</span>}
              {personal.location && <span><MapPin size={14} />{personal.location}</span>}
              {personal.phone && <span><Phone size={14} />{personal.phone}</span>}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="hero-completion">
          <div className="completion-label-row">
            <span>Profile Completion</span>
            <span className="completion-pct">{completion}%</span>
          </div>
          <div className="completion-bar-track">
            <div className="completion-bar-fill" style={{ width: `${completion}%` }}></div>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="profile-stats-row">
        <div className="pstat-card">
          <div className="pstat-icon blue"><BookOpen size={22} /></div>
          <div className="pstat-body">
            <div className="pstat-num">{enrolledCourses.length}</div>
            <div className="pstat-label">Courses Enrolled</div>
          </div>
        </div>
        <div className="pstat-card">
          <div className="pstat-icon green"><CheckCircle size={22} /></div>
          <div className="pstat-body">
            <div className="pstat-num">{assessmentsCount}</div>
            <div className="pstat-label">Skills Verified</div>
          </div>
        </div>
        <div className="pstat-card">
          <div className="pstat-icon purple"><Award size={22} /></div>
          <div className="pstat-body">
            <div className="pstat-num">{completedProjects}</div>
            <div className="pstat-label">Projects Done</div>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="profile-body">

        {/* LEFT MENU */}
        <div className="profile-sidemenu">
          <button className={`ps-menu-item ${open === 'personal' ? 'active' : ''}`} onClick={() => setOpen('personal')}>
            <User size={16} /> Personal Info
          </button>
          <button className={`ps-menu-item ${open === 'academic' ? 'active' : ''}`} onClick={() => setOpen('academic')}>
            <GraduationCap size={16} /> Academic Details
          </button>
          <button className={`ps-menu-item ${open === 'courses' ? 'active' : ''}`} onClick={() => setOpen('courses')}>
            <BookOpen size={16} /> My Courses
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="profile-content-panel">

          {/* ── PERSONAL INFO ── */}
          {open === 'personal' && (
            <div className="pc-card">
              <div className="pc-card-header">
                <h2><User size={20} /> Personal Information</h2>
                {isEditing ? (
                  <div className="pc-btn-group">
                    <button className="pc-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className="pc-btn-save" onClick={handleSavePersonal}>
                      {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <button className="pc-btn-edit" onClick={() => setIsEditing(true)}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>

              <div className="pc-fields-grid">
                <div className="pc-field pc-read-only">
                  <label>FULL NAME</label>
                  <p>{personal.fullName || '—'}</p>
                </div>
                <div className="pc-field pc-read-only">
                  <label>EMAIL (PRIMARY)</label>
                  <p className="pc-email-text">{personal.email || '—'}</p>
                </div>
                <div className="pc-field">
                  <label>PHONE</label>
                  {isEditing
                    ? (
                      <>
                        <input className={`pc-input ${errors.phone ? 'input-error' : ''}`} value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} />
                        {errors.phone && <span className="pc-error-text">{errors.phone}</span>}
                      </>
                    )
                    : <p>{personal.phone || '—'}</p>}
                </div>
                <div className="pc-field">
                  <label>DATE OF BIRTH</label>
                  {isEditing
                    ? <input className="pc-input" type="date" value={personal.dob} onChange={e => setPersonal({ ...personal, dob: e.target.value })} />
                    : <p>{personal.dob || '—'}</p>}
                </div>
                <div className="pc-field">
                  <label>LOCATION</label>
                  {isEditing
                    ? <input className="pc-input" value={personal.location} onChange={e => setPersonal({ ...personal, location: e.target.value })} />
                    : <p>{personal.location || '—'}</p>}
                </div>
                <div className="pc-field">
                  <label>GENDER</label>
                  {isEditing ? (
                    <select className="pc-input" value={personal.gender} onChange={e => setPersonal({ ...personal, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : <p>{personal.gender || '—'}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── ACADEMIC ── */}
          {open === 'academic' && (
            <div className="pc-card">
              <div className="pc-card-header">
                <h2><GraduationCap size={20} /> Academic Details</h2>
                {isEditingAcademic ? (
                  <div className="pc-btn-group">
                    <button className="pc-btn-cancel" onClick={() => setIsEditingAcademic(false)}>Cancel</button>
                    <button className="pc-btn-save" onClick={handleSaveAcademic}>Save</button>
                  </div>
                ) : (
                  <button className="pc-btn-edit" onClick={() => setIsEditingAcademic(true)}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>

              <div className="pc-fields-grid">
                <div className="pc-field">
                  <label>DEGREE</label>
                  {isEditingAcademic ? <input className="pc-input" value={academic.degree} onChange={e => setAcademic({ ...academic, degree: e.target.value })} /> : <p>{academic.degree || '—'}</p>}
                </div>
                <div className="pc-field">
                  <label>BRANCH / MAJOR</label>
                  {isEditingAcademic ? <input className="pc-input" value={academic.branch} onChange={e => setAcademic({ ...academic, branch: e.target.value })} /> : <p>{academic.branch || '—'}</p>}
                </div>
                <div className="pc-field">
                  <label>COLLEGE / UNIVERSITY</label>
                  {isEditingAcademic ? <input className="pc-input" value={academic.college} onChange={e => setAcademic({ ...academic, college: e.target.value })} /> : <p>{academic.college || '—'}</p>}
                </div>
                <div className="pc-field">
                  <label>PASSOUT YEAR</label>
                  {isEditingAcademic ? <input className="pc-input" value={academic.passOutYear} onChange={e => setAcademic({ ...academic, passOutYear: e.target.value })} /> : <p>{academic.passOutYear || '—'}</p>}
                </div>
                <div className="pc-field">
                  <label>CGPA / PERCENTAGE</label>
                  {isEditingAcademic ? <input className="pc-input" value={academic.cgpa} onChange={e => setAcademic({ ...academic, cgpa: e.target.value })} /> : <p>{academic.cgpa || '—'}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── MY COURSES ── */}
          {open === 'courses' && (
            <div className="pc-card">
              <div className="pc-card-header">
                <h2><BookOpen size={20} /> My Courses</h2>
              </div>
              {enrolledCourses.length > 0 ? (
                <div className="pc-course-list">
                  {enrolledCourses.map(c => (
                    <div key={c.id} className="pc-course-row">
                      <div>
                        <p className="pc-course-title">{c.title}</p>
                        <span className="pc-course-sub">{c.level || 'Professional Level'}</span>
                      </div>
                      <span className={`pc-status ${c.progress === 100 ? 'done' : 'ongoing'}`}>
                        {c.progress === 100 ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pc-empty">
                  <BookOpen size={40} style={{ opacity: 0.3 }} />
                  <p>No courses enrolled yet.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;