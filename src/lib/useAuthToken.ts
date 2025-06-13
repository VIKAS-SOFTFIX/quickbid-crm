'use client';

import { useState, useEffect } from 'react';
import { setAuthToken } from './api';

// Custom hook for managing the auth token
export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  
  // Initialize token from storage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);
  
  // Function to update the token
  const updateToken = (newToken: string, rememberMe: boolean = true) => {
    setToken(newToken);
    setAuthToken(newToken);
    
    // Store in the appropriate storage based on "remember me" setting
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem('auth_token', newToken);
        sessionStorage.removeItem('auth_token');
      } else {
        sessionStorage.setItem('auth_token', newToken);
        localStorage.removeItem('auth_token');
      }
    }
  };
  
  // Function to clear the token (logout)
  const clearToken = () => {
    setToken(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  };
  
  return {
    token,
    updateToken,
    clearToken,
  };
} 