'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, fetchRoles, createUser, updateUser, deleteUser } from '@/lib/api';

// Define interfaces for type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
  isActive: boolean;
  status?: string;
}

interface NewUser {
  firstName: string;
  email: string;
  role: string;
}

interface UserListProps {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function UserList({ showSnackbar }: UserListProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    firstName: '',
    email: '',
    role: '',
  });

  // Fetch users and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const [usersData, rolesData] = await Promise.all([
            fetchUsers(),
            fetchRoles()
          ]);
          
          setUsers(usersData.data);
          console.log(usersData.data,"usersData");
          console.log(rolesData.data,"rolesData");
          // Extract role names from role objects
          setRoles(rolesData.data.map((role: any) => role.name || '').filter(Boolean));
        } catch (apiError: any) {
          console.error('API Error:', apiError);
          
          // Check if it's a token-related error
          if (apiError.response && apiError.response.status === 401) {
            setError('Authentication failed. The system will automatically retry with a new token.');
          } else {
            setError(`Failed to load users: ${apiError.message || 'Unknown error'}`);
          }
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(`Failed to load users: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = async () => {
    try {
      setLoading(true);
      const createdUser = await createUser({
        name: newUser.firstName,
        email: newUser.email,
        role: newUser.role,
      });
      
      setUsers([...users, createdUser]);
      setIsAddUserDialogOpen(false);
      setNewUser({ firstName: '', email: '', role: '' });
      showSnackbar('User added successfully', 'success');
    } catch (err) {
      console.error('Error adding user:', err);
      showSnackbar('Failed to add user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      firstName: user.firstName,
      email: user.email,
      role: user.roles && Array.isArray(user.roles) && user.roles.length > 0 && user.roles[0] !== undefined 
        ? user.roles[0] 
        : '',
    });
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const updatedUser = await updateUser(selectedUser.id, {
        firstName: newUser.firstName,
        email: newUser.email,
        role: newUser.role,
      });
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      showSnackbar('User updated successfully', 'success');
    } catch (err) {
      console.error('Error updating user:', err);
      showSnackbar('Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      await deleteUser(selectedUser.id);
      
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      showSnackbar('User deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar('Failed to delete user', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddUserDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>

      <Paper elevation={0} variant="outlined">
        {users.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No users found. Add your first user to get started.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {users.map((user, index) => (
              <Box key={user.id}>
                <ListItem
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body1" color="text.primary">{user.firstName} {user.lastName || ''}</Typography>}
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column' }} component="span">
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ opacity: 0.9 }}
                          component="span"
                        >
                          {user.email}
                        </Typography>
                        {user.roles && Array.isArray(user.roles) && user.roles.length > 0 && (
                          <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }} component="span">
                            {user.roles
                              .filter(role => role !== undefined && role !== null && role !== '')
                              .map((role, roleIndex) => (
                                <Chip
                                  key={roleIndex}
                                  label={role}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    borderColor: alpha(theme.palette.primary.main, 0.3)
                                  }}
                                  component="span"
                                />
                              ))}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" sx={{ mr: 1, color: theme.palette.text.secondary }} onClick={() => handleEditUser(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" sx={{ color: theme.palette.error.main }} onClick={() => handleDeleteClick(user)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < users.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        )}
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onClose={() => setIsAddUserDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  label="Role"
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as string })}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            disabled={!newUser.firstName || !newUser.email || !newUser.role}
          >
            {loading ? <CircularProgress size={24} /> : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onClose={() => setIsEditUserDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  label="Role"
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as string })}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditUserDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            disabled={!newUser.firstName || !newUser.email || !newUser.role}
          >
            {loading ? <CircularProgress size={24} /> : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUser?.firstName}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteUser} 
            variant="contained" 
            color="error"
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 