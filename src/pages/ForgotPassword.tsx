import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import ParticlesBackground from '../components/layout/ParticlesBackground';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setValidationError(true);
      setError('Vui lòng nhập email của bạn');
      return;
    }
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError(true);
      setError('Email không hợp lệ');
      return;
    }
    
    setLoading(true);
    setError('');
    setValidationError(false);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd send the password reset email here
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Forgot password form container */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quên Mật Khẩu</h1>
          <p className="text-gray-400">Nhập email của bạn để đặt lại mật khẩu</p>
        </div>

        {error && !success && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email đã được gửi!</h2>
              <p className="text-gray-300 mb-6">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới email {email}. Vui lòng kiểm tra hộp thư của bạn.
              </p>
              <Link 
                to="/signin" 
                className="block w-full bg-gradient-to-r from-teal-400 to-teal-500 text-center text-black font-bold py-3 px-4 rounded-lg hover:from-teal-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
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
              ) : "Gửi Link Đặt Lại Mật Khẩu"}
            </button>
            
            <div className="text-center mt-6">
              <Link 
                to="/signin" 
                className="flex items-center justify-center text-gray-400 hover:text-teal-300 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;