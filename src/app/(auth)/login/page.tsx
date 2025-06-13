'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { alpha } from '@mui/material/styles';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';

export default function LoginPage() {
  const [email, setEmail] = useState('superadmin@quickbid.com');
  const [password, setPassword] = useState('QB#Super$Admin@2023!');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const theme = useTheme();
  
  // Add state to track if component is mounted (client-side)
  const [mounted, setMounted] = useState(false);

  // After first render (which happens on client), set mounted to true
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(email, password);
      
      // The token is already being stored in the authService login function
      // No need to manually set it here
      
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Show a minimal loading state until client-side hydration is complete
  if (!mounted) {
    return <div style={{ height: '100vh', width: '100vw' }}></div>;
  }

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      overflow: 'hidden',
    }}>
      {/* Left part - Branding */}
      <Box 
        sx={{ 
          width: { xs: '0%', md: '50%' },
          position: 'relative',
          display: { xs: 'none', md: 'block' },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 6,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <BusinessCenterOutlinedIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 2 }} />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
              }}
            >
              QuickBid CRM
            </Typography>
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'white', 
              opacity: 0.9, 
              maxWidth: '80%', 
              textAlign: 'center',
              mb: 6
            }}
          >
            Streamline your sales process and boost revenue
          </Typography>
          
          {/* CRM Dashboard Illustration */}
          <Box sx={{ width: '80%', height: '300px', position: 'relative', mb: 4 }}>
            <svg width="100%" height="100%" viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.95">
                <rect x="120" y="80" width="660" height="440" rx="15" fill="white" />
                <rect x="120" y="80" width="660" height="60" rx="15" fill="#FFAD26" />
                <rect x="150" y="180" width="280" height="160" rx="8" fill="#F1F5F9" />
                <rect x="150" y="370" width="280" height="120" rx="8" fill="#F1F5F9" />
                <rect x="470" y="180" width="280" height="310" rx="8" fill="#F1F5F9" />
                <circle cx="170" cy="110" r="10" fill="white" />
                <circle cx="200" cy="110" r="10" fill="white" />
                <circle cx="230" cy="110" r="10" fill="white" />
                <rect x="170" y="200" width="240" height="20" rx="4" fill="#FFAD26" opacity="0.5" />
                <rect x="170" y="230" width="180" height="10" rx="2" fill="#E2E8F0" />
                <rect x="170" y="250" width="220" height="10" rx="2" fill="#E2E8F0" />
                <rect x="170" y="270" width="200" height="10" rx="2" fill="#E2E8F0" />
                <rect x="170" y="290" width="240" height="10" rx="2" fill="#E2E8F0" />
                <rect x="170" y="310" width="160" height="10" rx="2" fill="#E2E8F0" />
                <rect x="170" y="390" width="240" height="20" rx="4" fill="#FFAD26" opacity="0.5" />
                <rect x="170" y="420" width="180" height="10" rx="2" fill="#E2E8F0" />
                <rect x="170" y="440" width="220" height="10" rx="2" fill="#E2E8F0" />
                <rect x="170" y="460" width="200" height="10" rx="2" fill="#E2E8F0" />
                <rect x="490" y="200" width="240" height="20" rx="4" fill="#FFAD26" opacity="0.5" />
                <rect x="490" y="240" width="100" height="80" rx="4" fill="#00204A" opacity="0.1" />
                <rect x="610" y="240" width="100" height="80" rx="4" fill="#00204A" opacity="0.2" />
                <rect x="490" y="340" width="100" height="80" rx="4" fill="#00204A" opacity="0.3" />
                <rect x="610" y="340" width="100" height="80" rx="4" fill="#00204A" opacity="0.1" />
                <rect x="490" y="440" width="220" height="20" rx="4" fill="#00204A" opacity="0.05" />
              </g>
            </svg>
          </Box>
        </Box>
      </Box>

      {/* Right part - Login Form */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          p: { xs: 3, md: 6 },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: '450px',
            p: { xs: 3, md: 4 },
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            align="center"
            sx={{
              color: theme.palette.primary.dark,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ mb: 4 }}
          >
            Sign in to your account
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mb: 3,
              }}
            >
              Sign In
            </Button>
            
            <Typography 
              variant="caption" 
              align="center" 
              color="text.secondary"
              sx={{ 
                display: 'block',
                mb: 2,
                fontStyle: 'italic'
              }}
            >
              Default credentials are pre-filled for demo purposes
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
} 