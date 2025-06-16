'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { alpha } from '@mui/material/styles';
import { useAuth } from '@/contexts/AuthContext'; // ✅ Context hook

export default function LoginPage() {
  const [email, setEmail] = useState('superadmin@quickbid.com');
  const [password, setPassword] = useState('QB#Super$Admin@2023!');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  const { login } = useAuth(); // ✅ From AuthContext
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password); // ✅ login using context
      router.push('/dashboard');   // ✅ redirect after success
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div style={{ height: '100vh', width: '100vw' }}></div>;
  }

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden' }}>
      {/* Left branding panel */}
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
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          }}
        />
        <Box
          sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            padding: 6,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <BusinessCenterOutlinedIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 2 }} />
            <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
              QuickBid CRM
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: 'white', opacity: 0.9, textAlign: 'center', mb: 6 }}>
            Streamline your sales process and boost revenue
          </Typography>
        </Box>
      </Box>

      {/* Right login form */}
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
        <Paper elevation={4} sx={{ width: '100%', maxWidth: '450px', p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          <Typography variant="h4" align="center" sx={{ color: theme.palette.primary.dark, fontWeight: 600, mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in to your account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
                    <IconButton onClick={handleClickShowPassword} edge="end">
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
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 1.5, fontWeight: 600, mb: 3 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Typography variant="caption" align="center" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
              Default credentials are pre-filled for demo purposes
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
