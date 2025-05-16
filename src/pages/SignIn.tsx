import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AtSign, Lock } from 'lucide-react';
import ParticlesBackground from '../components/layout/ParticlesBackground';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (email === 'admin123@gmail.com' && password === 'admin123') {
        navigate('/home');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <ParticlesBackground />
      {/* Login form container */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Đăng Nhập</h1>
          <p className="text-gray-400">Chào mừng trở lại!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-base font-medium text-gray-300 mb-1">Email:</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Nhập email của bạn"
                required
              />
              <AtSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-left text-base font-medium text-gray-300 mb-1">Mật khẩu:</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />  
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-teal-500 focus:ring-teal-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-teal-400 hover:text-teal-300">
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 text-black font-bold py-3 px-4 rounded-lg hover:from-teal-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : "Đăng Nhập"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Chưa có tài khoản?{" "}
            <Link 
            to="/signup" 
            className="font-medium text-teal-400 hover:text-teal-300" 
            onClick={(e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.classList.add("opacity-50");
                setTimeout(() => {
                window.location.href = "/Signup";
                }, 50);
              }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;