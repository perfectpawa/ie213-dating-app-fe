import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/postApi';
import { userApi } from '../api/userApi';
import { Post } from '../types/post';
import { User } from '../types/user';

export const useProfile = () => {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const navigateToProfile = (userId: string) => {
        navigate(`/profile/${userId}`);
    };

    const fetchUserPosts = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await postApi.getUserPosts(userId);
            if (response.data?.data?.posts) {
                setUserPosts(response.data.data.posts);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user posts');
            console.error('Error fetching user posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userApi.getUserById(userId);
            if (response.data?.data?.user) {
                setUser(response.data.data.user);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user data');
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        userPosts,
        user,
        loading,
        error,
        navigateToProfile,
        fetchUserPosts,
        fetchUserData,
    };
}; 