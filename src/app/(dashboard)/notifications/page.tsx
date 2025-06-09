'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemButton, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Chip, 
  Button, 
  Divider, 
  Tab, 
  Tabs, 
  Tooltip, 
  Menu,
  MenuItem,
  alpha,
  Badge,
  useTheme,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Check as CheckIcon,
  Delete as DeleteIcon, 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  DeleteSweep as DeleteSweepIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { useNotification, Notification, NotificationSeverity } from '@/contexts/NotificationContext';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import TestNotification from './test-notification';

// Helper function to get the icon for a notification based on severity
const getSeverityIcon = (severity: NotificationSeverity) => {
  switch (severity) {
    case 'success':
      return <CheckCircleIcon color="success" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'info':
    default:
      return <InfoIcon color="info" />;
  }
};

// Helper function to get the color for a notification based on severity
const getSeverityColor = (theme: any, severity: NotificationSeverity) => {
  switch (severity) {
    case 'success':
      return theme.palette.success.main;
    case 'error':
      return theme.palette.error.main;
    case 'warning':
      return theme.palette.warning.main;
    case 'info':
    default:
      return theme.palette.info.main;
  }
};

export default function NotificationsPage() {
  const theme = useTheme();
  const router = useRouter();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    unreadCount
  } = useNotification();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedNotifications, setSortedNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotificationId(id);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotificationId(null);
  };
  
  // Filter and sort notifications whenever dependencies change
  useEffect(() => {
    let filtered = [...notifications];
    
    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter(notif => !notif.read);
    }
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        notif => 
          notif.message.toLowerCase().includes(query) || 
          (notif.title && notif.title.toLowerCase().includes(query))
      );
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setSortedNotifications(filtered);
  }, [notifications, filter, searchQuery]);

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate to link if provided
    if (notification.link) {
      router.push(notification.link);
    }
  };

  // Handle tab change for filtering
  const handleTabChange = (_: React.SyntheticEvent, newValue: 'all' | 'unread') => {
    setFilter(newValue);
  };

  // Format notification timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } else {
      return format(timestamp, 'MMM dd, yyyy HH:mm');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
      }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Notifications
          {unreadCount > 0 && (
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{ ml: 2 }}
            >
              <NotificationsIcon fontSize="large" color="action" />
            </Badge>
          )}
        </Typography>
        
        <Box>
          <Button 
            startIcon={<DoneAllIcon />} 
            onClick={markAllAsRead}
            sx={{ mr: 1 }}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </Button>
          <Button 
            startIcon={<DeleteSweepIcon />} 
            color="error" 
            variant="outlined"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ 
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mb: 3,
          }}>
            <CardHeader title="Filters" />
            <Divider />
            <CardContent>
              <Tabs
                value={filter}
                onChange={handleTabChange}
                orientation="vertical"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>All</Typography>
                      <Chip 
                        label={notifications.length} 
                        size="small" 
                        sx={{ ml: 1 }} 
                      />
                    </Box>
                  } 
                  value="all" 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>Unread</Typography>
                      <Chip 
                        label={unreadCount} 
                        size="small" 
                        color="error" 
                        sx={{ ml: 1 }} 
                      />
                    </Box>
                  } 
                  value="unread" 
                />
              </Tabs>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card elevation={0} sx={{ 
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mb: 3,
          }}>
            <CardHeader 
              title="Notification List" 
              action={
                <TextField
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {sortedNotifications.length > 0 ? (
                <List sx={{ width: '100%', p: 0 }}>
                  {sortedNotifications.map((notification) => {
                    const severityColor = getSeverityColor(theme, notification.severity);
                    
                    return (
                      <React.Fragment key={notification.id}>
                        <ListItem
                          disablePadding
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              onClick={(e) => handleMenuOpen(e, notification.id)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          }
                          sx={{
                            bgcolor: notification.read ? 'transparent' : alpha(severityColor, 0.05),
                            borderLeft: notification.read ? 'none' : `4px solid ${severityColor}`,
                          }}
                        >
                          <ListItemButton onClick={() => handleNotificationClick(notification)}>
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: alpha(severityColor, 0.1),
                                color: severityColor
                              }}>
                                {getSeverityIcon(notification.severity)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography 
                                  variant="subtitle1" 
                                  fontWeight={notification.read ? 400 : 600}
                                >
                                  {notification.title || notification.message}
                                </Typography>
                              }
                              secondary={
                                <>
                                  {notification.title && (
                                    <Typography variant="body2" color="text.secondary">
                                      {notification.message}
                                    </Typography>
                                  )}
                                  <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ display: 'block', mt: 0.5 }}
                                  >
                                    {formatTimestamp(notification.timestamp)}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <NotificationsIcon 
                    sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} 
                  />
                  <Typography color="text.secondary" variant="h6">
                    No notifications found
                  </Typography>
                  <Typography color="text.disabled">
                    {filter === 'unread' 
                      ? "You've read all your notifications" 
                      : searchQuery 
                        ? "No notifications match your search" 
                        : "You don't have any notifications yet"}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Testing Tools */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 3 }}>
        Testing Tools
      </Typography>
      <TestNotification />

      {/* Notification action menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem 
          onClick={() => {
            if (selectedNotificationId) {
              markAsRead(selectedNotificationId);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as read</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedNotificationId) {
              deleteNotification(selectedNotificationId);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
} 