import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePost: (content: string, image: File) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onCreatePost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !image) return;

        try {
            setIsSubmitting(true);
            await onCreatePost(content, image);
            handleClose();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setContent('');
        setImage(null);
        setImagePreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Create Post</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Bạn đang nghĩ gì?"
                        className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mt-4 relative">
                            <img
                                src={imagePreview}
                                alt="Xem trước"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                }}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>
                    )}

                    {/* Image Upload Button */}
                    {!imagePreview && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ImageIcon size={20} />
                            <span>Add Image</span>
                        </button>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={!content || !image || isSubmitting}
                            className={`
                                px-6 py-2 rounded-full font-medium
                                ${(!content || !image || isSubmitting)
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-teal-400 to-teal-500 text-black hover:opacity-90'
                                }
                                flex items-center gap-2
                            `}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Post'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal; 