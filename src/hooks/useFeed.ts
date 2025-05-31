import { useState, useEffect } from 'react';
import { postApi } from '../api/postApi';
import { Post } from '../types/post';

export const useFeed = () => {
    const [feedPosts, setFeedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeedPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await postApi.getFeedPosts();
            if (response.data?.data?.posts) {
                setFeedPosts(response.data.data.posts);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch feed posts');
            console.error('Error fetching feed posts:', err);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchFeedPosts();
    }, []);

    return {
        posts: feedPosts,
        loading,
        error,
        toggleLike,
        refreshPosts: fetchFeedPosts,
    };
}; 