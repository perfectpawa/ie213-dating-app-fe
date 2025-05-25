import { apiRequest } from '../utils/apiRequest';
import { User } from '../types/user';

interface UserResponse {
    status: string;
    data: {
        user: User;
    };
}

export const userApi = {
    getUserById: async (userId: string) => {
        return apiRequest<UserResponse>(`/users/${userId}`, {
            method: 'GET',
        });
    },
}; 