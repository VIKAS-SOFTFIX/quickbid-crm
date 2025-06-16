import { useState, useEffect, useCallback } from 'react';
import authService, { LoginRequest, RegisterRequest, User, AuthResponse } from '@/services/authService';

// Update the AuthResponse interface to match the expected User type
export interface ExtendedAuthResponse extends AuthResponse {
  user: User;
}

export interface UseAuthResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  // Initial check for authentication
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      try {
        // Try to get current user from token
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        // If there's an error, the user is not authenticated
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isClient]);

  // Login handler
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      // Set token in API client
      authService.setAuthToken(response.token);
      
      // Type assertion to ensure the response has the User shape
      const fullUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        createdAt: new Date().toISOString(), // Fallback value
        updatedAt: new Date().toISOString()  // Fallback value
      };
      
      setUser(fullUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to log in';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register handler
  const register = useCallback(async (userData: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      
      // Set token in API client
      authService.setAuthToken(response.token);
      
      // Type assertion to ensure the response has the User shape
      const fullUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        createdAt: new Date().toISOString(), // Fallback value
        updatedAt: new Date().toISOString()  // Fallback value
      };
      
      setUser(fullUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      
      // Clear user data
      setUser(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to log out';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Password reset request handler
  const requestPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await authService.requestPasswordReset(email);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to request password reset';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password handler
  const resetPassword = useCallback(async (token: string, password: string, confirmPassword: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword(token, password, confirmPassword);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reset password';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile handler
  const updateProfile = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    clearError
  };
};

export default useAuth; 