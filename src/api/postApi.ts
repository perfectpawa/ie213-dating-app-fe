import { apiRequest } from '../utils/apiRequest';
import { Post } from '../types/post';

interface PostsResponse {
    status: string;
    data: {
        posts: Post[];
        pagination?: {
            currentPage: number;
            totalPages: number;
            totalPosts: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
}

interface PostResponse {
    status: string;
    data: {
        post: Post;
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

        return apiRequest<PostResponse>('/posts', {
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

    updatePost: async (postId: string, content: string, image?: File) => {
        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        return apiRequest<PostResponse>(`/posts/${postId}`, {
            method: 'PUT',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    toggleLike: async (postId: string) => {
        return apiRequest<PostResponse>(`/posts/${postId}/like`, {
            method: 'GET',
        });
    },

    getFeedPosts: async (page: number = 1, limit: number = 10) => {
        return apiRequest<PostsResponse>(`/posts/get-post/similar-interests?page=${page}&limit=${limit}`, {
            method: 'GET',
        });
    },

    getPost: async (postId: string) => {
        return apiRequest<PostResponse>(`/posts/${postId}`, {
            method: 'GET',
        });
    },

    addComment: async (postId: string, comment: string) => {
        return apiRequest<PostResponse>(`/posts/${postId}/comment`, {
            method: 'POST',
            data: { comment },
        });
    }
};