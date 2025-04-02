'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  Snackbar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Email,
  WhatsApp,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  EmailOutlined as EmailOutlinedIcon,
  Article as ArticleIcon,
  SupervisorAccount as SupervisorAccountIcon,
  CloudUpload as CloudUploadIcon,
  Apps as AppsIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Sample data - replace with real data from your API
const users = [
  {
    id: 1,
    name: 'Sarah Smith',
    email: 'sarah@quickbid.co.in',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Mike Johnson',
    email: 'mike@quickbid.co.in',
    role: 'Sales Manager',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Emily Brown',
    email: 'emily@quickbid.co.in',
    role: 'Sales Representative',
    status: 'Active',
  },
];

const roles = ['Admin', 'Sales Manager', 'Sales Representative'];

// Define interfaces for type safety
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface NewUser {
  name: string;
  email: string;
  role: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    role: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddUser = () => {
    // Handle adding new user
    setIsAddUserDialogOpen(false);
    setNewUser({ name: '', email: '', role: '' });
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'User added successfully',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const navigateToResources = () => {
    router.push('/admin/settings/resources');
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">
          Settings
        </Typography>
      </Box>

      <Paper elevation={0} variant="outlined">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            px: 2,
          }}
        >
          <Tab 
            icon={<AccountCircleIcon />} 
            iconPosition="start" 
            label="User Management" 
          />
          <Tab 
            icon={<SettingsIcon />} 
            iconPosition="start" 
            label="System" 
          />
          <Tab 
            icon={<EmailOutlinedIcon />} 
            iconPosition="start" 
            label="Email & Notifications" 
          />
          <Tab 
            icon={<ArticleIcon />} 
            iconPosition="start" 
            label="Resources" 
          />
        </Tabs>

        {/* User Management Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <SupervisorAccountIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddUserDialogOpen(true)}
            >
              Add User
            </Button>
          </Box>

          <Paper elevation={0} variant="outlined">
            <List sx={{ width: '100%' }}>
              {users.map((user, index) => (
                <>
                  <ListItem
                    key={user.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.email} • ${user.role}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < users.length - 1 && <Divider component="li" />}
                </>
              ))}
            </List>
          </Paper>
        </TabPanel>

        {/* System Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              System Settings
            </Typography>
          </Box>

          <Paper elevation={0} variant="outlined">
            <List sx={{ width: '100%' }}>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Enable additional security for user accounts"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications about new leads and updates"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <WhatsApp />
                </ListItemIcon>
                <ListItemText
                  primary="WhatsApp Integration"
                  secondary="Enable WhatsApp notifications and messaging"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <AppsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Enable Demo Request Feature"
                  secondary="Allow users to request product demonstrations"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </TabPanel>

        {/* Email & Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <EmailOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Email & Notification Settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Email Configuration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="SMTP Server"
                      defaultValue="smtp.quickbid.co.in"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="SMTP Port"
                      defaultValue="587"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Username"
                      defaultValue="noreply@quickbid.co.in"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      defaultValue="********"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Encryption</InputLabel>
                      <Select
                        defaultValue="tls"
                        label="Encryption"
                      >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="ssl">SSL</MenuItem>
                        <MenuItem value="tls">TLS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth>
                      Test Email Configuration
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notification Templates
                </Typography>
                <List>
                  <ListItem 
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                    onClick={() => {
                      // Handle edit notification template
                    }}
                  >
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="New Lead Notification" 
                      secondary="Template for new lead notifications"
                    />
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem 
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                    onClick={() => {
                      // Handle edit notification template
                    }}
                  >
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Demo Request Confirmation" 
                      secondary="Email sent when a demo is requested"
                    />
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem 
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                    onClick={() => {
                      // Handle edit notification template
                    }}
                  >
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Follow-up Reminder" 
                      secondary="Notification for sales follow-ups"
                    />
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Resources Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <ArticleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Resource Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={navigateToResources}
            >
              Manage Resources
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-4px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                onClick={navigateToResources}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon color="primary" sx={{ fontSize: 48, mr: 2 }} />
                    <Typography variant="h6">
                      Demo Scripts
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Manage and organize scripts for product demonstrations, including feature walkthroughs and presentations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-4px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                onClick={navigateToResources}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ArticleIcon color="secondary" sx={{ fontSize: 48, mr: 2 }} />
                    <Typography variant="h6">
                      Call Scripts
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Upload and manage scripts for sales calls, cold calling, and lead follow-ups with objection handling guidelines.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-4px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                onClick={navigateToResources}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CloudUploadIcon color="info" sx={{ fontSize: 48, mr: 2 }} />
                    <Typography variant="h6">
                      Training Materials
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Upload and organize training materials, guides, and videos for sales team onboarding and skill development.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
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
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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
          <Button onClick={handleAddUser} variant="contained">
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 