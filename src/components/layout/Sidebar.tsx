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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [openPipeline, setOpenPipeline] = useState(true);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set mounted to true after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePipelineClick = () => {
    setOpenPipeline(!openPipeline);
  };

  const drawerWidth = 240;

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          QuickBid
        </Typography>
        {mounted && user && (
          <Typography variant="caption" color="text.secondary">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Role
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
        <ListItem
          onClick={() => router.push('/dashboard')}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            display: searchQuery === '' || 'dashboard'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
          }}
        >
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          onClick={() => router.push('/leads')}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            display: searchQuery === '' || 'leads'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
          }}
        >
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Leads" />
        </ListItem>

        {/* Pipeline Section - Visible for all roles */}
        <ListItemButton 
          onClick={handlePipelineClick} 
          sx={{ 
            py: 1,
            bgcolor: openPipeline ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.12),
            },
            display: searchQuery === '' || 'pipeline'.includes(searchQuery.toLowerCase()) || 
                    'enterprise requests'.includes(searchQuery.toLowerCase()) ||
                    'demo requests'.includes(searchQuery.toLowerCase()) ||
                    'call back request'.includes(searchQuery.toLowerCase()) ||
                    'expert consultation'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
          }}
        >
          <ListItemIcon>
            <AssessmentIcon color={openPipeline ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText 
            primary="Pipeline" 
            primaryTypographyProps={{ 
              fontWeight: openPipeline ? 600 : 400,
              color: openPipeline ? theme.palette.primary.main : 'inherit' 
            }} 
          />
          {openPipeline ? <ExpandLess color="primary" /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPipeline || searchQuery !== ''} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <ListItemButton 
              sx={{ 
                pl: 4,
                py: 1.2,
                borderLeft: `4px solid ${alpha(theme.palette.primary.main, 0.8)}`,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
                display: searchQuery === '' || 'enterprise requests'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
              }}
              onClick={() => router.push('/enterprise-dashboard')}
            >
              <ListItemIcon>
                <Badge
                  badgeContent={6}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                    }
                  }}
                >
                  <BusinessIcon color="primary" />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Enterprise Requests" 
                primaryTypographyProps={{ fontWeight: 600, color: theme.palette.primary.main }}
              />
            </ListItemButton>
            <ListItemButton 
              sx={{ 
                pl: 4,
                py: 1.2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                },
                display: searchQuery === '' || 'demo requests'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
              }}
              onClick={() => router.push('/demo-requests')}
            >
              <ListItemIcon>
                <OffersIcon />
              </ListItemIcon>
              <ListItemText primary="Demo Requests" />
            </ListItemButton>
            <ListItemButton 
              sx={{ 
                pl: 4,
                py: 1.2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                },
                display: searchQuery === '' || 'call back request'.includes(searchQuery.toLowerCase()) || 'callback'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
              }}
              onClick={() => router.push('/callback-requests')}
            >
              <ListItemIcon>
                <PhoneInTalkIcon />
              </ListItemIcon>
              <ListItemText primary="Call Back Request" />
            </ListItemButton>
            <ListItemButton 
              sx={{ 
                pl: 4,
                py: 1.2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                },
                display: searchQuery === '' || 'expert consultation'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
              }}
              onClick={() => router.push('/expert-consultation')}
            >
              <ListItemIcon>
                <SupportAgentIcon />
              </ListItemIcon>
              <ListItemText primary="Expert Consultation" />
            </ListItemButton>
          </List>
        </Collapse>

          <ListItem
          onClick={() => router.push('/settings')}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            display: searchQuery === '' || 'settings'.includes(searchQuery.toLowerCase()) ? 'flex' : 'none',
            }}
          >
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
          </ListItem>
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