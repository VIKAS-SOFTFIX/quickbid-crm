'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  VideoCall as VideoCallIcon,
  PhoneInTalk as PhoneInTalkIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  SupportAgent as SupportAgentIcon,
  Note as NoteIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'sales', 'demonstrator'] },
  { text: 'Leads', icon: <PeopleIcon />, path: '/leads', roles: ['admin', 'sales'] },
  { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments', roles: ['admin', 'sales'] },
  // { text: 'Tenders', icon: <GavelIcon />, path: '/tenders', roles: ['admin', 'sales'] },
  // { text: 'Training', icon: <SchoolIcon />, path: '/training', roles: ['admin', 'sales'] },
  // { text: 'Compliance', icon: <SecurityIcon />, path: '/compliance', roles: ['admin', 'sales'] },
  // { text: 'Documents', icon: <DescriptionIcon />, path: '/documents', roles: ['admin', 'sales'] },
  // { text: 'Reports', icon: <AssessmentIcon />, path: '/reports', roles: ['admin', 'sales'] },
  { text: 'Demo Requests', icon: <VideoCallIcon />, path: '/demo-requests', roles: ['admin', 'sales', 'demonstrator'] },
  { text: 'Callback Requests', icon: <PhoneInTalkIcon />, path: '/callback-requests', roles: ['admin', 'sales'] },
  { text: 'Expert Consultation', icon: <SupportAgentIcon />, path: '/expert-consultation', roles: ['admin', 'sales'] },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const hasAccess = (itemRoles: string[]) => {
    if (!user?.role) return false;
    return itemRoles.includes(user.role);
  };

  const drawer = (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.1,
        pointerEvents: 'none',
      }
    }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          opacity: desktopOpen ? 1 : 0,
          transition: 'opacity 0.2s',
        }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: alpha(theme.palette.secondary.main, 0.15),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05) rotate(5deg)',
                background: alpha(theme.palette.secondary.main, 0.25),
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: '1.5rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              QB
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            QuickBid
          </Typography>
        </Box>
        <IconButton
          onClick={handleDesktopDrawerToggle}
          sx={{
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ p: 1, flex: 1}}>
        {menuItems
          .filter((item) => hasAccess(item.roles))
          .map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: '12px',
                  minHeight: 48,
                  px: 2.5,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'white',
                    },
                  },
                }}
                selected={pathname === item.path}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: desktopOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'white',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: desktopOpen ? 1 : 0,
                    transition: 'opacity 0.2s',
                    '& .MuiListItemText-primary': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'white',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ p: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              minHeight: 48,
              px: 2.5,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: desktopOpen ? 3 : 'auto',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                opacity: desktopOpen ? 1 : 0,
                transition: 'opacity 0.2s',
                '& .MuiListItemText-primary': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'white',
                  },
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : collapsedDrawerWidth}px)` },
          ml: { sm: `${desktopOpen ? drawerWidth : collapsedDrawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDesktopDrawerToggle}
            sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
          >
            {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                flex: 1,
                maxWidth: 400,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Search...
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  {user?.name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 32, 74, 0.1)',
                minWidth: 200,
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { sm: desktopOpen ? drawerWidth : collapsedDrawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 32, 74, 0.15)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: desktopOpen ? drawerWidth : collapsedDrawerWidth,
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 32, 74, 0.15)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : collapsedDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f3f0ec',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M30 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm0 40c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3Cpath d='M45 15c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5zm0 40c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5z'/%3E%3Cpath d='M20 30c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5zm40 0c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5z'/%3E%3Cpath d='M25 35c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm40 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm20 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm40 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm20 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z'/%3E%3Cpath d='M35 25c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm20 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm40 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm20 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z'/%3E%3Cpath d='M40 20c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 40c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3Cpath d='M30 45c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm30 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3Cpath d='M35 40c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3Cpath d='M40 35c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 20c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3Cpath d='M30 40c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm30 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3Cpath d='M35 45c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3Cpath d='M45 40c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3Cpath d='M40 45c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm20 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40 0c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 