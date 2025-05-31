import React from 'react';
import { useFeed } from '../hooks/useFeed';
import { Post } from '../types/post';
import { PostCard } from './PostCard';
// import LoadingSpinner from './LoadingSpinner';

export const Feed: React.FC = () => {
    const { posts, error, toggleLike, refreshPosts } = useFeed();

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
        return (            <div className="text-center p-4 text-gray-500">
                Không có bài đăng nào để hiển thị. Hãy theo dõi một số người dùng để xem bài đăng của họ ở đây!
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