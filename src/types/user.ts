export interface User {
  id: string;           // Backend user ID
  auth_id: string;      // Supabase auth ID
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  completeSetup: boolean;  // Flag to track if user has completed profile setup
  created_at: string;
  updated_at: string;
  // Add other user fields as needed
}

export interface CreateUserDto {
  auth_id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  completeSetup: boolean;
}

export interface UpdateUserDto {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  completeSetup?: boolean;
} 