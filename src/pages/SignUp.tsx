import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import ParticlesBackground from '../components/layout/ParticlesBackground';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();

  const passwordRequirements = [
    { text: "Ít nhất 8 ký tự", met: formData.password.length >= 8 },
    { text: "Ít nhất 1 chữ hoa (A-Z)", met: /[A-Z]/.test(formData.password) },
    { text: "Ít nhất 1 chữ thường (a-z)", met: /[a-z]/.test(formData.password) },
    { text: "Ít nhất 1 số (0-9)", met: /\d/.test(formData.password) },
    { text: "Ít nhất 1 ký tự đặc biệt (!@#$...)", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: false
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    let isValid = true;
    
    if (!formData.email) {
      errors.email = true;
      isValid = false;
    }
    
    if (!formData.username) {
      errors.username = true;
      isValid = false;
    }
    
    if (!formData.password) {
      errors.password = true;
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = true;
      isValid = false;
    }
    
    if (!formData.agreeTerms) {
      errors.agreeTerms = true;
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First validate form
    if (!validateForm()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      setValidationErrors({
        ...validationErrors,
        confirmPassword: true
      });
      return;
    }
    
    if (passwordCheck.strength < 2) {
      setError('Mật khẩu không đủ mạnh');
      setValidationErrors({
        ...validationErrors,
        password: true
      });
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('Bạn cần đồng ý với điều khoản sử dụng');
      setValidationErrors({
        ...validationErrors,
        agreeTerms: true
      });
      return;
    }
    
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      navigate('/onboarding');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <ParticlesBackground />
      {/* SignUp form container */}
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
              className={`w-full bg-gray-800 border ${validationErrors.email ? 'border-red-500 animate-shake' : 'border-gray-700'} text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
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
              className={`w-full bg-gray-800 border ${validationErrors.username ? 'border-red-500 animate-shake' : 'border-gray-700'} text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
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
                className={`w-full bg-gray-800 border ${validationErrors.password ? 'border-red-500 animate-shake' : 'border-gray-700'} text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                placeholder="••••••••"
                autoComplete="new-password"
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
            
            {/* Password requirements list */}
            {formData.password && (
              <div className="mt-2 p-3 bg-gray-800 rounded-md">
                <p className="text-xs text-gray-300 mb-2">Mật khẩu phải có:</p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <li 
                      key={index} 
                      className={`text-xs flex items-center ${req.met ? 'text-green-400' : 'text-gray-400'}`}
                    >
                      {req.met ? (
                        <CheckCircle2 size={12} className="mr-1.5" />
                      ) : (
                        <span className="w-3 h-3 mr-1.5 inline-block border border-gray-400 rounded-full" />
                      )}
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-left text-sm font-medium text-gray-300 mb-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={`w-full bg-gray-800 border ${
                  validationErrors.confirmPassword ? 'border-red-500 animate-shake' :
                  formData.confirmPassword 
                    ? passwordsMatch ? "border-green-500" : "border-red-500" 
                    : "border-gray-700"
                } text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                placeholder="••••••••"
                required
              />
              {/* Show eye icon for confirm password */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute inset-y-0 ${formData.confirmPassword ? 'right-8' : 'right-0'} pr-3 flex items-center text-gray-400 hover:text-white`}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              
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
              className={`h-4 w-4 rounded bg-gray-800 border-gray-700 ${validationErrors.agreeTerms ? 'ring-2 ring-red-500' : ''} text-teal-500 focus:ring-teal-500`}
              required
            />
            <label htmlFor="agreeTerms" className={`ml-2 block text-sm ${validationErrors.agreeTerms ? 'text-red-300' : 'text-gray-400'}`}>
              Tôi đồng ý với <button type="button" className="text-teal-400 hover:text-teal-300 cursor-pointer">Điều khoản</button> và <button type="button" className="text-teal-400 hover:text-teal-300 cursor-pointer">Chính sách bảo mật</button>
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
              }}
            >
              Đăng nhập
            </Link>
          </p>
          <p className="text-gray-400 mt-2">
            <Link 
              to="/forgot-password" 
              className="font-medium text-gray-500 hover:text-gray-400"
              onClick={(e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.classList.add("opacity-50");
                setTimeout(() => {
                  window.location.href = "/forgot-password";
                }, 500);
              }}
            >
              Quên mật khẩu?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;