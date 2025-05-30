import { apiRequest } from '../utils/apiRequest';
import { User, InteractedUser, UpdateUserDto } from '../types/user';

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

interface InteractedUsersResponse {
    status: string;
    data: {
        users: InteractedUser[];
    };
}

interface RelationshipResponse {
    status: string;
    relationship: string;
}

interface EnhancedMatchResponse {
    status: string;
    data: {
        outgoingLikes: InteractedUser[];
        incomingLikes: InteractedUser[];
        mutualMatches: InteractedUser[];
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
    },
    getInteractedUsers: async () => {
        return apiRequest<InteractedUsersResponse>(`/users/interacted-users`, {
            method: 'GET',
        });
    },
    getEnhancedMatchInfo: async () => {
        return apiRequest<EnhancedMatchResponse>(`/users/enhanced-match-info`, {
            method: 'GET',
        });
    },
    updateProfilePicture: async (image: File) => {
        const formData = new FormData();
        formData.append('profile_picture', image);
        return apiRequest<UserResponse>(`/users/update-profile-picture`, {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateCoverPicture: async (image: File) => {
        const formData = new FormData();
        formData.append('cover_picture', image);
        return apiRequest<UserResponse>(`/users/update-cover-picture`, {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateProfile: async (data: UpdateUserDto) => {
        return apiRequest<UserResponse>(`/users/update-profile`, {
            method: 'POST',
            data,
        });
    },
    getRelationship: async (userId: string) => {
        return apiRequest<RelationshipResponse>(`/users/relationship/${userId}`, {
            method: 'GET',
        });
    },
};