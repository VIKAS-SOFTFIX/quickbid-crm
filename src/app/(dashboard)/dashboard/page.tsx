'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  Divider,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  MenuItem as MuiMenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  VideoCall as VideoCallIcon,
  PhoneInTalk as PhoneInTalkIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import WaitlistSummary from '@/components/dashboard/WaitlistSummary';
import { fetchWaitlistUsers } from '@/services/waitlistService';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => {
  const theme = useTheme();
  const isPositive = change >= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(color, 0.1),
            color: color,
          }}
        >
          {icon}
        </Box>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isPositive ? (
          <ArrowUpwardIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
        ) : (
          <ArrowDownwardIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />
        )}
        <Typography
          variant="body2"
          sx={{
            color: isPositive ? theme.palette.success.main : theme.palette.error.main,
            fontWeight: 600,
          }}
        >
          {Math.abs(change)}% from last month
        </Typography>
      </Box>
    </Paper>
  );
};

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  type: 'lead' | 'demo' | 'callback';
}

const ActivityItem = ({ title, description, time, type }: ActivityItemProps) => {
  const theme = useTheme();
  const getTypeColor = () => {
    switch (type) {
      case 'lead':
        return theme.palette.primary.main;
      case 'demo':
        return theme.palette.secondary.main;
      case 'callback':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: alpha(getTypeColor(), 0.1),
          color: getTypeColor(),
        }}
      >
        {type === 'lead' && <PeopleIcon />}
        {type === 'demo' && <VideoCallIcon />}
        {type === 'callback' && <PhoneInTalkIcon />}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {time}
      </Typography>
    </Box>
  );
};

export default function DashboardPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [timeRange, setTimeRange] = useState('week');
  const [waitlistData, setWaitlistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch waitlist data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await fetchWaitlistUsers();
        setWaitlistData(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch waitlist data:', err);
        setError('Failed to load waitlist data. Using sample data instead.');
        // Keep any existing data or fall back to empty array
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await fetchWaitlistUsers();
      setWaitlistData(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to refresh waitlist data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare stats data with real waitlist count
  const waitlistCount = waitlistData.length;
  
  const stats = [
    {
      title: 'Total Leads',
      value: '1,234',
      change: 12.5,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Waitlist Entries',
      value: loading ? '—' : waitlistCount.toString(),
      change: 34.2,
      icon: <GroupIcon />,
      color: theme.palette.info.dark,
    },
    {
      title: 'Demo Requests',
      value: '45',
      change: 8.2,
      icon: <VideoCallIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Conversion Rate',
      value: '32%',
      change: 5.4,
      icon: <TrendingUpIcon />,
      color: theme.palette.success.main,
    },
  ];

  // Generate mock historical data based on current waitlist count
  const generateHistoricalData = () => {
    // Mock monthly growth pattern (starting from current count and working backwards)
    const growth = [1, 0.75, 0.85, 0.65, 0.55, 0.4, 0.2];
    const months = ['Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'];
    
    return months.map((month, index) => {
      // Calculate historical waitlist count based on growth factors
      const waitlistValue = index === 0 
        ? waitlistCount 
        : Math.round(waitlistCount * growth[index]);
      
      return {
        name: month,
        leads: 400 - (index * 30),
        demos: 240 - (index * 20),
        closed: 120 - (index * 10),
        waitlist: waitlistValue,
      };
    }).reverse(); // Reverse to get chronological order
  };

  // Use real data for current count, with historical trend
  const leadData = loading ? [] : generateHistoricalData();

  // Create conversion funnel with real waitlist count
  const conversionData = [
    { name: 'Waitlist', value: loading ? 0 : waitlistCount },
    { name: 'New Leads', value: 35 },
    { name: 'Contacted', value: 25 },
    { name: 'Qualified', value: 20 },
    { name: 'Proposal', value: 15 },
    { name: 'Closed', value: 5 },
  ];

  const recentActivities = [
    {
      title: 'New Lead Assigned',
      description: 'John Doe from ABC Corp',
      time: '2 hours ago',
      type: 'lead' as const,
    },
    {
      title: 'Demo Scheduled',
      description: 'Product demo with XYZ Company',
      time: '4 hours ago',
      type: 'demo' as const,
    },
    {
      title: 'Callback Request',
      description: 'Sarah Smith requested a callback',
      time: '5 hours ago',
      type: 'callback' as const,
    },
    {
      title: 'Lead Updated',
      description: 'Contact information updated for ABC Corp',
      time: '6 hours ago',
      type: 'lead' as const,
    },
  ];

  const teamPerformance = [
    { name: 'John Doe', leads: 45, demos: 12, conversion: 75 },
    { name: 'Jane Smith', leads: 38, demos: 10, conversion: 68 },
    { name: 'Mike Johnson', leads: 42, demos: 15, conversion: 82 },
    { name: 'Sarah Wilson', leads: 35, demos: 8, conversion: 71 },
  ];

  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Refresh Data
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleMenuOpen}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            {timeRange === 'week'
              ? 'This Week'
              : timeRange === 'month'
              ? 'This Month'
              : timeRange === 'quarter'
              ? 'This Quarter'
              : 'Custom'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Export
          </Button>
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
          <MenuItem onClick={handleMenuClose}>View All</MenuItem>
          <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        </Menu>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Lead Activity & Waitlist Trends
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: theme.palette.info.dark, borderRadius: '50%' }} />
                  <Typography variant="caption" color="text.secondary">Waitlist</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: theme.palette.primary.main, borderRadius: '50%' }} />
                  <Typography variant="caption" color="text.secondary">Leads</Typography>
                </Box>
                <Button
                  startIcon={<FilterIcon />}
                  size="small"
                  sx={{ borderRadius: 2, ml: 1 }}
                >
                  Filter
                </Button>
              </Box>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : leadData.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={leadData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <ChartTooltip 
                    contentStyle={{
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(0, 32, 74, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waitlist" 
                    stroke={theme.palette.info.dark} 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                  />
                  <Line type="monotone" dataKey="demos" stroke={theme.palette.secondary.main} strokeWidth={2} />
                  <Line type="monotone" dataKey="closed" stroke={theme.palette.success.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <WaitlistSummary />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Activities
              </Typography>
            </Box>
            <Box>
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Client Journey Funnel
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                From waitlist to closed deals
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, Math.max(100, waitlistCount + 10)]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <ChartTooltip
                        formatter={(value) => [`${value} clients`, null]}
                        contentStyle={{
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill={theme.palette.primary.main}
                        radius={[0, 4, 4, 0]}
                        background={{ fill: alpha(theme.palette.primary.main, 0.1) }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Team Performance
              </Typography>
              <Box>
                {teamPerformance.map((member, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        {member.name[0]}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ flex: 1 }}>
                        {member.name}
                      </Typography>
                      <Chip
                        label={`${member.conversion}%`}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {member.leads} leads
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.demos} demos
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={member.conversion}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: theme.palette.success.main,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
} 