'use client';

import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
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
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { fetchLeadById, fetchLeadActivities, createLeadActivity, LeadData } from '@/lib/api';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
type LeadSource = 'website' | 'referral' | 'social' | 'trade_show' | 'other';
type LeadType = 'enterprise' | 'startup' | 'small_business' | 'individual';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  type: LeadType;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  location: string;
  notes: string;
  tags: string[];
  requirements?: string[];
}

interface LeadActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  date: string;
  description: string;
  leadId: string;
  assignedTo: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

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
    case 'won':
      return theme.palette.success.dark;
    case 'lost':
      return theme.palette.error.main;
    default:
      return theme.palette.grey[500];
  }
};

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState('');
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityPage, setActivityPage] = useState(1);
  const [activityLimit, setActivityLimit] = useState(10);
  const [totalActivities, setTotalActivities] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch lead details
  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use _id for MongoDB compatibility
        const leadData = await fetchLeadById(params.id);
        console.log('Lead details:', leadData);
        
        if (leadData) {
          setLead({
            id: leadData._id || leadData.id,
            name: leadData.name,
            company: leadData.company || leadData.companyName,
            email: leadData.email,
            phone: leadData.phone,
            status: leadData.status,
            source: leadData.source,
            type: leadData.type,
            assignedTo: leadData.assignedTo,
            createdAt: leadData.createdAt,
            lastContact: leadData.lastContact || leadData.updatedAt,
            location: leadData.location,
            notes: leadData.notes,
            tags: leadData.tags || [],
            requirements: leadData.requirements || [],
          });
        } else {
          setError('Failed to load lead details');
        }
      } catch (err) {
        console.error('Error fetching lead details:', err);
        setError('An error occurred while loading lead details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLeadDetails();
    }
  }, [params.id]);

  // Fetch lead activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!lead) return;
        
        // Use the MongoDB _id for fetching activities
        const leadId = lead.id;
        const activitiesData = await fetchLeadActivities(leadId, activityPage, activityLimit);
        console.log('Lead activities:', activitiesData);
        
        if (activitiesData && activitiesData.data) {
          setActivities(activitiesData.data.map((activity: any) => ({
            id: activity._id || activity.id,
            type: activity.type,
            date: activity.createdAt,
            description: activity.description,
            leadId: activity.leadId,
            assignedTo: activity.assignedTo,
            completed: activity.completed,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt,
            user: {
              name: activity.assignedTo,
              avatar: '',
            }
          })));
          setTotalActivities(activitiesData.totalCount || activitiesData.data.length);
        }
      } catch (err) {
        console.error('Error fetching lead activities:', err);
      }
    };

    if (lead) {
      fetchActivities();
    }
  }, [lead, activityPage, activityLimit]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddActivity = async (type: 'call' | 'email' | 'meeting' | 'note', description: string) => {
    if (!lead) return;
    
    try {
      // Use the MongoDB _id for creating activities
      const leadId = lead.id;
      const newActivity = await createLeadActivity({
        leadId: leadId,
        type,
        description,
        assignedTo: lead.assignedTo,
      });
      
      // Refresh activities
      const activitiesData = await fetchLeadActivities(leadId, activityPage, activityLimit);
      if (activitiesData && activitiesData.data) {
        setActivities(activitiesData.data.map((activity: any) => ({
          id: activity._id || activity.id,
          type: activity.type,
          date: activity.createdAt,
          description: activity.description,
          leadId: activity.leadId,
          assignedTo: activity.assignedTo,
          completed: activity.completed,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
          user: {
            name: activity.assignedTo,
            avatar: '',
          }
        })));
      }
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage(`${type} copied to clipboard`);
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !lead) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error || 'Failed to load lead details'}
      </Alert>
    );
  }

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
                    label={lead.status}
                    color="default"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  <Chip
                    icon={<BusinessIcon />}
                    label={lead.type}
                    color="default"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {lead.company}
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
            <Badge badgeContent={totalActivities} color="primary">
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
                      <Typography variant="h6">{lead.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {lead.company}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon color="action" />
                      <Typography variant="body2">{lead.email}</Typography>
                      <Tooltip title="Copy email">
                        <IconButton 
                          size="small" 
                          onClick={() => handleCopyToClipboard(lead.email, 'Email')}
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon color="action" />
                      <Typography variant="body2">{lead.phone}</Typography>
                      <Tooltip title="Copy phone number">
                        <IconButton 
                          size="small" 
                          onClick={() => handleCopyToClipboard(lead.phone, 'Phone number')}
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon color="action" />
                      <Typography variant="body2">{lead.location || 'Location not specified'}</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions>
            
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
                  <Typography variant="body1">{lead.notes || 'No notes available'}</Typography>
                  {lead.requirements && lead.requirements.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Requirements:
                      </Typography>
                      <Stack spacing={1}>
                        {lead.requirements.map((req, index) => (
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
                    {lead.tags && lead.tags.length > 0 ? (
                      lead.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No tags available
                      </Typography>
                    )}
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
                          label={lead.status}
                          sx={{
                            bgcolor: alpha(getStatusColor(lead.status as LeadStatus), 0.1),
                            color: getStatusColor(lead.status as LeadStatus),
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
                            alt={lead.assignedTo}
                            sx={{ width: 32, height: 32 }}
                          >
                            {lead.assignedTo ? lead.assignedTo.charAt(0).toUpperCase() : 'U'}
                          </Avatar>
                          <Typography variant="body1">{lead.assignedTo || 'Unassigned'}</Typography>
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
                        onClick={() => handleAddActivity('meeting', 'Scheduled meeting with ' + lead.name)}
                      >
                        Schedule Meeting
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<AccessTimeIcon />}
                        fullWidth
                        onClick={() => handleAddActivity('note', 'Set reminder for follow-up')}
                      >
                        Set Reminder
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SendIcon />}
                        fullWidth
                        onClick={() => handleAddActivity('email', 'Sent resources to ' + lead.name)}
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
              onClick={() => handleAddActivity('note', 'New activity added')}
            >
              Add Activity
            </Button>
          </Box>

          <Card>
            <CardContent>
              <Box sx={{ position: 'relative', pl: 3 }}>
                {activities.length > 0 ? (
                  activities
                    .filter(activity => 
                      !timelineFilter || 
                      activity.description.toLowerCase().includes(timelineFilter.toLowerCase())
                    )
                    .map((activity, index) => (
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
                                {new Date(activity.date).toLocaleDateString()} by {activity.user?.name || activity.assignedTo || 'Unknown'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Fade>
                    ))
                ) : (
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

      {/* Snackbar for copy notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
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