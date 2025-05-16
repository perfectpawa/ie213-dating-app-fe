import { supabase } from '../services/supabaseClient';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    requiresAuth = true,
  } = options;

  try {
    // Get the session if authentication is required
    let authHeader = {};
    if (requiresAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new ApiError('Authentication required', 401, 'UNAUTHORIZED');
      }
      authHeader = {
        Authorization: `Bearer ${session.access_token}`,
        'X-User-ID': session.user.id, // Include Supabase user ID for backend reference
      };
    }

    // Prepare request configuration
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...headers,
      },
    };

    // Add body if present
    if (body) {
      config.body = JSON.stringify(body);
    }

    // Make the request
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'An error occurred',
        response.status,
        errorData.code
      );
    }

    // Parse and return the response data
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return { data: null, error };
    }
    return {
      data: null,
      error: new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      ),
    };
  }
};

// Generic API methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Example usage:
/*
// After Supabase signup, create user in backend
const { data: { user } } = await supabase.auth.signUp({ email, password });
if (user) {
  const { data, error } = await userApi.createUser({
    auth_id: user.id,
    email: user.email!,
    username: username,
  });
}

// Get current user profile
const { data: user, error } = await userApi.getCurrentUser();

// Update user profile
const { data: updatedUser, error } = await userApi.updateUser(userId, {
  username: 'newUsername',
  bio: 'New bio'
});
*/ 