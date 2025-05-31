'use client'
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!user.completeProfile) {
    if (location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" replace />;
    }
    return <>{children}</>;
  }

  if (!user.completeInterest) {
    if (location.pathname !== '/complete-interest') {
      return <Navigate to="/complete-interest" replace />;
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 