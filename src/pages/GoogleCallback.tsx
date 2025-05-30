import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        try {
          const { data } = await authApi.handleGoogleCallback(token);

          console.log("DATA: ",data);

          if (data?.user) {
            // login(data.user.email, token);
            updateUser(data.user);
            navigate('/home');
          }
        } catch (error) {
          console.error('Google authentication error:', error);
          navigate('/signin?error=google_auth_failed');
        }
      } else {
        navigate('/signin?error=google_auth_failed');
      }
    };

    handleCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 