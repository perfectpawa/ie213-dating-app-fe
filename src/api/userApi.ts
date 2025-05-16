import { User, CreateUserDto, UpdateUserDto } from '../types/user';
import { api } from '../utils/apiRequest';

export const userApi = {
  /**
   * Create a new user
   */
  createUser: (userData: CreateUserDto) =>
    api.post<User>('/users', userData),

  /**
   * Update user profile
   */
  updateUser: (userId: string, userData: UpdateUserDto) =>
    api.patch<User>(`/users/${userId}`, userData),

  /**
   * Get user by ID
   */
  getUserById: (userId: string) =>
    api.get<User>(`/users/${userId}`),

  /**
   * Get user by auth_id
   */
  getUserByAuthId: (authId: string) =>
    api.get<User>(`/users/auth/${authId}`),

  /**
   * Delete user account
   */
  deleteUser: (userId: string) =>
    api.delete<void>(`/users/${userId}`),

  /**
   * Search users
   */
  searchUsers: (query: string) =>
    api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`),
}; 