import { apiRequest } from '../utils/apiRequest';
import { User } from '../types/user';

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
        return apiRequest<void>('/users/complete-profile', {
            method: 'POST',
            data,
        });
    },
};