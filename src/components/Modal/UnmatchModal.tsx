import React, { useState } from 'react';
import { X, UserX, AlertTriangle, Loader2 } from 'lucide-react';

interface UnmatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const UnmatchModal: React.FC<UnmatchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-700/50">
        {/* Header */}
        <div className="bg-gray-800 flex items-center justify-between p-5 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-red-500">
              <UserX size={20} />
            </span>
            Hủy kết nối
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all"
            aria-label="Close"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Hủy kết nối với <span className="text-[#4edcd8] font-semibold">{userName}</span>?
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>Khi hủy kết nối, hai bạn sẽ không thể:</p>
              <ul className="list-disc list-inside text-left space-y-1">
                <li>Nhắn tin cho nhau</li>
                <li>Xem thông tin hồ sơ chi tiết</li>
                <li>Thông báo về hoạt động của người kia</li>
              </ul>
              <p className="mt-3 text-gray-400 italic text-sm">Hành động này không thể hoàn tác.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all order-2 sm:order-1"
            >
              Giữ kết nối
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`
                px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2
                ${isProcessing
                  ? 'bg-red-500/50 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/20'
                }
                transition-all order-1 sm:order-2
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <UserX size={18} />
                  Xác nhận hủy kết nối
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnmatchModal;