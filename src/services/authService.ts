import apiClient from './apiClient';
import { post, authGet } from './apiService';
import Cookies from 'js-cookie';

// Update the cookie name to match what the server sends
const AUTH_COOKIE_NAME = 'auth_token';
const USER_COOKIE_NAME = 'user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
      permissions: string[];
    };
  };
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
}

class AuthService {
  private baseUrl = '/auth';

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>(`${this.baseUrl}/register`, userData);
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>(`${this.baseUrl}/me`);
  }

  // Logout user (invalidate token on server)
  async logout(): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`${this.baseUrl}/logout`);
    // Clear token from client
    apiClient.clearToken();
    return response;
  }

  // Password reset request
  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    return await apiClient.post<{ success: boolean }>(`${this.baseUrl}/password/reset-request`, { email });
  }

  // Reset password with token
  async resetPassword(token: string, password: string, confirmPassword: string): Promise<{ success: boolean }> {
    return await apiClient.post<{ success: boolean }>(`${this.baseUrl}/password/reset`, {
      token,
      password,
      confirmPassword
    });
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    return await apiClient.put<User>(`${this.baseUrl}/profile`, userData);
  }

  // Set auth token in API client
  setAuthToken(token: string): void {
    apiClient.setToken(token);
    // You might want to store the token in a cookie or localStorage here
  }

  // Clear auth token in API client
  clearAuthToken(): void {
    apiClient.clearToken();
    // You might want to clear the token from a cookie or localStorage here
  }
}

// Create a singleton instance
export const authService = new AuthService();

// Export default instance
export default authService;

// Login function - directly connect to the external API
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Call the external API directly without going through Next.js API routes
    const response = await post<LoginResponse>('/api/auth/login', { email, password });
    
    console.log('Login response:', response); // Debug log
    
    // Store the token in cookies and localStorage
    if (response.success && response.data && response.data.token) {
      // Store the token in localStorage for API calls
      localStorage.setItem(AUTH_COOKIE_NAME, response.data.token);
      
      // Store user data in localStorage and cookies
      const userData = JSON.stringify(response.data.user);
      localStorage.setItem(USER_COOKIE_NAME, userData);
      Cookies.set(USER_COOKIE_NAME, userData);
      
      // Note: The server should set the auth_token cookie automatically
      // If it doesn't, we set it here as well
      if (!Cookies.get(AUTH_COOKIE_NAME)) {
        Cookies.set(AUTH_COOKIE_NAME, response.data.token);
      }
    } else {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format');
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user profile
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await authGet<ProfileResponse>('/api/auth/me');
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error('Failed to fetch user profile');
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Check if user has a specific permission
export const hasPermission = (permission: string): boolean => {
  const userData = Cookies.get(USER_COOKIE_NAME) || localStorage.getItem(USER_COOKIE_NAME);
  if (!userData) return false;
  
  try {
    const user = JSON.parse(userData);
    return user.permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// Check if user has a specific role
export const hasRole = (role: string): boolean => {
  const userData = Cookies.get(USER_COOKIE_NAME) || localStorage.getItem(USER_COOKIE_NAME);
  if (!userData) return false;
  
  try {
    const user = JSON.parse(userData);
    return user.roles.includes(role);
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

// Function to manually set token from provided JSON data
export const setTokenFromResponse = (responseData: any): void => {
  if (responseData && responseData.success && responseData.data && responseData.data.token) {
    const { token, user } = responseData.data;
    
    // Store in cookies
    Cookies.set('auth_token', token, { expires: 1 });
    Cookies.set('user', JSON.stringify(user));
    
    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('Token and user data stored successfully');
  } else {
    console.error('Invalid response data format for token storage');
  }
};