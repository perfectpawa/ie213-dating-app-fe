export interface User {
  _id: string;           // Backend user ID
  auth_id: string;      // Supabase auth ID
  email: string;
  completeProfile: boolean;  // Flag to track if user has completed profile setup
  user_name?: string;    // User's display name
  full_name?: string;   // User's full name
  gender?: string;      // User's gender
  bio?: string;        // User's biography
  profile_picture?: string; // URL to user's profile picture
}

export interface CreateUserDto {
  auth_id: string;
  email: string;
  completeProfile?: boolean;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  profile_picture?: string;
}

export interface UpdateUserDto {
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  profile_picture?: string;
  completeProfile?: boolean;
}