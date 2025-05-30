import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AtSign, Lock } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'google_auth_failed') {
      setError('Không thể đăng nhập bằng Google. Vui lòng thử lại hoặc sử dụng email.');
    } else if (errorParam === 'email_already_registered') {
      setError('Email này đã được đăng ký bằng tài khoản thường. Vui lòng đăng nhập bằng email và mật khẩu.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    authApi.initiateGoogleAuth();
  };

  return (
    <AuthLayout>
      <div className="text-center mb-5 mt-2">
        <h1 className="text-4xl font-bold text-white mb-2">Đăng Nhập</h1>
        <p className="text-gray-400">Chào mừng trở lại!</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-left text-sm font-medium text-gray-300 mb-1">Email</label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              placeholder="Nhập email của bạn"
              required
            />
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-left text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-400">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link 
            to="/forgot-password" 
            className="text-sm text-teal-400 hover:text-teal-300"
          >
            Quên mật khẩu?
          </Link>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-teal-400 to-teal-500 text-black font-bold py-3 px-4 rounded-lg hover:from-teal-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          ) : "Đăng Nhập"}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Hoặc</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Đăng nhập với Google
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-400">
          Chưa có tài khoản?{" "}
          <Link 
            to="/signup" 
            className="font-medium text-teal-400 hover:text-teal-300"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;