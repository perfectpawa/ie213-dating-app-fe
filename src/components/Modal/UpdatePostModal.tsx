import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2, Edit3 } from 'lucide-react';
import { Post } from '../../types/post';

interface UpdatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePost: (content: string, image?: File) => Promise<void>;
  post: Post;
}

const UpdatePostModal: React.FC<UpdatePostModalProps> = ({
  isOpen,
  onClose,
  onUpdatePost,
  post,
}) => {
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(post.image);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await onUpdatePost(content, image || undefined);
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Có lỗi xảy ra khi cập nhật bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setContent(post.content);
    setPreviewUrl(post.image);
    setImage(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-700/50">
        {/* Header */}
        <div className="bg-gray-800 flex items-center justify-between p-5 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-[#4edcd8]">
              <Edit3 size={20} />
            </span>
            Chỉnh sửa bài viết
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <span className="rounded-full bg-red-500/20 p-1">
                <X size={14} className="text-red-400" />
              </span>
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Nội dung
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full px-4 py-2.5 bg-gray-800/70 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4edcd8]/50 border border-gray-700/50 transition-all h-28"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex justify-between items-center">
              <span>Ảnh đính kèm</span>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#4edcd8] hover:underline"
              >
                Thay đổi ảnh
              </button>
            </label>
            <div className="relative w-full max-h-[300px] bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/30 flex items-center justify-center">
              {previewUrl ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[300px] object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-400 flex-col gap-2">
                  <ImageIcon size={48} />
                  <p className="text-sm">Chưa có ảnh</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className={`
                px-6 py-2.5 rounded-lg font-medium
                ${isLoading || !content.trim()
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#4edcd8] to-[#3bc0bd] text-black hover:shadow-lg hover:shadow-[#4edcd8]/20'
                }
                flex items-center gap-2 transition-all
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePostModal;