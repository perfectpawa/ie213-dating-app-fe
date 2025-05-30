export interface User {
  _id: string;           // Backend user ID
  email: string;
  auth_id?: string;      // Auth provider ID
  completeProfile: boolean;  // Flag to track if user has completed profile setup
  isVerified: boolean;  // Flag to track if user has verified their email
  user_name?: string;    // User's display name
  full_name?: string;   // User's full name
  gender?: string;      // User's gender
  birthday?: string;    // User's birthday in YYYY-MM-DD format
  bio?: string;        // User's biography
  profile_picture?: string; // URL to user's profile picture
  cover_picture?: string; // URL to user's cover picture
  age?: number;        // User's age
  location?: string;    // User's location
  interests?: string[]; // User's interests
  photos?: string[];    // Additional photos
  occupation?: string;  // User's job/occupation
  education?: string;   // User's education level or institution
  preferences?: {      // User's preferences for matching
    minAge?: number;
    maxAge?: number;
    distance?: number;
    genderPreference?: string[];
  };
  lastActive?: Date;    // When the user was last active
  createdAt?: Date;     // When the user created their account
  updatedAt?: Date;     // When the user last updated their profile
}

export interface UpdateUserDto {
  full_name?: string;
  gender?: string;
  birthday?: string;    // User's birthday in YYYY-MM-DD format
  bio?: string;
}

export interface InteractedUser {
  user: User;           // The user object
  status: 'swiped' | 'matched' | 'liked_you';
  swipeType?: 'like' | 'superlike';  // Optional swipe type
  matchDate?: Date;     // Optional match date for mutual matches
  matchId?: string;     // Match ID for navigation to chat conversation
}