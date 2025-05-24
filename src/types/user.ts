export interface User {
  _id: string;           // Backend user ID
  email: string;
  completeProfile: boolean;  // Flag to track if user has completed profile setup
  isVerified: boolean;  // Flag to track if user has verified their email
  user_name?: string;    // User's display name
  full_name?: string;   // User's full name
  gender?: string;      // User's gender
  bio?: string;        // User's biography
  profile_picture?: string; // URL to user's profile picture
}

export interface UpdateUserDto {
  id?: string;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  profile_picture?: string;
  completeProfile?: boolean;
}