import { Navigate, useLocation } from 'react-router-dom';

import React from 'react';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is logged in using auth_token
  const authToken = localStorage.getItem('auth_token');
  
  if (!authToken) {
    // Show toast notification and redirect to login
    toast.error('Please login to access this page');
    
    // Redirect to login page with the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;