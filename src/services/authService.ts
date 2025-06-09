import { post, authGet } from './apiService';
import Cookies from 'js-cookie';

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
    
    // Store the token in cookies
    if (response.success && response.data && response.data.token) {
      Cookies.set('auth_token', response.data.token, { expires: 1 }); // Expires in 1 day
      
      // Store user data
      Cookies.set('user', JSON.stringify(response.data.user));
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
  const userData = Cookies.get('user');
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
  const userData = Cookies.get('user');
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
  Cookies.remove('auth_token');
  Cookies.remove('user');
};