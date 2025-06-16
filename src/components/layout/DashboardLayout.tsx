'use client';

import { useState, useEffect, useRef } from 'react';
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
  Badge,
  InputBase,
  Button,
  Collapse,
  CircularProgress,
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
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BookmarkBorder as BookmarkIcon,
  Business as BusinessIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

// Menu structure with categories
const menuCategories = [
  {
    category: 'Overview',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['Administrator', 'sales', 'demonstrator'] },
    ]
  },
  {
    category: 'Pipeline',
    items: [
      { text: 'Leads', icon: <PeopleIcon />, path: '/leads', roles: ['Administrator', 'sales'] },
      { 
        text: 'Enterprise Requests', 
        icon: <Badge badgeContent={6} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
                <BusinessIcon />
              </Badge>, 
        path: '/enterprise-dashboard', 
        roles: ['Administrator', 'sales', 'demonstrator', 'manager'] 
      },
      { text: 'Demo Requests', icon: <VideoCallIcon />, path: '/demo-requests', roles: ['Administrator', 'sales', 'demonstrator'] },
      { text: 'Callback Requests', icon: <PhoneInTalkIcon />, path: '/callback-requests', roles: ['Administrator', 'sales'] },
      { text: 'Expert Consultation', icon: <SupportAgentIcon />, path: '/expert-consultation', roles: ['Administrator', 'sales'] },
      { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments', roles: ['Administrator', 'sales'] },
      { text: 'Waitlist', icon: <BookmarkIcon />, path: '/waitlist', roles: ['Administrator', 'sales'] },
    ]
  },
  {
    category: 'Communications',
    items: [
      { text: 'Mail Box', icon: <EmailIcon />, path: '/communications/mailbox', roles: ['Administrator', 'sales', 'demonstrator'] },
      { text: 'Email Marketing', icon: <EmailIcon />, path: '/email-marketing', roles: ['Administrator', 'sales', 'demonstrator'] },
      { text: 'WhatsApp Messaging', icon: <WhatsAppIcon />, path: '/whatsapp-messaging', roles: ['Administrator', 'sales'] },
    ]
  },
  {
    category: 'Administration',
    items: [
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['Administrator'] },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications', roles: ['Administrator', 'sales', 'demonstrator', 'manager'] },
    ]
  }
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  // Add refs for the drawers
  const mobileDrawerRef = useRef(null);
  const desktopDrawerRef = useRef(null);

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Expand the category of the current active path by default
  useEffect(() => {
    if (pathname && isClient) {
      const currentCategory = menuCategories.find(category => 
        category.items.some(item => pathname.startsWith(item.path))
      );
      if (currentCategory) {
        setExpandedCategory(currentCategory.category);
      }
    }
  }, [pathname, isClient]);

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
    if (!user?.roles || user.roles.length === 0) return false;
    return user.roles.some(role => itemRoles.includes(role));
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // If we're server-side rendering, return a minimal layout
  if (!isClient) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const drawer = (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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
      {/* Logo and Brand */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          opacity: desktopOpen ? 1 : 0,
          transition: 'opacity 0.2s',
        }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.secondary.main,
              color: 'white',
              boxShadow: '0 4px 12px rgba(255, 173, 38, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(255, 173, 38, 0.4)',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.2rem',
              }}
            >
              QB
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '1.3rem',
              letterSpacing: '-0.02em',
            }}
          >
            QuickBid
          </Typography>
        </Box>
        <IconButton
          onClick={handleDesktopDrawerToggle}
          sx={{
            color: 'white',
            width: 32,
            height: 32,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* User profile summary in sidebar */}
      {desktopOpen && (
        <Box sx={{ 
          px: 2.5, 
          py: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(theme.palette.secondary.main, 0.3),
              color: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {user?.firstName?.[0]}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: 'white',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.firstName || 'User'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: alpha('#fff', 0.7),
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.roles?.[0] || 'Role'}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Search bar in sidebar */}
      {desktopOpen && (
        <Box sx={{ px: 2.5, py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mx: 1 }} />
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                ml: 1,
                flex: 1,
                color: 'white',
                '& ::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
      }}>
        {menuCategories.map((category) => {
          // Filter items based on role access and search query
          const accessibleItems = category.items.filter(item => 
            hasAccess(item.roles) && 
            (searchQuery === '' || 
             item.text.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          
          // Skip rendering categories with no accessible items
          if (accessibleItems.length === 0) return null;

          return (
            <Box key={category.category} sx={{ py: 1 }}>
              {desktopOpen && (
                <ListItem 
                  sx={{ px: 2.5, py: 1 }}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => toggleCategory(category.category)}
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      {expandedCategory === category.category ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  }
                  onClick={() => toggleCategory(category.category)}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.5)', 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.7rem',
                    }}
                  >
                    {category.category}
                  </Typography>
                </ListItem>
              )}

              <Collapse in={desktopOpen ? (searchQuery !== '' || expandedCategory === category.category) : true}>
                <List sx={{ px: 1.5 }}>
                  {accessibleItems.map((item) => {
                    const isSelected = pathname === item.path;
                    
                    return (
                      <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                            borderRadius: '10px',
                            minHeight: 44,
                            px: 1.5,
                            py: 0.5,
                            position: 'relative',
                            overflow: 'hidden',
                            ...(isSelected && {
                              bgcolor: 'rgba(255, 255, 255, 0.15)',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                borderRadius: '0 2px 2px 0',
                                bgcolor: theme.palette.secondary.main,
                              },
                            }),
                    '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                          selected={isSelected}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                              mr: desktopOpen ? 1.5 : 'auto',
                    justifyContent: 'center',
                              color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)',
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
                                color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)',
                                fontWeight: isSelected ? 600 : 400,
                                fontSize: '0.9rem',
                    },
                  }}
                />
                          {isSelected && desktopOpen && (
                            <KeyboardArrowRightIcon sx={{ 
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '1.2rem' 
                            }} />
                          )}
              </ListItemButton>
            </ListItem>
                    );
                  })}
      </List>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
            justifyContent: desktopOpen ? 'flex-start' : 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            textTransform: 'none',
              '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
            '& .MuiButton-startIcon': {
              mr: desktopOpen ? 1 : 0,
                },
              }}
            >
          {desktopOpen && 'Logout'}
        </Button>
      </Box>
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
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {pathname === '/dashboard' ? 'Dashboard' : 
                 pathname === '/leads' ? 'Leads Management' : 
                 pathname === '/waitlist' ? 'Waitlist' : 
                 pathname === '/appointments' ? 'Appointments' : 
                 pathname === '/demo-requests' ? 'Demo Requests' : 
                 pathname === '/callback-requests' ? 'Callback Requests' : 
                 pathname === '/expert-consultation' ? 'Expert Consultation' : 
                 pathname === '/email-marketing' ? 'Email Marketing' : 
                 pathname === '/whatsapp-messaging' ? 'WhatsApp Messaging' : 
                 pathname === '/settings' ? 'Settings' : 'QuickBid CRM'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                p: 0.75,
                px: 2,
                borderRadius: 20,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                mr: 1,
              }}
            >
              <SearchIcon sx={{ color: alpha(theme.palette.primary.main, 0.6), fontSize: '1.2rem' }} />
              <InputBase
                placeholder="Search..."
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '0.9rem',
                  '& input::placeholder': {
                    color: alpha(theme.palette.text.primary, 0.5),
                    opacity: 1,
                  },
                }}
              />
            </Box>
            
            <Tooltip title="Notifications">
              <IconButton 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
                onClick={() => router.push('/notifications')}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon color="action" />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ 
                  ml: 0.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                  }}
                >
                  {user?.firstName?.[0]}
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
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                {user?.firstName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.firstName || 'User'}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textTransform: 'capitalize' }}>
                  {user?.roles?.[0] || 'Role'}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleMenuClose} dense>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose} dense>Account Settings</MenuItem>
            <MenuItem onClick={() => router.push('/settings')} dense>System Settings</MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} dense sx={{ color: theme.palette.error.main }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
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
          p: { xs: 2, md: 3 },
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : collapsedDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/svg%3E")`,
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 