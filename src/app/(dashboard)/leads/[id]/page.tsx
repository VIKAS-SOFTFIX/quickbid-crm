'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Paper,
  Divider,
  Stack,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Card,
  CardContent,
  InputAdornment,
  Fade,
  CardActions,
  Grow,
  Zoom,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Timeline as TimelineIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Share as ShareIcon,
  Note as NoteIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import Link from 'next/link';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
type LeadSource = 'website' | 'referral' | 'social' | 'trade-show' | 'other';
type LeadType = 'enterprise' | 'startup' | 'small-business' | 'individual';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  type: LeadType;
  assignedTo: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  lastContact: string;
  location: string;
  notes: string;
  tags: string[];
  requirements: string[];
  activities: {
    id: string;
    type: 'call' | 'email' | 'meeting' | 'note';
    date: string;
    description: string;
    user: {
      name: string;
      avatar: string;
    };
  }[];
}

// Mock data
const mockLead: Lead = {
  id: '1',
  name: 'John Smith',
  company: 'TechCorp Inc.',
  email: 'john.smith@techcorp.com',
  phone: '+1 (555) 123-4567',
  status: 'qualified',
  source: 'website',
  type: 'enterprise',
  assignedTo: {
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
  },
  createdAt: '2024-02-15',
  lastContact: '2024-02-20',
  location: 'San Francisco, CA',
  notes: 'Interested in enterprise solution',
  tags: ['Enterprise', 'High Priority', 'Software Development'],
  requirements: [
    'Custom software development',
    'Integration with existing systems',
    '24/7 support',
    'Training and documentation',
  ],
  activities: [
    {
      id: '1',
      type: 'call',
      date: '2024-02-20',
      description: 'Initial discovery call - discussed requirements and timeline',
      user: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
    },
    {
      id: '2',
      type: 'email',
      date: '2024-02-19',
      description: 'Sent proposal document and pricing details',
      user: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
    },
    {
      id: '3',
      type: 'meeting',
      date: '2024-02-18',
      description: 'Technical team meeting to discuss architecture',
      user: {
        name: 'Mike Chen',
        avatar: '/avatars/mike.jpg',
      },
    },
  ],
};

const getStatusColor = (status: LeadStatus) => {
  const theme = useTheme();
  switch (status) {
    case 'new':
      return theme.palette.info.main;
    case 'contacted':
      return theme.palette.warning.main;
    case 'qualified':
      return theme.palette.success.main;
    case 'proposal':
      return theme.palette.primary.main;
    case 'negotiation':
      return theme.palette.secondary.main;
    case 'closed-won':
      return theme.palette.success.dark;
    case 'closed-lost':
      return theme.palette.error.main;
    default:
      return theme.palette.grey[500];
  }
};

export default function LeadDetailPage({ params }: any) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      {/* Header Section */}
      <Fade in={true} timeout={800}>
        <Card 
          sx={{ 
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white',
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Lead Details
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={mockLead.status}
                    color="default"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  <Chip
                    icon={<BusinessIcon />}
                    label={mockLead.type}
                    color="default"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {mockLead.company}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1} direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    Edit Lead
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PhoneIcon />}
                    sx={{ 
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    Call Now
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}
      >
        <Tab label="Details" />
        <Tab 
          label={
            <Badge badgeContent={mockLead.activities.length} color="primary">
              Timeline
            </Badge>
          } 
        />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Contact Information Card */}
            <Grow in={true} timeout={800}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{mockLead.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {mockLead.company}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon color="action" />
                      <Typography variant="body2">{mockLead.email}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon color="action" />
                      <Typography variant="body2">{mockLead.phone}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon color="action" />
                      <Typography variant="body2">{mockLead.location}</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button 
                    startIcon={<PhoneIcon />}
                    variant="outlined"
                    onClick={() => {}}
                  >
                    Call Now
                  </Button>
                  <Button 
                    startIcon={<EmailIcon />}
                    variant="contained"
                    onClick={() => {}}
                  >
                    Send Email
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <Tooltip title="Share contact">
                    <IconButton
                      size="small"
                      onClick={() => {}}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grow>

            {/* Notes Section */}
            <Grow in={true} timeout={1000}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Notes & Requirements</Typography>
                    <IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body1">{mockLead.notes}</Typography>
                  {mockLead.requirements.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Requirements:
                      </Typography>
                      <Stack spacing={1}>
                        {mockLead.requirements.map((req, index) => (
                          <Typography key={index} variant="body2" color="text.secondary">
                            • {req}
                          </Typography>
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grow>

            {/* Tags Section */}
            <Grow in={true} timeout={1200}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Tags</Typography>
                    <IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {mockLead.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Status Card */}
              <Zoom in={true} timeout={800}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Status & Assignment
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Current Status
                        </Typography>
                        <Chip
                          label={mockLead.status}
                          sx={{
                            bgcolor: alpha(getStatusColor(mockLead.status), 0.1),
                            color: getStatusColor(mockLead.status),
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Assigned To
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={mockLead.assignedTo.avatar}
                            alt={mockLead.assignedTo.name}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Typography variant="body1">{mockLead.assignedTo.name}</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>

              {/* Quick Actions */}
              <Zoom in={true} timeout={1200}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        fullWidth
                        onClick={() => {}}
                      >
                        Schedule Meeting
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<AccessTimeIcon />}
                        fullWidth
                        onClick={() => {}}
                      >
                        Set Reminder
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SendIcon />}
                        fullWidth
                        onClick={() => {}}
                      >
                        Send Resources
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            </Stack>
          </Grid>
        </Grid>
      )}

      {/* Timeline Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <TextField
                placeholder="Search timeline..."
                size="small"
                value={timelineFilter}
                onChange={(e) => setTimelineFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {}}
            >
              Add Activity
            </Button>
          </Box>

          <Card>
            <CardContent>
              <Box sx={{ position: 'relative', pl: 3 }}>
                {mockLead.activities.map((activity, index) => (
                  <Fade in={true} key={activity.id} timeout={500 + index * 100}>
                    <Box
                      sx={{
                        position: 'relative',
                        pb: 3,
                        '&:last-child': { pb: 0 },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -9,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: 'divider',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: -12,
                          top: 0,
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ color: theme.palette.primary.main }}>
                          {getActivityIcon(activity.type)}
                        </Box>
                        <Box sx={{ flex: 1, p: 2, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.date} by {activity.user.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Fade>
                ))}

                {mockLead.activities.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No timeline events found. Add an activity to get started.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

// Helper function to get activity icon
const getActivityIcon = (type: 'call' | 'email' | 'meeting' | 'note') => {
  switch (type) {
    case 'call':
      return <PhoneIcon />;
    case 'email':
      return <EmailIcon />;
    case 'meeting':
      return <ScheduleIcon />;
    case 'note':
      return <NoteIcon />;
    default:
      return <HistoryIcon />;
  }
}; 