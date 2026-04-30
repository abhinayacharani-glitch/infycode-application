import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';
import './StudentConnect.css';

const courseImages = {
  "Full Stack Web Development (MERN)": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  "Python & Data Science Bootcamp": "https://daxg39y63pxwu.cloudfront.net/images/blog/python-for-data-science/Python_for_Data_Science.png",
  "UI/UX Advanced Design Basics": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk_Flhj2QvBQmdsP1Z9Sh0AndFgQ5GnOBuOw&s",
  "AWS & Cloud Architecture Pro": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_oWkWTKL2p1IS6YePJdEC_yfVuW71T4ypwA&s",
  "Java Full Stack": "https://nearlearn.com/public/images/java.jpg",
  "Python Fullstack Bootcamp": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCX8Te4g44b9u8JR5X4KUqpDwUWkwgqFcA0Q&s",
  "Cloud Computing Mastery": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXFtm4KBMFCjyW69endBqelpOkz38qAX8zVA&s",
  "Gen AI": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgRF0qx-Zn9j57Ej7sLvyDit7iERu4yvRItg&s",
  "Default": "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
};

const cardColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#6366f1', '#f43f5e', '#06b6d4', '#f97316'];

const StudentConnect = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('trainer_batches_v2');
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data)) {
          setBatches(data);
        }
      } else {
        // Fallback to same defaults as Batches.jsx if no local storage
        const defaults = [
          { id: 'B1', course: 'Full Stack Web Development (MERN)', students: 32 },
          { id: 'B2', course: 'Python & Data Science Bootcamp', students: 28 },
          { id: 'B3', course: 'UI/UX Advanced Design Basics', students: 24 },
          { id: 'B4', course: 'AWS & Cloud Architecture Pro', students: 18 },
          { id: 'B5', course: 'Java Full Stack', students: 20 },
          { id: 'B6', course: 'Python Fullstack Bootcamp', students: 25 },
          { id: 'B7', course: 'Cloud Computing Mastery', students: 15 },
        ];
        setBatches(defaults);
      }
    } catch (e) {
      console.error("Data Load Error in StudentConnect", e);
    }
  }, []);

  const getCourseImage = (courseName) => {
    return courseImages[courseName] || courseImages.Default;
  };

  return (
    <div className="sc-container animate-fade-in">
      <div className="sc-header">
        <h1 className="sc-title">Student Connect</h1>
        <p className="sc-subtitle">Select a batch to manage student queries and interactions.</p>
      </div>

      <div className="sc-batch-grid">
        {batches.map((batch, index) => {
          const accentColor = cardColors[index % cardColors.length];
          const courseImage = getCourseImage(batch.course);

          return (
            <div
              key={batch.id}
              className="sc-batch-card"
              onClick={() => navigate(`/trainer-dashboard/student-connect/${batch.id}`)}
              style={{ '--accent-color': accentColor }}
            >
              <div className="sc-image-container">
                <img src={courseImage} alt={batch.course} className="sc-card-image" />
                <div className="sc-image-overlay"></div>
              </div>

              <div className="sc-card-body">
                <h3 className="sc-batch-name">Batch {index + 1}</h3>
                <p className="sc-course-name">{batch.course}</p>

                <div className="sc-batch-info">
                  <div className="sc-info-item">
                    <Users size={16} />
                    <span>{batch.students} Students</span>
                  </div>
                </div>

                <button className="sc-view-btn">
                  <span>View Queries</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentConnect;
