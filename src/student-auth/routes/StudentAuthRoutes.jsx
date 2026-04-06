import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOtp from '../pages/VerifyOtp';
import ResetPassword from '../pages/ResetPassword';

const StudentAuthRoutes = () => {
  return (
    <Routes>
      <Route path="login"           element={<Login />} />
      <Route path="signup"          element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verify-otp"      element={<VerifyOtp />} />
      <Route path="reset-password"  element={<ResetPassword />} />
      {/* Redirect /student to /student/login */}
      <Route path="" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default StudentAuthRoutes;
