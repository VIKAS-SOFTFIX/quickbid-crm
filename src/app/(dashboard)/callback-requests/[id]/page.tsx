'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Paper,
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
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
  Note as NoteIcon,
  History as HistoryIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: 'call' | 'note' | 'status_change' | 'follow_up';
  description: string;
  user: string;
}

interface CallbackRequest {
  id: string;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  time: string;
  preferredTime: string;
  contactName: string;
  contactPhone: string;
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

const mockCallbackRequest: CallbackRequest = {
  id: '1',
  status: 'pending',
  date: '2024-03-25',
  time: '10:00',
  preferredTime: 'After 2 PM',
  contactName: 'John Doe',
  contactPhone: '+91 9876543210',
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
      type: 'call',
      description: 'Initial call attempt - No answer',
      user: 'Rajesh Kumar',
    },
    {
      id: '2',
      date: '2024-03-25',
      time: '14:30',
      type: 'note',
      description: 'Left voicemail with callback number',
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
      description: 'Follow-up call scheduled for tomorrow',
      user: 'Rajesh Kumar',
    },
  ],
};

export default function CallbackDetailPage() {
  const { id } = useParams();
  const [callbackRequest, setCallbackRequest] = useState<CallbackRequest | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [openFollowUp, setOpenFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const theme = useTheme();

  useEffect(() => {
    // In a real app, fetch callback request details from API
    setCallbackRequest(mockCallbackRequest);
  }, [id]);

  const handleOpenEdit = () => {
    setEditNotes(callbackRequest?.notes || '');
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleSaveNotes = () => {
    if (callbackRequest) {
      setCallbackRequest({ ...callbackRequest, notes: editNotes });
    }
    handleCloseEdit();
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
    if (callbackRequest && followUpDate) {
      const newEvent: TimelineEvent = {
        id: Date.now().toString(),
        date: followUpDate,
        time: new Date().toLocaleTimeString(),
        type: 'follow_up',
        description: followUpNotes || 'Follow-up scheduled',
        user: 'Rajesh Kumar', // In real app, use actual user
      };
      setCallbackRequest({
        ...callbackRequest,
        timeline: [newEvent, ...callbackRequest.timeline],
        followUpDate: followUpDate,
      });
      handleCloseFollowUp();
    }
  };

  const getTimelineIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'call':
        return <PhoneIcon />;
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

  if (!callbackRequest) {
    return (
      <Box>
        <Typography variant="h4">Callback request not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Callback Request Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Chip
                label={callbackRequest.status}
                color="default"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '& .MuiChip-label': { fontWeight: 500 }
                }}
              />
              <Chip
                icon={<PriorityHighIcon />}
                label={callbackRequest.urgency}
                color="default"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '& .MuiChip-label': { fontWeight: 500 }
                }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {callbackRequest.reason}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1} direction="row" justifyContent="flex-end">
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
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Contact Information Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{callbackRequest.contactName}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="primary" />
                    <Typography variant="body2">{callbackRequest.contactPhone}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" />
                <Typography>Preferred: {callbackRequest.preferredTime}</Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button startIcon={<PhoneIcon />}>Call Now</Button>
            </CardActions>
          </Card>

          {/* Timeline Section */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Activity Timeline</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenFollowUp}
                >
                  Add Activity
                </Button>
              </Box>

              <Box sx={{ position: 'relative', pl: 3 }}>
                {callbackRequest.timeline.map((event) => (
                  <Box
                    key={event.id}
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
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {event.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.date} at {event.time} by {event.user}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Assigned Agent Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assigned Agent
              </Typography>
              {callbackRequest.assignedTo ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>
                      {callbackRequest.assignedTo.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {callbackRequest.assignedTo.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="primary" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {callbackRequest.assignedTo.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    fullWidth
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

          {/* Quick Actions Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  fullWidth
                >
                  Reschedule Callback
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AccessTimeIcon />}
                  fullWidth
                >
                  Set Reminder
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Notes</Typography>
                <IconButton size="small" onClick={handleOpenEdit}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant="body1">{callbackRequest.notes}</Typography>
              {callbackRequest.followUpDate && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="warning" />
                    <Typography variant="subtitle2" color="warning.main">
                      Follow-up: {callbackRequest.followUpDate}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
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
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFollowUp} onClose={handleCloseFollowUp} maxWidth="sm" fullWidth>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFollowUp}>Cancel</Button>
          <Button onClick={handleAddFollowUp} variant="contained">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 