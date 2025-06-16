'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
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
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { fetchLeadById, fetchLeadActivities, createLeadActivity, updateLead, assignLead, fetchUsers, LeadData } from '@/lib/api';

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
  assignedTo: string;  // Keep as string, but handle potential object type safely
  createdAt: string;
  lastContact: string;
  location: string;
  notes: string;
  tags: string[];
  requirements?: string[];
  designation?: string;
  businessType?: string;
  discoveryMethod?: string[];
  frustrations?: string[];
  managementMethod?: string[];
  states?: string[];
  tenderCount?: string;
  mobile?: string;
  address?: string;
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

// Move function outside of component to avoid React hooks rules violation
const useStatusColor = () => {
  const theme = useTheme();
  
  return (status: LeadStatus) => {
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
};

export default function LeadDetailPage({ params }:any) {
  // Don't use React.use() as it's causing TypeScript errors
  // Just access params directly, but update the dependency in the useEffect
  const leadId = params.id;

  const theme = useTheme();
  const getStatusColor = useStatusColor();
  
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
  
  // New state variables for edit form and agent assignment
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [assignAgentDialogOpen, setAssignAgentDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Lead>>({});
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New activity form state
  const [newActivityOpen, setNewActivityOpen] = useState(false);
  const [newActivityType, setNewActivityType] = useState<'call' | 'email' | 'meeting' | 'note'>('note');
  const [newActivityDescription, setNewActivityDescription] = useState('');

  // Helper function to handle assignedTo which might be an object or string
  const getAssignedToString = (assignedTo: any): string => {
    if (!assignedTo) return '';
    if (typeof assignedTo === 'string') return assignedTo;
    if (typeof assignedTo === 'object') {
      // If it's an object, try to get a name property or stringify it
      return assignedTo.name || assignedTo.email || JSON.stringify(assignedTo);
    }
    return String(assignedTo);
  };

  // Helper function to get first character from assignedTo
  const getAssignedToInitial = (assignedTo: any): string => {
    const str = getAssignedToString(assignedTo);
    return str ? str.charAt(0).toUpperCase() : 'U';
  };

  // Fetch lead details
  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use _id for MongoDB compatibility
        const leadData = await fetchLeadById(leadId);
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
            assignedTo: getAssignedToString(leadData.assignedTo),
            createdAt: leadData.createdAt,
            lastContact: leadData.lastContact || leadData.updatedAt,
            location: leadData.location,
            notes: leadData.notes,
            tags: leadData.tags || [],
            requirements: leadData.requirements || [],
            designation: leadData.designation,
            businessType: leadData.businessType,
            discoveryMethod: leadData.discoveryMethod,
            frustrations: leadData.frustrations,
            managementMethod: leadData.managementMethod,
            states: leadData.states,
            tenderCount: leadData.tenderCount,
            mobile: leadData.mobile,
            address: leadData.address,
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

    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);

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

  // Fetch all users for agent assignment
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const usersData = await fetchUsers();
        if (usersData && usersData.data) {
          setUsers(usersData.data.map((user: any) => ({
            id: user._id || user.id,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          })));
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setSnackbarMessage('Failed to load users');
        setSnackbarOpen(true);
      }
    };

    getAllUsers();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddActivity = async (type: 'call' | 'email' | 'meeting' | 'note', description: string) => {
    if (!lead) return;
    
    setIsSubmitting(true);
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
        setTotalActivities(activitiesData.totalCount || activitiesData.data.length);
      }
      
      setSnackbarMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} activity added successfully`);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error adding activity:', err);
      setSnackbarMessage('Failed to add activity');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
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

  // Edit lead functions
  const handleOpenEditForm = () => {
    if (lead) {
      setEditFormData({...lead});
      setEditFormOpen(true);
      setIsEditing(true);
    }
  };

  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setIsEditing(false);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    setEditFormData(prev => ({
      ...prev,
      status: e.target.value as LeadStatus
    }));
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    setEditFormData(prev => ({
      ...prev,
      type: e.target.value as LeadType
    }));
  };

  const handleSourceChange = (e: SelectChangeEvent) => {
    setEditFormData(prev => ({
      ...prev,
      source: e.target.value as LeadSource
    }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !editFormData.tags?.includes(tag)) {
      setEditFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setEditFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete) || []
    }));
  };

  // Handle array fields like states, discoveryMethod, frustrations, and managementMethod
  const handleArrayItemAdd = (field: string, value: string) => {
    if (!value) return;
    
    setEditFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[] || [];
      if (Array.isArray(currentArray) && !currentArray.includes(value)) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      }
      return prev;
    });
  };

  const handleArrayItemDelete = (field: string, valueToDelete: string) => {
    setEditFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[] || [];
      if (Array.isArray(currentArray)) {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== valueToDelete)
        };
      }
      return prev;
    });
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !lead) return;
    
    setIsSubmitting(true);
    try {
      // Don't include the id in the update payload
      const { id, ...updatePayload } = editFormData;
      
      await updateLead(lead.id, updatePayload);
      
      // Update the local lead state
      setLead({...lead, ...updatePayload});
      
      setSnackbarMessage('Lead updated successfully');
      setSnackbarOpen(true);
      handleCloseEditForm();
      
      // Add activity for the update
      await createLeadActivity({
        leadId: lead.id,
        type: 'note',
        description: 'Lead details updated',
        assignedTo: lead.assignedTo,
      });
      
    } catch (error) {
      console.error('Error updating lead:', error);
      setSnackbarMessage('Failed to update lead');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assign agent functions
  const handleOpenAssignAgent = () => {
    if (lead) {
      setSelectedAgent(lead.assignedTo);
      setAssignAgentDialogOpen(true);
    }
  };

  const handleCloseAssignAgent = () => {
    setAssignAgentDialogOpen(false);
  };

  const handleAgentChange = (e: SelectChangeEvent) => {
    setSelectedAgent(e.target.value);
  };

  const handleAssignAgent = async () => {
    if (!lead || !selectedAgent) return;
    
    setIsSubmitting(true);
    try {
      await assignLead(lead.id, selectedAgent);
      
      // Update the local lead state
      setLead({...lead, assignedTo: selectedAgent});
      
      setSnackbarMessage('Agent assigned successfully');
      setSnackbarOpen(true);
      handleCloseAssignAgent();
      
      // Add activity for the assignment
      await createLeadActivity({
        leadId: lead.id,
        type: 'note',
        description: `Lead assigned to ${selectedAgent}`,
        assignedTo: selectedAgent,
      });
      
    } catch (error) {
      console.error('Error assigning agent:', error);
      setSnackbarMessage('Failed to assign agent');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Activity form handlers
  const handleOpenNewActivity = () => {
    setNewActivityOpen(true);
  };

  const handleCloseNewActivity = () => {
    setNewActivityOpen(false);
    setNewActivityType('note');
    setNewActivityDescription('');
  };

  const handleActivityTypeChange = (e: SelectChangeEvent) => {
    setNewActivityType(e.target.value as 'call' | 'email' | 'meeting' | 'note');
  };

  const handleSubmitNewActivity = async () => {
    if (!newActivityDescription) return;
    
    setIsSubmitting(true);
    try {
      await handleAddActivity(newActivityType, newActivityDescription);
      handleCloseNewActivity();
    } finally {
      setIsSubmitting(false);
    }
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
                    onClick={handleOpenEditForm}
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
                    <IconButton size="small" onClick={handleOpenEditForm}>
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

            {/* Additional Details Section */}
            <Grow in={true} timeout={1100}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Business Details</Typography>
                    <IconButton size="small" onClick={handleOpenEditForm}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {lead.designation && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                        <Typography variant="body2">{lead.designation}</Typography>
                      </Grid>
                    )}
                    
                    {lead.businessType && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Business Type</Typography>
                        <Typography variant="body2">{lead.businessType}</Typography>
                      </Grid>
                    )}
                    
                    {lead.mobile && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                        <Typography variant="body2">{lead.mobile}</Typography>
                      </Grid>
                    )}
                    
                    {lead.address && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                        <Typography variant="body2">{lead.address}</Typography>
                      </Grid>
                    )}
                    
                    {lead.tenderCount && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Tender Count</Typography>
                        <Typography variant="body2">{lead.tenderCount}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  
                  {lead.states && lead.states.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Operating States:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {lead.states.map((state, index) => (
                          <Chip 
                            key={index} 
                            label={state} 
                            size="small" 
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grow>
            
            {/* Discovery & Challenges Section */}
            <Grow in={true} timeout={1150}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Discovery & Challenges</Typography>
                    <IconButton size="small" onClick={handleOpenEditForm}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  
                  {lead.discoveryMethod && lead.discoveryMethod.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Discovery Method:
                      </Typography>
                      <Stack spacing={0.5}>
                        {lead.discoveryMethod.map((method, index) => (
                          <Typography key={index} variant="body2" color="text.secondary">
                            • {method}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}
                  
                  {lead.managementMethod && lead.managementMethod.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Management Method:
                      </Typography>
                      <Stack spacing={0.5}>
                        {lead.managementMethod.map((method, index) => (
                          <Typography key={index} variant="body2" color="text.secondary">
                            • {method}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}
                  
                  {lead.frustrations && lead.frustrations.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Frustrations:
                      </Typography>
                      <Stack spacing={0.5}>
                        {lead.frustrations.map((frustration, index) => (
                          <Typography key={index} variant="body2" color="text.secondary">
                            • {frustration}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
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
                    <IconButton size="small" onClick={handleOpenEditForm}>
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
                        {lead.assignedTo ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              alt={lead.assignedTo}
                              sx={{ width: 32, height: 32 }}
                            >
                              {getAssignedToInitial(lead.assignedTo)}
                            </Avatar>
                            <Typography variant="body1">{lead.assignedTo}</Typography>
                            <Tooltip title="Change assignment">
                              <IconButton size="small" onClick={handleOpenAssignAgent}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Box sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            border: `1px dashed ${theme.palette.divider}`,
                            borderRadius: 1,
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              No agent assigned yet
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ mt: 1 }}
                              onClick={handleOpenAssignAgent}
                            >
                              Assign Agent
                            </Button>
                          </Box>
                        )}
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
          <Paper 
            elevation={0} 
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              mb: 3
            }}
          >
            <Box sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Typography variant="h6">Timeline</Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                width: { xs: '100%', sm: 'auto' },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
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
                  sx={{ 
                    minWidth: { xs: '100%', sm: 200 },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenNewActivity}
                  size="small"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Add Activity
                </Button>
              </Box>
            </Box>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                            <Box sx={{ 
                              flex: 1, 
                              p: 2, 
                              borderRadius: 1, 
                              bgcolor: alpha(theme.palette.primary.main, 0.03),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                boxShadow: 1
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                mb: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 0.5, sm: 0 }
                              }}>
                                <Typography variant="subtitle2" color="primary">
                                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(activity.date).toLocaleString()}
                                </Typography>
                              </Box>
                              <Typography variant="body2" gutterBottom>
                                {activity.description}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Avatar 
                                  sx={{ 
                                    width: 24, 
                                    height: 24, 
                                    fontSize: '0.75rem',
                                    bgcolor: theme.palette.secondary.main
                                  }}
                                >
                                  {activity.user?.name?.[0] || activity.assignedTo?.[0] || 'U'}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                  {activity.user?.name || activity.assignedTo || 'Unknown'}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Fade>
                    ))
                ) : timelineFilter ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No timeline events match the filter &quot;{timelineFilter}&quot;
                    </Typography>
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => setTimelineFilter('')}
                    >
                      Clear Filter
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No timeline events found. Add an activity to get started.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={handleOpenNewActivity}
                      startIcon={<AddIcon />}
                    >
                      Add Activity
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Paper>
          
          {/* Quick Actions for Timeline */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                fullWidth
                onClick={() => {
                  setNewActivityType('call');
                  handleOpenNewActivity();
                }}
                sx={{ 
                  borderColor: theme.palette.info.main,
                  color: theme.palette.info.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    borderColor: theme.palette.info.main,
                  }
                }}
              >
                Log Call
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                fullWidth
                onClick={() => {
                  setNewActivityType('email');
                  handleOpenNewActivity();
                }}
                sx={{ 
                  borderColor: theme.palette.warning.main,
                  color: theme.palette.warning.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    borderColor: theme.palette.warning.main,
                  }
                }}
              >
                Log Email
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<ScheduleIcon />}
                fullWidth
                onClick={() => {
                  setNewActivityType('meeting');
                  handleOpenNewActivity();
                }}
                sx={{ 
                  borderColor: theme.palette.success.main,
                  color: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    borderColor: theme.palette.success.main,
                  }
                }}
              >
                Schedule Meeting
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<NoteIcon />}
                fullWidth
                onClick={() => {
                  setNewActivityType('note');
                  handleOpenNewActivity();
                }}
                sx={{ 
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    borderColor: theme.palette.secondary.main,
                  }
                }}
              >
                Add Note
              </Button>
            </Grid>
          </Grid>
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

      {/* Edit Lead Dialog */}
      <Dialog
        open={editFormOpen}
        onClose={handleCloseEditForm}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
            width: { xs: '100%', sm: '90%', md: '80%' },
            mx: 'auto'
          },
        }}
      >
        <DialogTitle>Edit Lead</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editFormData.name || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={editFormData.company || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editFormData.email || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editFormData.phone || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={editFormData.mobile || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={editFormData.designation || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Type"
                name="businessType"
                value={editFormData.businessType || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tender Count"
                name="tenderCount"
                value={editFormData.tenderCount || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status || ''}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="qualified">Qualified</MenuItem>
                  <MenuItem value="proposal">Proposal</MenuItem>
                  <MenuItem value="negotiation">Negotiation</MenuItem>
                  <MenuItem value="won">Won</MenuItem>
                  <MenuItem value="lost">Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={editFormData.type || ''}
                  label="Type"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                  <MenuItem value="startup">Startup</MenuItem>
                  <MenuItem value="small_business">Small Business</MenuItem>
                  <MenuItem value="individual">Individual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Source</InputLabel>
                <Select
                  value={editFormData.source || ''}
                  label="Source"
                  onChange={handleSourceChange}
                >
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="referral">Referral</MenuItem>
                  <MenuItem value="social">Social Media</MenuItem>
                  <MenuItem value="trade_show">Trade Show</MenuItem>
                  <MenuItem value="direct">Direct</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={editFormData.location || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editFormData.address || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={editFormData.notes || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {editFormData.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagDelete(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add tag"
                  id="new-tag"
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleTagAdd(input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    const input = document.getElementById('new-tag') as HTMLInputElement;
                    if (input) {
                      handleTagAdd(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            {/* States Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Operating States
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {editFormData.states?.map((state) => (
                  <Chip
                    key={state}
                    label={state}
                    onDelete={() => handleArrayItemDelete('states', state)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add state"
                  id="new-state"
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleArrayItemAdd('states', input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    const input = document.getElementById('new-state') as HTMLInputElement;
                    if (input) {
                      handleArrayItemAdd('states', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            {/* Requirements Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Requirements
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editFormData.requirements?.map((req) => (
                  <Box key={req} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{req}</Typography>
                    <IconButton size="small" onClick={() => handleArrayItemDelete('requirements', req)}>
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add requirement"
                  id="new-requirement"
                  fullWidth
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleArrayItemAdd('requirements', input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    const input = document.getElementById('new-requirement') as HTMLInputElement;
                    if (input) {
                      handleArrayItemAdd('requirements', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            {/* Discovery Method Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Discovery Method
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editFormData.discoveryMethod?.map((method) => (
                  <Box key={method} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{method}</Typography>
                    <IconButton size="small" onClick={() => handleArrayItemDelete('discoveryMethod', method)}>
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add discovery method"
                  id="new-discovery-method"
                  fullWidth
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleArrayItemAdd('discoveryMethod', input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    const input = document.getElementById('new-discovery-method') as HTMLInputElement;
                    if (input) {
                      handleArrayItemAdd('discoveryMethod', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            {/* Management Method Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Management Method
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editFormData.managementMethod?.map((method) => (
                  <Box key={method} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{method}</Typography>
                    <IconButton size="small" onClick={() => handleArrayItemDelete('managementMethod', method)}>
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add management method"
                  id="new-management-method"
                  fullWidth
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleArrayItemAdd('managementMethod', input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    const input = document.getElementById('new-management-method') as HTMLInputElement;
                    if (input) {
                      handleArrayItemAdd('managementMethod', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            {/* Frustrations Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Frustrations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editFormData.frustrations?.map((frustration) => (
                  <Box key={frustration} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{frustration}</Typography>
                    <IconButton size="small" onClick={() => handleArrayItemDelete('frustrations', frustration)}>
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add frustration"
                  id="new-frustration"
                  fullWidth
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleArrayItemAdd('frustrations', input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  size="small"
                  onClick={() => {
                    const input = document.getElementById('new-frustration') as HTMLInputElement;
                    if (input) {
                      handleArrayItemAdd('frustrations', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditForm} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            color="primary" 
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog
        open={assignAgentDialogOpen}
        onClose={handleCloseAssignAgent}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
            width: { xs: '100%', sm: '90%', md: '80%' },
            mx: 'auto'
          },
        }}
      >
        <DialogTitle>Assign Agent</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Assign to</InputLabel>
            <Select
              value={selectedAgent}
              label="Assign to"
              onChange={handleAgentChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.secondary.main }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    {user.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Select an agent to assign this lead to. The agent will be notified.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignAgent} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleAssignAgent} 
            variant="contained" 
            color="primary" 
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <PersonIcon />}
            disabled={isSubmitting || !selectedAgent}
          >
            {isSubmitting ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Activity Dialog */}
      <Dialog
        open={newActivityOpen}
        onClose={handleCloseNewActivity}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
            width: { xs: '100%', sm: '90%', md: '80%' },
            mx: 'auto'
          },
        }}
      >
        <DialogTitle>Add Activity</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={newActivityType}
              label="Activity Type"
              onChange={handleActivityTypeChange}
            >
              <MenuItem value="call">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="info" />
                  Call
                </Box>
              </MenuItem>
              <MenuItem value="email">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="warning" />
                  Email
                </Box>
              </MenuItem>
              <MenuItem value="meeting">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon color="success" />
                  Meeting
                </Box>
              </MenuItem>
              <MenuItem value="note">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NoteIcon color="secondary" />
                  Note
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newActivityDescription}
            onChange={(e) => setNewActivityDescription(e.target.value)}
            placeholder={
              newActivityType === 'call' ? 'Describe the call details...' :
              newActivityType === 'email' ? 'Describe the email content...' :
              newActivityType === 'meeting' ? 'Describe the meeting details...' :
              'Add your notes here...'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewActivity} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleSubmitNewActivity} 
            variant="contained" 
            color="primary" 
            startIcon={isSubmitting ? <CircularProgress size={20} /> : getActivityIcon(newActivityType)}
            disabled={isSubmitting || !newActivityDescription}
          >
            {isSubmitting ? 'Adding...' : 'Add Activity'}
          </Button>
        </DialogActions>
      </Dialog>
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