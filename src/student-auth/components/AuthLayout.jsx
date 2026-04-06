import React from 'react';
import '../styles/authComponents.css';
import AuthLeftPanel from './AuthLeftPanel';

/**
 * AuthLayout — Full-page wrapper + card shell
 * Props:
 *   panelHeading  – heading shown in the left blue panel
 *   panelText     – description shown in the left blue panel
 *   panelBtnText  – button label on the left panel
 *   panelBtnClick – onClick handler for the left panel button
 *   children      – the right-side form (AuthFormCard)
 */
const AuthLayout = ({
  panelHeading  = 'Welcome Back!',
  panelText     = 'Enter your personal details to use all site features.',
  panelBtnText,
  panelBtnClick,
  children,
}) => (
  <div className="sa-wrapper">
    <div className="sa-card">
      <AuthLeftPanel
        heading={panelHeading}
        subText={panelText}
        buttonText={panelBtnText}
        onButtonClick={panelBtnClick}
      />
      {children}
    </div>
  </div>
);

export default AuthLayout;
