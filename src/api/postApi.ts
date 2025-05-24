import { apiRequest } from '../utils/apiRequest';
import { Post } from '../types/post';

interface PostsResponse {
    status: string;
    data: {
        posts: Post[];
    };
}

export const postApi = {
    getUserPosts: async (userId: string) => {
        return apiRequest<PostsResponse>(`/posts/user/${userId}`, {
            method: 'GET',
        });
    },

    createPost: async (content: string, image: File) => {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('image', image);

        return apiRequest<PostsResponse>('/posts', {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deletePost: async (postId: string) => {
        return apiRequest<void>(`/posts/${postId}`, {
            method: 'DELETE',
        });
    },

    toggleLike: async (postId: string) => {
        return apiRequest<PostsResponse>(`/posts/${postId}/like`, {
            method: 'POST',
        });
    },
};