'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { login as apiLogin, logout as apiLogout, getProfile, UserProfile, LoginResponse } from '../services/authService';

// Update the cookie name to match what the server sends
const USER_COOKIE_NAME = 'user';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing user data in cookies or localStorage
    let userData = Cookies.get(USER_COOKIE_NAME);
    
    // If not found in cookies, try localStorage
    if (typeof window !== 'undefined' && !userData) {
      const localStorageUser = localStorage.getItem(USER_COOKIE_NAME);
      if (localStorageUser) {
        userData = localStorageUser;
        // Sync to cookies
        Cookies.set(USER_COOKIE_NAME, localStorageUser);
      }
    }
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove(USER_COOKIE_NAME);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(USER_COOKIE_NAME);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiLogin(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        router.push('/dashboard');
        return response;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}