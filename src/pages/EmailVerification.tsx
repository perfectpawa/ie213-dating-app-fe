import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw, Check, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

const EmailVerification: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { resendOTP } = useAuth();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleResendOTP = async () => {
    if (!email || !canResend) return;

    setLoading(true);
    setError('');

    try {
      await resendOTP(email);
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const { data, error: verifyError } = await authApi.verifyAccount(otp);
      
      if (verifyError) throw verifyError;
      
      setSuccess(true);
      // Wait for 1 second before redirecting
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực thất bại. Vui lòng thử lại.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/20 mb-4">
          <Mail size={32} className="text-teal-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Xác nhận email</h1>
        <p className="text-gray-400 mb-6">
          Chúng tôi đã gửi mã OTP đến <span className="text-teal-400">{email}</span>. 
          Vui lòng nhập mã OTP để xác thực tài khoản của bạn.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-teal-500/20 border border-teal-500 rounded-lg text-teal-200 text-sm flex items-center gap-2">
            <CheckCircle2 size={20} />
            <span>Xác thực thành công! Đang chuyển hướng...</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              className="w-full bg-gray-800 text-white font-medium py-3 px-6 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
              maxLength={6}
              disabled={success}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={verifying || !otp || success}
              className="w-full bg-teal-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Đang xác thực...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={20} />
                  Đã xác thực
                </>
              ) : (
                <>
                  <Check size={20} />
                  Xác thực
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleResendOTP}
            disabled={loading || !canResend || success}
            className="w-full bg-gray-800 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Đang gửi lại...
              </>
            ) : canResend ? (
              <>
                <RefreshCw size={20} />
                Gửi lại mã OTP
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Gửi lại sau {countdown}s
              </>
            )}
          </button>

          <Link 
            to="/signin" 
            className="inline-flex items-center justify-center w-full text-teal-400 hover:text-teal-300 font-medium py-3 px-6 rounded-lg hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification; 