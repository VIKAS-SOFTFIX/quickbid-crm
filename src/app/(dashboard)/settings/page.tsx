'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Container,
  Breadcrumbs,
  Link,
  useTheme,
  alpha,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useSearchParams } from 'next/navigation';

import UserManagement from '@/app/(dashboard)/settings/components/UserManagement/index';
import SystemSettings from '@/app/(dashboard)/settings/components/SystemSettings';
import EmailNotifications from '@/app/(dashboard)/settings/components/EmailNotifications';
import ResourceManagement from '@/app/(dashboard)/settings/components/ResourceManagement';

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
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ pt: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Handle tab selection from URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      const tabIndex = parseInt(tab, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < tabOptions.length) {
        setTabValue(tabIndex);
      }
    }
  }, [searchParams]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const tabOptions = [
    { 
      icon: <AccountCircleIcon />, 
      label: 'User Management',
      description: 'Manage users, roles, and permissions' 
    },
    { 
      icon: <SettingsIcon />, 
      label: 'System',
      description: 'Configure system settings and view API tokens' 
    },
    { 
      icon: <EmailOutlinedIcon />, 
      label: 'Email & Notifications',
      description: 'Set up email templates and notification preferences' 
    },
    { 
      icon: <ArticleIcon />, 
      label: 'Resources',
      description: 'Manage application resources and assets' 
    },
  ];

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
          <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Settings
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your QuickBid CRM system preferences and user access
          </Typography>
        </Box>
      </Box>

      {/* Settings Layout */}
      <Grid container spacing={3}>
        {/* Left sidebar with tabs */}
        <Grid item xs={12} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Tabs
                orientation="vertical"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Settings tabs"
                sx={{
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    py: 2.5,
                    px: 3,
                    minHeight: 'auto',
                    borderLeft: '3px solid transparent',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                }}
              >
                {tabOptions.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.icon}
                    iconPosition="start"
                    label={
                      <Box sx={{ textAlign: 'left', ml: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {tab.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {tab.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </Grid>

        {/* Main content area */}
        <Grid item xs={12} md={9}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {/* User Management Tab */}
              <TabPanel value={tabValue} index={0}>
                <UserManagement showSnackbar={showSnackbar} />
              </TabPanel>

              {/* System Settings Tab */}
              <TabPanel value={tabValue} index={1}>
                <SystemSettings showSnackbar={showSnackbar} />
              </TabPanel>

              {/* Email & Notifications Tab */}
              <TabPanel value={tabValue} index={2}>
                <EmailNotifications showSnackbar={showSnackbar} />
              </TabPanel>

              {/* Resources Tab */}
              <TabPanel value={tabValue} index={3}>
                <ResourceManagement />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': { alignItems: 'center' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 