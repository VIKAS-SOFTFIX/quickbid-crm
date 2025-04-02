'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Zoom,
  Fade,
  Grow,
  Checkbox,
  FormControlLabel,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
  Note as NoteIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  VideoCall as VideoCallIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as ContentCopyIcon,
  CalendarMonth as CalendarMonthIcon,
  Share as ShareIcon,
  Report as ReportIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  FileCopy as FileCopyIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  WhatsApp as WhatsAppIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  Slideshow as SlideshowIcon,
  OndemandVideo as OndemandVideoIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from '@mui/icons-material';
import {
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: 'demo' | 'note' | 'status_change' | 'follow_up';
  description: string;
  user: string;
}

interface DemoRequest {
  id: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected';
  date: string;
  time: string;
  preferredTime: string;
  leadName: string;
  companyName: string;
  contactPhone: string;
  whatsappNumber?: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  notes: string;
  assignedTo?: {
    name: string;
    phone: string;
  };
  followUpDate?: string;
  timeline: TimelineEvent[];
}

interface DemoResource {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'video' | 'link';
  size?: string;
  url: string;
  category: 'script' | 'presentation' | 'guide' | 'video' | 'other';
  lastUpdated: string;
  isDefault: boolean;
}

const mockDemoRequest: DemoRequest = {
  id: '1',
  status: 'scheduled',
  date: '2024-03-25',
  time: '10:00',
  preferredTime: 'After 2 PM',
  leadName: 'John Doe',
  companyName: 'Tech Solutions Inc.',
  contactPhone: '+91 9876543210',
  whatsappNumber: '+91 9876543210',
  reason: 'Interested in QuickBid enterprise features',
  urgency: 'high',
  notes: 'Prospect has immediate requirement for tender management solution',
  assignedTo: {
    name: 'Rajesh Kumar',
    phone: '+91 9876543211',
  },
  followUpDate: '2024-03-26',
  timeline: [
    {
      id: '1',
      date: '2024-03-25',
      time: '10:00',
      type: 'demo',
      description: 'Initial demo scheduled',
      user: 'Rajesh Kumar',
    },
    {
      id: '2',
      date: '2024-03-25',
      time: '14:30',
      type: 'note',
      description: 'Prepared demo script for enterprise features',
      user: 'Rajesh Kumar',
    },
    {
      id: '3',
      date: '2024-03-26',
      time: '09:15',
      type: 'status_change',
      description: 'Status changed to Scheduled',
      user: 'Rajesh Kumar',
    },
    {
      id: '4',
      date: '2024-03-26',
      time: '11:00',
      type: 'follow_up',
      description: 'Follow-up demo scheduled for tomorrow',
      user: 'Rajesh Kumar',
    },
  ],
};

const mockDemoResources: DemoResource[] = [
  {
    id: '1',
    name: 'Product Demo Script',
    type: 'docx',
    size: '568 KB',
    url: '/resources/product-demo-script.docx',
    category: 'script',
    lastUpdated: '2024-03-23',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Enterprise Features Guide',
    type: 'pdf',
    size: '1.8 MB',
    url: '/resources/enterprise-features-guide.pdf',
    category: 'guide',
    lastUpdated: '2024-03-15',
    isDefault: true,
  },
  {
    id: '3',
    name: 'Product Presentation',
    type: 'pptx',
    size: '2.5 MB', 
    url: '/resources/product-presentation.pptx',
    category: 'presentation',
    lastUpdated: '2024-03-20',
    isDefault: true,
  },
  {
    id: '4',
    name: 'Technical Demo Script',
    type: 'docx',
    size: '720 KB',
    url: '/resources/tech-demo-script.docx',
    category: 'script',
    lastUpdated: '2024-03-22',
    isDefault: false,
  },
  {
    id: '5',
    name: 'Basic Features Video',
    type: 'video',
    url: 'https://example.com/videos/basic-features',
    category: 'video',
    lastUpdated: '2024-03-10',
    isDefault: false,
  },
  {
    id: '6',
    name: 'Integration Guide',
    type: 'pdf',
    size: '3.2 MB',
    url: '/resources/integration-guide.pdf',
    category: 'guide',
    lastUpdated: '2024-03-18',
    isDefault: false,
  },
];

export default function DemoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [demoRequest, setDemoRequest] = useState<DemoRequest | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [openFollowUp, setOpenFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timelineFilter, setTimelineFilter] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const theme = useTheme();
  const phoneRef = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState<DemoResource[]>([]);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [adminResourcesLoading, setAdminResourcesLoading] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'sales' | 'demonstrator'>('admin');
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sendResourcesDialogOpen, setSendResourcesDialogOpen] = useState(false);
  const [resourcesToSend, setResourcesToSend] = useState<string[]>([]);
  const [sendMethod, setSendMethod] = useState<'email' | 'whatsapp'>('email');

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
    setDemoRequest(mockDemoRequest);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (demoRequest) {
      // In a real application, we would fetch the selected resources for this demo
      // For now, let's use the default resources from mock admin settings
      setResources(mockDemoResources.filter(resource => resource.isDefault));
    }
  }, [demoRequest]);

  const handleOpenEdit = () => {
    setEditNotes(demoRequest?.notes || '');
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleSaveNotes = () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
    if (demoRequest) {
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          type: 'note',
          description: 'Notes updated',
          user: 'Rajesh Kumar', // In real app, use actual user
        };

        setDemoRequest({
          ...demoRequest,
          notes: editNotes,
          timeline: [newEvent, ...demoRequest.timeline],
        });

        setSnackbar({
          open: true,
          message: 'Notes updated successfully',
          severity: 'success',
        });
      }
      setSubmitting(false);
    handleCloseEdit();
    }, 800);
  };

  const handleOpenFollowUp = () => {
    setOpenFollowUp(true);
  };

  const handleCloseFollowUp = () => {
    setOpenFollowUp(false);
    setFollowUpDate('');
    setFollowUpNotes('');
  };

  const handleAddFollowUp = () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (demoRequest && followUpDate) {
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          date: followUpDate,
          time: new Date().toLocaleTimeString(),
          type: 'follow_up',
          description: followUpNotes || 'Follow-up scheduled',
          user: 'Rajesh Kumar', // In real app, use actual user
        };
        setDemoRequest({
          ...demoRequest,
          timeline: [newEvent, ...demoRequest.timeline],
          followUpDate: followUpDate,
        });
        
        setSnackbar({
          open: true,
          message: 'Follow-up scheduled successfully',
          severity: 'success',
        });
        
        handleCloseFollowUp();
      }
      setSubmitting(false);
    }, 800);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message,
      severity: 'success',
    });
  };

  const handleUpdateStatus = (status: DemoRequest['status']) => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (demoRequest) {
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          type: 'status_change',
          description: `Status changed to ${status}`,
          user: 'Rajesh Kumar', // In real app, use actual user
        };
        
        setDemoRequest({
          ...demoRequest,
          status,
          timeline: [newEvent, ...demoRequest.timeline],
        });
        
        setSnackbar({
          open: true,
          message: `Status updated to ${status}`,
          severity: 'success',
        });
      }
      setSubmitting(false);
      handleCloseMenu();
    }, 800);
  };

  const getTimelineIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'demo':
        return <VideoCallIcon />;
      case 'note':
        return <NoteIcon />;
      case 'status_change':
        return <PriorityHighIcon />;
      case 'follow_up':
        return <ScheduleIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const filteredTimeline = demoRequest?.timeline.filter(event => {
    if (!timelineFilter) return true;
    return event.type.includes(timelineFilter);
  }) || [];

  const getStatusColor = (status: DemoRequest['status']) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'scheduled':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
      case 'rejected':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getUrgencyColor = (urgency: DemoRequest['urgency']) => {
    switch (urgency) {
      case 'low':
        return theme.palette.info.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'high':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const handleOpenResourceDialog = () => {
    setSelectedResources(resources.map(resource => resource.id));
    setResourceDialogOpen(true);
  };

  const handleCloseResourceDialog = () => {
    setResourceDialogOpen(false);
  };

  const handleResourceCheckboxChange = (resourceId: string) => {
    setSelectedResources(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
  };

  const handleSaveResources = () => {
    setAdminResourcesLoading(true);

    // Simulate API call to save selected resources
    setTimeout(() => {
      // Update the resources based on selection
      const newResources = mockDemoResources.filter(resource => 
        selectedResources.includes(resource.id)
      );
      
      setResources(newResources);
      
      setSnackbar({
        open: true,
        message: 'Demo resources updated successfully',
        severity: 'success',
      });
      
      setAdminResourcesLoading(false);
      handleCloseResourceDialog();
    }, 800);
  };

  const getResourceIcon = (type: DemoResource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileCopyIcon color="primary" />;
      case 'docx':
        return <NoteIcon color="primary" />;
      case 'pptx':
        return <AssignmentIcon color="primary" />;
      case 'video':
        return <VideoCallIcon color="primary" />;
      case 'link':
        return <LinkIcon color="primary" />;
      default:
        return <FileCopyIcon color="primary" />;
    }
  };

  const handleOpenWhatsappDialog = () => {
    setWhatsappNumber(demoRequest?.whatsappNumber || demoRequest?.contactPhone || '');
    setWhatsappDialogOpen(true);
  };

  const handleCloseWhatsappDialog = () => {
    setWhatsappDialogOpen(false);
  };

  const handleSaveWhatsappNumber = () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (demoRequest) {
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          type: 'note',
          description: 'WhatsApp number updated',
          user: 'Rajesh Kumar', // In real app, use actual user
        };

        setDemoRequest({
          ...demoRequest,
          whatsappNumber: whatsappNumber,
          timeline: [newEvent, ...demoRequest.timeline],
        });

        setSnackbar({
          open: true,
          message: 'WhatsApp number updated successfully',
          severity: 'success',
        });
      }
      setSubmitting(false);
      handleCloseWhatsappDialog();
    }, 800);
  };

  const handleOpenSendResourcesDialog = () => {
    setResourcesToSend([]);
    setSendResourcesDialogOpen(true);
  };

  const handleCloseSendResourcesDialog = () => {
    setSendResourcesDialogOpen(false);
  };

  const handleSendResources = () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (demoRequest) {
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          type: 'note',
          description: `Resources sent via ${sendMethod}`,
          user: 'Rajesh Kumar', // In real app, use actual user
        };

        setDemoRequest({
          ...demoRequest,
          timeline: [newEvent, ...demoRequest.timeline],
        });

        setSnackbar({
          open: true,
          message: `Resources sent successfully via ${sendMethod}`,
          severity: 'success',
        });
      }
      setSubmitting(false);
      handleCloseSendResourcesDialog();
    }, 800);
  };

  const handleResourceSendSelection = (resourceId: string) => {
    setResourcesToSend(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
  };

  if (loading) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!demoRequest) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Demo request not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/demo-requests')}
          sx={{ mt: 2 }}
        >
          Go Back to Demo Requests
        </Button>
      </Box>
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
                  Demo Request Details
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={demoRequest.status}
                    color="default"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  <Chip
                    icon={<PriorityHighIcon />}
                    label={demoRequest.urgency}
                    color="default"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {demoRequest.reason}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1} direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenEdit}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
          >
            Edit Notes
          </Button>
          <Button
            variant="contained"
            startIcon={<VideoCallIcon />}
                    sx={{ 
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    Start Demo
          </Button>
                  <IconButton 
                    onClick={handleOpenMenu}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      <Tabs
        value={activeTab}
        onChange={handleChangeTab}
        variant="fullWidth"
        sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}
      >
        <Tab label="Details" />
        <Tab 
          label={
            <Badge badgeContent={filteredTimeline.length} color="primary">
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
                      <Typography variant="h6">{demoRequest.leadName}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {demoRequest.companyName}
            </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Stack spacing={2}>
                    <Box 
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      ref={phoneRef}
                    >
                      <PhoneIcon color="primary" />
                      <Typography variant="body2">{demoRequest.contactPhone}</Typography>
                      <Tooltip title="Copy phone number">
                        <IconButton 
                          size="small"
                          onClick={() => handleCopyToClipboard(
                            demoRequest.contactPhone,
                            'Phone number copied to clipboard'
                          )}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {demoRequest.whatsappNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatsAppIcon color="success" />
                        <Typography variant="body2">{demoRequest.whatsappNumber}</Typography>
                        <Tooltip title="Copy WhatsApp number">
                          <IconButton 
                            size="small"
                            onClick={() => handleCopyToClipboard(
                              demoRequest.whatsappNumber || '',
                              'WhatsApp number copied to clipboard'
                            )}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update WhatsApp number">
                          <IconButton 
                            size="small"
                            onClick={handleOpenWhatsappDialog}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon color="primary" />
                      <Typography>Preferred: {demoRequest.preferredTime}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                    }}>
                      <CalendarMonthIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2">Scheduled Demo</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {demoRequest.date} at {demoRequest.time}
                </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button 
                    startIcon={<PhoneIcon />}
                  variant="outlined"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'Initiating call...',
                        severity: 'info',
                      });
                    }}
                  >
                    Call Now
                  </Button>
                  <Button 
                    startIcon={<VideoCallIcon />}
                    variant="contained"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: 'Starting demo session...',
                        severity: 'info',
                      });
                    }}
                  >
                    Start Demo
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <Tooltip title="Share contact">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSnackbar({
                          open: true,
                          message: 'Sharing options opened',
                          severity: 'info',
                        });
                      }}
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
                    <IconButton size="small" onClick={handleOpenEdit}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body1">{demoRequest.notes}</Typography>
                  {demoRequest.followUpDate && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon color="warning" />
                        <Typography variant="subtitle2" color="warning.main">
                          Follow-up: {demoRequest.followUpDate}
                </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grow>

            {/* Resources Section */}
            <Grow in={true} timeout={1200}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Demo Resources</Typography>
                    {userRole === 'admin' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={handleOpenResourceDialog}
                      >
                        Manage Resources
                      </Button>
                    )}
                  </Box>
                  
                  {resources.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No resources assigned to this demo yet.
            </Typography>
                      {userRole === 'admin' && (
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleOpenResourceDialog}
                          sx={{ mt: 2 }}
                        >
                          Add Resources
                        </Button>
                      )}
                    </Box>
                  ) : (
            <List>
                      {resources.map((resource) => (
                        <React.Fragment key={resource.id}>
                          <ListItem component={Box}>
                  <ListItemIcon>
                              {getResourceIcon(resource.type)}
                  </ListItemIcon>
                  <ListItemText
                              primary={resource.name} 
                              secondary={`${resource.type.toUpperCase()} ${resource.size ? `• ${resource.size}` : ''} • Last updated ${new Date(resource.lastUpdated).toLocaleDateString()}`}
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {resource.category === 'script' && (
                                <Chip
                                  size="small"
                                  label="Script"
                                  color="primary"
                                  sx={{ mr: 1 }}
                                />
                              )}
                              <Tooltip title={`Open ${resource.name}`}>
                                <IconButton 
                                  size="small"
                                  onClick={() => {
                                    setSnackbar({
                                      open: true,
                                      message: `Opening ${resource.name}...`,
                                      severity: 'info',
                                    });
                                  }}
                                  sx={{ color: 
                                    resource.type === 'pdf' ? '#ff5252' :
                                    resource.type === 'docx' ? '#5c6bc0' :
                                    resource.type === 'pptx' ? '#ff8f00' :
                                    resource.type === 'video' ? '#d81b60' :
                                    theme.palette.primary.main
                                  }}
                                >
                                  {resource.type === 'pdf' ? <PictureAsPdfIcon /> :
                                    resource.type === 'docx' ? <DescriptionIcon /> :
                                    resource.type === 'pptx' ? <SlideshowIcon /> :
                                    resource.type === 'video' ? <OndemandVideoIcon /> :
                                    resource.type === 'link' ? <LinkIcon /> :
                                    <InsertDriveFileIcon />
                                  }
                    </IconButton>
                              </Tooltip>
                              <Tooltip title={`Download ${resource.name}`}>
                                <IconButton 
                                  size="small"
                                  onClick={() => {
                                    setSnackbar({
                                      open: true,
                                      message: `Downloading ${resource.name}...`,
                                      severity: 'info',
                                    });
                                  }}
                                >
                                  <DownloadIcon />
                    </IconButton>
                              </Tooltip>
                  </Box>
                </ListItem>
                          {resources.indexOf(resource) < resources.length - 1 && <Divider />}
                        </React.Fragment>
              ))}
            </List>
                  )}
                </CardContent>
              </Card>
            </Grow>
        </Grid>

          {/* Sidebar */}
        <Grid item xs={12} md={4}>
            {/* Assigned Agent Card */}
            <Zoom in={true} timeout={800}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Assigned Agent
                  </Typography>
                  {demoRequest.assignedTo ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>
                          {demoRequest.assignedTo.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {demoRequest.assignedTo.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {demoRequest.assignedTo.phone}
                            </Typography>
                            <Tooltip title="Copy phone number">
                              <IconButton 
                                size="small"
                                onClick={() => handleCopyToClipboard(
                                  demoRequest.assignedTo!.phone,
                                  'Agent phone number copied to clipboard'
                                )}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<PhoneIcon />}
                        fullWidth
                        onClick={() => {
                          setSnackbar({
                            open: true,
                            message: 'Calling agent...',
                            severity: 'info',
                          });
                        }}
                      >
                        Call Agent
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not assigned yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Zoom>

            {/* Status Update Card */}
            <Zoom in={true} timeout={1000}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status Update
                  </Typography>
                  <Grid container spacing={2}>
                    {(['pending', 'scheduled', 'completed', 'cancelled', 'rejected'] as const).map((status) => (
                      <Grid item xs={6} key={status}>
                        <Button
                          variant={demoRequest.status === status ? 'contained' : 'outlined'}
                          fullWidth
                          color={
                            status === 'cancelled' || status === 'rejected' 
                              ? 'error' 
                              : status === 'completed'
                              ? 'success'
                              : 'primary'
                          }
                          onClick={() => handleUpdateStatus(status)}
                          disabled={demoRequest.status === status || submitting}
                          sx={{
                            textTransform: 'capitalize',
                            ...(demoRequest.status === status && { boxShadow: 3 }),
                          }}
                          startIcon={
                            status === 'completed' ? <CheckCircleIcon /> :
                            status === 'rejected' || status === 'cancelled' ? <DeleteIcon /> :
                            undefined
                          }
                        >
                          {status}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Zoom>

            {/* Quick Actions Card */}
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
                      onClick={handleOpenFollowUp}
              >
                      Schedule Follow-up
              </Button>
              <Button
                variant="outlined"
                      startIcon={<AccessTimeIcon />}
                fullWidth
                      onClick={() => {
                        setSnackbar({
                          open: true,
                          message: 'Reminder set for tomorrow',
                          severity: 'success',
                        });
                      }}
                    >
                      Set Reminder
              </Button>
              <Button
                variant="outlined"
                      startIcon={<SendIcon />}
                fullWidth
                      onClick={handleOpenSendResourcesDialog}
              >
                      Send Resources
              </Button>
            </Stack>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      )}

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
              onClick={handleOpenFollowUp}
            >
              Add Activity
            </Button>
          </Box>

          <Card>
            <CardContent>
              <Box sx={{ position: 'relative', pl: 3 }}>
                {filteredTimeline.map((event, index) => (
                  <Fade in={true} key={event.id} timeout={500 + index * 100}>
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
                          {getTimelineIcon(event.type)}
                        </Box>
                        <Box sx={{ flex: 1, p: 2, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {event.description}
                </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.date} at {event.time} by {event.user}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Fade>
                ))}

                {filteredTimeline.length === 0 && (
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

      <Dialog 
        open={openEdit} 
        onClose={handleCloseEdit} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
        }}
      >
        <DialogTitle>Edit Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSaveNotes} 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openFollowUp} 
        onClose={handleCloseFollowUp} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
        }}
      >
        <DialogTitle>Schedule Follow-up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Follow-up Date"
            type="date"
            fullWidth
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={followUpNotes}
            onChange={(e) => setFollowUpNotes(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Send email notification to lead"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFollowUp} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleAddFollowUp} 
            variant="contained" 
            disabled={!followUpDate || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
          >
            {submitting ? 'Scheduling...' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          handleCloseMenu();
          router.push('/demo-requests');
        }}>
          <ListItemIcon>
            <ArrowBackIcon fontSize="small" />
          </ListItemIcon>
          Back to Demo Requests
        </MenuItem>
        <MenuItem onClick={() => {
          handleCopyToClipboard(
            `${window.location.origin}/demo-requests/${demoRequest.id}`,
            'Link copied to clipboard'
          );
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          Share Demo Request
        </MenuItem>
        <MenuItem onClick={() => {
          setSnackbar({
            open: true,
            message: 'Generating PDF report...',
            severity: 'info',
          });
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Export as PDF
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setSnackbar({
            open: true,
            message: 'Report issue feature coming soon',
            severity: 'info',
          });
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <ReportIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Report Issue</Typography>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={resourceDialogOpen}
        onClose={handleCloseResourceDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
        }}
      >
        <DialogTitle>
          Manage Demo Resources
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select resources for this demo from the admin resource library.
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Search resources..."
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <List>
            {mockDemoResources.map((resource) => (
              <React.Fragment key={resource.id}>
                <ListItem 
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <Checkbox
                    checked={selectedResources.includes(resource.id)}
                    onChange={() => handleResourceCheckboxChange(resource.id)}
                  />
                  <ListItemIcon>
                    {getResourceIcon(resource.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={resource.name} 
                    secondary={`${resource.type.toUpperCase()} ${resource.size ? `• ${resource.size}` : ''} • Last updated ${new Date(resource.lastUpdated).toLocaleDateString()}`}
                  />
                  <Chip
                    size="small"
                    label={resource.category}
                    color={resource.category === 'script' ? 'primary' : 'default'}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResourceDialog} disabled={adminResourcesLoading}>Cancel</Button>
          <Button 
            onClick={handleSaveResources} 
            variant="contained" 
            disabled={adminResourcesLoading}
            startIcon={adminResourcesLoading ? <CircularProgress size={20} /> : undefined}
          >
            {adminResourcesLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={whatsappDialogOpen}
        onClose={handleCloseWhatsappDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
        }}
      >
        <DialogTitle>Update WhatsApp Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="WhatsApp Number"
            fullWidth
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsAppIcon color="success" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Enter the WhatsApp number including country code (e.g., +91 98765 43210)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWhatsappDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSaveWhatsappNumber} 
            variant="contained" 
            disabled={!whatsappNumber || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
            color="success"
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={sendResourcesDialogOpen}
        onClose={handleCloseSendResourcesDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
        }}
      >
        <DialogTitle>Send Resources</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select resources to send to the client and choose the sending method.
          </Typography>
          
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              row
              value={sendMethod}
              onChange={(e) => setSendMethod(e.target.value as 'email' | 'whatsapp')}
            >
              <FormControlLabel value="email" control={<Radio />} label="Email" />
              <FormControlLabel 
                value="whatsapp" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography>WhatsApp</Typography>
                    <WhatsAppIcon color="success" fontSize="small" />
                  </Box>
                } 
              />
            </RadioGroup>
          </FormControl>
          
          {sendMethod === 'whatsapp' && !demoRequest?.whatsappNumber && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No WhatsApp number is set for this client. 
              <Button 
                size="small"
                color="inherit"
                onClick={() => {
                  handleCloseSendResourcesDialog();
                  handleOpenWhatsappDialog();
                }}
                sx={{ ml: 1 }}
              >
                Add WhatsApp Number
              </Button>
            </Alert>
          )}
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select Resources to Send:
          </Typography>
          
          <List sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 1 }}>
            {resources.map((resource) => (
              <React.Fragment key={resource.id}>
                <ListItem 
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <Checkbox
                    checked={resourcesToSend.includes(resource.id)}
                    onChange={() => handleResourceSendSelection(resource.id)}
                  />
                  <ListItemIcon>
                    {resource.type === 'pdf' ? <PictureAsPdfIcon color="error" /> :
                      resource.type === 'docx' ? <DescriptionIcon color="primary" /> :
                      resource.type === 'pptx' ? <SlideshowIcon color="warning" /> :
                      resource.type === 'video' ? <OndemandVideoIcon color="secondary" /> :
                      resource.type === 'link' ? <LinkIcon color="primary" /> :
                      <InsertDriveFileIcon color="primary" />
                    }
                  </ListItemIcon>
                  <ListItemText 
                    primary={resource.name} 
                    secondary={`${resource.type.toUpperCase()} ${resource.size ? `• ${resource.size}` : ''}`}
                  />
                  <Chip
                    size="small"
                    label={resource.category}
                    color={resource.category === 'script' ? 'primary' : 'default'}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            
            {resources.length === 0 && (
              <ListItem sx={{ justifyContent: 'center', p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No resources available to send. 
                  {userRole === 'admin' && (
                    <Button 
                      size="small" 
                      onClick={() => {
                        handleCloseSendResourcesDialog();
                        handleOpenResourceDialog();
                      }}
                      sx={{ ml: 1 }}
                    >
                      Add Resources
                    </Button>
                  )}
                </Typography>
              </ListItem>
            )}
          </List>

          {sendMethod === 'email' && (
            <TextField
              margin="dense"
              label="Custom Message (Optional)"
              fullWidth
              multiline
              rows={3}
              placeholder="Add a custom message to include with the resources..."
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendResourcesDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSendResources} 
            variant="contained" 
            disabled={resourcesToSend.length === 0 || submitting || (sendMethod === 'whatsapp' && !demoRequest?.whatsappNumber)}
            startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
            color="primary"
          >
            {submitting ? 'Sending...' : `Send via ${sendMethod === 'email' ? 'Email' : 'WhatsApp'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 