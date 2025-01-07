import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, children }) => {
  const token = localStorage.getItem('authToken');

  if (!isLoggedIn || !token) {
    return <Navigate to="/" replace />; // Redirect to the login page
  }

  return <>{children}</>;
};

export default ProtectedRoute;