import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, BookOpen, User } from 'lucide-react';
import './VideoCourses.css';

const VideoPlayerPage = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { lessonTitle, courseTitle, description } = location.state || { 
        lessonTitle: "Lesson Video", 
        courseTitle: "Course Video",
        description: "In this lesson, we cover the core concepts and practical implementations to help you build a solid foundation."
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Placeholder video - using the same sample as before or a generic one
    const videoUrl = "https://www.youtube.com/embed/mAtkpqV1drE";

    return (
        <div className="ct-viewport" style={{ background: '#f8fafc' }}>
            <div className="vc-centered-container">
                <motion.button 
                    className="ct-back-btn" 
                    onClick={() => navigate(-1)}
                    whileHover={{ x: -5 }}
                    style={{ marginBottom: '20px' }}
                >
                    <ArrowLeft size={18} /> Back to Curriculum
                </motion.button>

                <div className="vc-video-player-section">
                    <motion.div 
                        className="vc-main-player-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="vc-player-wrapper">
                            <iframe 
                                src={videoUrl} 
                                title="Video Player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="vc-player-details">
                            <span className="ct-category-tag" style={{ marginBottom: '10px' }}>Now Playing</span>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '10px' }}>{lessonId.toUpperCase().replace('-', ' ')}: {lessonTitle}</h1>
                            <div className="vc-player-meta">
                                <span><User size={14} /> Master Instructor</span>
                                <span><Clock size={14} /> 15 mins</span>
                                <span><BookOpen size={14} /> {courseTitle}</span>
                            </div>
                            
                            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
                            
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>About this Lesson</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '15px' }}>
                                {description}
                            </p>

                            <div style={{ marginTop: '30px', padding: '20px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ background: '#2563eb', color: 'white', padding: '10px', borderRadius: '10px' }}>
                                    <Play size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: '#1e40af' }}>Next Lesson: Advanced Concepts</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#3b82f6' }}>Coming up next in this series</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
