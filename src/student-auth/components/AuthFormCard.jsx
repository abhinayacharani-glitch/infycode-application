import React from 'react';

/**
 * AuthFormCard — White right-side form panel
 * Children: heading, sub-text, and the form itself
 */
const AuthFormCard = ({ children }) => (
  <div className="sa-form-side">
    {children}
  </div>
);

export default AuthFormCard;
