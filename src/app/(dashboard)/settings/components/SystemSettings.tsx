'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Divider,
  useTheme,
  Card,
  CardContent,
  alpha,
  Chip,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import StorageIcon from '@mui/icons-material/Storage';

interface SystemSettingsProps {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function SystemSettings({ showSnackbar }: SystemSettingsProps) {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    whatsappIntegration: false,
    demoRequestFeature: true,
    autoBackup: true,
    dataSyncing: false,
  });

  const handleToggle = (setting: keyof typeof settings) => () => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
    
    // Show success message
    showSnackbar(`${setting} setting updated`, 'success');
  };

  const settingsList = [
    {
      id: 'twoFactorAuth',
      icon: <SecurityIcon />,
      title: 'Two-Factor Authentication',
      description: 'Enable additional security for user accounts',
      value: settings.twoFactorAuth,
      color: theme.palette.success.main,
    },
    {
      id: 'emailNotifications',
      icon: <NotificationsIcon />,
      title: 'Email Notifications',
      description: 'Receive notifications about new leads and updates',
      value: settings.emailNotifications,
      color: theme.palette.info.main,
    },
    {
      id: 'whatsappIntegration',
      icon: <WhatsAppIcon />,
      title: 'WhatsApp Integration',
      description: 'Enable WhatsApp notifications and messaging',
      value: settings.whatsappIntegration,
      color: theme.palette.success.main,
    },
    {
      id: 'demoRequestFeature',
      icon: <AppsIcon />,
      title: 'Demo Request Feature',
      description: 'Allow users to request product demonstrations',
      value: settings.demoRequestFeature,
      color: theme.palette.primary.main,
    },
    {
      id: 'autoBackup',
      icon: <StorageIcon />,
      title: 'Automatic Backups',
      description: 'Schedule regular backups of your data',
      value: settings.autoBackup,
      color: theme.palette.warning.main,
    },
    {
      id: 'dataSyncing',
      icon: <CloudSyncIcon />,
      title: 'Cloud Data Syncing',
      description: 'Keep data synchronized across multiple devices',
      value: settings.dataSyncing,
      color: theme.palette.info.main,
    },
  ];

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          System Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your system settings and API integration options
        </Typography>
      </Box>

      <Card 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          borderColor: alpha(theme.palette.divider, 0.7)
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Feature Settings
          </Typography>
          
          <List sx={{ width: '100%' }}>
            {settingsList.map((setting, index) => (
              <Box key={setting.id}>
                <ListItem 
                  sx={{ 
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        color: setting.value ? setting.color : alpha(theme.palette.text.secondary, 0.6),
                        bgcolor: setting.value ? alpha(setting.color, 0.1) : alpha(theme.palette.action.hover, 0.5),
                      }}
                    >
                      {setting.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {setting.title}
                        </Typography>
                        {setting.value && (
                          <Chip 
                            label="Enabled" 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              bgcolor: alpha(setting.color, 0.1),
                              color: setting.color,
                              fontWeight: 500,
                            }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ opacity: 0.9, mt: 0.5 }}
                      >
                        {setting.description}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Switch 
                      checked={setting.value}
                      onChange={handleToggle(setting.id as keyof typeof settings)}
                      color={setting.value ? 'primary' : 'default'}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {index < settingsList.length - 1 && (
                  <Divider variant="inset" component="li" sx={{ ml: 7 }} />
                )}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
} 