import React from 'react';
import { Post } from '../types/post';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDate } from '../utils/date';
import { useAuth } from '../hooks/useAuth';

interface PostCardProps {
    post: Post;
    onLikeToggle: (postId: string) => Promise<void>;
    onRefresh: () => Promise<void>;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLikeToggle, onRefresh }) => {
    const { user } = useAuth();
    const handleLike = async () => {
        await onLikeToggle(post._id);
        await onRefresh();
    };

    const isLiked = user ? post.likes.includes(user._id) : false;

    return (
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl mx-auto w-[400px]">
            {/* User Info */}
            <div className="p-3 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                    <img 
                        src={post.user.profile_picture || '/default-avatar.png'} 
                        alt={`${post.user.user_name || post.user.full_name || 'Anonymous'}'s profile`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-white text-sm">{post.user.user_name || post.user.full_name || 'Anonymous'}</h3>
                    <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                </div>
            </div>

            {/* Post Image */}
            <div className="bg-black">
                <div className="aspect-square">
                    <img 
                        src={post.image} 
                        alt="Post content"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <p className="text-white text-sm mb-3">{post.content}</p>
                <div className="flex items-center gap-4 text-gray-400">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 hover:text-[#4edcd8] transition-colors ${
                            isLiked ? 'text-red-500' : 'text-gray-400'
                        }`}
                    >
                        <Heart
                            className="w-4 h-4"
                            fill={isLiked ? 'currentColor' : 'none'}
                        />
                        <span className="text-sm">{post.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#4edcd8] transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments.length}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}; 