import React from 'react';
import { useFeed } from '../hooks/useFeed';
import { Post } from '../types/post';
import { PostCard } from './PostCard';
import LoadingSpinner from './LoadingSpinner';

export const Feed: React.FC = () => {
    const { posts, loading, error, toggleLike, refreshPosts } = useFeed();

    // if (loading) {
    //     return <LoadingSpinner />;
    // }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center p-4 text-gray-500">
                No posts to show. Follow some users to see their posts here!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post: Post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onLikeToggle={toggleLike}
                    onRefresh={refreshPosts}
                />
            ))}
        </div>
    );
}; 