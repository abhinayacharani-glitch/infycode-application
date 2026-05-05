import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, Loader2 } from 'lucide-react';
import { getTrainerBatchesAPI } from '../../../services/api';
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
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await getTrainerBatchesAPI();
        if (response.success) {
          setBatches(response.batches || []);
        }
      } catch (e) {
        console.error("Data Load Error in StudentConnect", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
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
        {loading ? (
          <div className="loading-state-sc">
             <Loader2 size={40} className="animate-spin" />
             <p>Loading your batches...</p>
          </div>
        ) : batches.length > 0 ? (
          batches.map((batch, index) => {
            const accentColor = cardColors[index % cardColors.length];
            const courseName = batch.courseName || batch.course || "General Course";
            const courseImage = getCourseImage(courseName);

            return (
              <div
                key={batch.id || index}
                className="sc-batch-card"
                onClick={() => navigate(`/trainer-dashboard/student-connect/${batch.id}`)}
                style={{ '--accent-color': accentColor }}
              >
                <div className="sc-image-container">
                  <img src={courseImage} alt={courseName} className="sc-card-image" />
                  <div className="sc-image-overlay"></div>
                </div>

                <div className="sc-card-body">
                  <h3 className="sc-batch-name">{batch.id || `Batch ${index + 1}`}</h3>
                  <p className="sc-course-name">{courseName}</p>

                  <div className="sc-batch-info">
                    <div className="sc-info-item">
                      <Users size={16} />
                      <span>{batch.enrolled || batch.students || 0} Students</span>
                    </div>
                  </div>

                  <button className="sc-view-btn">
                    <span>View Queries</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state-sc">
            <Users size={48} />
            <p>No active batches found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentConnect;
