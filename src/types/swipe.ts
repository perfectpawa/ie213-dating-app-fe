import { User } from './user';

export interface Swipe {
    _id: string;
    swipeId: string;
    swiperId: string;
    swipedUserId: string;
    swipeDate: Date;
    status: 'like' | 'dislike' | 'superlike';
    createdAt: Date;
    updatedAt: Date;
}

export interface Match {
    _id: string;
    matchId: string;
    user1Id: string;
    user2Id: string;
    swipeId?: string;
    matchDate: Date;
    isMutual: boolean;
    createdAt: Date;
    updatedAt: Date;
    otherUser?: User; // For UI display - populated from backend or frontend
    latestMessage?: any;
    unreadCount?: number;
}
