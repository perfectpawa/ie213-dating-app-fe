import { apiRequest } from '../utils/apiRequest';
import { Swipe, Match } from '../types/swipe';

interface SwipeResponse {
    status: string;
    data: {
        swipe: Swipe;
        match?: Match;
    };
}

interface SwipesResponse {
    status: string;
    results: number;
    data: {
        swipes: Swipe[];
    };
}

interface PotentialMatchesResponse {
    status: string;
    results: number;
    data: {
        potentialMatches: any[];
    };
}

interface MatchesResponse {
    status: string;
    results: number;
    data: {
        matches: Match[];
    };
}

export const swipeApi = {
    // Create a new swipe
    createSwipe: async (swiperId: string, swipedUserId: string, status: 'like' | 'dislike' | 'superlike') => {
        return apiRequest<SwipeResponse>('/swipes', {
            method: 'POST',
            data: { swiperId, swipedUserId, status }
        });
    },

    // Get all swipes for a user
    getUserSwipes: async (userId: string) => {
        return apiRequest<SwipesResponse>(`/swipes/user?userId=${userId}`, {
            method: 'GET',
        });
    },

    // Get potential matches (users that haven't been swiped yet) with pagination
    getPotentialMatches: async (userId: string) => {
        return apiRequest<PotentialMatchesResponse>(`/swipes/potential-matches?userId=${userId}`, {
            method: 'GET'
        });
    },

    // Get user matches
    getUserMatches: async (userId: string) => {
        return apiRequest<MatchesResponse>(`/matches?userId=${userId}`, {
            method: 'GET',
        });
    },

    // Get user matches with latest messages
    getUserMatchesWithMessages: async (userId: string) => {
        return apiRequest<MatchesResponse>(`/matches/with-messages?userId=${userId}`, {
            method: 'GET',
        });
    },
    
    // Get match statistics
    getSwipeStats: async (userId: string) => {
        return apiRequest(`/swipes/stats?userId=${userId}`, {
            method: 'GET',
        });
    },
};
