import { apiRequest } from '../utils/apiRequest';
import {User} from '../types/user';

interface AuthResponse {
    user: User;
    token: string;
}

interface CompleteProfileResponse {
    status: string;
    message: string;
    user: User;
}

// interface CompleteProfileData {
//     user_name: string;
//     full_name: string;
//     gender: string;
//     birthday: string;
//     bio?: string;
//     profile_picture?: File;
//     cover_picture?: File;
//     location?: string;
//     occupation?: string;
//     education?: string;
//     preferences?: {
//         minAge?: number;
//         maxAge?: number;
//         distance?: number;
//         genderPreference?: string[];
//     };
// }

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

    completeProfile: async (user_id: string, data: FormData) => {
        return apiRequest<CompleteProfileResponse>(`/users/${user_id}/complete-profile`, {
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    completeInterest: async (user_id: string, interests: string[]) => {
        return apiRequest<{ user: User }>(`/users/${user_id}/complete-interest`, {
            method: 'POST',
            data: { interestIds: interests },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },

    CheckUserNameValidation: async (username: string) => {
        return apiRequest<{ isValid: boolean }>(`/users/check-username/${username}`, {
            method: 'GET',
        });
    },

    // Google authentication
    initiateGoogleAuth: () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        window.location.href = `${apiUrl}/users/auth/google`;
    },

    handleGoogleCallback: async (token: string) => {
        return apiRequest<AuthResponse>('/users/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
};