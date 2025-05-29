import { useState, useEffect } from 'react';
import { postApi } from '../api/postApi';
import { Post } from '../types/post';

export const usePosts = (userId: string) => {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await postApi.getUserPosts(userId);
            setUserPosts(response.data.data.posts);

            console.log("FECTH POST")

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (content: string, image: File) => {
        try {
            setError(null);

            const response = await postApi.createPost(content, image);

            const post = response.data.data.post;

            setUserPosts(prevPosts => [post, ...prevPosts]);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create post');
            throw err;
        }
    };

    const deletePost = async (postId: string) => {
        try {
            setError(null);
            await postApi.deletePost(postId);
            setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete post');
            throw err;
        }
    };

    const toggleLike = async (postId: string) => {
        try {
            setError(null);
            const response = await postApi.toggleLike(postId);
            setUserPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId ? response.data.posts[0] : post
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle like');
            throw err;
        }
    };

    useEffect(() => {
        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    return {
        posts: userPosts,
        loading,
        error,
        createPost,
        deletePost,
        toggleLike,
        refreshPosts: fetchPosts,
    };
}; 