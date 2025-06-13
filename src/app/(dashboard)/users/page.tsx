'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Breadcrumbs,
  Link,
  useTheme,
  alpha,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AddIcon from '@mui/icons-material/Add';
import UsersList from '@/components/UsersList';

export default function UsersPage() {
  const theme = useTheme();

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
          <PeopleOutlineIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Users
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts and permissions
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            py: 1.2,
            px: 2.5,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add New User
        </Button>
      </Box>

      {/* Users List Component */}
      <UsersList />
    </Container>
  );
} 