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
import {
  DemoRequest as APIDemoRequest,
  getDemoRequest,
  updateDemoRequest
} from '@/services/demoService';
import {
  DemoActivity,
  getDemoActivities,
  addDemoNote,
  scheduleFollowUp,
  addMeetingLink,
  completeDemoActivity
} from '@/services/demoActivityService';

// Add the BASE_URL constant
const BASE_URL = 'http://localhost:7505';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: string;
  description: string;
  user: string;
}

interface DemoRequest {
  id: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected';
  date: string;
  time: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  email: string;
  mobile: string;
  businessName: string;
  notes?: string;
  requirements?: string;
  interestedIn?: string;
  services?: string[];
  industry?: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  assignedAgentName?: string;
  followUpDate?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
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


export default function DemoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [demoRequest, setDemoRequest] = useState<DemoRequest | null>(null);
  const [activities, setActivities] = useState<DemoActivity[]>([]);
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
  const [meetingLinkDialogOpen, setMeetingLinkDialogOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    // Fetch demo request and activities from API
    const fetchDemoData = async () => {
      try {
        setLoading(true);
        
        // Fetch demo request details
        const demoResponse = await getDemoRequest(id as string);
        console.log('Demo request response:', demoResponse);
        
        // First fetch activities separately to ensure we have them
        console.log('Fetching activities for demo ID:', id);
        const activitiesResponse = await getDemoActivities(id as string);
        console.log('Activities response raw:', activitiesResponse);
        
        // Handle different response formats - API might return array directly or {success, data} object
        let activities: DemoActivity[] = [];
        
        if (Array.isArray(activitiesResponse)) {
          // API returned array directly
          activities = activitiesResponse;
          console.log(`Detected direct array response with ${activities.length} activities`);
        } else if (activitiesResponse && activitiesResponse.success && Array.isArray(activitiesResponse.data)) {
          // API returned {success: true, data: [...]} format
          activities = activitiesResponse.data;
          console.log(`Detected success/data object response with ${activities.length} activities`);
        } else {
          console.warn('Unable to parse activities response:', activitiesResponse);
        }
        
        // Only proceed if we have activities
        if (activities.length > 0) {
          console.log(`${activities.length} activities found:`, activities);
          
          // Set activities to state first
          setActivities(activities);
          
          // Create timeline events explicitly
          const timelineEvents: TimelineEvent[] = [];
          
          // Process each activity
          activities.forEach(activity => {
            try {
              console.log('Processing activity:', activity);
              
              // Format date and time
              const date = new Date(activity.performedAt);
              const formattedDate = date.toISOString().split('T')[0];
              const formattedTime = date.toLocaleTimeString();
              
              // Create timeline event
              const event: TimelineEvent = {
                id: activity._id,
                date: formattedDate,
                time: formattedTime,
                type: activity.action,
                description: activity.description,
                user: activity.performedBy
              };
              
              console.log('Created timeline event:', event);
              timelineEvents.push(event);
            } catch (err) {
              console.error('Error processing activity:', activity, err);
            }
          });
          
          console.log(`${timelineEvents.length} timeline events created:`, timelineEvents);
          
          // Sort by most recent first
          timelineEvents.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`).getTime();
            const dateB = new Date(`${b.date}T${b.time}`).getTime();
            return dateB - dateA;
          });
          
          if (demoResponse && demoResponse.success && demoResponse.data) {
            // Convert API model to UI model
            const demo = demoResponse.data;
            
            // Format date for display
            const formattedDate = demo.preferredDate ? 
              new Date(demo.preferredDate).toISOString().split('T')[0] : 
              new Date().toISOString().split('T')[0];
            
            // Create the UI model with timeline events
            const uiDemo: DemoRequest = {
              id: demo.id,
              status: demo.status,
              date: formattedDate,
              time: demo.preferredTime,
              preferredDate: formattedDate,
              preferredTime: demo.preferredTime,
              name: demo.name,
              email: demo.email,
              mobile: demo.mobile,
              businessName: demo.businessName,
              notes: demo.notes,
              requirements: demo.requirements,
              interestedIn: demo.interestedIn,
              services: demo.services,
              industry: demo.industry,
              priority: demo.priority,
              assignedTo: demo.assignedTo,
              assignedAgentName: demo.assignedAgentName,
              timeline: timelineEvents, // Add the timeline events here
              createdAt: demo.createdAt,
              updatedAt: demo.updatedAt
            };
            
            console.log('Setting demo request with timeline:', uiDemo);
            setDemoRequest(uiDemo);
          } else {
            console.warn('Invalid demo request data or demo not found');
          }
        } else {
          console.warn('No activities found in the response');
          
          // Still set the demo data even if no activities
          if (demoResponse && demoResponse.success && demoResponse.data) {
            const demo = demoResponse.data;
            
            // Format date for display
            const formattedDate = demo.preferredDate ? 
              new Date(demo.preferredDate).toISOString().split('T')[0] : 
              new Date().toISOString().split('T')[0];
            
            // Create the UI model without timeline events
            const uiDemo: DemoRequest = {
              id: demo.id,
              status: demo.status,
              date: formattedDate,
              time: demo.preferredTime,
              preferredDate: formattedDate,
              preferredTime: demo.preferredTime,
              name: demo.name,
              email: demo.email,
              mobile: demo.mobile,
              businessName: demo.businessName,
              notes: demo.notes,
              requirements: demo.requirements,
              interestedIn: demo.interestedIn,
              services: demo.services,
              industry: demo.industry,
              priority: demo.priority,
              assignedTo: demo.assignedTo,
              assignedAgentName: demo.assignedAgentName,
              timeline: [], // Empty timeline
              createdAt: demo.createdAt,
              updatedAt: demo.updatedAt
            };
            
            setDemoRequest(uiDemo);
          }
        }
      } catch (error) {
        console.error('Error fetching demo data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading demo details',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDemoData();
    }
  }, [id]);

  const handleOpenEdit = () => {
    setEditNotes(demoRequest?.notes || '');
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  // Helper function to convert activity to timeline event
  const createTimelineEventFromActivity = (activity: DemoActivity): TimelineEvent => {
    const date = new Date(activity.performedAt);
    return {
      id: activity._id,
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString(),
      type: activity.action,
      description: activity.description,
      user: activity.performedBy
    };
  };

  // Update handleSaveNotes to use the helper function
  const handleSaveNotes = async () => {
    setSubmitting(true);
    
    try {
      if (demoRequest) {
        // First update the demo request with new notes
        const updateResponse = await updateDemoRequest(demoRequest.id, {
          notes: editNotes
        });
        
        // Then create an activity record for the note
        const activityResponse = await addDemoNote(
          demoRequest.id,
          editNotes,
          demoRequest.assignedTo || 'system', // Use assigned agent or system as performer
          demoRequest.priority
        );
        
        console.log('Note update response:', updateResponse);
        console.log('Activity response:', activityResponse);
        
        if (updateResponse.success && activityResponse.success) {
          // Get the created activity
          const newActivity = activityResponse.data;
          
          // Add to activities list
          setActivities(prev => [newActivity, ...prev]);
          
          // Create a new timeline event from the activity
          const newEvent = createTimelineEventFromActivity(newActivity);
          console.log('Created new timeline event:', newEvent);
          
          // Update the demo request in state
          setDemoRequest(prev => {
            if (!prev) return null;
            
            // Create a new object with updated timeline
            const updatedDemo = {
              ...prev,
              notes: editNotes,
              timeline: [newEvent, ...prev.timeline]
            };
            
            console.log('Updated demo with new timeline:', updatedDemo.timeline);
            return updatedDemo;
          });
          
          setSnackbar({
            open: true,
            message: 'Notes updated successfully',
            severity: 'success',
          });
        } else {
          throw new Error('Failed to update notes or create activity');
        }
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setSnackbar({
        open: true,
        message: 'Error updating notes',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
      handleCloseEdit();
    }
  };

  const handleOpenFollowUp = () => {
    setOpenFollowUp(true);
  };

  const handleCloseFollowUp = () => {
    setOpenFollowUp(false);
    setFollowUpDate('');
    setFollowUpNotes('');
  };

  // Update handleAddFollowUp to use the helper function
  const handleAddFollowUp = async () => {
    setSubmitting(true);
    
    try {
      if (demoRequest && followUpDate) {
        // Format the follow-up date for the API
        const formattedFollowUpDate = `${followUpDate}T10:00:00.000Z`;
        
        // Create the description for the activity
        const description = followUpNotes || 'Follow-up scheduled';
        
        // Create an activity record for the follow-up
        const activityResponse = await scheduleFollowUp(
          demoRequest.id,
          formattedFollowUpDate,
          description,
          demoRequest.assignedTo || 'system', // Use assigned agent or system as performer
          demoRequest.priority
        );
        
        console.log('Follow-up activity response:', activityResponse);
        
        if (activityResponse.success) {
          // Get the created activity
          const newActivity = activityResponse.data;
          
          // Add to activities list
          setActivities(prev => [newActivity, ...prev]);
          
          // Create a new timeline event from the activity
          const newEvent = createTimelineEventFromActivity(newActivity);
          console.log('Created new follow-up timeline event:', newEvent);
          
          // Update the demo request in state
          setDemoRequest(prev => {
            if (!prev) return null;
            
            // Create a new object with updated timeline
            const updatedDemo = {
              ...prev,
              followUpDate: followUpDate,
              timeline: [newEvent, ...prev.timeline]
            };
            
            console.log('Updated demo with new follow-up timeline:', updatedDemo.timeline);
            return updatedDemo;
          });
          
          setSnackbar({
            open: true,
            message: 'Follow-up scheduled successfully',
            severity: 'success',
          });
          
          handleCloseFollowUp();
        } else {
          throw new Error('Failed to schedule follow-up');
        }
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      setSnackbar({
        open: true,
        message: 'Error scheduling follow-up',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
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

  const handleUpdateStatus = async (status: DemoRequest['status']) => {
    setSubmitting(true);
    
    try {
      if (demoRequest) {
        // Update the demo status in the API
        const updateResponse = await updateDemoRequest(demoRequest.id, {
          status
        });
        
        console.log('Status update response:', updateResponse);
        
        // Determine the activity type based on the new status
        let action = 'status_change';
        let description = `Status changed from ${demoRequest.status} to ${status}`;
        
        // If status is completed, use the demo_completed action
        if (status === 'completed') {
          action = 'demo_completed';
          description = 'Demo marked as completed';
          
          // Call the completeDemoActivity function
          const activityResponse = await completeDemoActivity(
            demoRequest.id,
            'Demo completed successfully',
            demoRequest.assignedTo || 'system',
            demoRequest.priority
          );
          
          console.log('Complete demo activity response:', activityResponse);
          
          if (activityResponse.success) {
            // Get the created activity
            const newActivity = activityResponse.data;
            
            // Add to activities list
            setActivities(prev => [newActivity, ...prev]);
            
            // Create a new timeline event from the activity
            const newEvent = createTimelineEventFromActivity(newActivity);
            console.log('Created new status timeline event:', newEvent);
            
            // Update the demo request in state
            setDemoRequest(prev => {
              if (!prev) return null;
              
              // Create a new object with updated timeline
              const updatedDemo = {
                ...prev,
                status,
                timeline: [newEvent, ...prev.timeline]
              };
              
              console.log('Updated demo with new status timeline:', updatedDemo.timeline);
              return updatedDemo;
            });
          }
        } else {
          // For other status changes, create a generic status_change activity
          const activityData = {
            demoId: demoRequest.id,
            action,
            description,
            performedBy: demoRequest.assignedTo || 'system',
            priority: demoRequest.priority,
            details: {
              field: 'status',
              oldValue: demoRequest.status,
              newValue: status
            }
          };
          
          // Use the post method directly as we don't have a specific function for this
          const response = await fetch(`${BASE_URL}/api/demo-activities/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(activityData),
          });
          
          const activityResponse = await response.json();
          console.log('Status change activity response:', activityResponse);
          
          if (activityResponse.success) {
            // Get the created activity
            const newActivity = activityResponse.data;
            
            // Add to activities list
            setActivities(prev => [newActivity, ...prev]);
            
            // Create a new timeline event from the activity
            const newEvent = createTimelineEventFromActivity(newActivity);
            console.log('Created new status timeline event:', newEvent);
            
            // Update the demo request in state
            setDemoRequest(prev => {
              if (!prev) return null;
              
              // Create a new object with updated timeline
              const updatedDemo = {
                ...prev,
                status,
                timeline: [newEvent, ...prev.timeline]
              };
              
              console.log('Updated demo with new status timeline:', updatedDemo.timeline);
              return updatedDemo;
            });
          }
        }
        
        setSnackbar({
          open: true,
          message: `Status updated to ${status}`,
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({
        open: true,
        message: 'Error updating status',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
      handleCloseMenu();
    }
  };

  const getTimelineIcon = (type: string) => {
    const actionType = type.toLowerCase();
    
    if (actionType.includes('demo_booked') || actionType.includes('demo_scheduled')) {
      return <VideoCallIcon />;
    } else if (actionType.includes('note')) {
      return <NoteIcon />;
    } else if (actionType.includes('demo_completed') || actionType.includes('status')) {
      return <PriorityHighIcon />;
    } else if (actionType.includes('follow_up')) {
      return <ScheduleIcon />;
    } else if (actionType.includes('agent')) {
      return <PersonIcon />;
    } else if (actionType.includes('meeting') || actionType.includes('link')) {
      return <LinkIcon />;
    } else {
      console.log('Unknown timeline event type:', type);
      return <HistoryIcon />;
    }
  };

  const filteredTimeline = demoRequest?.timeline.filter(event => {
    if (!timelineFilter) return true;
    
    // Make filtering more flexible by checking multiple fields
    return (
      event.type.toLowerCase().includes(timelineFilter.toLowerCase()) ||
      event.description.toLowerCase().includes(timelineFilter.toLowerCase()) ||
      event.user.toLowerCase().includes(timelineFilter.toLowerCase())
    );
  }) || [];

  // Add a useEffect to log timeline changes for debugging
  useEffect(() => {
    if (demoRequest?.timeline) {
      console.log('Current timeline in state:', demoRequest.timeline);
      console.log('Filtered timeline:', filteredTimeline);
      console.log('Timeline length:', demoRequest.timeline.length);
      
      // Debug any potential issues with timeline data
      if (demoRequest.timeline.length === 0) {
        console.warn('Timeline is empty! Check if activities were properly converted to timeline events.');
      } else if (filteredTimeline.length === 0 && timelineFilter) {
        console.warn(`No timeline events match the filter "${timelineFilter}".`);
      } else if (filteredTimeline.length === 0) {
        console.warn('Filtered timeline is empty but no filter is applied. Check rendering logic.');
      }
    } else {
      console.warn('Timeline is undefined or null in demoRequest state!');
    }
  }, [demoRequest?.timeline, filteredTimeline, timelineFilter]);

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

  const getUrgencyColor = (urgency: DemoRequest['priority']) => {
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
    setWhatsappNumber(demoRequest?.mobile || demoRequest?.mobile || '');
    setWhatsappDialogOpen(true);
  };

  const handleCloseWhatsappDialog = () => {
    setWhatsappDialogOpen(false);
  };

  const handleSaveWhatsappNumber = async () => {
    setSubmitting(true);
    
    try {
      if (demoRequest) {
        // Update the demo request with new mobile number
        const updateResponse = await updateDemoRequest(demoRequest.id, {
          mobile: whatsappNumber
        });
        
        console.log('Mobile number update response:', updateResponse);
        
        if (updateResponse.success) {
          // Create an activity for the mobile update
          const activityData = {
            demoId: demoRequest.id,
            action: 'contact_updated',
            description: 'Mobile number updated',
            performedBy: demoRequest.assignedTo || 'system',
            priority: demoRequest.priority,
            details: {
              field: 'mobile',
              oldValue: demoRequest.mobile,
              newValue: whatsappNumber
            }
          };
          
          // Use fetch to create an activity
          const response = await fetch(`${BASE_URL}/api/demo-activities/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(activityData),
          });
          
          const activityResponse = await response.json();
          console.log('Mobile update activity response:', activityResponse);
          
          if (activityResponse.success) {
            // Get the created activity
            const newActivity = activityResponse.data;
            
            // Add to activities list
            setActivities(prev => [newActivity, ...prev]);
            
            // Create a new timeline event from the activity
            const date = new Date(newActivity.performedAt);
            const newEvent: TimelineEvent = {
              id: newActivity._id,
              date: date.toISOString().split('T')[0],
              time: date.toLocaleTimeString(),
              type: newActivity.action,
              description: newActivity.description,
              user: newActivity.performedBy
            };
            
            // Update the demo request in state
            setDemoRequest(prev => {
              if (!prev) return null;
              
              return {
                ...prev,
                mobile: whatsappNumber,
                timeline: [newEvent, ...prev.timeline]
              };
            });
          }
          
          setSnackbar({
            open: true,
            message: 'Mobile number updated successfully',
            severity: 'success',
          });
          
          handleCloseWhatsappDialog();
        } else {
          throw new Error('Failed to update mobile number');
        }
      }
    } catch (error) {
      console.error('Error updating mobile number:', error);
      setSnackbar({
        open: true,
        message: 'Error updating mobile number',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
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

  const handleOpenMeetingLinkDialog = () => {
    setMeetingLink('');
    setMeetingLinkDialogOpen(true);
  };

  const handleCloseMeetingLinkDialog = () => {
    setMeetingLinkDialogOpen(false);
  };

  // Update handleSaveMeetingLink to use the helper function
  const handleSaveMeetingLink = async () => {
    setSubmitting(true);
    
    try {
      if (demoRequest && meetingLink) {
        // Call the addMeetingLink function
        const activityResponse = await addMeetingLink(
          demoRequest.id,
          meetingLink,
          demoRequest.assignedTo || 'system',
          demoRequest.priority
        );
        
        console.log('Meeting link activity response:', activityResponse);
        
        if (activityResponse.success) {
          // Get the created activity
          const newActivity = activityResponse.data;
          
          // Add to activities list
          setActivities(prev => [newActivity, ...prev]);
          
          // Create a new timeline event from the activity
          const newEvent = createTimelineEventFromActivity(newActivity);
          console.log('Created new meeting link timeline event:', newEvent);
          
          // Update the demo request in state
          setDemoRequest(prev => {
            if (!prev) return null;
            
            // Create a new object with updated timeline
            const updatedDemo = {
              ...prev,
              timeline: [newEvent, ...prev.timeline]
            };
            
            console.log('Updated demo with new meeting link timeline:', updatedDemo.timeline);
            return updatedDemo;
          });
          
          setSnackbar({
            open: true,
            message: 'Meeting link added successfully',
            severity: 'success',
          });
          
          handleCloseMeetingLinkDialog();
        } else {
          throw new Error('Failed to add meeting link');
        }
      }
    } catch (error) {
      console.error('Error adding meeting link:', error);
      setSnackbar({
        open: true,
        message: 'Error adding meeting link',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
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
                    label={demoRequest.priority}
                    color="default"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {demoRequest.interestedIn}
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
            <Badge 
              badgeContent={demoRequest?.timeline.length || 0} 
              color="primary"
              showZero={false}
            >
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
                      <Typography variant="h6">{demoRequest.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {demoRequest.businessName}
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
                      <Typography variant="body2">{demoRequest.mobile}</Typography>
                      <Tooltip title="Copy phone number">
                        <IconButton 
                          size="small"
                          onClick={() => handleCopyToClipboard(
                            demoRequest.mobile,
                            'Phone number copied to clipboard'
                          )}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {demoRequest.mobile && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatsAppIcon color="success" />
                        <Typography variant="body2">{demoRequest.mobile}</Typography>
                        <Tooltip title="Copy WhatsApp number">
                          <IconButton 
                            size="small"
                            onClick={() => handleCopyToClipboard(
                              demoRequest.mobile || '',
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

            {/* Notes Card */}
            <Grow in={true} timeout={900}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" gutterBottom>
                      Notes
                    </Typography>
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      onClick={handleOpenEdit}
                    >
                      Edit
                    </Button>
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {demoRequest.notes || 'No notes added yet.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>

            {/* Requirements Card */}
            <Grow in={true} timeout={1000}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {demoRequest.requirements || 'No specific requirements provided.'}
                  </Typography>
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
                          {demoRequest.assignedAgentName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {demoRequest.assignedAgentName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {demoRequest.assignedTo}
                            </Typography>
                            <Tooltip title="Copy phone number">
                              <IconButton 
                                size="small"
                                onClick={() => handleCopyToClipboard(
                                  demoRequest.assignedTo || '',
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
                startIcon={<LinkIcon />}
                fullWidth
                onClick={handleOpenMeetingLinkDialog}
              >
                Add Meeting Link
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
                {filteredTimeline.length > 0 ? (
                  filteredTimeline.map((event, index) => (
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
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                              Activity type: {event.type}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Fade>
                  ))
                ) : demoRequest?.timeline && demoRequest.timeline.length > 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {timelineFilter ? 
                        `No timeline events match the filter "${timelineFilter}".` : 
                        'Timeline events aren\'t being displayed properly.'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {`${demoRequest.timeline.length} total activities found but not visible.`}
                    </Typography>
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => {
                        console.log('Debug info - Timeline events:', demoRequest.timeline);
                        setTimelineFilter('');
                        setSnackbar({
                          open: true,
                          message: 'Timeline filter cleared and debug info logged to console',
                          severity: 'info',
                        });
                      }}
                    >
                      Clear Filter & Debug
                    </Button>
                  </Box>
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
        <DialogTitle>Update Mobile/WhatsApp Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mobile Number"
            fullWidth
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Enter the mobile number including country code (e.g., +91 98765 43210)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWhatsappDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSaveWhatsappNumber} 
            variant="contained" 
            disabled={!whatsappNumber || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
            color="primary"
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={meetingLinkDialogOpen}
        onClose={handleCloseMeetingLinkDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
        }}
      >
        <DialogTitle>Add Meeting Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Meeting Link"
            fullWidth
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="https://meet.google.com/abc-defg-hij"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Enter the full meeting link (e.g., Google Meet, Zoom, Microsoft Teams)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMeetingLinkDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSaveMeetingLink} 
            variant="contained" 
            disabled={!meetingLink || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
            color="primary"
          >
            {submitting ? 'Saving...' : 'Add Link'}
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
    </Box>
  );
} 