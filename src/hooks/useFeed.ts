import { useState, useEffect, useCallback } from 'react';
import { postApi } from '../api/postApi';
import { Post } from '../types/post';

export const useFeed = () => {
    const [feedPosts, setFeedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchFeedPosts = async (page: number = 1, append: boolean = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setIsLoadingMore(true);
            }
            setError(null);
            
            const response = await postApi.getFeedPosts(page);
            if (response.data?.data?.posts) {
                const newPosts = response.data.data.posts;

                //change posts.likes from [Object] to [String]
                const formattedPosts = newPosts.map(post => ({
                    ...post,
                    likes: post.likes.map(like => like._id) // Assuming like._id is the string identifier
                }));

                setFeedPosts(prevPosts => append ? [...prevPosts, ...formattedPosts] : formattedPosts);
                
                // Update pagination state
                if (response.data.data.pagination) {
                    setHasMore(response.data.data.pagination.hasNextPage);
                    setCurrentPage(response.data.data.pagination.currentPage);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch feed posts');
            console.error('Error fetching feed posts:', err);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    const loadMore = useCallback(async () => {
        if (!hasMore || isLoadingMore) return;
        await fetchFeedPosts(currentPage + 1, true);
    }, [currentPage, hasMore, isLoadingMore]);

    const toggleLike = async (postId: string) => {
        try {
            setError(null);
            const response = await postApi.toggleLike(postId);
            if (response?.data?.data?.post) {
                const updatedPost = response.data.data.post;
                setFeedPosts(prevPosts => 
                    prevPosts.map(post => 
                        post._id === postId ? updatedPost : post
                    )
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle like');
            throw err;
        }
    };

    const refreshPosts = useCallback(() => {
        setCurrentPage(1);
        fetchFeedPosts(1, false);
    }, []);

    useEffect(() => {
        fetchFeedPosts(1, false);
    }, []);

    return {
        posts: feedPosts,
        loading,
        error,
        toggleLike,
        refreshPosts,
        loadMore,
        hasMore,
        isLoadingMore
    };
}; 