import { apiRequest } from '../utils/apiRequest';
import { User } from '../types/user';

interface UserResponse {
    status: string;
    data: {
        user: User;
    };
}

interface ListUserResponse {
    status: string;
    data: {
        users: User[];
    };
}

export const userApi = {
    getUserById: async (userId: string) => {
        return apiRequest<UserResponse>(`/users/${userId}`, {
            method: 'GET',
        });
    },
    getOtherUsers: async () => {
        return apiRequest<ListUserResponse>(`/users/other-users`, {
            method: 'GET',
        });
    },
    getMatchedUsers: async () => {
        return apiRequest<ListUserResponse>(`/users/matched-users`, {
            method: 'GET',
        });
    },
    getSwipedUsers: async () => {
        return apiRequest<ListUserResponse>(`/users/swiped-users`, {
            method: 'GET',
        });
    }
}; 