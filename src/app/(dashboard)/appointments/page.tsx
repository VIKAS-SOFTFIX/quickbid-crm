'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  alpha,
  Paper,
  Divider,
  Stack,
  IconButton,
  Badge,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
  Tab,
  Tabs,
  CardActions,
  Avatar,
  Container,
  LinearProgress,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Slide,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Today as TodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  Groups as MeetingIcon,
  Event as EventIcon,
  EventBusy as EventBusyIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterAltIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  DateRange as DateRangeIcon,
  CloudDownload as CloudDownloadIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  FilterList as FilterListIcon,
  Cancel as CancelIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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

  const [searchDate, setSearchDate] = useState<Dayjs | null>(null);
  const [searchTime, setSearchTime] = useState<Dayjs | null>(null);
  const [searchResult, setSearchResult] = useState<{
    isBusy: boolean;
    conflictingAppointments: Appointment[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'call' | 'demo' | 'meeting' | ''>('');
  const [statusFilter, setStatusFilter] = useState<'scheduled' | 'completed' | 'cancelled' | ''>('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);

  // Define a color palette to match the dashboard
  const colorPalette = {
    background: '#f5f7fa',
    cardBg: '#ffffff',
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    border: alpha(theme.palette.divider, 0.08),
  };

  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment]);
    setIsNewAppointmentOpen(false);
  };

  const handleUpdateAppointment = (appointment: Appointment) => {
    setAppointments(appointments.map(a => a.id === appointment.id ? appointment : a));
    setSelectedAppointment(null);
    setIsAppointmentDetailOpen(false);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    setSelectedAppointment(null);
    setIsAppointmentDetailOpen(false);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailOpen(true);
  };

  const checkAvailability = () => {
    if (!searchDate || !searchTime) return;

    const searchDateTime = dayjs(searchDate)
      .hour(searchTime.hour())
      .minute(searchTime.minute());
    const searchEndTime = searchDateTime.add(30, 'minute');

    const conflictingAppointments = appointments.filter(appointment => {
      const appointmentStart = dayjs(appointment.start);
      const appointmentEnd = dayjs(appointment.end);
      return (
        (searchDateTime.isAfter(appointmentStart) && searchDateTime.isBefore(appointmentEnd)) ||
        (searchEndTime.isAfter(appointmentStart) && searchEndTime.isBefore(appointmentEnd)) ||
        (searchDateTime.isBefore(appointmentStart) && searchEndTime.isAfter(appointmentEnd))
      );
    });

    setSearchResult({
      isBusy: conflictingAppointments.length > 0,
      conflictingAppointments,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getAppointmentTypeIcon = (type: Appointment['type']) => {
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

  const getAppointmentTypeColor = (type: Appointment['type'], theme: any) => {
    switch (type) {
      case 'call':
        return theme.palette.primary.main;
      case 'demo':
        return theme.palette.success.main;
      case 'meeting':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getAppointmentStatusColor = (status: Appointment['status'], theme: any) => {
    switch (status) {
      case 'scheduled':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getAppointmentStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return <TimerIcon fontSize="small" />;
      case 'completed':
        return <CheckCircleOutlineIcon fontSize="small" />;
      case 'cancelled':
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by type if selected
    if (typeFilter && appointment.type !== typeFilter) return false;
    
    // Filter by status if selected
    if (statusFilter && appointment.status !== statusFilter) return false;
    
    // Filter by tab
    if (activeTab === 1) { // Today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const appointmentDate = new Date(appointment.start);
      if (!(appointmentDate >= today && appointmentDate < tomorrow)) {
        return false;
      }
    } else if (activeTab === 2) { // Upcoming
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const appointmentDate = new Date(appointment.start);
      if (!(appointmentDate >= tomorrow)) {
        return false;
      }
    } else if (activeTab === 3) { // Phone Calls
      if (appointment.type !== 'call') {
        return false;
      }
    } else if (activeTab === 4) { // Product Demos
      if (appointment.type !== 'demo') {
        return false;
      }
    } else if (activeTab === 5) { // Meetings
      if (appointment.type !== 'meeting') {
        return false;
      }
    }
    
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = appointment.title.toLowerCase().includes(query);
      const matchesLeadName = appointment.leadName.toLowerCase().includes(query);
      const matchesNotes = appointment.notes.toLowerCase().includes(query);
      if (!matchesTitle && !matchesLeadName && !matchesNotes) {
        return false;
      }
    }
    
    return true;
  });

  // Get counts for type chips
  const callsCount = appointments.filter(a => a.type === 'call').length;
  const demosCount = appointments.filter(a => a.type === 'demo').length;
  const meetingsCount = appointments.filter(a => a.type === 'meeting').length;

  // Get today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.start);
    return appointmentDate >= today && appointmentDate < tomorrow;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colorPalette.background }}>
      {/* Header section with a gradient background */}
      <Box 
        sx={{ 
          pt: { xs: 3, md: 4 }, 
          pb: { xs: 4, md: 5 },
          background: `linear-gradient(to right, ${alpha(theme.palette.primary.dark, 0.9)}, ${alpha(theme.palette.primary.main, 0.8)})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography 
                  variant="h3" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                    letterSpacing: '-0.01em'
                  }}
                >
                  Appointment Manager
                </Typography>
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    opacity: 0.9, 
                    maxWidth: '600px',
                    mb: { xs: 2, md: 3 }
                  }}
                >
                  Schedule, manage, and track all your client meetings and appointments in one place
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    mt: 2
                  }}
                >
                  <Chip 
                    icon={<EventIcon sx={{ color: '#FFFFFF !important' }} />}
                    label={`${appointments.length} Total`} 
                    sx={{ 
                      bgcolor: alpha('#FFFFFF', 0.15),
                      color: '#FFFFFF',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: '#FFFFFF' }
                    }} 
                  />
                  <Chip 
                    icon={<TodayIcon sx={{ color: '#FFFFFF !important' }} />}
                    label={`${todayAppointments.length} Today`} 
                    sx={{ 
                      bgcolor: alpha('#FFFFFF', 0.15),
                      color: '#FFFFFF',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: '#FFFFFF' }
                    }}
                  />
                  <Chip 
                    icon={<CalendarIcon sx={{ color: '#FFFFFF !important' }} />}
                    label={`${appointments.filter(a => new Date(a.start) > tomorrow).length} Upcoming`} 
                    sx={{ 
                      bgcolor: alpha('#FFFFFF', 0.15),
                      color: '#FFFFFF',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: '#FFFFFF' }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 2, md: 0 } }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' }
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon />}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#FFFFFF',
                        bgcolor: alpha('#FFFFFF', 0.1),
                      },
                    }}
                  >
                    Export
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                    onClick={() => setIsNewAppointmentOpen(true)}
                    sx={{
                      borderRadius: 2,
                      bgcolor: '#FFFFFF',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      boxShadow: `0 8px 16px ${alpha('#000', 0.1)}`,
                      '&:hover': {
                        bgcolor: alpha('#FFFFFF', 0.9),
                      },
                    }}
                  >
                    New Appointment
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
        
        {/* Decorative shapes in the background */}
        <Box 
          component="div" 
          sx={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: alpha('#FFFFFF', 0.05),
            zIndex: 0
          }}
        />
        <Box 
          component="div" 
          sx={{
            position: 'absolute',
            top: -30,
            right: '30%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha('#FFFFFF', 0.05),
            zIndex: 0
          }}
        />
      </Box>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        {/* Check Availability Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            mb: 4,
            border: `1px solid ${colorPalette.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <Box sx={{ p: 3, borderBottom: `1px solid ${colorPalette.border}` }}>
            <Typography 
              variant="h6" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontWeight: 600
              }}
            >
              <ScheduleIcon color="primary" />
              Check Availability
            </Typography>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={searchDate}
                    onChange={(date) => setSearchDate(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { borderRadius: 2 }
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={searchTime}
                    onChange={(time) => setSearchTime(time)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { borderRadius: 2 }
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SearchIcon />}
                  onClick={checkAvailability}
                  disabled={!searchDate || !searchTime}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    mt: 1,
                  }}
                >
                  Check Availability
                </Button>
              </Grid>
            </Grid>

            <AnimatePresence>
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${colorPalette.border}` }}>
                    <Chip
                      icon={searchResult.isBusy ? <EventBusyIcon /> : <CheckCircleIcon />}
                      label={searchResult.isBusy ? 'Time Slot is Busy' : 'Time Slot is Available'}
                      color={searchResult.isBusy ? 'error' : 'success'}
                      sx={{ mb: 2, fontWeight: 600, px: 1 }}
                    />
                    
                    {searchResult.isBusy && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                          Conflicting Appointments:
                        </Typography>
                        
                        <Stack spacing={1.5}>
                          {searchResult.conflictingAppointments.map((appointment) => (
                            <Paper
                              key={appointment.id}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.error.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main,
                                  borderRadius: '50%',
                                  width: 36,
                                  height: 36,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                {getAppointmentTypeIcon(appointment.type)}
                              </Box>
                              
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {appointment.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {appointment.leadName} • {new Date(appointment.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              </Box>
                            </Paper>
                          ))}
                        </Stack>
                      </motion.div>
                    )}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            mb: 4,
            border: `1px solid ${colorPalette.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          {/* Search and Filter Bar */}
          <Box sx={{ 
            p: { xs: 2, md: 3 }, 
            borderBottom: `1px solid ${colorPalette.border}`,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}>
            <TextField
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                maxWidth: { xs: '100%', md: '300px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.grey[100], 0.5),
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!isMobile && (
                <>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeFilter}
                      label="Type"
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="call">Phone Calls</MenuItem>
                      <MenuItem value="demo">Product Demos</MenuItem>
                      <MenuItem value="meeting">Meetings</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterAltIcon />}
                  size="small"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  sx={{
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.divider, 0.3),
                  }}
                >
                  Filters
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                size="small"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('');
                  setStatusFilter('');
                }}
                sx={{
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.divider, 0.3),
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              borderBottom: `1px solid ${colorPalette.border}`,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minHeight: 56,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tab 
              label="All Appointments" 
              icon={<EventIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Today" 
              icon={<TodayIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Upcoming" 
              icon={<DateRangeIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Phone Calls
                  <Chip 
                    label={callsCount} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main 
                    }} 
                  />
                </Box>
              }
              icon={<PhoneIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Product Demos
                  <Chip 
                    label={demosCount} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main 
                    }} 
                  />
                </Box>
              }
              icon={<VideoCallIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Meetings
                  <Chip 
                    label={meetingsCount} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem', 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main 
                    }} 
                  />
                </Box>
              }
              icon={<MeetingIcon />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Appointment List/Grid */}
          <Box sx={{ p: 3 }}>
            {filteredAppointments.length === 0 ? (
              <Box 
                sx={{ 
                  py: 8, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <EventBusyIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.5), mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                  No appointments found
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(theme.palette.text.secondary, 0.7), maxWidth: 400, mb: 3 }}>
                  {searchQuery || typeFilter || statusFilter ? 
                    "Try adjusting your filters or search query" : 
                    "Schedule your first appointment by clicking the 'New Appointment' button"}
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setIsNewAppointmentOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  New Appointment
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredAppointments.map((appointment) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={appointment.id}>
                    <Card
                      component={motion.div}
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${colorPalette.border}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        },
                      }}
                      onClick={() => handleViewAppointment(appointment)}
                    >
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderBottom: `1px solid ${colorPalette.border}`,
                          bgcolor: alpha(getAppointmentTypeColor(appointment.type, theme), 0.05),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(getAppointmentTypeColor(appointment.type, theme), 0.15),
                              color: getAppointmentTypeColor(appointment.type, theme),
                              width: 32,
                              height: 32,
                            }}
                          >
                            {getAppointmentTypeIcon(appointment.type)}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          sx={{
                            borderRadius: '4px',
                            bgcolor: alpha(getAppointmentStatusColor(appointment.status, theme), 0.1),
                            color: getAppointmentStatusColor(appointment.status, theme),
                            fontWeight: 500,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      
                      <CardContent sx={{ p: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom noWrap>
                          {appointment.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(appointment.start).toLocaleDateString()} • {new Date(appointment.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {appointment.leadName}
                          </Typography>
                        </Box>
                        
                        {appointment.notes && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              bgcolor: alpha(theme.palette.grey[100], 0.5),
                              p: 1.5,
                              borderRadius: 1,
                            }}
                          >
                            {appointment.notes}
                          </Typography>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          sx={{ 
                            borderRadius: 2,
                            borderColor: alpha(theme.palette.divider, 0.3),
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            borderRadius: 2,
                            bgcolor: getAppointmentTypeColor(appointment.type, theme),
                            '&:hover': {
                              bgcolor: alpha(getAppointmentTypeColor(appointment.type, theme), 0.9),
                            },
                          }}
                        >
                          {appointment.type === 'call' ? 'Call' : appointment.type === 'demo' ? 'Join' : 'Attend'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>
      
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 300,
            borderRadius: '12px 0 0 12px',
            p: 3,
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value as any)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="call">Phone Calls</MenuItem>
              <MenuItem value="demo">Product Demos</MenuItem>
              <MenuItem value="meeting">Meetings</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as any)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            fullWidth
            onClick={() => setIsFilterDrawerOpen(false)}
            sx={{ borderRadius: 2, mt: 2 }}
          >
            Apply Filters
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('');
              setStatusFilter('');
              setIsFilterDrawerOpen(false);
            }}
            sx={{ borderRadius: 2 }}
          >
            Reset Filters
          </Button>
        </Stack>
      </Drawer>
      
      {/* Appointment Detail Dialog */}
      <Dialog 
        open={isAppointmentDetailOpen} 
        onClose={() => setIsAppointmentDetailOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'visible',
          }
        }}
      >
        {selectedAppointment && (
          <>
            <DialogTitle sx={{ 
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: `1px solid ${colorPalette.border}`,
            }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {selectedAppointment.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    size="small"
                    label={selectedAppointment.type.charAt(0).toUpperCase() + selectedAppointment.type.slice(1)}
                    sx={{
                      bgcolor: alpha(getAppointmentTypeColor(selectedAppointment.type, theme), 0.1),
                      color: getAppointmentTypeColor(selectedAppointment.type, theme),
                    }}
                  />
                  <Chip
                    size="small"
                    label={selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                    sx={{
                      bgcolor: alpha(getAppointmentStatusColor(selectedAppointment.status, theme), 0.1),
                      color: getAppointmentStatusColor(selectedAppointment.status, theme),
                    }}
                  />
                </Box>
              </Box>
              <IconButton 
                onClick={() => setIsAppointmentDetailOpen(false)}
                sx={{ marginTop: -1, marginRight: -1 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {selectedAppointment.leadName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lead ID: {selectedAppointment.leadId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CalendarIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(selectedAppointment.start).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <AccessTimeIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date(selectedAppointment.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedAppointment.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {selectedAppointment.notes && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotesIcon fontSize="small" />
                        Notes
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.grey[100], 0.5),
                          border: `1px solid ${colorPalette.border}`,
                        }}
                      >
                        <Typography variant="body2">
                          {selectedAppointment.notes}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                sx={{ borderRadius: 2 }}
              >
                Delete
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsAppointmentDetailOpen(false)} 
                  sx={{ borderRadius: 2 }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: getAppointmentTypeColor(selectedAppointment.type, theme),
                  }}
                >
                  {selectedAppointment.type === 'call' ? 'Call' : selectedAppointment.type === 'demo' ? 'Join' : 'Attend'}
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 