import React from 'react';

/**
 * AuthLeftPanel — Blue curved panel on the LEFT
 * Mirrors the Login signup state (blue toggle on left with blob radius)
 */
const AuthLeftPanel = ({ heading = 'Welcome Back!', subText, buttonText, onButtonClick }) => (
  <div className="sa-panel-container">
    <div className="sa-panel-bg">
      <div className="sa-panel-content">
        <h1 className="sa-panel-heading">{heading}</h1>
        {subText && <p className="sa-panel-sub">{subText}</p>}
      </div>
    </div>
  </div>
);

export default AuthLeftPanel;
