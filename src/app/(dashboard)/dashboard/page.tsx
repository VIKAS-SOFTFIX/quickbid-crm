'use client';

import { useState } from 'react';
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const stats = [
    {
      title: 'Total Leads',
      value: '1,234',
      change: 12.5,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Demo Requests',
      value: '45',
      change: 8.2,
      icon: <VideoCallIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Callback Requests',
      value: '28',
      change: -3.1,
      icon: <PhoneInTalkIcon />,
      color: theme.palette.success.main,
    },
    {
      title: 'Conversion Rate',
      value: '32%',
      change: 5.4,
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
    },
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

  // Sample data for charts
  const leadData = [
    { name: 'Mon', leads: 65, demos: 12, callbacks: 8 },
    { name: 'Tue', leads: 78, demos: 15, callbacks: 10 },
    { name: 'Wed', leads: 92, demos: 18, callbacks: 12 },
    { name: 'Thu', leads: 85, demos: 14, callbacks: 9 },
    { name: 'Fri', leads: 88, demos: 16, callbacks: 11 },
  ];

  const conversionData = [
    { name: 'New', value: 35 },
    { name: 'Contacted', value: 25 },
    { name: 'Qualified', value: 20 },
    { name: 'Proposal', value: 15 },
    { name: 'Negotiation', value: 5 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your leads today.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MuiMenuItem value="week">This Week</MuiMenuItem>
              <MuiMenuItem value="month">This Month</MuiMenuItem>
              <MuiMenuItem value="quarter">This Quarter</MuiMenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Report">
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Stack>
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
                Lead Activity Trends
              </Typography>
              <Button
                startIcon={<FilterIcon />}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Filter
              </Button>
            </Box>
            <Box sx={{ height: 300, mb: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <ChartTooltip
                    contentStyle={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="demos"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    dot={{ fill: theme.palette.secondary.main, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="callbacks"
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                    dot={{ fill: theme.palette.success.main, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Activities
            </Typography>
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
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Conversion Funnel
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip
                      contentStyle={{
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill={theme.palette.primary.main}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
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