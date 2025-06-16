import { useState, useEffect } from 'react';
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

// Define the BASE_URL
const BASE_URL = 'https://api.quickbid.co.in/support';

// Timeline event interface
export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: string;
  description: string;
  user: string;
}

// Demo request interface
export interface DemoRequest {
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

export function useDemoDetail(id: string) {
  // State
  const [demoRequest, setDemoRequest] = useState<DemoRequest | null>(null);
  const [activities, setActivities] = useState<DemoActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  
  // Component UI state - moved from page component
  const [openEdit, setOpenEdit] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [openFollowUp, setOpenFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [meetingLinkDialogOpen, setMeetingLinkDialogOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

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

  // Fetch demo data
  const fetchDemoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch demo request details
      const demoResponse = await getDemoRequest(id);
      console.log('Demo request response:', demoResponse);
      
      // First fetch activities separately to ensure we have them
      console.log('Fetching activities for demo ID:', id);
      const activitiesResponse = await getDemoActivities(id);
      console.log('Activities response raw:', activitiesResponse);
      
      // Handle different response formats - API might return array directly or {success, data} object
      let activitiesList: DemoActivity[] = [];
      
      if (Array.isArray(activitiesResponse)) {
        // API returned array directly
        activitiesList = activitiesResponse;
        console.log(`Detected direct array response with ${activitiesList.length} activities`);
      } else if (activitiesResponse && activitiesResponse.success && Array.isArray(activitiesResponse.data)) {
        // API returned {success: true, data: [...]} format
        activitiesList = activitiesResponse.data;
        console.log(`Detected success/data object response with ${activitiesList.length} activities`);
      } else {
        console.warn('Unable to parse activities response:', activitiesResponse);
      }
      
      // Set activities to state
      setActivities(activitiesList);
      
      // Create timeline events
      const timelineEvents: TimelineEvent[] = [];
      
      // Process each activity
      activitiesList.forEach(activity => {
        try {
          const event = createTimelineEventFromActivity(activity);
          console.log('Created timeline event:', event);
          timelineEvents.push(event);
        } catch (err) {
          console.error('Error processing activity:', activity, err);
        }
      });
      
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
          timeline: timelineEvents,
          createdAt: demo.createdAt,
          updatedAt: demo.updatedAt
        };
        
        console.log('Setting demo request with timeline:', uiDemo);
        setDemoRequest(uiDemo);
      } else {
        setError('Failed to fetch demo request details');
      }
    } catch (error) {
      console.error('Error fetching demo data:', error);
      setError('Error loading demo details');
      setSnackbar({
        open: true,
        message: 'Error loading demo details',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add note to demo
  const addNote = async (notes: string) => {
    if (!demoRequest) return false;
    
    setSubmitting(true);
    
    try {
      // First update the demo request with new notes
      const updateResponse = await updateDemoRequest(demoRequest.id, {
        notes
      });
      
      // Then create an activity record for the note
      const activityResponse = await addDemoNote(
        demoRequest.id,
        notes,
        demoRequest.assignedTo || 'system',
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
            notes,
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
        
        return true;
      } else {
        throw new Error('Failed to update notes or create activity');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setSnackbar({
        open: true,
        message: 'Error updating notes',
        severity: 'error',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Schedule follow-up
  const scheduleNewFollowUp = async (followUpDate: string, description: string = 'Follow-up scheduled') => {
    if (!demoRequest) return false;
    
    setSubmitting(true);
    
    try {
      // Format the follow-up date for the API
      const formattedFollowUpDate = `${followUpDate}T10:00:00.000Z`;
      
      // Create an activity record for the follow-up
      const activityResponse = await scheduleFollowUp(
        demoRequest.id,
        formattedFollowUpDate,
        description,
        demoRequest.assignedTo || 'system',
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
        
        return true;
      } else {
        throw new Error('Failed to schedule follow-up');
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      setSnackbar({
        open: true,
        message: 'Error scheduling follow-up',
        severity: 'error',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Add meeting link
  const addNewMeetingLink = async (meetingLink: string) => {
    if (!demoRequest) return false;
    
    setSubmitting(true);
    
    try {
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
        
        return true;
      } else {
        throw new Error('Failed to add meeting link');
      }
    } catch (error) {
      console.error('Error adding meeting link:', error);
      setSnackbar({
        open: true,
        message: 'Error adding meeting link',
        severity: 'error',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Update status
  const updateDemoStatus = async (status: DemoRequest['status']) => {
    if (!demoRequest) return false;
    
    setSubmitting(true);
    
    try {
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
      
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({
        open: true,
        message: 'Error updating status',
        severity: 'error',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Update WhatsApp number
  const updateWhatsAppNumber = async (number: string) => {
    if (!demoRequest) return false;
    
    setSubmitting(true);
    
    try {
      // Update the demo request with new mobile number
      const updateResponse = await updateDemoRequest(demoRequest.id, {
        mobile: number
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
            newValue: number
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
          const newEvent = createTimelineEventFromActivity(newActivity);
          
          // Update the demo request in state
          setDemoRequest(prev => {
            if (!prev) return null;
            
            return {
              ...prev,
              mobile: number,
              timeline: [newEvent, ...prev.timeline]
            };
          });
        }
        
        setSnackbar({
          open: true,
          message: 'Mobile number updated successfully',
          severity: 'success',
        });
        
        return true;
      } else {
        throw new Error('Failed to update mobile number');
      }
    } catch (error) {
      console.error('Error updating mobile number:', error);
      setSnackbar({
        open: true,
        message: 'Error updating mobile number',
        severity: 'error',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Close snackbar
  const closeSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Get filtered timeline
  const getFilteredTimeline = () => {
    if (!demoRequest) return [];
    
    return demoRequest.timeline.filter(event => {
      if (!timelineFilter) return true;
      
      // Make filtering more flexible by checking multiple fields
      return (
        event.type.toLowerCase().includes(timelineFilter.toLowerCase()) ||
        event.description.toLowerCase().includes(timelineFilter.toLowerCase()) ||
        event.user.toLowerCase().includes(timelineFilter.toLowerCase())
      );
    });
  };

  // Dialog handlers - moved from page component
  const handleOpenEdit = () => {
    setEditNotes(demoRequest?.notes || '');
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleSaveNotes = async () => {
    const success = await addNote(editNotes);
    if (success) {
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

  const handleAddFollowUp = async () => {
    const success = await scheduleNewFollowUp(followUpDate, followUpNotes);
    if (success) {
      handleCloseFollowUp();
    }
  };

  const handleOpenWhatsappDialog = () => {
    setWhatsappNumber(demoRequest?.mobile || '');
    setWhatsappDialogOpen(true);
  };

  const handleCloseWhatsappDialog = () => {
    setWhatsappDialogOpen(false);
  };

  const handleSaveWhatsappNumber = async () => {
    const success = await updateWhatsAppNumber(whatsappNumber);
    if (success) {
      handleCloseWhatsappDialog();
    }
  };

  const handleOpenMeetingLinkDialog = () => {
    setMeetingLink('');
    setMeetingLinkDialogOpen(true);
  };

  const handleCloseMeetingLinkDialog = () => {
    setMeetingLinkDialogOpen(false);
  };

  const handleSaveMeetingLink = async () => {
    const success = await addNewMeetingLink(meetingLink);
    if (success) {
      handleCloseMeetingLinkDialog();
    }
  };

  // Menu handlers
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // Tab handlers
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Copy to clipboard
  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    closeSnackbar();
    // Should show a snackbar message, but we're closing it instead
    // Could be improved to show the success message
  };

  // Helper functions for UI
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'primary.main';
    
    switch (status) {
      case 'pending':
        return 'warning.main';
      case 'scheduled':
        return 'info.main';
      case 'completed':
        return 'success.main';
      case 'cancelled':
      case 'rejected':
        return 'error.main';
      default:
        return 'primary.main';
    }
  };

  const getUrgencyColor = (urgency: string | undefined) => {
    if (!urgency) return 'primary.main';
    
    switch (urgency) {
      case 'low':
        return 'info.main';
      case 'medium':
        return 'warning.main';
      case 'high':
        return 'error.main';
      default:
        return 'primary.main';
    }
  };

  const getTimelineIcon = (type: string) => {
    const actionType = type.toLowerCase();
    
    if (actionType.includes('demo_booked') || actionType.includes('demo_scheduled')) {
      return 'EventIcon';
    } else if (actionType.includes('note')) {
      return 'NoteIcon';
    } else if (actionType.includes('demo_completed') || actionType.includes('status')) {
      return 'CheckCircleIcon';
    } else if (actionType.includes('follow_up')) {
      return 'ScheduleIcon';
    } else if (actionType.includes('agent')) {
      return 'PersonIcon';
    } else if (actionType.includes('meeting') || actionType.includes('link')) {
      return 'LinkIcon';
    } else if (actionType.includes('contact')) {
      return 'PhoneIcon';
    } else {
      return 'HistoryIcon';
    }
  };

  // Initial data load
  useEffect(() => {
    fetchDemoData();
  }, [id]);

  // Compute filtered timeline
  const filteredTimeline = getFilteredTimeline();

  // Refresh function to reload data
  const refresh = () => {
    fetchDemoData();
  };

  return {
    demoRequest,
    loading,
    submitting,
    error,
    timelineFilter,
    snackbar,
    filteredTimeline,
    openEdit,
    editNotes,
    openFollowUp,
    followUpDate,
    followUpNotes,
    menuAnchorEl,
    activeTab,
    whatsappDialogOpen,
    whatsappNumber,
    meetingLinkDialogOpen,
    meetingLink,
    setTimelineFilter,
    addNote,
    scheduleFollowUp: scheduleNewFollowUp,
    addMeetingLink: addNewMeetingLink,
    updateStatus: updateDemoStatus,
    updateWhatsAppNumber,
    closeSnackbar,
    refresh,
    handleOpenEdit,
    handleCloseEdit,
    handleSaveNotes,
    handleOpenFollowUp,
    handleCloseFollowUp,
    handleAddFollowUp,
    handleOpenWhatsappDialog,
    handleCloseWhatsappDialog,
    handleSaveWhatsappNumber,
    handleOpenMeetingLinkDialog,
    handleCloseMeetingLinkDialog,
    handleSaveMeetingLink,
    handleOpenMenu,
    handleCloseMenu,
    handleChangeTab,
    handleCopyToClipboard,
    getStatusColor,
    getUrgencyColor,
    getTimelineIcon,
    setEditNotes,
    setFollowUpDate,
    setFollowUpNotes,
    setWhatsappNumber,
    setMeetingLink
  };
} 