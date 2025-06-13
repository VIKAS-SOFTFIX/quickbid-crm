'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Switch,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import { fetchRoles, fetchPermissions, updateRolePermissions } from '@/lib/api';

interface Permission {
  _id: string;
  code: string;
  name: string;
  description: string;
  module: string;
  category: string;
}

interface PermissionGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  permissions: Permission[];
}

interface Role {
  _id: any;
  name: string;
  permissions?: string[];
}

interface PermissionsProps {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function Permissions({ showSnackbar }: PermissionsProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [rolePermissions, setRolePermissions] = useState<{ [key: string]: boolean }>({});

  // Icons for permission groups
  const groupIcons: { [key: string]: React.ReactNode } = {
    dashboard: <DashboardIcon />,
    users: <PeopleIcon />,
    leads: <DescriptionIcon />,
    reports: <AssessmentIcon />,
    settings: <SettingsIcon />,
  };

  // Organize permissions into groups
  const organizePermissionsIntoGroups = (permissions: Permission[]) => {
    const groups: { [key: string]: Permission[] } = {};
    console.log(permissions,"permissions");
    
    // Group permissions based on module field
    permissions.forEach((permission: Permission) => {
      if (!permission || !permission.module) return;
      
      const groupId = permission.module;
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(permission);
    });
    
    // Create permission groups with proper icons
    const formattedGroups: PermissionGroup[] = Object.keys(groups).map(groupId => {
      return {
        id: groupId,
        name: groupId.charAt(0).toUpperCase() + groupId.slice(1), // Capitalize
        icon: groupIcons[groupId] || <LockIcon />,
        permissions: groups[groupId],
      };
    });
    
    return formattedGroups;
  };

  // Fetch roles and permissions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rolesData, permissionsData] = await Promise.all([
          fetchRoles(),
          fetchPermissions(),
        ]);
        
        setRoles(rolesData.data);
        setAllPermissions(permissionsData);
        
        // Organize permissions into groups
        const groups = organizePermissionsIntoGroups(permissionsData);
        setPermissionGroups(groups);
        
        // Select the first role by default if available
        if (rolesData.length > 0) {
          setSelectedRoleId(rolesData[0].id);
          
          // Fetch permissions for the selected role
          const roleWithPermissions = rolesData[0];
          const permissionsObj: { [key: string]: boolean } = {};
          
          // Initialize all permissions as false
          permissionsData.forEach((permission: Permission) => {
            permissionsObj[permission._id] = false;
          });
          
          // Set true for permissions that the role has
          if (roleWithPermissions.permissions) {
            roleWithPermissions.permissions.forEach((permissionId: string) => {
              permissionsObj[permissionId] = true;
            });
          }
          
          setRolePermissions(permissionsObj);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load permissions data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    try {
      const roleId = event.target.value as string;
      setSelectedRoleId(roleId);
      setLoading(true);
      
      // Find the selected role
      const selectedRole = roles.find(role => role._id === roleId);
      
      if (selectedRole) {
        const permissionsObj: { [key: string]: boolean } = {};
        
        // Initialize all permissions as false
        allPermissions.forEach(permission => {
          permissionsObj[permission._id] = false;
        });
        
        // Set true for permissions that the role has
        if (selectedRole.permissions) {
          selectedRole.permissions.forEach((permissionId: string) => {
            permissionsObj[permissionId] = true;
          });
        }
        
        setRolePermissions(permissionsObj);
      }
    } catch (err) {
      console.error('Error changing role:', err);
      showSnackbar('Failed to load role permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRolePermissions({
      ...rolePermissions,
      [permissionId]: event.target.checked,
    });
  };

  const handleGroupToggle = (groupId: string) => {
    const groupPermissions = permissionGroups.find(g => g.id === groupId)?.permissions || [];
    const permissionIds = groupPermissions.map(p => p._id);
    
    // Check if all permissions in the group are enabled
    const allEnabled = permissionIds.every(id => rolePermissions[id]);
    
    // Toggle all permissions in the group
    const updatedPermissions = { ...rolePermissions };
    permissionIds.forEach(id => {
      updatedPermissions[id] = !allEnabled;
    });
    
    setRolePermissions(updatedPermissions);
  };

  const savePermissions = async () => {
    if (!selectedRoleId) return;
    
    try {
      setSaving(true);
      
      // Get all permission IDs that are enabled
      const enabledPermissions = Object.keys(rolePermissions).filter(
        permissionId => rolePermissions[permissionId]
      );
      
      await updateRolePermissions(selectedRoleId, enabledPermissions);
      
      showSnackbar('Permissions updated successfully', 'success');
    } catch (err) {
      console.error('Error saving permissions:', err);
      showSnackbar('Failed to update permissions', 'error');
    } finally {
      setSaving(false);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
          Configure permissions for each role to control access to system features
        </Typography>
      </Box>

      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Select Role</InputLabel>
              
              <Select
                labelId="role-select-label"
                value={selectedRoleId}
                label="Select Role"
                onChange={handleRoleChange as any}
                disabled={loading || roles.length === 0}
              >
                {roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={savePermissions}
              color="primary"
              disabled={saving || loading || !selectedRoleId}
            >
              {saving ? 'Saving...' : 'Save Permissions'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {permissionGroups.map((group) => (
            <Grid item xs={12} md={6} key={group.id}>
              <Card variant="outlined">
                <CardHeader
                  avatar={group.icon}
                  title={group.name}
                  action={
                    <FormControlLabel
                      control={
                        <Switch
                          checked={group.permissions.every(p => rolePermissions[p._id])}
                          onChange={() => handleGroupToggle(group.id)}
                        />
                      }
                      label="All"
                    />
                  }
                  sx={{ 
                    pb: 0,
                    '& .MuiCardHeader-action': {
                      margin: 0,
                    },
                  }}
                />
                <CardContent>
                  <FormGroup>
                    {group.permissions.map((permission) => (
                      <FormControlLabel
                        key={permission._id}
                        control={
                          <Checkbox
                            checked={rolePermissions[permission._id] || false}
                            onChange={handlePermissionChange(permission._id)}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {permission.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.9 }}>
                              {permission.description}
                            </Typography>
                          </Box>
                        }
                      />
                    ))}
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
} 