'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  alpha,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
  IconButton,
} from '@mui/material';
import { fetchWaitlistUsers } from '@/services/waitlistService';
import { useRouter } from 'next/navigation';
import {
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  BusinessCenter as BusinessCenterIcon,
  LocationOn as LocationOnIcon,
  Badge as BadgeIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Helper to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Component to show waitlist summary on dashboard
export default function WaitlistSummary() {
  const theme = useTheme();
  const router = useRouter();
  const [waitlistData, setWaitlistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define colors to match the dashboard's colorPalette
  const colors = {
    primary: theme.palette.primary.main,
    background: '#f9fafc',
    cardBg: '#ffffff',
    waitlist: '#5470c6'
  };

  // Fetch waitlist data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWaitlistUsers();
      setWaitlistData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch waitlist data:', err);
      setError('Failed to load waitlist data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle navigate to waitlist page
  const handleViewAll = () => {
    router.push('/waitlist');
  };

  // Determine how many items to display
  const displayLimit = 5;
  const displayedItems = waitlistData.slice(0, displayLimit);
  const totalCount = waitlistData.length;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.cardBg,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
                background: `linear-gradient(135deg, ${colors.waitlist} 0%, ${alpha(colors.waitlist, 0.8)} 100%)`,
                color: 'white',
                boxShadow: `0 4px 12px ${alpha(colors.waitlist, 0.3)}`,
            }}
          >
            <PeopleIcon />
          </Box>
            <Typography variant="h6" fontWeight={600}>
            Waitlist
          </Typography>
        </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
          onClick={fetchData}
          disabled={loading}
          size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
        >
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
      </Box>

      {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            py: { xs: 3, sm: 4 }, 
            flexGrow: 1, 
            alignItems: 'center' 
          }}>
            <CircularProgress size={36} sx={{ color: colors.waitlist }} />
        </Box>
      ) : error ? (
          <Alert severity="error" sx={{ m: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          {error}
        </Alert>
      ) : waitlistData.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: { xs: 4, sm: 5 }, 
            px: 2,
            flexGrow: 1 
          }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(colors.waitlist, 0.1),
                color: colors.waitlist,
                mb: 2,
              }}
            >
              <PeopleIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="body1" fontWeight={500} color="text.primary" align="center" sx={{ mb: 1 }}>
              No entries in waitlist yet
            </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
              Waitlist entries will appear here once available
          </Typography>
        </Box>
      ) : (
        <>
            <List sx={{ p: 0, flexGrow: 1, overflow: 'auto', maxHeight: { xs: '300px', sm: 'auto' } }}>
            {displayedItems.map((user, index) => (
                <Box key={user._id || index}>
                <ListItem 
                  sx={{ 
                      px: { xs: 2, sm: 3 }, 
                      py: { xs: 1.5, sm: 2 },
                    '&:hover': { 
                        bgcolor: alpha(colors.waitlist, 0.03),
                    },
                  }}
                >
                  <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(colors.waitlist, 0.15),
                          color: colors.waitlist,
                          fontWeight: 600,
                        }}
                      >
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                          {truncateText(user.name, 20)}
                        </Typography>
                      }
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <BusinessCenterIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                            <Typography variant="caption" color="text.secondary" sx={{ 
                              maxWidth: { xs: '160px', sm: '100%' }, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                          {user.companyName} • {user.designation}
                        </Typography>
                          </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          {user.states.slice(0, 2).map((state: string) => (
                            <Chip
                              key={state}
                              label={state}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                  bgcolor: alpha(colors.waitlist, 0.1),
                                  color: colors.waitlist,
                                  fontWeight: 500,
                                  borderRadius: 1,
                              }}
                            />
                          ))}
                          {user.states.length > 2 && (
                            <Chip
                              label={`+${user.states.length - 2}`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                color: theme.palette.secondary.main,
                                  fontWeight: 500,
                                  borderRadius: 1,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                  {index < displayedItems.length - 1 && <Divider component="li" sx={{ opacity: 0.5 }} />}
              </Box>
            ))}
          </List>

            <Box sx={{ 
              px: { xs: 2, sm: 3 }, 
              py: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              bgcolor: alpha(colors.background, 0.5),
            }}>
              <Chip 
                label={`${totalCount} entries`} 
                size="small"
                sx={{
                  height: 24,
                  bgcolor: alpha(colors.waitlist, 0.1),
                  color: colors.waitlist,
                  fontWeight: 600,
                  borderRadius: 1.5,
                }}
              />
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={handleViewAll}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
            >
              View All
            </Button>
          </Box>
        </>
      )}
      </CardContent>
    </Card>
  );
} 