'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';

interface EmailNotificationsProps {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function EmailNotifications({ showSnackbar }: EmailNotificationsProps) {
  const theme = useTheme();
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: 'smtp.quickbid.co.in',
    smtpPort: '587',
    username: 'noreply@quickbid.co.in',
    password: '********',
    encryption: 'tls',
  });

  const handleEmailConfigChange = (field: keyof typeof emailConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailConfig({
      ...emailConfig,
      [field]: e.target.value,
    });
  };

  const handleEncryptionChange = (e: any) => {
    setEmailConfig({
      ...emailConfig,
      encryption: e.target.value,
    });
  };

  const testEmailConfiguration = () => {
    // In a real app, you would test the email configuration here
    showSnackbar('Email test sent successfully', 'success');
  };

  const handleEditTemplate = (templateName: string) => {
    // In a real app, you would open the template editor here
    showSnackbar(`Editing ${templateName} template`, 'info');
  };

  return (
    <>
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
                  value={emailConfig.smtpServer}
                  onChange={handleEmailConfigChange('smtpServer')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SMTP Port"
                  value={emailConfig.smtpPort}
                  onChange={handleEmailConfigChange('smtpPort')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Username"
                  value={emailConfig.username}
                  onChange={handleEmailConfigChange('username')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={emailConfig.password}
                  onChange={handleEmailConfigChange('password')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Encryption</InputLabel>
                  <Select
                    value={emailConfig.encryption}
                    label="Encryption"
                    onChange={handleEncryptionChange}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="ssl">SSL</MenuItem>
                    <MenuItem value="tls">TLS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={testEmailConfiguration}
                >
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
                onClick={() => handleEditTemplate('New Lead Notification')}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="body1" color="text.primary">New Lead Notification</Typography>} 
                  secondary={<Typography variant="body2" color="text.secondary" sx={{ opacity: 0.9 }}>Template for new lead notifications</Typography>}
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
                onClick={() => handleEditTemplate('Demo Request Confirmation')}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="body1" color="text.primary">Demo Request Confirmation</Typography>} 
                  secondary={<Typography variant="body2" color="text.secondary" sx={{ opacity: 0.9 }}>Email sent when a demo is requested</Typography>}
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
                onClick={() => handleEditTemplate('Follow-up Reminder')}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="body1" color="text.primary">Follow-up Reminder</Typography>} 
                  secondary={<Typography variant="body2" color="text.secondary" sx={{ opacity: 0.9 }}>Notification for sales follow-ups</Typography>}
                />
                <IconButton>
                  <EditIcon />
                </IconButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
} 