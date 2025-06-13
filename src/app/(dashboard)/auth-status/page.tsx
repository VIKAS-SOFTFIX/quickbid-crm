import AuthStatus from '@/components/AuthStatus';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SecurityIcon from '@mui/icons-material/Security';

export default function AuthStatusPage() {
  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link 
          color="inherit" 
          href="/dashboard" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Authentication Status
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Authentication Status
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View the current authentication status and token information
        </Typography>
      </Box>

      {/* Auth Status Component */}
      <AuthStatus />
    </Container>
  );
} 