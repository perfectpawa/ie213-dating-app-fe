import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: Error;
}

// Get token from cookie or localStorage
const getToken = () => {
  // First try to get from cookie
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  // Fallback to localStorage
  return localStorage.getItem('token');
};

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiRequest = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = getToken();
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await axiosInstance({
      url: endpoint,
      ...options,
      headers,
    });

    // If we get a token in the response, store it
    if (response.data?.token) {
      // Set cookie with token
      document.cookie = `token=${response.data.token}; path=/; secure; samesite=strict`;
      // Also store in localStorage as backup
      localStorage.setItem('token', response.data.token);
    }

    return { data: response.data };
  } catch (error) {
    if (error instanceof AxiosError) {
      // If unauthorized, clear token
      if (error.response?.status === 401) {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('token');
      }
      return {
        error: new Error(error.response?.data?.message || 'An error occurred'),
      };
    }
    return { error: error as Error };
  }
};