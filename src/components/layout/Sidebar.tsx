import {
  Box,
  Drawer,
  List,
  ListItem,
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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { useAuth } from '@/contexts/AuthContext';

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

  const drawerWidth = 240;

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          QuickBid
        </Typography>
        {mounted && user && user.roles && user.roles.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {user.roles[0]} Role
          </Typography>
        )}
      </Box>
      <Divider />
      
      {/* Add search box */}
      <Box sx={{ px: 2, py: 1 }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}>
          <SearchIcon sx={{ color: alpha(theme.palette.text.secondary, 0.7), fontSize: '1rem', mx: 0.5 }} />
          <InputBase
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              ml: 0.5,
              flex: 1,
              fontSize: '0.875rem',
            }}
          />
        </Box>
      </Box>
      
      <List>
        {menuCategories.map((category) => {
          // Filter items based on user roles and search query
          const filteredItems = category.items.filter(item => 
            userHasRole(item.roles) && 
            (searchQuery === '' || item.text.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          // Skip rendering the category if no items match
          if (filteredItems.length === 0) return null;

          return (
            <Box key={category.category}>
              {category.category !== 'Overview' && (
        <ListItemButton 
                  onClick={() => handleCategoryClick(category.category)} 
          sx={{ 
            py: 1,
                    bgcolor: openCategories[category.category] ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.12),
            },
          }}
        >
          <ListItemIcon>
                    {category.category === 'Pipeline' && <AssessmentIcon color={openCategories[category.category] ? "primary" : "inherit"} />}
                    {category.category === 'Communications' && <EmailIcon color={openCategories[category.category] ? "primary" : "inherit"} />}
                    {category.category === 'Administration' && <AdminIcon color={openCategories[category.category] ? "primary" : "inherit"} />}
          </ListItemIcon>
          <ListItemText 
                    primary={category.category} 
            primaryTypographyProps={{ 
                      fontWeight: openCategories[category.category] ? 600 : 400,
                      color: openCategories[category.category] ? theme.palette.primary.main : 'inherit' 
            }} 
          />
                  {openCategories[category.category] ? <ExpandLess color="primary" /> : <ExpandMore />}
        </ListItemButton>
              )}

              {/* For Overview category or if the category is expanded */}
              <Collapse in={category.category === 'Overview' || openCategories[category.category] || searchQuery !== ''} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                  {filteredItems.map((item, index) => (
            <ListItemButton 
                      key={item.text}
              sx={{ 
                        pl: category.category === 'Overview' ? 2 : 4,
                py: 1.2,
                        ...(category.category === 'Pipeline' && index === 0 && {
                borderLeft: `4px solid ${alpha(theme.palette.primary.main, 0.8)}`,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }),
                '&:hover': {
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                },
              }}
                      onClick={() => router.push(item.path)}
            >
              <ListItemIcon>
                        {item.icon}
              </ListItemIcon>
                      <ListItemText primary={item.text} />
            </ListItemButton>
                  ))}
          </List>
        </Collapse>
            </Box>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
} 