import { apiRequest } from '../utils/apiRequest';
import {UpdateUserDto, User} from '../types/user';

interface AuthResponse {
    user: User;
    token: string;
}

export const authApi = {
    login: async (email: string, password: string) => {
        return apiRequest<AuthResponse>('/users/login', {
            method: 'POST',
            data: { email, password },
        });
    },

    signup: async (email: string, password: string) => {
        return apiRequest<AuthResponse>('/users/signup', {
            method: 'POST',
            data: { email, password },
        });
    },

    logout: async () => {
        return apiRequest<void>('/users/logout', {
            method: 'POST',
        });
    },

    verifyAccount: async (otp: string) => {
        return apiRequest<AuthResponse>('/users/verify', {
            method: 'POST',
            data: { otp },
        });
    },

    resendOTP: async (email: string) => {
        return apiRequest<void>('/users/resend-otp', {
            method: 'POST',
            data: { email },
        });
    },

    completeProfile: async (data: any) => {
        const formData = new FormData();
        
        // Add text fields
        formData.append('user_name', data.username);
        formData.append('full_name', data.full_name);
        formData.append('gender', data.gender);
        formData.append('bio', data.bio);
        
        // Add profile picture if it exists
        if (data.profile_picture && data.profile_picture.startsWith('data:')) {
            // Convert base64 to blob
            const response = await fetch(data.profile_picture);
            const blob = await response.blob();
            formData.append('profilePic', blob, 'profile.jpg');
        }

        return apiRequest<AuthResponse>(`/users/${data.id}/complete-profile`, {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};