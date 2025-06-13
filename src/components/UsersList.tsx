'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fetchUsers } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  roles?: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers();
      console.log(response,"response");
      if (response && response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError('Invalid response format from API');
        console.error('Invalid API response:', response);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
    
    // Simple hash function to get consistent color for same user
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={0} 
      variant="outlined"
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        borderColor: alpha(theme.palette.divider, 0.7)
      }}
    >
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6">Users</Typography>
        <Typography variant="body2" color="text.secondary">
          {users.length} users found
        </Typography>
      </Box>
      
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.3) }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getAvatarColor(user.email),
                        width: 40,
                        height: 40,
                        mr: 2
                      }}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }} component="span">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div">
                        ID: {user.id.substring(0, 8)}...
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile || 'N/A'}</TableCell>
                <TableCell>
                  {user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} component="span">
                      {user.roles
                        .filter(role => role !== undefined && role !== null && role !== '')
                        .map((role, index) => (
                          <Chip
                            key={index}
                            label={role}
                            size="small"
                            color="primary"
                            variant="outlined"
                            component="span"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              borderColor: alpha(theme.palette.primary.main, 0.3)
                            }}
                          />
                        ))}
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary" component="span">
                      No roles assigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? 'Active' : 'Inactive'} 
                    size="small"
                    color={user.isActive ? 'success' : 'default'}
                    component="span"
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  />
                </TableCell>
                <TableCell>
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton size="small" sx={{ mr: 1, color: theme.palette.text.secondary }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit User">
                    <IconButton size="small" sx={{ mr: 1, color: theme.palette.text.secondary }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton size="small" sx={{ color: theme.palette.error.main }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {users.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No users found
          </Typography>
        </Box>
      )}
    </Paper>
  );
}