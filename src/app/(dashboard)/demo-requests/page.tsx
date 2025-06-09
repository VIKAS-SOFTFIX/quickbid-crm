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
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DemoRequest, getDemoRequests, createDemoRequest, updateDemoRequest } from '@/services/demoService';
import { getDemoActivities } from '@/services/demoActivityService';

// Mock data for team members
const mockTeamMembers = [
  { id: '1', name: 'John Doe', email: 'agent1@quickbid.co.in', role: 'sales' },
  { id: '2', name: 'Jane Smith', email: 'agent2@quickbid.co.in', role: 'sales' },
  { id: '3', name: 'Mike Johnson', email: 'agent3@quickbid.co.in', role: 'demonstrator' },
  { id: '4', name: 'Sarah Wilson', email: 'agent4@quickbid.co.in', role: 'demonstrator' },
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
    // Fetch demo requests from API
    const fetchDemoRequests = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch demo requests...');
        const response = await getDemoRequests();
        console.log('Response from getDemoRequests:', response);
        
        if (response && response.success && Array.isArray(response.data)) {
          // Process the dates to ensure they're in the correct format for display
          const formattedData = response.data.map(demo => ({
            ...demo,
            // Extract just the date part from ISO strings
            preferredDate: demo.preferredDate ? demo.preferredDate.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          
          console.log('Setting demo requests with formatted dates:', formattedData);
          setRequests(formattedData);
        } else {
          console.warn('Invalid response format or empty data:', response);
          // For testing/fallback - create some dummy data if API fails
          const fallbackData = [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              mobile: '+1234567890',
              businessName: 'Acme Inc',
              preferredDate: new Date().toISOString().split('T')[0],
              preferredTime: '10:00 AM',
              status: 'pending' as const,
              priority: 'medium' as const,
              interestedIn: 'Product Demo',
              services: ['Web App'],
              industry: 'Technology',
              assignedTo: 'agent1@quickbid.co.in',
              assignedAgentName: 'John Doe',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          setRequests(fallbackData);
          setSnackbar({
            open: true,
            message: 'Failed to fetch demo requests, using sample data',
            severity: 'warning',
          });
        }
      } catch (error) {
        console.error('Error in fetchDemoRequests:', error);
        // For testing/fallback - create some dummy data if API fails
        const fallbackData = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            mobile: '+1234567890',
            businessName: 'Acme Inc',
            preferredDate: new Date().toISOString().split('T')[0],
            preferredTime: '10:00 AM',
            status: 'pending' as const,
            priority: 'medium' as const,
            interestedIn: 'Product Demo',
            services: ['Web App'],
            industry: 'Technology',
            assignedTo: 'agent1@quickbid.co.in',
            assignedAgentName: 'John Doe',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setRequests(fallbackData);
        setSnackbar({
          open: true,
          message: 'Error fetching demo requests, using sample data',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDemoRequests();
  }, []);

  const handleOpen = (request?: DemoRequest) => {
    setSelectedRequest(request || null);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRequest(null);
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData.entries());
      
      console.log('Form values:', formValues);
      
      // Format date properly for API
      const preferredDate = formValues.preferredDate as string;
      const preferredTime = formValues.preferredTime as string;
      
      // Prepare the demo request data
      const demoData: any = {
        name: formValues.name as string,
        email: formValues.email as string,
        mobile: formValues.mobile as string,
        businessName: formValues.businessName as string,
        // Send the date in ISO format as required by the API
        preferredDate: `${preferredDate}T10:00:00.000Z`,
        preferredTime: preferredTime,
        status: formValues.status as DemoRequest['status'],
        priority: formValues.priority || 'medium',
        interestedIn: formValues.interestedIn || 'Product Demo',
        services: formValues.services ? (formValues.services as string).split(',') : ['Web App'],
        industry: formValues.industry || 'Technology',
        notes: formValues.notes as string || '',
        requirements: formValues.requirements as string || '',
        assignedTo: formValues.assignedTo as string,
      };
      
      // Add the agent's name based on the selected email
      const selectedAgent = mockTeamMembers.find(m => m.email === formValues.assignedTo);
      if (selectedAgent) {
        demoData.assignedAgentName = selectedAgent.name;
      }
      
      console.log('Prepared demo data:', demoData);
      
      let response;
      
      if (selectedRequest) {
        // Update existing demo request
        response = await updateDemoRequest(selectedRequest.id, demoData);
        setSnackbar({
          open: true,
          message: 'Demo request updated successfully',
          severity: 'success',
        });
      } else {
        // Create new demo request
        response = await createDemoRequest(demoData);
        setSnackbar({
          open: true,
          message: 'Demo request created successfully',
          severity: 'success',
        });
      }
      
      console.log('API response:', response);
      
      if (response && response.success) {
        // Refresh the demo requests list
        const refreshResponse = await getDemoRequests();
        if (refreshResponse.success && Array.isArray(refreshResponse.data)) {
          const formattedData = refreshResponse.data.map(demo => ({
            ...demo,
            // Extract just the date part from ISO strings for display
            preferredDate: demo.preferredDate ? demo.preferredDate.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          
          setRequests(formattedData);
        } else {
          // Add the newly created demo to the existing list
          if (response.data) {
            if (selectedRequest) {
              // Update the existing request in the list
              setRequests(prev => prev.map(item => {
                if (item.id === selectedRequest.id && response.data) {
                  // Ensure we have the right format for the updated record
                  return {
                    ...response.data,
                    preferredDate: response.data.preferredDate 
                      ? response.data.preferredDate.split('T')[0] 
                      : new Date().toISOString().split('T')[0]
                  } as DemoRequest;
                }
                return item;
              }));
            } else if (response.data) {
              // Add the new request to the list
              const newDemo = {
                ...response.data,
                preferredDate: response.data.preferredDate 
                  ? response.data.preferredDate.split('T')[0] 
                  : new Date().toISOString().split('T')[0]
              } as DemoRequest;
              
              setRequests(prev => [newDemo, ...prev]);
            }
          }
        }
        handleClose();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to save demo request',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving demo request:', error);
      setSnackbar({
        open: true,
        message: 'Error saving demo request',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRowClick = (request: DemoRequest) => {
    router.push(`/demo-requests/${request.id}`);
  };

  const handleEditClick = (request: DemoRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/demo-requests/${request.id}`);
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
      console.log('Filtering request:', request, 'viewType:', viewType);
      
      // Filter by view type
      if (viewType === 'ongoing') {
        // For ongoing, show any pending or scheduled requests regardless of date
        return ['pending', 'scheduled'].includes(request.status);
      }
      
      if (viewType === 'upcoming') {
        // For upcoming, show any future date
        const requestDate = new Date(request.preferredDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return requestDate >= currentDate;
      }
      
      if (viewType === 'completed') {
        return request.status === 'completed';
      }
      
      if (viewType === 'rejected') {
        return ['cancelled', 'rejected'].includes(request.status);
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !request.name?.toLowerCase().includes(query) &&
          !request.businessName?.toLowerCase().includes(query) &&
          !request.mobile?.includes(query) &&
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
      const dateA = new Date(a.preferredDate);
      const dateB = new Date(b.preferredDate);
      const dateComparison = dateA.getTime() - dateB.getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If same date, sort by time
      return (a.preferredTime || '').localeCompare(b.preferredTime || '');
    });

  console.log('Filtered requests:', filteredRequests);

  // Group the filtered requests by date
  const groupedRequests = filteredRequests.reduce((groups, request) => {
    // Make sure we use just the date part
    const date = request.preferredDate.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(request);
    return groups;
  }, {} as Record<string, DemoRequest[]>);

  console.log('Grouped requests:', groupedRequests);

  // Convert dates to array for rendering
  const sortedDates = Object.keys(groupedRequests).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const formatDate = (dateString: string) => {
    // Make sure we use just the date part
    const datePart = dateString.split('T')[0];
    const date = new Date(datePart);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateToCompare = new Date(datePart);
    dateToCompare.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    if (dateToCompare.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateToCompare.getTime() === tomorrow.getTime()) {
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
                          <Typography variant="subtitle1">{request.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {request.businessName}
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
                        <Typography variant="body2">{request.assignedAgentName || request.assignedTo || 'Unassigned'}</Typography>
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
                            {request.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {request.businessName}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{request.mobile}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {request.preferredTime}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{request.assignedAgentName || request.assignedTo || 'Unassigned'}</Typography>
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
                  <MenuItem key={member.id} value={member.email}>
                    {member.name} ({member.role})
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
        ) : filteredRequests.length === 0 ? (
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

      {/* Fallback rendering if there are no sorted dates but filtered requests exist */}
      {!loading && filteredRequests.length > 0 && Object.keys(groupedRequests).length === 0 && (
        <Box sx={{ mb: 3, border: '1px solid #ffe0b2', p: 3, borderRadius: 2, bgcolor: '#fff8e1' }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            Date Grouping Issue Detected
          </Typography>
          <Typography variant="body1" gutterBottom>
            {filteredRequests.length} requests matched your filters, but couldn't be grouped by date.
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Showing all filtered results:</Typography>
            
            {filteredRequests.map((request) => (
              <Paper
                key={request.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: theme.shadows[3],
                  },
                }}
                onClick={() => handleRowClick(request)}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{request.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.businessName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        {request.preferredDate} at {request.preferredTime}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                        {request.mobile}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Chip
                      label={request.status}
                      color={statusColors[request.status]}
                      size="small"
                      sx={{ mr: 2 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditClick(request, e)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

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
              name="name"
              fullWidth
              defaultValue={selectedRequest?.name}
              required
            />
            <TextField
              margin="dense"
              label="Company Name"
              name="businessName"
              fullWidth
              defaultValue={selectedRequest?.businessName}
              required
            />
            <TextField
              margin="dense"
              label="Contact Phone"
              name="mobile"
              fullWidth
              defaultValue={selectedRequest?.mobile}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              defaultValue={selectedRequest?.email}
              required
            />
            <TextField
              margin="dense"
              label="Preferred Date"
              name="preferredDate"
              type="date"
              fullWidth
              defaultValue={selectedRequest?.preferredDate || today}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              margin="dense"
              label="Preferred Time"
              name="preferredTime"
              fullWidth
              defaultValue={selectedRequest?.preferredTime || "10:00 AM"}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Assigned To</InputLabel>
              <Select
                name="assignedTo"
                defaultValue={selectedRequest?.assignedTo || mockTeamMembers[0].email}
                label="Assigned To"
                required
              >
                {mockTeamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.email}>
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
            
            {/* Hidden fields for API compatibility */}
            <input type="hidden" name="priority" value={selectedRequest?.priority || "medium"} />
            <input type="hidden" name="interestedIn" value={selectedRequest?.interestedIn || "Product Demo"} />
            <input type="hidden" name="services" value={selectedRequest?.services?.join(',') || "Web App"} />
            <input type="hidden" name="industry" value={selectedRequest?.industry || "Technology"} />
            <input type="hidden" name="requirements" value={selectedRequest?.requirements || ""} />
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