import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated, redirect to home or complete profile
  if (user) {
    return <Navigate to={user.completeProfile ? "/home" : "/complete-profile"} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 