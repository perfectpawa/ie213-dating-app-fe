import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import ParticlesBackground from '../components/layout/ParticlesBackground';

const EmailVerification: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <ParticlesBackground />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/20 mb-4">
            <Mail size={32} className="text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Kiểm tra email của bạn</h1>
          <p className="text-gray-400 mb-6">
            Chúng tôi đã gửi một email xác nhận đến {email}. 
            Vui lòng kiểm tra hộp thư của bạn và nhấp vào liên kết xác nhận để hoàn tất đăng ký.
          </p>
          <div className="space-y-4">
            <Link 
              to="/signin" 
              className="inline-block w-full bg-gradient-to-r from-teal-400 to-teal-500 text-black font-bold py-3 px-6 rounded-lg hover:from-teal-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
            >
              Quay lại đăng nhập
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center w-full text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Gửi lại email xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 