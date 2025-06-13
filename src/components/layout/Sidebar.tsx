import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
  Collapse,
  ListItemButton,
  Badge,
  InputBase,
  Avatar,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SupportAgent as SupportAgentIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  ExpandLess,
  ExpandMore,
  Assessment as AssessmentIcon,
  LocalOffer as OffersIcon,
  PhoneInTalk as PhoneInTalkIcon,
  Search as SearchIcon,
  SupervisorAccount as AdminIcon,
  WhatsApp as WhatsAppIcon,
  EventNote as EventNoteIcon,
  QuestionAnswer as WaitlistIcon,
  Badge as BadgeIcon,
  VideoCall as VideoCallIcon,
  Email as EmailIcon,
  Bookmark as BookmarkIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

// Menu structure with categories
const menuCategories = [
  {
    category: 'Overview',
    icon: <DashboardIcon />,
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['Administrator', 'sales', 'demonstrator'] },
    ]
  },
  {
    category: 'Pipeline',
    icon: <AssessmentIcon />,
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
    icon: <EmailIcon />,
    items: [
      { text: 'Email Marketing', icon: <EmailIcon />, path: '/email-marketing', roles: ['Administrator', 'sales', 'demonstrator'] },
      { text: 'WhatsApp Messaging', icon: <WhatsAppIcon />, path: '/whatsapp-messaging', roles: ['Administrator', 'sales'] },
    ]
  },
  {
    category: 'Administration',
    icon: <AdminIcon />,
    items: [
      { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['Administrator'] },
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['Administrator'] },
      { text: 'Auth Status', icon: <SecurityIcon />, path: '/auth-status', roles: ['Administrator'] },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications', roles: ['Administrator', 'sales', 'demonstrator', 'manager'] },
    ]
  }
];

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Pipeline': true,
    'Communications': false,
    'Administration': false
  });
  const { user, hasRole } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  // Set mounted to true after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Log user data to check what we're getting
  useEffect(() => {
    if (user) {
      console.log('User data in Sidebar:', user);
      console.log('User roles:', user.roles);
    }
  }, [user]);

  const userHasRole = (requiredRoles: string[]): boolean => {
    if (!mounted || !user || !user.roles) return false;
    
    return user.roles.some(role => requiredRoles.includes(role));
  };

  const drawerWidth = collapsed ? 80 : 260;

  const drawer = (
    <Box 
      sx={{ 
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* Logo and brand section */}
      <Box 
        sx={{ 
          p: collapsed ? 1 : 3, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              Q
            </Box>
            <Typography 
              variant="h5" 
              component="div" 
              noWrap 
              sx={{ 
                fontWeight: 700,
                background: `-webkit-linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main} 80%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
          QuickBid
        </Typography>
          </Box>
        )}
        
        {collapsed && (
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            Q
          </Box>
        )}
        
        {!isMobile && (
          <IconButton 
            onClick={toggleCollapse}
            size="small"
            sx={{ 
              ml: 1,
              display: collapsed ? 'none' : 'flex',
              borderRadius: '50%',
              width: 24,
              height: 24,
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      {/* Collapsed menu expander */}
      {collapsed && !isMobile && (
        <IconButton 
          onClick={toggleCollapse}
          size="small"
          sx={{ 
            alignSelf: 'center',
            borderRadius: '50%',
            width: 24,
            height: 24,
            mb: 1,
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      )}

      {!collapsed && (
        <Box 
          sx={{ 
            mx: 2, 
            mb: 2,
          display: 'flex',
          alignItems: 'center',
          p: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.common.white, 0.1),
          }}
        >
          <SearchIcon sx={{ color: theme.palette.common.white, opacity: 0.7, fontSize: '1.1rem', mx: 1 }} />
          <InputBase
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: '0.875rem',
              color: theme.palette.common.white,
              '& .MuiInputBase-input::placeholder': {
                color: alpha(theme.palette.common.white, 0.6),
                opacity: 1,
              },
            }}
          />
        </Box>
      )}

      {/* User profile section - only in expanded mode */}
      {!collapsed && mounted && user && (
        <Box 
          sx={{ 
            mx: 2, 
            mb: 2, 
            p: 2, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.common.white, 0.05),
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              fontWeight: 'bold',
            }}
          >
            {user.firstName?.substring(0, 1) || 'U'}
          </Avatar>
          <Box sx={{ ml: 1.5, overflow: 'hidden' }}>
            <Typography 
              variant="subtitle2" 
              noWrap 
              sx={{ 
                color: theme.palette.common.white,
                fontWeight: 600,
              }}
            >
              {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
            </Typography>
            {user.roles && user.roles.length > 0 && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: alpha(theme.palette.common.white, 0.7),
                  display: 'block',
                }}
              >
                {user.roles[0]}
              </Typography>
            )}
        </Box>
      </Box>
      )}

      <Divider sx={{ bgcolor: alpha(theme.palette.common.white, 0.1), mx: collapsed ? 1 : 2 }} />
      
      {/* Menu section */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
        <List component="nav" sx={{ px: collapsed ? 0 : 1 }}>
        {menuCategories.map((category) => {
          // Filter items based on user roles and search query
          const filteredItems = category.items.filter(item => 
            userHasRole(item.roles) && 
            (searchQuery === '' || item.text.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          // Skip rendering the category if no items match
          if (filteredItems.length === 0) return null;

            // For collapsed view, categories act as direct links except Overview
            if (collapsed && category.category !== 'Overview') {
          return (
            <Box key={category.category}>
                  <Tooltip title={category.category} placement="right">
                    <ListItemButton
                      sx={{
                        my: 0.5,
                        mx: 'auto',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        p: 0,
                        minWidth: 0,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.secondary.main, 0.15),
                        },
                        ...(openCategories[category.category] && {
                          bgcolor: alpha(theme.palette.secondary.main, 0.2),
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.secondary.main,
                          },
                        }),
                      }}
                      onClick={() => handleCategoryClick(category.category)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          color: openCategories[category.category] ? theme.palette.secondary.main : alpha(theme.palette.common.white, 0.7),
                          justifyContent: 'center',
                        }}
                      >
                        {category.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>

                  {/* Still show popup menu when category is clicked */}
                  {openCategories[category.category] && (
                    <Collapse in={true} timeout="auto">
                      <List component="div" disablePadding>
                        {filteredItems.map((item) => (
                          <Tooltip key={item.text} title={item.text} placement="right">
                            <ListItemButton
                              sx={{
                                my: 0.5,
                                mx: 'auto',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                p: 0,
                                minWidth: 0,
                                bgcolor: alpha(theme.palette.common.white, 0.05),
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.common.white, 0.1),
                                },
                              }}
                              onClick={() => router.push(item.path)}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  color: alpha(theme.palette.common.white, 0.7),
                                  justifyContent: 'center',
                                }}
                              >
                                {typeof item.icon === 'object' && 'type' in item.icon && item.icon.type === Badge
                                  ? React.cloneElement(item.icon, {
                                      sx: { '& .MuiBadge-badge': { top: -2, right: -2 } },
                                    })
                                  : item.icon}
                              </ListItemIcon>
                            </ListItemButton>
                          </Tooltip>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            }
            
            // Expanded view - full sidebar
            return (
              <Box key={category.category} sx={{ mb: 1 }}>
                {/* Category heading */}
                {!collapsed && category.category !== 'Overview' && (
        <ListItemButton 
                  onClick={() => handleCategoryClick(category.category)} 
          sx={{ 
                      mb: 0.5,
            py: 1,
                      borderRadius: 2, 
                      bgcolor: openCategories[category.category] 
                        ? alpha(theme.palette.secondary.main, 0.15) 
                        : 'transparent',
            '&:hover': {
                        bgcolor: alpha(theme.palette.secondary.main, 0.2),
            },
          }}
        >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: openCategories[category.category] 
                          ? theme.palette.secondary.main 
                          : alpha(theme.palette.common.white, 0.7),
                      }}
                    >
                      {category.icon}
          </ListItemIcon>
          <ListItemText 
                    primary={category.category} 
            primaryTypographyProps={{ 
                        fontWeight: openCategories[category.category] ? 600 : 500,
                        fontSize: '0.9rem',
                        color: openCategories[category.category] 
                          ? theme.palette.secondary.main 
                          : theme.palette.common.white
            }} 
          />
                    {openCategories[category.category] ? (
                      <ExpandLess sx={{ color: theme.palette.secondary.main }} />
                    ) : (
                      <ExpandMore sx={{ color: alpha(theme.palette.common.white, 0.7) }} />
                    )}
        </ListItemButton>
              )}

                {/* Menu items */}
                <Collapse 
                  in={category.category === 'Overview' || openCategories[category.category] || searchQuery !== ''} 
                  timeout="auto" 
                  unmountOnExit
                >
                  <List 
                    component="div" 
                    disablePadding 
                    sx={{
                      ml: category.category !== 'Overview' ? 2 : 0,
                      '& .MuiListItemButton-root': {
                        borderRadius: 2,
                        mb: 0.5,
                        pl: category.category !== 'Overview' ? 2 : 3,
                        py: 1,
                      }
                    }}
                  >
                    {filteredItems.map((item) => (
            <ListItemButton 
                      key={item.text}
              sx={{ 
                          '&:hover': {
                            bgcolor: alpha(theme.palette.common.white, 0.1),
                          },
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                '&:hover': {
                              bgcolor: alpha(theme.palette.secondary.main, 0.25),
                },
                            '& .MuiListItemIcon-root': {
                              color: theme.palette.secondary.main,
                            },
                            '& .MuiListItemText-primary': {
                              color: theme.palette.secondary.main,
                              fontWeight: 600,
                            }
                          },
                          position: 'relative',
              }}
                      onClick={() => router.push(item.path)}
                        selected={item.text === 'Leads'} // Example of a selected item
            >
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color: alpha(theme.palette.common.white, 0.8),
                          }}
                        >
                        {item.icon}
              </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.875rem',
                          }} 
                        />
            </ListItemButton>
                  ))}
          </List>
        </Collapse>
            </Box>
          );
        })}
      </List>
      </Box>

      {/* Footer section - Version info */}
      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'flex-start',
          mt: 'auto',
        }}
      >
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.5),
              fontSize: '0.7rem',
            }}
          >
            QuickBid CRM v1.2.3
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={true}
          onClose={() => {}}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundImage: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              boxShadow: '0 0 20px rgba(0,0,0,0.15)',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundImage: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              borderRight: 'none',
              boxShadow: '0 0 20px rgba(0,0,0,0.15)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
} 