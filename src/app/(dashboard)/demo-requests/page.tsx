'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Stack,
  Avatar,
  alpha,
  InputAdornment,
  Skeleton,
  Snackbar,
  Alert,
  Badge,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  CheckCircle as CheckCircleIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { mockLeads } from '@/services/mockData';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface DemoRequest {
  id: string;
  leadName: string;
  companyName: string;
  contactPhone: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected';
  assignedTo: string;
  notes?: string;
  createdAt?: string;
}

// Mock data for demo requests
const mockDemoRequests: DemoRequest[] = [
  {
    id: '1',
    leadName: 'John Doe',
    companyName: 'Tech Solutions Inc.',
    contactPhone: '+91 98765 43210',
    preferredDate: new Date().toISOString().split('T')[0], // Today
    preferredTime: '10:00 AM',
    status: 'scheduled',
    assignedTo: 'John Doe',
    notes: 'Interested in enterprise features',
    createdAt: '2024-03-20',
  },
  {
    id: '2',
    leadName: 'Jane Smith',
    companyName: 'Global Industries',
    contactPhone: '+91 98765 43211',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    preferredTime: '2:00 PM',
    status: 'pending',
    assignedTo: 'Jane Smith',
    notes: 'Looking for bulk pricing',
    createdAt: '2024-03-21',
  },
  {
    id: '3',
    leadName: 'Robert Johnson',
    companyName: 'Johnson & Associates',
    contactPhone: '+91 98765 43212',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Day after tomorrow
    preferredTime: '11:30 AM',
    status: 'scheduled',
    assignedTo: 'Mike Johnson',
    notes: 'Interested in premium features',
    createdAt: '2024-03-18',
  },
  {
    id: '4',
    leadName: 'Emily Chen',
    companyName: 'Chen Technology',
    contactPhone: '+91 98765 43213',
    preferredDate: new Date().toISOString().split('T')[0], // Today
    preferredTime: '3:00 PM',
    status: 'scheduled',
    assignedTo: 'Sarah Wilson',
    notes: 'Needs detailed walkthrough',
    createdAt: '2024-03-15',
  },
  {
    id: '5',
    leadName: 'Michael Brown',
    companyName: 'Brown Industries',
    contactPhone: '+91 98765 43214',
    preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
    preferredTime: '11:00 AM',
    status: 'scheduled',
    assignedTo: 'Jane Smith',
    notes: 'Focus on integration features',
    createdAt: '2024-03-22',
  },
  {
    id: '6',
    leadName: 'Sarah Wong',
    companyName: 'Wong LLC',
    contactPhone: '+91 98765 43215',
    preferredDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days from now
    preferredTime: '1:30 PM',
    status: 'scheduled',
    assignedTo: 'Mike Johnson',
    notes: 'Enterprise client, big opportunity',
    createdAt: '2024-03-22',
  },
];

// Mock data for team members
const mockTeamMembers = [
  { id: '1', name: 'John Doe', role: 'sales' },
  { id: '2', name: 'Jane Smith', role: 'sales' },
  { id: '3', name: 'Mike Johnson', role: 'demonstrator' },
  { id: '4', name: 'Sarah Wilson', role: 'demonstrator' },
];

const statusColors = {
  pending: 'warning',
  scheduled: 'info',
  completed: 'success',
  cancelled: 'error',
  rejected: 'error',
} as const;

// View types
type ViewType = 'ongoing' | 'upcoming' | 'completed' | 'rejected';

export default function DemoRequestsPage() {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('date');
  const [viewType, setViewType] = useState<ViewType>('ongoing');
  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setRequests(mockDemoRequests);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = (request?: DemoRequest) => {
    setSelectedRequest(request || null);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRequest(null);
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData.entries());
      
    // Handle form submission
      const newRequest: DemoRequest = {
        id: selectedRequest?.id || (requests.length + 1).toString(),
        leadName: formValues.leadName as string,
        companyName: formValues.companyName as string,
        contactPhone: formValues.contactPhone as string,
        preferredDate: formValues.preferredDate as string,
        preferredTime: formValues.preferredTime as string,
        status: formValues.status as DemoRequest['status'],
        assignedTo: formValues.assignedTo as string,
        notes: formValues.notes as string,
        createdAt: selectedRequest?.createdAt || new Date().toISOString().split('T')[0],
      };
      
      if (selectedRequest) {
        setRequests(prev => prev.map(r => r.id === newRequest.id ? newRequest : r));
        setSnackbar({
          open: true,
          message: 'Demo request updated successfully',
          severity: 'success',
        });
      } else {
        setRequests(prev => [newRequest, ...prev]);
        setSnackbar({
          open: true,
          message: 'Demo request created successfully',
          severity: 'success',
        });
      }
      
      setSubmitting(false);
    handleClose();
    }, 1000);
  };

  const handleRowClick = (request: DemoRequest) => {
    router.push(`/demo-requests/${request.id}`);
  };

  const handleEditClick = (request: DemoRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/demo-requests/${request.id}`);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSnackbar({
      open: true,
      message: 'Initiating call...',
      severity: 'info',
    });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: string | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleViewTypeChange = (_event: React.SyntheticEvent, newValue: ViewType) => {
    setViewType(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // First filter and sort the requests
  const filteredRequests = requests
    .filter(request => {
      // Filter by view type
      if (viewType === 'ongoing' && request.preferredDate !== today) {
        return false;
      }
      
      if (viewType === 'upcoming' && request.preferredDate <= today) {
        return false;
      }
      
      // New filters for completed and rejected types
      if (viewType === 'completed' && request.status !== 'completed') {
        return false;
      }
      
      if (viewType === 'rejected' && request.status !== 'cancelled' && request.status !== 'rejected') {
        return false;
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !request.leadName.toLowerCase().includes(query) &&
          !request.companyName.toLowerCase().includes(query) &&
          !request.contactPhone.includes(query) &&
          !request.notes?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      // Apply status filter
      if (filters.status && request.status !== filters.status) {
        return false;
      }
      
      // Apply assignedTo filter
      if (filters.assignedTo && request.assignedTo !== filters.assignedTo) {
        return false;
      }
      
    return true;
    })
    .sort((a, b) => {
      // For completed and rejected, sort by most recent first
      if (viewType === 'completed' || viewType === 'rejected') {
        // If we have createdAt field, use that for sorting
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      }
      
      // Otherwise sort by date
      const dateComparison = new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If same date, sort by time
      return a.preferredTime.localeCompare(b.preferredTime);
    });

  // Group the filtered requests by date
  const groupedRequests = filteredRequests.reduce((groups, request) => {
    const date = request.preferredDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(request);
    return groups;
  }, {} as Record<string, DemoRequest[]>);

  // Convert dates to array for rendering
  const sortedDates = Object.keys(groupedRequests).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
              </Box>
              <Stack spacing={2}>
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="50%" height={20} />
              </Stack>
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={32} height={32} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDateListView = () => (
    <Box>
      {sortedDates.map((date) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" color="primary">
              {formatDate(date)}
            </Typography>
            <Chip 
              label={`${groupedRequests[date].length} Demo${groupedRequests[date].length > 1 ? 's' : ''}`} 
              size="small" 
              sx={{ ml: 2 }} 
            />
          </Box>

          <Paper elevation={0} variant="outlined">
            {groupedRequests[date].map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: index < groupedRequests[date].length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  onClick={() => handleRowClick(request)}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">{request.leadName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {request.companyName}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="primary.main" fontWeight="medium">
                          {request.preferredTime}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2">{request.assignedTo}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <Chip
                        label={request.status}
                        color={statusColors[request.status]}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 500,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="right">
                      <Tooltip title="Call Now">
                        <IconButton
                          size="small"
                          onClick={handleCallClick}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={(e) => handleEditClick(request, e)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            ))}
          </Paper>
        </Box>
      ))}
    </Box>
  );

  const renderDateGridView = () => (
    <Box>
      {sortedDates.map((date) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" color="primary">
              {formatDate(date)}
            </Typography>
            <Chip 
              label={`${groupedRequests[date].length} Demo${groupedRequests[date].length > 1 ? 's' : ''}`} 
              size="small" 
              sx={{ ml: 2 }} 
            />
          </Box>

          <Grid container spacing={3}>
            {groupedRequests[date].map((request, index) => (
              <Grid item xs={12} sm={6} md={4} key={request.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                        transform: 'translateY(-4px)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                    onClick={() => handleRowClick(request)}
                  >
                    {request.status === 'completed' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          zIndex: 1,
                          bgcolor: theme.palette.success.main,
                          color: 'white',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${theme.palette.background.paper}`,
                        }}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {request.leadName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {request.companyName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{request.contactPhone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {request.preferredTime}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{request.assignedTo}</Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={request.status}
                          color={statusColors[request.status]}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Tooltip title="Call Now">
                        <IconButton
                          size="small"
                          onClick={handleCallClick}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={(e) => handleEditClick(request, e)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
        <Typography variant="h4">Demo Requests</Typography>
            <Box 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ mt: 1 }}
            >
              <Chip 
                label={`Total: ${filteredRequests.length}`} 
                size="small" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label={`Today: ${requests.filter(r => r.preferredDate === today).length}`} 
                size="small" 
                color="primary" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label={`Upcoming: ${requests.filter(r => r.preferredDate > today).length}`} 
                size="small" 
                color="info" 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
        >
          Schedule Demo
        </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={viewType}
          onChange={handleViewTypeChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            value="ongoing" 
            label="Ongoing" 
            icon={<TodayIcon />} 
            iconPosition="start"
          />
          <Tab 
            value="upcoming" 
            label="Upcoming" 
            icon={<DateRangeIcon />} 
            iconPosition="start"
          />
          <Tab 
            value="completed" 
            label="Completed" 
            icon={<CheckCircleIcon />} 
            iconPosition="start"
          />
          <Tab 
            value="rejected" 
            label="Rejected/Cancelled" 
            icon={<DeleteIcon />} 
            iconPosition="start"
          />
        </Tabs>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name, company, phone..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={filters.assignedTo}
                label="Assigned To"
                onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                {mockTeamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.name}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
      </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
                  </Box>
          </Grid>
        </Grid>
                  </Box>

      <Box sx={{ mb: 3 }}>
        {loading ? (
          renderSkeleton()
        ) : sortedDates.length === 0 ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No {viewType === 'ongoing' ? 'ongoing' : 
                  viewType === 'upcoming' ? 'upcoming' : 
                  viewType === 'completed' ? 'completed' : 'rejected/cancelled'} demo requests found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters, or create a new demo request.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{ mt: 2 }}
            >
              Schedule Demo
            </Button>
          </Box>
        ) : viewMode === 'list' ? (
          renderDateListView()
        ) : (
          renderDateGridView()
        )}
                  </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
          component: motion.div,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
        }}
      >
        <DialogTitle>
          {selectedRequest ? 'Update Demo Request' : 'Add Demo Request'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Lead Name"
              name="leadName"
              fullWidth
              defaultValue={selectedRequest?.leadName}
              required
            />
            <TextField
              margin="dense"
              label="Company Name"
              name="companyName"
              fullWidth
              defaultValue={selectedRequest?.companyName}
              required
            />
            <TextField
              margin="dense"
              label="Contact Phone"
              name="contactPhone"
              fullWidth
              defaultValue={selectedRequest?.contactPhone}
              required
            />
            <TextField
              margin="dense"
              label="Preferred Date"
              name="preferredDate"
              type="date"
              fullWidth
              defaultValue={selectedRequest?.preferredDate}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              margin="dense"
              label="Preferred Time"
              name="preferredTime"
              fullWidth
              defaultValue={selectedRequest?.preferredTime}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Assigned To</InputLabel>
              <Select
                name="assignedTo"
                defaultValue={selectedRequest?.assignedTo || ''}
                label="Assigned To"
                required
              >
                {mockTeamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.name}>
                    {member.name} ({member.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                defaultValue={selectedRequest?.status || 'pending'}
                label="Status"
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Notes"
              name="notes"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedRequest?.notes}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={submitting}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              {submitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {selectedRequest ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                selectedRequest ? 'Update' : 'Add'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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