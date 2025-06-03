import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import ParticlesBackground from '../components/layout/ParticlesBackground';
import { authApi } from '../api/authApi';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(false);
  
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars && isLongEnough;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setValidationError(true);
      setError('Vui lòng nhập email của bạn');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError(true);
      setError('Email không hợp lệ');
      return;
    }
    
    setLoading(true);
    setError('');
    setValidationError(false);
    
    try {
      await authApi.forgotPassword(email);
      setStep('otp');
    } catch (err) {
      setError('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setValidationError(true);
      setError('Vui lòng nhập mã OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    setValidationError(false);
    
    try {
      setStep('password');
    } catch (err) {
      setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setValidationError(true);
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }
    
    if (!validatePassword(password)) {
      setValidationError(true);
      setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError(true);
      setError('Mật khẩu không khớp');
      return;
    }
    
    setLoading(true);
    setError('');
    setValidationError(false);
    
    try {
      await authApi.resetPassword(email, otp, password);
      setStep('success');
    } catch (err) {
      setError('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit} className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <label htmlFor="email" className="block text-left text-base font-medium text-gray-300 mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationError) setValidationError(false);
          }}
          className={`w-full bg-gray-800/80 border ${validationError ? 'border-red-500 animate-shake' : 'border-gray-700'} text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
          placeholder="Nhập email của bạn"
          required
        />
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
            Đang xử lý...
          </span>
        ) : "Gửi Mã Xác Thực"}
      </button>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit} className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <label htmlFor="otp" className="block text-left text-base font-medium text-gray-300 mb-1">Mã Xác Thực</label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            if (validationError) setValidationError(false);
          }}
          className={`w-full bg-gray-800/80 border ${validationError ? 'border-red-500 animate-shake' : 'border-gray-700'} text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
          placeholder="Nhập mã xác thực"
          required
        />
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
            Đang xử lý...
          </span>
        ) : "Xác Nhận Mã"}
      </button>
    </form>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handlePasswordSubmit} className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <label htmlFor="password" className="block text-left text-base font-medium text-gray-300 mb-1">Mật Khẩu Mới</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationError) setValidationError(false);
            }}
            className={`w-full bg-gray-800/80 border ${validationError ? 'border-red-500 animate-shake' : 'border-gray-700'} text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
            placeholder="Nhập mật khẩu mới"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-left text-base font-medium text-gray-300 mb-1">Xác Nhận Mật Khẩu</label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationError) setValidationError(false);
            }}
            className={`w-full bg-gray-800/80 border ${validationError ? 'border-red-500 animate-shake' : 'border-gray-700'} text-white rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
            placeholder="Nhập lại mật khẩu mới"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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
            Đang xử lý...
          </span>
        ) : "Đặt Lại Mật Khẩu"}
      </button>
    </form>
  );

  const renderSuccess = () => (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Đặt Lại Mật Khẩu Thành Công!</h2>
        <p className="text-gray-300 mb-6">
          Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
        </p>
        <Link 
          to="/signin" 
          className="block w-full bg-gradient-to-r from-teal-400 to-teal-500 text-center text-black font-bold py-3 px-4 rounded-lg hover:from-teal-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
        >
          Đăng Nhập
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quên Mật Khẩu</h1>
          <p className="text-gray-400">
            {step === 'email' && 'Nhập email của bạn để đặt lại mật khẩu'}
            {step === 'otp' && 'Nhập mã xác thực đã được gửi đến email của bạn'}
            {step === 'password' && 'Nhập mật khẩu mới của bạn'}
            {step === 'success' && 'Mật khẩu đã được đặt lại thành công'}
          </p>
        </div>

        {error && step !== 'success' && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {step === 'email' && renderEmailForm()}
        {step === 'otp' && renderOtpForm()}
        {step === 'password' && renderPasswordForm()}
        {step === 'success' && renderSuccess()}

        {step !== 'success' && (
          <div className="text-center mt-6">
            <Link 
              to="/signin" 
              className="flex items-center justify-center text-gray-400 hover:text-teal-300 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Quay lại đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;