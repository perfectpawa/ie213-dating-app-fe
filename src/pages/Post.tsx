import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post as PostType } from '../types/post';
import { postApi } from '../api/postApi';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/layout';
import { Heart } from 'lucide-react';
import { formatDate } from '../utils/date';
import avatarHolder from '../assets/avatar_holder.png';
import { useProfile } from '../hooks/useProfile';

const Post: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { navigateToProfile } = useProfile();
    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await postApi.getPost(postId!);
                setPost(response.data.data.post);
            } catch (err) {
                setError('Failed to load post');
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const handleLike = async () => {
        if (!post) return;
        try {
            const response = await postApi.toggleLike(post._id);
            setPost(response.data.data.post);
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            </Layout>
        );
    }

    if (error || !post) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <p className="text-red-500 mb-4">{error || 'Post not found'}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        Go Back Home
                    </button>
                </div>
            </Layout>
        );
    }

    const isLiked = user ? post.likes.includes(user._id) : false;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto max-h-[70vh] py-8 px-4">
                <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
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
                                <h3 className="font-semibold text-white text-sm text-left">
                                    {post.user.user_name || post.user.full_name || 'Anonymous'}
                                </h3>
                                <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
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
                            <span className="text-sm">{post.likes.length}</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-3 pb-3">
                        <p className="text-white text-sm text-left">
                            {post.content}
                        </p>
                    </div>

                    {/* Post Image */}
                    <div className="bg-black">
                        <div className="aspect-square">
                            <img 
                                src={post.image} 
                                alt="Post content"
                                className="w-full max-h-[70vh] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Post; 