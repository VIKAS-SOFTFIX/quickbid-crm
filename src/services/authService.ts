import { post, authGet } from './apiService';
import Cookies from 'js-cookie';

// Update the cookie name to match what the server sends
const AUTH_COOKIE_NAME = 'auth_token';
const USER_COOKIE_NAME = 'user';

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

// Logout function
export const logout = (): void => {
  // Clear from cookies
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(USER_COOKIE_NAME);
  
  // Clear from localStorage
  localStorage.removeItem(AUTH_COOKIE_NAME);
  localStorage.removeItem(USER_COOKIE_NAME);
  
  // The server-side cookie needs to be cleared by the server
  // We'll make a logout request to the server
  fetch('/api/auth/logout', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(err => console.error('Error during logout:', err));
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