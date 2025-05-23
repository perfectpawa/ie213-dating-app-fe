'use client'
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';


interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading } = useAuth();
  const { user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && !user.completeProfile){
    return <Navigate to="/complete-profile" />;
  }


  return <>{children}</>;
};

export default ProtectedRoute; 