'use client';

import { useState } from 'react';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

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

export default function AppointmentsPage() {
  const theme = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Product Demo - Tech Solutions',
      start: new Date('2024-03-27T15:00:00'),
      end: new Date('2024-03-27T16:00:00'),
      type: 'demo',
      status: 'scheduled',
      leadId: '1',
      leadName: 'John Doe',
      notes: 'Enterprise solution demo for Tech Solutions Pvt Ltd',
    },
    {
      id: '2',
      title: 'Product Demo - Digital Marketing Agency',
      start: new Date('2024-03-28T11:00:00'),
      end: new Date('2024-03-28T12:00:00'),
      type: 'demo',
      status: 'scheduled',
      leadId: '2',
      leadName: 'Jane Smith',
      notes: 'Demo for Digital Marketing Agency',
    },
    {
      id: '3',
      title: 'Team Meeting',
      start: new Date('2024-03-21T09:00:00'),
      end: new Date('2024-03-21T10:00:00'),
      type: 'meeting',
      status: 'scheduled',
      leadId: '3',
      leadName: 'Internal',
      notes: 'Weekly sales team sync',
    },
    {
      id: '4',
      title: 'Client Call',
      start: new Date('2024-03-21T11:30:00'),
      end: new Date('2024-03-21T12:00:00'),
      type: 'call',
      status: 'scheduled',
      leadId: '4',
      leadName: 'Tech Solutions Inc',
      notes: 'Follow-up on proposal',
    },
    {
      id: '5',
      title: 'Product Demo',
      start: new Date('2024-03-22T13:00:00'),
      end: new Date('2024-03-22T14:00:00'),
      type: 'demo',
      status: 'scheduled',
      leadId: '5',
      leadName: 'Global Industries',
      notes: 'Custom solution demo',
    },
    {
      id: '6',
      title: 'Strategy Meeting',
      start: new Date('2024-03-22T15:30:00'),
      end: new Date('2024-03-22T16:30:00'),
      type: 'meeting',
      status: 'scheduled',
      leadId: '6',
      leadName: 'Internal',
      notes: 'Q2 planning meeting',
    },
    {
      id: '7',
      title: 'Client Call',
      start: new Date('2024-03-23T10:00:00'),
      end: new Date('2024-03-23T10:30:00'),
      type: 'call',
      status: 'scheduled',
      leadId: '7',
      leadName: 'Innovation Labs',
      notes: 'Initial contact',
    },
    {
      id: '8',
      title: 'Product Demo',
      start: new Date('2024-03-23T14:00:00'),
      end: new Date('2024-03-23T15:00:00'),
      type: 'demo',
      status: 'scheduled',
      leadId: '8',
      leadName: 'Future Systems',
      notes: 'Technical demo',
    },
    {
      id: '9',
      title: 'Team Meeting',
      start: new Date('2024-03-24T09:00:00'),
      end: new Date('2024-03-24T10:00:00'),
      type: 'meeting',
      status: 'scheduled',
      leadId: '9',
      leadName: 'Internal',
      notes: 'Monthly review',
    },
    {
      id: '10',
      title: 'Client Call',
      start: new Date('2024-03-24T11:30:00'),
      end: new Date('2024-03-24T12:00:00'),
      type: 'call',
      status: 'scheduled',
      leadId: '10',
      leadName: 'Digital Solutions',
      notes: 'Contract discussion',
    },
  ]);

  const [searchDate, setSearchDate] = useState<string>('');
  const [searchTime, setSearchTime] = useState<string>('');
  const [searchResult, setSearchResult] = useState<{
    isBusy: boolean;
    conflictingAppointments: Appointment[];
  } | null>(null);

  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const handleUpdateAppointment = (appointment: Appointment) => {
    setAppointments(appointments.map(a => a.id === appointment.id ? appointment : a));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const checkAvailability = () => {
    if (!searchDate || !searchTime) return;

    const searchDateTime = new Date(`${searchDate}T${searchTime}`);
    const searchEndTime = new Date(searchDateTime.getTime() + 30 * 60000); // 30 minutes duration

    const conflictingAppointments = appointments.filter(appointment => {
      const appointmentStart = new Date(appointment.start);
      const appointmentEnd = new Date(appointment.end);
      return (
        (searchDateTime >= appointmentStart && searchDateTime < appointmentEnd) ||
        (searchEndTime > appointmentStart && searchEndTime <= appointmentEnd) ||
        (searchDateTime <= appointmentStart && searchEndTime >= appointmentEnd)
      );
    });

    setSearchResult({
      isBusy: conflictingAppointments.length > 0,
      conflictingAppointments,
    });
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Check Availability
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Date"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Time"
            type="time"
            value={searchTime}
            onChange={(e) => setSearchTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={checkAvailability}
            disabled={!searchDate || !searchTime}
          >
            Check Availability
          </Button>
        </Stack>

        {searchResult && (
          <Box>
            <Chip
              label={searchResult.isBusy ? 'Time Slot is Busy' : 'Time Slot is Available'}
              color={searchResult.isBusy ? 'error' : 'success'}
              sx={{ mb: 2 }}
            />
            {searchResult.isBusy && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Conflicting Appointments:
                </Typography>
                <Stack spacing={1}>
                  {searchResult.conflictingAppointments.map((appointment) => (
                    <Paper
                      key={appointment.id}
                      sx={{
                        p: 1.5,
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                      }}
                    >
                      <Typography variant="body2">
                        {appointment.title} - {appointment.leadName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(appointment.start).toLocaleTimeString()} - {new Date(appointment.end).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      <AppointmentCalendar
        appointments={appointments}
        onAddAppointment={handleAddAppointment}
        onUpdateAppointment={handleUpdateAppointment}
        onDeleteAppointment={handleDeleteAppointment}
      />
    </Box>
  );
} 