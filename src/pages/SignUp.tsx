import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: number, message: string } => {
    if (!password) return { strength: 0, message: "Vui lòng nhập mật khẩu" };
    if (password.length < 8) return { strength: 1, message: "Mật khẩu yếu" };
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars]
      .filter(Boolean).length;
      
    if (strength <= 2) return { strength: 2, message: "Mật khẩu trung bình" };
    if (strength === 3) return { strength: 3, message: "Mật khẩu khá mạnh" };
    return { strength: 4, message: "Mật khẩu mạnh" };
  };

  const passwordCheck = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    
    if (passwordCheck.strength < 2) {
      setError('Mật khẩu không đủ mạnh');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('Bạn cần đồng ý với điều khoản sử dụng');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Replace with actual registration logic
      navigate('/onboarding');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Particles background */}
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={{
                fpsLimit: 60,
                particles: {
                  color: {
                    value: "#4edcd8"
                  },
                  links: {
                    color: "#4edcd8",
                    distance: 150,
                    enable: true,
                    opacity: 0.3,
                    width: 1
                  },
                  move: {
                    enable: true,
                    outModes: {
                      default: "bounce"
                    },
                    random: true,
                    speed: 1,
                    straight: false
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800
                    },
                    value: 40
                  },
                  opacity: {
                    value: 0.5
                  },
                  shape: {
                    type: "circle"
                  },
                  size: {
                    value: { min: 1, max: 3 }
                  }
                },
                detectRetina: true
              }}
              className="absolute inset-0 z-0"
            />

      {/* Sign up form container with higher z-index */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-5 mt-2">
          <h1 className="text-4xl font-bold text-white mb-2">Đăng Ký</h1>
          <p className="text-gray-400">Tạo tài khoản mới</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-left text-sm font-medium text-gray-300 mb-1">Tên hiển thị</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Tên của bạn"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-left text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="••••••••"
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
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{passwordCheck.message}</span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((segment) => (
                    <div 
                      key={segment}
                      className={`h-1.5 flex-1 rounded-full ${
                        passwordCheck.strength >= segment 
                          ? segment <= 1 ? "bg-red-500" 
                            : segment <= 2 ? "bg-yellow-500" 
                            : segment <= 3 ? "bg-green-400" 
                            : "bg-green-500"
                          : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-left text-sm font-medium text-gray-300 mb-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                // autoComplete="new-password"
                // autoCapitalize="current-password"      
                // spellCheck="false"
                className={`w-full bg-gray-800 border ${
                  formData.confirmPassword 
                    ? passwordsMatch ? "border-green-500" : "border-red-500" 
                    : "border-gray-700"
                } text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                placeholder="••••••••"
                required
              />
              {/* Show validation icon only if there's content in the field */}
              {formData.confirmPassword && (
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {passwordsMatch 
                    ? <CheckCircle2 size={20} className="text-green-500" /> 
                    : <AlertCircle size={20} className="text-red-500" />
                  }
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center pt-2">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-teal-500 focus:ring-teal-500"
              required
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-400">
              Tôi đồng ý với <button className="text-teal-400 hover:text-teal-300 cursor-pointer">Điều khoản</button> và <button className="text-teal-400 hover:text-teal-300 cursor-pointer">Chính sách bảo mật</button>
            </label>
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
            ) : "Đăng Ký"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Đã có tài khoản?{" "}
            <Link 
            to="/signin" 
            className="font-medium text-teal-400 hover:text-teal-300"
            onClick={(e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.classList.add("opacity-50");
                setTimeout(() => {
                window.location.href = "/Signin";
                }, 500);
              }}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;