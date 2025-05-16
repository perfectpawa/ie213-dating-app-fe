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

// Convenience methods for common HTTP methods
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
// GET request
const { data, error } = await api.get<User>('/users/me');

// POST request with body
const { data, error } = await api.post<ResponseType>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request with custom headers
const { data, error } = await api.put<ResponseType>('/users/123', {
  name: 'John Doe'
}, {
  headers: {
    'Custom-Header': 'value'
  }
});

// DELETE request without authentication
const { data, error } = await api.delete<ResponseType>('/users/123', {
  requiresAuth: false
});
*/ 