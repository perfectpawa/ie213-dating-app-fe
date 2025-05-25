import { User } from './user';

export interface Post {
    _id: string;
    user: User;
    content: string;
    image: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    _id: string;
    user: User;
    content: string;
    createdAt: string;
} 