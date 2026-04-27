import React from 'react';
import { MessageSquare } from 'lucide-react';
import './Feedback.css';

const Feedback = () => {
  return (
    <div className="fb-dashboard-v7 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="fb-top-header-v7">
        <h1 className="fb-main-title-v7">Student Connect</h1>
        <p className="fb-main-subtitle-v7">Student interactions and feedback will appear here.</p>
      </div>

      <div className="fb-tab-content-v7">
        <div className="fb-empty-state-container">
          <div className="fb-empty-icon-wrap">
            <MessageSquare size={48} strokeWidth={1.5} />
          </div>
          <h2 className="fb-empty-title">No Interactions Yet</h2>
          <p className="fb-empty-text">
            When students reach out or provide feedback, you'll see it here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
