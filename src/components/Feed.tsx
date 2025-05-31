import React, { useEffect, useRef, useCallback } from 'react';
import { useFeed } from '../hooks/useFeed';
import { Post } from '../types/post';
import { PostCard } from './PostCard';
import LoadingSpinner from './LoadingSpinner';

export const Feed: React.FC = () => {
    const { 
        posts, 
        error, 
        loading, 
        isLoadingMore,
        hasMore,
        toggleLike, 
        loadMore 
    } = useFeed();

    const observer = useRef<IntersectionObserver | undefined>(undefined);
    const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || isLoadingMore) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                void loadMore();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, isLoadingMore, hasMore, loadMore]);

    if (loading) {
        return <LoadingSpinner />;
    }

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
                Không có bài đăng nào để hiển thị. Hãy theo dõi một số người dùng để xem bài đăng của họ ở đây!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post: Post, index: number) => (
                <div
                    key={post._id}
                    ref={index === posts.length - 1 ? lastPostElementRef : undefined}
                >
                    <PostCard
                        post={post}
                        onLikeToggle={toggleLike}
                    />
                </div>
            ))}
            {isLoadingMore && (
                <div className="flex justify-center p-4">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
}; 