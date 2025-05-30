import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
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
      await onUpdatePost(content, image || undefined);
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-24 bg-gray-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#4edcd8]"
            />
          </div>

          <div className="mb-4">
            <div className="relative w-full aspect-square max-h-[400px] bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Post preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ImageIcon size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="px-4 py-2 bg-[#4edcd8] text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePostModal; 