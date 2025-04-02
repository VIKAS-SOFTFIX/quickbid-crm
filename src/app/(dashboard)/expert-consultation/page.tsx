'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  SupportAgent as SupportAgentIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const CONSULTATION_TYPES = [
  'Product Demo',
  'Technical Support',
  'Sales Inquiry',
  'Feature Request',
  'General Query',
] as const;

const URGENCY_LEVELS = ['Low', 'Medium', 'High'] as const;

interface Consultation {
  id: string;
  type: typeof CONSULTATION_TYPES[number];
  subject: string;
  description: string;
  requestDate: string;
  preferredDate: string;
  preferredTime: string;
  urgency: typeof URGENCY_LEVELS[number];
  status: 'pending' | 'scheduled' | 'completed';
}

const mockConsultations: Consultation[] = [
  {
    id: '1',
    type: 'Product Demo',
    subject: 'QuickBid Features Overview',
    description: 'Need a detailed walkthrough of tender management features',
    requestDate: '2024-03-20',
    preferredDate: '2024-03-25',
    preferredTime: '14:00',
    urgency: 'Medium',
    status: 'scheduled',
  },
  // Add more mock consultations as needed
];

export default function ExpertConsultationPage() {
  const [open, setOpen] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [newConsultation, setNewConsultation] = useState({
    type: '',
    subject: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    urgency: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add new consultation logic here
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Expert Consultation</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          New Consultation Request
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Consultation Requests
            </Typography>
            <List>
              {consultations.map((consultation) => (
                <ListItem
                  key={consultation.id}
                  sx={{
                    mb: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <SupportAgentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{consultation.subject}</Typography>
                        <Chip
                          label={consultation.status}
                          color={
                            consultation.status === 'completed'
                              ? 'success'
                              : consultation.status === 'scheduled'
                              ? 'primary'
                              : 'warning'
                          }
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Type: {consultation.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Requested: {consultation.requestDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Preferred: {consultation.preferredDate} at {consultation.preferredTime}
                        </Typography>
                        <Chip
                          label={`Urgency: ${consultation.urgency}`}
                          size="small"
                          color={
                            consultation.urgency === 'High'
                              ? 'error'
                              : consultation.urgency === 'Medium'
                              ? 'warning'
                              : 'default'
                          }
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ScheduleIcon />}
                fullWidth
              >
                Schedule Consultation
              </Button>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                fullWidth
              >
                Call Expert
              </Button>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                fullWidth
              >
                Email Expert
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Consultation Request</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Consultation Type</InputLabel>
                <Select
                  value={newConsultation.type}
                  label="Consultation Type"
                  onChange={(e) => setNewConsultation({ ...newConsultation, type: e.target.value })}
                >
                  {CONSULTATION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Urgency Level</InputLabel>
                <Select
                  value={newConsultation.urgency}
                  label="Urgency Level"
                  onChange={(e) => setNewConsultation({ ...newConsultation, urgency: e.target.value })}
                >
                  {URGENCY_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Subject"
                fullWidth
                value={newConsultation.subject}
                onChange={(e) => setNewConsultation({ ...newConsultation, subject: e.target.value })}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={newConsultation.description}
                onChange={(e) => setNewConsultation({ ...newConsultation, description: e.target.value })}
              />

              <TextField
                label="Preferred Date"
                type="date"
                fullWidth
                value={newConsultation.preferredDate}
                onChange={(e) => setNewConsultation({ ...newConsultation, preferredDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Preferred Time"
                type="time"
                fullWidth
                value={newConsultation.preferredTime}
                onChange={(e) => setNewConsultation({ ...newConsultation, preferredTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit Request
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 