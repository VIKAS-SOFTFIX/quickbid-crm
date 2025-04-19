'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
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
} from '@mui/material';
import { fetchWaitlistUsers } from '@/services/waitlistService';
import { useRouter } from 'next/navigation';
import {
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
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
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <PeopleIcon />
          </Box>
          <Typography variant="h6" fontWeight="medium">
            Waitlist
          </Typography>
        </Box>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={fetchData}
          disabled={loading}
          size="small"
          sx={{ minWidth: 0, p: 1 }}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, flexGrow: 1, alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : waitlistData.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 3, flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            No entries in the waitlist yet
          </Typography>
        </Box>
      ) : (
        <>
          <List sx={{ p: 0, flexGrow: 1 }}>
            {displayedItems.map((user, index) => (
              <Box key={user._id}>
                <ListItem 
                  sx={{ 
                    px: 1, 
                    py: 1.5,
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 1,
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={truncateText(user.name, 20)}
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {user.companyName} • {user.designation}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          {user.states.slice(0, 2).map((state: string) => (
                            <Chip
                              key={state}
                              label={state}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
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
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < displayedItems.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
            <Typography variant="body2" color="text.secondary">
              {totalCount} entries in waitlist
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={handleViewAll}
              size="small"
              sx={{ minWidth: 0 }}
            >
              View All
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
} 