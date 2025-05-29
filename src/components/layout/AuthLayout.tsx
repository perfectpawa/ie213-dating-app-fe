import React from 'react';
import ParticlesBackground from './ParticlesBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <ParticlesBackground />
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout; 