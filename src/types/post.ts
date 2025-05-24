export interface Post {
    _id: string;
    user: string;
    content: string;
    image: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    _id: string;
    user: string;
    content: string;
    createdAt: string;
} 