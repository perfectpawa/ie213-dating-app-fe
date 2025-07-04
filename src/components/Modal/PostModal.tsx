import React from 'react';
import { Post } from '../../types/post';
import { Heart, X } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { useAuth } from '../../hooks/useAuth';
import avatarHolder from '../../assets/avatar_holder.png';
import { useProfile } from '../../hooks/useProfile';

interface PostModalProps {
    post: Post;
    isOpen: boolean;
    onClose: () => void;
    onLikeToggle: (postId: string) => Promise<void>;
    onRefresh: () => Promise<void>;
}

export const PostModal: React.FC<PostModalProps> = ({
    post,
    isOpen,
    onClose,
    onLikeToggle,
    onRefresh,
}) => {
    const { user } = useAuth();
    const { navigateToProfile } = useProfile();

    if (!isOpen) return null;

    const handleLike = async () => {
        await onLikeToggle(post._id);
        await onRefresh();
    };

    const isLiked = user ? post.likes.includes(user._id) : false;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b max-h-[80vh] border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigateToProfile(post.user._id)}
                        >
                            <img 
                                src={post.user.profile_picture || avatarHolder} 
                                alt={`${post.user.user_name || post.user.full_name || 'Anonymous'}'s profile`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div 
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigateToProfile(post.user._id)}
                        >
                            <h3 className="font-semibold text-white text-sm">{post.user.user_name || post.user.full_name || 'Anonymous'}</h3>
                            <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Image */}
                <div className="flex-1 bg-black relative max-h-[70vh] max-w-[800px] mx-auto">
                    <img 
                        src={post.image} 
                        alt="Post content"
                        className="w-full max-h-[70vh] object-contain"
                    />
                </div>

                {/* Footer with Like Button and Caption */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                        <p className="text-white text-sm flex-1">
                            <span className="font-semibold mr-1">{post.user.user_name}</span>
                            {post.content}
                        </p>
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 hover:text-[#4edcd8] transition-colors ml-4 ${
                                isLiked ? 'text-red-500' : 'text-gray-400'
                            }`}
                        >
                            <Heart
                                className="w-5 h-5"
                                fill={isLiked ? 'currentColor' : 'none'}
                            />
                            <span className="text-sm">{post.likes.length}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 