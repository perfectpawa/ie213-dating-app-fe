import React from 'react';
import { X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Mất kết nối với {userName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Bạn có chắc chắn muốn mất kết nối với {userName} không?
          Hành động này không thể hoàn tác. Hai bạn sẽ không còn nhắn tin được với nhau và mối quan hệ sẽ trở lại người lạ.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Không, tôi đã nghĩ lại
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Có, chấm dứt kết nối
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnmatchModal; 