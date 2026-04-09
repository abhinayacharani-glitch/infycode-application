import React, { useEffect } from "react";
import "./InstagramPage.css";
// Using an existing logo from the assets folder to fix the import error 
import profileLogo from "../../assets/instagram-logo.png"; 

const InstagramPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const posts = [
    { id: 1, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80", caption: "Coding the future!" },
    { id: 2, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80", caption: "Team collaboration." },
    { id: 3, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80", caption: "Our new office space." },
    { id: 4, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80", caption: "Learning never stops." },
    { id: 5, image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80", caption: "Workshop session." },
    { id: 6, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80", caption: "Project planning." },
  ];

  return (
    <div className="instagram-container">
      {/* Header Section */}
      <header className="ig-header">
        <div className="ig-profile-pic-container">
          <div className="ig-profile-pic-ring">
            <img src={profileLogo} alt="Charani Infotech Logo" className="ig-profile-pic" onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Logo"; }} />
          </div>
        </div>
        
        <div className="ig-profile-info">
          <div className="ig-profile-title">
            <h1 className="ig-username">charani_infotech</h1>
            <button className="ig-follow-btn">Follow</button>
            <button className="ig-message-btn">Message</button>
          </div>
          
          <div className="ig-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>10.5K</strong> followers</span>
            <span><strong>150</strong> following</span>
          </div>
          
          <div className="ig-bio">
            <h2 className="ig-name">Charani Infotech pvt ltd</h2>
            <p className="ig-category">Information Technology Company</p>
            <p className="ig-description">
              🚀 Empowering your future through code & innovation.<br/>
              🎓 Premium IT Training & Corporate Solutions.<br/>
              🌐 Transforming ideas into reality.
            </p>
            <a href="https://infycode.com" className="ig-link">www.infycode.com</a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="ig-tabs">
        <div className="ig-tab active">
          <i className="fa-solid fa-table-cells"></i> POSTS
        </div>
        <div className="ig-tab">
          <i className="fa-solid fa-play"></i> REELS
        </div>
        <div className="ig-tab">
          <i className="fa-regular fa-bookmark"></i> SAVED
        </div>
        <div className="ig-tab">
          <i className="fa-solid fa-user-tag"></i> TAGGED
        </div>
      </div>

      {/* Posts Grid */}
      <div className="ig-grid">
        {posts.map(post => (
          <div key={post.id} className="ig-post">
            <img src={post.image} alt={post.caption} className="ig-post-image" />
            <div className="ig-post-overlay">
              <span className="ig-overlay-item"><i className="fa-solid fa-heart"></i> {Math.floor(Math.random() * 500) + 50}</span>
              <span className="ig-overlay-item"><i className="fa-solid fa-comment"></i> {Math.floor(Math.random() * 50) + 5}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramPage;
