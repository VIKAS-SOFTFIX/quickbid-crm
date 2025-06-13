'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, Chip, Button, Divider, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

export default function AuthStatus() {
  const { user } = useAuth();
  const [cookieStatus, setCookieStatus] = useState<string>('Checking...');
  const [localStorageStatus, setLocalStorageStatus] = useState<string>('Checking...');
  const [allCookies, setAllCookies] = useState<string>('');
  const [testApiResult, setTestApiResult] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  useEffect(() => {
    // Check for auth_token cookie
    const cookieToken = Cookies.get('auth_token');
    setCookieStatus(cookieToken ? 'Present' : 'Not found');

    // Check localStorage
    const localStorageToken = localStorage.getItem('auth_token');
    setLocalStorageStatus(localStorageToken ? 'Present' : 'Not found');
    
    // Get all cookies
    setAllCookies(document.cookie);
  }, []);

  // Function to ensure the auth token is set as a cookie
  const ensureAuthCookie = () => {
    // If token exists in localStorage but not in cookies, set it in cookies
    const localStorageToken = localStorage.getItem('auth_token');
    const cookieToken = Cookies.get('auth_token');
    
    if (localStorageToken && !cookieToken) {
      Cookies.set('auth_token', localStorageToken);
      setAllCookies(document.cookie); // Update the cookies display
      setCookieStatus('Present');
      return true;
    }
    
    return !!cookieToken;
  };

  // Function to test making an authenticated API request
  const testAuthenticatedRequest = async () => {
    setIsTestingApi(true);
    setTestApiResult(null);
    
    try {
      // Ensure auth cookie is set
      const hasToken = ensureAuthCookie();
      
      if (!hasToken) {
        setTestApiResult('Error: No authentication token found');
        setIsTestingApi(false);
        return;
      }
      
      // Make a request to a protected endpoint
      const response = await fetch('http://localhost:7505/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // No Authorization header, using cookies only
        },
        // Include credentials to send cookies
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestApiResult(JSON.stringify(data, null, 2));
      } else {
        setTestApiResult(`Error: ${response.status} - ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Error making authenticated request:', error);
      setTestApiResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Authentication Status</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>User Data:</Typography>
        {user ? (
          <Box sx={{ ml: 2 }}>
            <Typography variant="body1">
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Roles:</strong>{' '}
              {user.roles.map(role => (
                <Chip 
                  key={role}
                  label={role}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              ))}
            </Typography>
          </Box>
        ) : (
          <Alert severity="warning">No user data found</Alert>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Cookie Status:</Typography>
        <Chip 
          label={cookieStatus}
          color={cookieStatus === 'Present' ? 'success' : 'error'}
          variant="outlined"
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>LocalStorage Status:</Typography>
        <Chip 
          label={localStorageStatus}
          color={localStorageStatus === 'Present' ? 'success' : 'error'}
          variant="outlined"
        />
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>All Cookies:</Typography>
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'background.default', 
            borderRadius: 1,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            fontSize: '0.8rem',
            fontFamily: 'monospace'
          }}
        >
          {allCookies || 'No cookies found'}
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>Test Authenticated API Request:</Typography>
        <Button 
          variant="contained" 
          onClick={testAuthenticatedRequest}
          disabled={isTestingApi}
          sx={{ mb: 2 }}
        >
          {isTestingApi ? <CircularProgress size={24} color="inherit" /> : 'Test API Request'}
        </Button>
        
        {testApiResult && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'background.default', 
              borderRadius: 1,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              maxHeight: '300px',
              overflow: 'auto'
            }}
          >
            {testApiResult}
          </Box>
        )}
      </Box>
    </Paper>
  );
} 