import React, { useState } from 'react';
import { Post } from '../types/post';
import { Heart } from 'lucide-react';
import { formatDate } from '../utils/date';
import { useAuth } from '../hooks/useAuth';
import avatarHolder from '../assets/avatar_holder.png';
import { useProfile } from '../hooks/useProfile';
import { PostModal } from './Modal/PostModal';

interface PostCardProps {
    post: Post;
    onLikeToggle: (postId: string) => Promise<void>;
    onRefresh?: () => Promise<void>;
    isLiked: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLikeToggle, onRefresh, isLiked }) => {
    // const { user } = useAuth();
    const { navigateToProfile } = useProfile();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLike = async () => {
        await onLikeToggle(post._id);
        if (onRefresh) {
            await onRefresh();
        }
    };

    // const isLiked = user ? post.likes.includes(user._id) : false;

    return (
        <>
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl mx-auto w-[400px]">
                {/* User Info and Like Button */}
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
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
                            <h3 className="font-semibold text-white text-sm text-left">{post.user.user_name || post.user.full_name || 'Anonymous'}</h3>
                            <p className="text-xs text-left text-gray-400">{formatDate(post.createdAt)}</p>
                        </div>
                    </div>
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
                        <span className="text-sm pr-2">{post.likes.length}</span>
                    </button>
                </div>

                {/* Content */}
                <div className="px-3 pb-3">
                    <p className="text-white text-sm text-left">
                        {post.content}
                    </p>
                </div>

                {/* Post Image */}
                <div 
                    className="bg-black cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="aspect-square">
                        <img 
                            src={post.image} 
                            alt="Post content"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <PostModal
                post={post}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLikeToggle={onLikeToggle}
                onRefresh={onRefresh || (async () => {})}
            />
        </>
    );
}; 