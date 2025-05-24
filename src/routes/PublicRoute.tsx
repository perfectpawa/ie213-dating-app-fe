import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user?.isVerified) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 