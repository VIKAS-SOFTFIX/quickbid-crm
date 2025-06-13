'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Badge,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockIcon from '@mui/icons-material/Lock';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import UserList from '@/app/(dashboard)/settings/components/UserManagement/UserList';
import Roles from '@/app/(dashboard)/settings/components/UserManagement/Roles';
import Permissions from '@/app/(dashboard)/settings/components/UserManagement/Permissions';

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
      id={`user-management-tabpanel-${index}`}
      aria-labelledby={`user-management-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface UserManagementProps {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function UserManagement({ showSnackbar }: UserManagementProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    {
      label: 'User List',
      icon: <PersonIcon />,
      count: 12,
      color: theme.palette.primary.main,
    },
    {
      label: 'Roles',
      icon: <AssignmentIndIcon />,
      count: 5,
      color: theme.palette.success.main,
    },
    {
      label: 'Permissions',
      icon: <LockIcon />,
      count: 24,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
          <SupervisorAccountIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage users, roles, and permissions for your QuickBid CRM system
        </Typography>
      </Box>

      <Card 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          borderColor: alpha(theme.palette.divider, 0.7),
          overflow: 'visible',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              backgroundColor: theme.palette.background.paper,
              '& .MuiTab-root': {
                color: theme.palette.text.primary,
                fontWeight: 500,
                py: 2,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                },
                '& .MuiSvgIcon-root': {
                  mr: 1,
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                icon={tab.icon} 
                iconPosition="start" 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {tab.label}
                    <Chip
                      size="small"
                      label={tab.count}
                      sx={{
                        ml: 1,
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: alpha(tab.color, 0.1),
                        color: tab.color,
                        border: `1px solid ${alpha(tab.color, 0.2)}`,
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <TabPanel value={tabValue} index={0}>
            <UserList showSnackbar={showSnackbar} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Roles showSnackbar={showSnackbar} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Permissions showSnackbar={showSnackbar} />
          </TabPanel>
        </Box>
      </Card>
    </>
  );
} 