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
  Card,
  CardContent,
  Tab,
  Tabs,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  Skeleton,
  InputBase,
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
  ShowChart as ShowChartIcon,
  AttachMoney as AttachMoneyIcon,
  DataUsage as DataUsageIcon,
  BarChart as BarChartIcon,
  Phone as PhoneIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
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
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { fetchWaitlistUsers } from '@/services/waitlistService';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  chartData?: { name: string; value: number }[];
}

const StatCard = ({ title, value, change, icon, color, chartData }: StatCardProps) => {
  const theme = useTheme();
  const isPositive = change >= 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 4px 20px ${alpha(color, 0.08)}`,
        transition: 'all 0.3s ease-in-out',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', position: 'relative' }}>
        {/* Icon in circle */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            color: 'white',
            boxShadow: `0 4px 14px ${alpha(color, 0.4)}`,
            zIndex: 1,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ mt: 1.5, mb: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              letterSpacing: '-0.02em',
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 500 }}
          >
            {title}
          </Typography>
        </Box>

        {/* Mini chart */}
        {chartData && (
          <Box sx={{ height: 40, width: '100%', mb: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={`colorGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#colorGradient-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: isPositive
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.error.main, 0.1),
            }}
          >
            {isPositive ? (
              <ArrowUpwardIcon
                sx={{ color: theme.palette.success.main, fontSize: 16 }}
              />
            ) : (
              <ArrowDownwardIcon
                sx={{ color: theme.palette.error.main, fontSize: 16 }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isPositive
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                fontWeight: 600,
              }}
            >
              {Math.abs(change)}%
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            vs last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
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
    <Box sx={{ display: 'flex', gap: 2, p: 2, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2 } }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: alpha(getTypeColor(), 0.1),
          color: getTypeColor(),
          flexShrink: 0,
        }}
      >
        {type === 'lead' && <PeopleIcon />}
        {type === 'demo' && <VideoCallIcon />}
        {type === 'callback' && <PhoneInTalkIcon />}
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        {time}
      </Typography>
    </Box>
  );
};

// Helper function to blend two colors based on a ratio (0-1)
const blend = (color1: string, color2: string, ratio: number) => {
  // Parse hex colors to RGB
  const parseHex = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Blend the RGB values
  const c1 = parseHex(color1);
  const c2 = parseHex(color2);
  
  const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
  const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
  const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export default function DashboardPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [timeRange, setTimeRange] = useState('week');
  const [waitlistData, setWaitlistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Enhanced color palette
  const colorPalette = {
    leads: theme.palette.primary.main,
    waitlist: '#5470c6',
    demos: theme.palette.secondary.main,
    closed: '#91cc75',
    background: '#f9fafc',
    cardBg: '#ffffff',
    chartGrid: '#eaecef',
  };

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate mock historical data for mini charts
  const generateMiniChartData = (base: number, variance: number) => {
    return Array.from({ length: 7 }).map((_, i) => ({
      name: i.toString(),
      value: base + Math.random() * variance * (Math.random() > 0.5 ? 1 : -1),
    }));
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
      chartData: generateMiniChartData(200, 50),
    },
    {
      title: 'Waitlist Entries',
      value: loading ? '—' : waitlistCount.toString(),
      change: 34.2,
      icon: <GroupIcon />,
      color: colorPalette.waitlist,
      chartData: generateMiniChartData(150, 30),
    },
    {
      title: 'Demo Requests',
      value: '45',
      change: 8.2,
      icon: <VideoCallIcon />,
      color: theme.palette.secondary.main,
      chartData: generateMiniChartData(30, 15),
    },
    {
      title: 'Conversion Rate',
      value: '32%',
      change: 5.4,
      icon: <TrendingUpIcon />,
      color: colorPalette.closed,
      chartData: generateMiniChartData(25, 10),
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

  // Upcoming appointments
  const upcomingAppointments = [
    { client: 'ABC Company', type: 'Demo', time: '10:30 AM', date: 'Today', status: 'confirmed' },
    { client: 'XYZ Corp', type: 'Sales Call', time: '2:00 PM', date: 'Today', status: 'pending' },
    { client: 'Global Tech', type: 'Follow-up', time: '11:15 AM', date: 'Tomorrow', status: 'confirmed' },
    { client: 'Acme Inc', type: 'Demo', time: '3:30 PM', date: 'Tomorrow', status: 'confirmed' },
  ];

  // Pie chart data for lead sources
  const leadSourceData = [
    { name: 'Website', value: 40 },
    { name: 'Referral', value: 25 },
    { name: 'Social Media', value: 20 },
    { name: 'Email', value: 15 },
  ];

  // Colors for pie chart
  const pieChartColors = [
    colorPalette.leads,
    colorPalette.waitlist, 
    colorPalette.demos,
    colorPalette.closed
  ];

  return (
    <Box sx={{ 
      py: 2,
      px: { xs: 1, sm: 2 },
      backgroundColor: colorPalette.background,
      minHeight: '100%',
    }}>
      {/* Page header */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: { xs: 2, md: 3 },
          gap: 2,
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: theme.palette.grey[800],
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              mb: 0.5,
              letterSpacing: '-0.01em',
            }}
          >
            Welcome back, {user?.name?.split(' ')[0]}!
          </Typography>
          <Typography 
            variant="body1"
            color="text.secondary"
            sx={{ opacity: 0.85 }}
          >
            Here's what's happening with your sales today
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          alignSelf: { xs: 'flex-end', sm: 'center' },
          '& .MuiButton-root': {
            boxShadow: 'none',
          }
        }}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              displayEmpty
              sx={{ 
                borderRadius: 2,
                height: 40,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': { 
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <MenuItem value="day">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              height: 40,
              px: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.85)} 100%)`,
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 100%)`,
              },
              '&:disabled': {
                opacity: 0.7,
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Stats cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main content */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Main area with charts and activities */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
            {/* Chart card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                overflow: 'hidden',
                backgroundColor: colorPalette.cardBg,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                height: { xs: 'auto', md: '450px' }, // Taller on larger screens
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: alpha(theme.palette.divider, 0.1), px: 3, pt: 2 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      minWidth: { xs: 'auto', sm: 120 },
                      px: { xs: 2, sm: 3 },
                    },
                    '& .Mui-selected': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                    }
                  }}
                >
                  <Tab label="Sales Overview" />
                  <Tab label="Leads" />
                  <Tab label="Conversions" />
                </Tabs>
              </Box>
              
              <CardContent sx={{ 
                p: { xs: 2, sm: 3 }, 
                pt: { xs: 2, sm: 2.5 }, 
                height: { xs: '300px', sm: '350px', md: '400px' },
              }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={36} />
                  </Box>
                ) : leadData.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={leadData}
                      margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colorPalette.leads} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colorPalette.leads} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWaitlist" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colorPalette.waitlist} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colorPalette.waitlist} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colorPalette.chartGrid} />
                      <XAxis 
                        dataKey="name" 
                        stroke={alpha(theme.palette.text.secondary, 0.7)}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: colorPalette.chartGrid }}
                      />
                      <YAxis 
                        stroke={alpha(theme.palette.text.secondary, 0.7)} 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: colorPalette.chartGrid }}
                      />
                      <ChartTooltip 
                        contentStyle={{
                          backgroundColor: alpha(colorPalette.cardBg, 0.95),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0, 32, 74, 0.1)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        stroke={colorPalette.leads}
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: colorPalette.leads }}
                        name="Leads"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="waitlist" 
                        stroke={colorPalette.waitlist} 
                        strokeWidth={3}
                        activeDot={{ r: 7 }} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: colorPalette.waitlist }}
                        name="Waitlist"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="demos" 
                        stroke={colorPalette.demos} 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: colorPalette.demos }}
                        name="Demos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="closed" 
                        stroke={colorPalette.closed} 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: colorPalette.closed }}
                        name="Closed"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Recent activity and appointments */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={7}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    height: '100%',
                    backgroundColor: colorPalette.cardBg,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Recent Activities
                      </Typography>
                      <Button
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          textTransform: 'none',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          }
                        }}
                      >
                        View All
                      </Button>
                    </Box>
                    <Divider sx={{ opacity: 0.5 }} />
                    <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: { xs: '300px', md: 'auto' } }}>
                      {recentActivities.map((activity, index) => (
                        <ActivityItem key={index} {...activity} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    height: '100%',
                    backgroundColor: colorPalette.cardBg,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Upcoming Appointments
                      </Typography>
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
                    <Divider sx={{ opacity: 0.5 }} />
                    <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: { xs: '300px', md: 'auto' } }}>
                      {upcomingAppointments.map((appointment, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            p: { xs: 1.5, sm: 2 }, 
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
                            borderBottom: index !== upcomingAppointments.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.08)}` : 'none',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {appointment.client}
                            </Typography>
                            <Chip 
                              label={appointment.status} 
                              size="small"
                              sx={{ 
                                borderRadius: 1,
                                bgcolor: appointment.status === 'confirmed' 
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : alpha(theme.palette.warning.main, 0.1),
                                color: appointment.status === 'confirmed'
                                  ? theme.palette.success.main
                                  : theme.palette.warning.main,
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.type}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.primary" fontWeight={500}>
                              {appointment.date}, {appointment.time}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Right sidebar with waitlist and other stats */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
            {/* Lead sources */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                backgroundColor: colorPalette.cardBg,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Lead Sources
                </Typography>
                <Box sx={{ height: { xs: '220px', sm: '300px' }, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {leadSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        formatter={(value, name) => [`${value} leads`, name]}
                        contentStyle={{
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0, 32, 74, 0.1)',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            {/* Conversion Funnel Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                backgroundColor: colorPalette.cardBg,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Conversion Funnel
                </Typography>
                <Box sx={{ height: { xs: '220px', sm: '300px' }, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={conversionData}
                      margin={{ top: 0, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={colorPalette.chartGrid} />
                      <XAxis type="number" 
                        stroke={alpha(theme.palette.text.secondary, 0.7)}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis dataKey="name" 
                        type="category" 
                        stroke={alpha(theme.palette.text.secondary, 0.7)} 
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip
                        formatter={(value) => [`${value} leads`]}
                        contentStyle={{
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0, 32, 74, 0.1)',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {conversionData.map((entry, index) => {
                          // Gradient colors from primary to success
                          const ratio = index / (conversionData.length - 1);
                          const color = index === 0 ? colorPalette.waitlist :
                            index === conversionData.length - 1 ? colorPalette.closed :
                            blend(colorPalette.leads, colorPalette.closed, ratio);
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
} 