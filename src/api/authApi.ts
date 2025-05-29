import { apiRequest } from '../utils/apiRequest';
import {UpdateUserDto, User} from '../types/user';

interface AuthResponse {
    user: User;
    token: string;
}

interface CompleteProfileResponse {
    status: string;
    message: string;
    user: User;
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

    completeProfile: async (user_id: string, data: any) => {
        return apiRequest<CompleteProfileResponse>(`/users/${user_id}/complete-profile`, {
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    CheckUserNameValidation: async (username: string) => {
        return apiRequest<{ isValid: boolean }>(`/users/check-username/${username}`, {
            method: 'GET',
        });
    }
};