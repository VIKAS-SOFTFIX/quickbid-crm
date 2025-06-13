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
  Chip,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { fetchRoles, createRole, updateRole, deleteRole } from '@/lib/api';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

interface NewRole {
  name: string;
  description: string;
}

interface RolesProps {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function Roles({ showSnackbar }: RolesProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<NewRole>({
    name: '',
    description: '',
  });

  // Fetch roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rolesData = await fetchRoles();
        setRoles(rolesData.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load roles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddRole = async () => {
    try {
      setLoading(true);
      const createdRole = await createRole({
        name: newRole.name,
        description: newRole.description,
      });
      
      setRoles([...roles, createdRole]);
      setIsAddRoleDialogOpen(false);
      setNewRole({ name: '', description: '' });
      showSnackbar('Role added successfully', 'success');
    } catch (err) {
      console.error('Error adding role:', err);
      showSnackbar('Failed to add role', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
    });
    setIsEditRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;
    
    try {
      setLoading(true);
      const updatedRole = await updateRole(selectedRole.id, {
        name: newRole.name,
        description: newRole.description,
      });
      
      setRoles(roles.map((role: any) => 
        role.id === selectedRole.id ? updatedRole : role
      ));
      setIsEditRoleDialogOpen(false);
      setSelectedRole(null);
      showSnackbar('Role updated successfully', 'success');
    } catch (err) {
      console.error('Error updating role:', err);
      showSnackbar('Failed to update role', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    try {
      setLoading(true);
      await deleteRole(selectedRole.id);
      
      setRoles(roles.filter(role => role.id !== selectedRole.id));
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
      showSnackbar('Role deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting role:', err);
      showSnackbar('Failed to delete role', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && roles.length === 0) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
          Define roles to manage permissions and access levels for different user types
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddRoleDialogOpen(true)}
        >
          Add Role
        </Button>
      </Box>

      <Paper elevation={0} variant="outlined">
        {roles.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No roles found. Add your first role to get started.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {roles.map((role, index) => (
              <Box key={role.id}>
                <ListItem
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {role.name}
                        {/* <Chip 
                          icon={<PeopleIcon />} 
                          label={`${role.userCount} users`} 
                          size="small" 
                          sx={{ ml: 2, color: theme.palette.text.primary }} 
                          variant="outlined"
                        /> */}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                        {role.description}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" sx={{ mr: 1 }} onClick={() => handleEditRole(role)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteClick(role)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < roles.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onClose={() => setIsAddRoleDialogOpen(false)}>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddRoleDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddRole} 
            variant="contained"
            disabled={!newRole.name}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onClose={() => setIsEditRoleDialogOpen(false)}>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditRoleDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateRole} 
            variant="contained"
            disabled={!newRole.name}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the {selectedRole?.name} role? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Warning: This may affect users assigned to this role.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteRole} 
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