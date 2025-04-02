'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  IconButton,
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
  Stack,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  Groups as MeetingIcon,
} from '@mui/icons-material';

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'call' | 'demo' | 'meeting';
  status: 'scheduled' | 'completed' | 'cancelled';
  leadId: string;
  leadName: string;
  notes: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

export default function AppointmentCalendar({
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
}: AppointmentCalendarProps) {
  const router = useRouter();
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    title: '',
    start: new Date(),
    end: new Date(),
    type: 'call',
    status: 'scheduled',
    leadId: '',
    leadName: '',
    notes: '',
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setNewAppointment({
      ...newAppointment,
      start: clickedDate,
      end: new Date(clickedDate.getTime() + 30 * 60000), // 30 minutes default
    });
    setOpenDialog(true);
  };

  const handleAddAppointment = () => {
    onAddAppointment(newAppointment);
    setOpenDialog(false);
    setNewAppointment({
      title: '',
      start: new Date(),
      end: new Date(),
      type: 'call',
      status: 'scheduled',
      leadId: '',
      leadName: '',
      notes: '',
    });
  };

  const getAppointmentsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isDateBusy = (day: number) => {
    const appointments = getAppointmentsForDay(day);
    return appointments.length > 0;
  };

  const getAppointmentColor = (type: Appointment['type']) => {
    switch (type) {
      case 'call':
        return 'primary';
      case 'demo':
        return 'success';
      case 'meeting':
        return 'info';
      default:
        return 'default';
    }
  };

  const getAppointmentIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'call':
        return <PhoneIcon fontSize="small" />;
      case 'demo':
        return <VideoCallIcon fontSize="small" />;
      case 'meeting':
        return <MeetingIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const handleAppointmentClick = (appointment: Appointment, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent calendar day click
    if (appointment.type === 'demo') {
      router.push(`/demo-requests/${appointment.leadId}`);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
          <Box>
            <IconButton onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Typography
              key={day}
              variant="caption"
              sx={{ textAlign: 'center', fontWeight: 'bold', color: 'text.secondary' }}
            >
              {day}
            </Typography>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <Box key={`empty-${index}`} />
          ))}
          {days.map((day) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isBusy = isDateBusy(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <Paper
                key={day}
                sx={{
                  p: 1,
                  minHeight: 100,
                  cursor: 'pointer',
                  bgcolor: isToday ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  border: isToday ? `1px solid ${theme.palette.primary.main}` : 'none',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
                onClick={() => handleDateClick(day)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? 'bold' : 'normal',
                    color: isToday ? 'primary.main' : 'text.primary',
                  }}
                >
                  {day}
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  {dayAppointments.map((appointment) => (
                    <Chip
                      key={appointment.id}
                      label={appointment.title}
                      size="small"
                      color={getAppointmentColor(appointment.type)}
                      icon={getAppointmentIcon(appointment.type) || undefined}
                      onClick={(e) => handleAppointmentClick(appointment, e)}
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        cursor: appointment.type === 'demo' ? 'pointer' : 'default',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                        '&:hover': {
                          bgcolor: appointment.type === 'demo' 
                            ? alpha(theme.palette.primary.main, 0.1)
                            : undefined,
                        },
                      }}
                    />
                  ))}
                  {dayAppointments.length > 0 && (
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(day);
                      }}
                      sx={{ mt: 0.5 }}
                    >
                      Add Activity
                    </Button>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Appointment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={newAppointment.title}
              onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newAppointment.type}
                label="Type"
                onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as Appointment['type'] })}
              >
                <MenuItem value="call">Phone Call</MenuItem>
                <MenuItem value="demo">Product Demo</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              value={newAppointment.start.toISOString().slice(0, 16)}
              onChange={(e) => {
                const newStart = new Date(e.target.value);
                setNewAppointment({
                  ...newAppointment,
                  start: newStart,
                  end: new Date(newStart.getTime() + 30 * 60000),
                });
              }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              value={newAppointment.end.toISOString().slice(0, 16)}
              onChange={(e) => setNewAppointment({ ...newAppointment, end: new Date(e.target.value) })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Lead Name"
              fullWidth
              value={newAppointment.leadName}
              onChange={(e) => setNewAppointment({ ...newAppointment, leadName: e.target.value })}
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAppointment} variant="contained">
            Add Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 