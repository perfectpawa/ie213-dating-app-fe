export interface User {
  id: string;           // Backend user ID
  auth_id: string;      // Supabase auth ID
  email: string;
  completeSetup: boolean;  // Flag to track if user has completed profile setup
}

export interface CreateUserDto {
  auth_id: string;
  email: string;
  completeSetup?: boolean;
}

export interface UpdateUserDto {
}