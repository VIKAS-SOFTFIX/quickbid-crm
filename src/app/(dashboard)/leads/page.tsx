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
  Tooltip,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Avatar,
  InputAdornment,
  Skeleton,
  Badge,
  ToggleButtonGroup,
  ToggleButton,
  Theme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  CallMade as CallMadeIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  CloudDownload as CloudDownloadIcon,
  Sort as SortIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon,
  PeopleAlt as PeopleAltIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, HTMLMotionProps } from 'framer-motion';
import { fetchLeads, fetchLeadCounts, deleteLead, fetchUsers, updateLead, assignLead, LeadData } from '@/lib/api';

// Add type for motion div
type MotionDiv = HTMLMotionProps<'div'>;

// Define lead status types
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
type LeadSource = 'website' | 'referral' | 'social' | 'trade_show' | 'other';
type LeadType = 'enterprise' | 'startup' | 'small_business' | 'individual';

// Define the lead interface
interface Lead {
  _id: any;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  type: LeadType;
  assignedTo: string | { _id: string; email: string; name?: string };
  createdAt: string;
  lastContact: string;
  location: string;
  notes: string;
  tags: string[];
}

// Helper function to get status color
const getStatusColor = (status: LeadStatus, theme: Theme) => {
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

// Format status label for display
const formatStatusLabel = (status: LeadStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Helper function to safely get assignedTo display value
const getAssignedToDisplay = (assignedTo: any, userDetails: Record<string, any> = {}): string => {
  if (!assignedTo) return 'Unassigned';
  
  // If it's a string, check if it looks like an ID (MongoDB ObjectId format)
  if (typeof assignedTo === 'string') {
    // If it's a MongoDB ObjectId (24 hex chars), try to get user details
    if (/^[0-9a-f]{24}$/i.test(assignedTo)) {
      const user = userDetails[assignedTo];
      if (user) {
        return user.name || 
               (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
               user.email || 
               'Assigned';
      }
      return 'Assigned'; // Just show "Assigned" instead of the ID
    }
    return assignedTo;
  }
  
  if (typeof assignedTo === 'object') {
    // If it's an object, try to get name property first
    // Then try firstName + lastName
    // Then email
    // Then id or _id as a last resort
    return assignedTo.name || 
           (assignedTo.firstName && assignedTo.lastName ? `${assignedTo.firstName} ${assignedTo.lastName}` : '') ||
           assignedTo.email || 
           'Assigned'; // Just show "Assigned" instead of the ID
  }
  
  return String(assignedTo);
};

export default function LeadsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadCounts, setLeadCounts] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('');
  const [typeFilter, setTypeFilter] = useState<LeadType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalLeads, setTotalLeads] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  // Add state for storing user details
  const [userDetails, setUserDetails] = useState<Record<string, any>>({});
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [assignAgentDialogOpen, setAssignAgentDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Lead>>({});
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  useEffect(() => {
    loadLeads();
    loadLeadCounts();
    console.log('Lead counts:', leadCounts);
    console.log('Leads:', leads);
  }, [statusFilter, sourceFilter, typeFilter, searchQuery, page, limit, activeTab]);
 
  // Update the useEffect to fetch user details when needed
  useEffect(() => {
    // This will run whenever leads data changes
    if (leads.length > 0) {
      // Collect all assignedTo IDs that need to be resolved
      const assigneeIds: string[] = [];
      
      leads.forEach(lead => {
        if (typeof lead.assignedTo === 'string' && /^[0-9a-f]{24}$/i.test(lead.assignedTo as string)) {
          assigneeIds.push(lead.assignedTo as string);
        }
      });
      
      // If we have IDs to resolve, fetch the user details
      if (assigneeIds.length > 0) {
        console.log('Found leads with unresolved assignees, fetching user details');
        
        // Fetch user details
        const fetchUserDetails = async () => {
          try {
            const response = await fetchUsers();
            if (response && response.data) {
              // Create a map of user IDs to user details
              const userMap: Record<string, any> = {};
              
              response.data.forEach((user: any) => {
                const userId = user._id || user.id;
                if (userId) {
                  userMap[userId] = user;
                }
              });
              
              console.log('User details fetched:', userMap);
              setUserDetails(userMap);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        };
        
        fetchUserDetails();
      }
    }
  }, [leads]);

  // Fetch all users for agent assignment
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const usersData = await fetchUsers();
        if (usersData && usersData.data) {
          setUsers(usersData.data.map((user: any) => ({
            id: user._id || user.id,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          })));
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    getAllUsers();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map active tab to status filter if needed
      let status = statusFilter;
      if (activeTab === 1) status = 'new';
      else if (activeTab === 2) status = 'contacted';
      else if (activeTab === 3) status = 'qualified';
      else if (activeTab === 4) status = 'proposal';
      else if (activeTab === 5) status = 'won';
      
      const filter = {
        status,
        source: sourceFilter,
        search: searchQuery,
      };
      
      const response = await fetchLeads(filter, page, limit);
      console.log('Leads response:', response);
      
      // Handle the actual API response structure
      if (response) {
        // Ensure assignedTo is properly processed before setting state
        const processedLeads = response.data?.map((lead: any) => {
          // Log the assignedTo field to see what we're getting
          console.log('Lead assignedTo:', lead._id, lead.assignedTo);
          
          // Make sure we return the lead with no changes to its structure
          return lead;
        }) || [];
        
        setLeads(processedLeads);
        setTotalLeads(response.totalCount || 0);
      } else {
        console.error('Invalid API response:', response);
        setError('Failed to load leads data');
      }
    } catch (err) {
      console.error('Error loading leads:', err);
      setError('An error occurred while loading leads');
    } finally {
      setLoading(false);
    }
  };

  const loadLeadCounts = async () => {
    try {
      const response = await fetchLeadCounts();
      console.log('Lead counts response:', response);
      if (response) {
        // The API returns count data directly, not nested in a success/data structure
        setLeadCounts(response || {});
      }
    } catch (err) {
      console.error('Error loading lead counts:', err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      // Refresh leads after deletion
      loadLeads();
      loadLeadCounts();
    } catch (err) {
      console.error('Error deleting lead:', err);
      setError('Failed to delete lead');
    }
  };

  // Define a color palette to match the dashboard
  const colorPalette = {
    background: '#f9fafc',
    cardBg: '#ffffff',
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    border: alpha(theme.palette.divider, 0.08),
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1); // Reset to first page when changing tabs
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'grid' | 'list' | 'table' | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleLeadClick = (leadId: string) => {
    router.push(`/leads/${leadId}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lead: Lead) => {
    setSelectedLead(lead);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setSourceFilter('');
    setTypeFilter('');
    setSearchQuery('');
    setFilterMenuAnchor(null);
  };

  // Use filtered leads from the API response directly
  const filteredLeads = leads;

  // Get counts for status chips from API response
  const newLeadsCount = leadCounts.new || 0;
  const contactedLeadsCount = leadCounts.contacted || 0;
  const qualifiedLeadsCount = leadCounts.qualified || 0;
  const proposalLeadsCount = leadCounts.proposal || 0;
  const negotiationLeadsCount = leadCounts.negotiation || 0;
  const wonLeadsCount = leadCounts.won || 0;
  const lostLeadsCount = leadCounts.lost || 0;

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

  // Edit lead functions
  const handleOpenEditForm = (lead: Lead) => {
    setSelectedLead(lead);
    setEditFormData({...lead});
    setEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setSelectedLead(null);
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

  const handleSourceChange = (e: SelectChangeEvent) => {
    setEditFormData(prev => ({
      ...prev,
      source: e.target.value as LeadSource
    }));
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    setEditFormData(prev => ({
      ...prev,
      type: e.target.value as LeadType
    }));
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !selectedLead) return;
    
    setIsSubmitting(true);
    try {
      // Use _id for MongoDB compatibility
      const leadId = selectedLead._id;
      
      // Create a clean payload with proper typing
      const payload: Partial<LeadData> = {
        name: editFormData.name,
        company: editFormData.company,
        email: editFormData.email,
        phone: editFormData.phone,
        status: editFormData.status,
        source: editFormData.source,
        type: editFormData.type,
        location: editFormData.location,
        notes: editFormData.notes,
      };
      
      // If assignedTo exists and is an object, extract the ID
      if (editFormData.assignedTo) {
        if (typeof editFormData.assignedTo === 'object') {
          const assignedToObj = editFormData.assignedTo as any;
          payload.assignedTo = assignedToObj._id || assignedToObj.id || '';
        } else {
          payload.assignedTo = editFormData.assignedTo;
        }
      }
      
      await updateLead(leadId, payload);
      
      // Refresh leads after update
      loadLeads();
      
      setSnackbarMessage('Lead updated successfully');
      setSnackbarOpen(true);
      handleCloseEditForm();
    } catch (error) {
      console.error('Error updating lead:', error);
      setSnackbarMessage('Failed to update lead');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assign agent functions
  const handleOpenAssignAgent = (lead: Lead) => {
    setSelectedLead(lead);
    setSelectedAgent(typeof lead.assignedTo === 'string' ? lead.assignedTo : 
                    (lead.assignedTo as any)?._id || '');
    setAssignAgentDialogOpen(true);
  };

  const handleCloseAssignAgent = () => {
    setAssignAgentDialogOpen(false);
    setSelectedLead(null);
  };

  const handleAgentChange = (e: SelectChangeEvent) => {
    setSelectedAgent(e.target.value);
  };

  const handleAssignAgent = async () => {
    if (!selectedLead || !selectedAgent) return;
    
    setIsSubmitting(true);
    try {
      // Use _id for MongoDB compatibility
      const leadId = selectedLead._id;
      
      await assignLead(leadId, selectedAgent);
      
      // Refresh leads after update
      loadLeads();
      
      setSnackbarMessage('Agent assigned successfully');
      setSnackbarOpen(true);
      handleCloseAssignAgent();
    } catch (error) {
      console.error('Error assigning agent:', error);
      setSnackbarMessage('Failed to assign agent');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ py: 2, px: { xs: 1, sm: 2 }, backgroundColor: colorPalette.background, minHeight: '100%' }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.grey[800],
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  letterSpacing: '-0.01em',
                }}
              >
                Lead Management
              </Typography>
              
              <Box 
                component={motion.div as React.ComponentType<MotionDiv>}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
              >
                <Chip 
                  icon={<PeopleAltIcon fontSize="small" />}
                  label={`Total: ${totalLeads}`} 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }} 
                />
                <Chip 
                  icon={<TodayIcon fontSize="small" />}
                  label={`New: ${newLeadsCount}`} 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: 500,
                  }}
                />
                <Chip 
                  icon={<CheckCircleIcon fontSize="small" />}
                  label={`Won: ${wonLeadsCount}`} 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CloudDownloadIcon />}
              size="medium"
              sx={{
                borderRadius: 2,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="medium"
              onClick={() => router.push('/leads/create')}
              sx={{
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.85)} 100%)`,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 100%)`,
                },
              }}
            >
              Add Lead
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Display error if any */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filter and tabs section */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 3, 
          borderRadius: 3, 
          bgcolor: colorPalette.cardBg,
          border: `1px solid ${colorPalette.border}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
          <Box sx={{ width: { xs: '100%', sm: '40%', md: '30%' } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.divider, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={handleFilterMenuOpen}
              sx={{
                borderRadius: 2,
                borderColor: filterMenuAnchor || statusFilter || sourceFilter || typeFilter 
                  ? theme.palette.primary.main 
                  : alpha(theme.palette.divider, 0.3),
                color: filterMenuAnchor || statusFilter || sourceFilter || typeFilter 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary,
                bgcolor: filterMenuAnchor || statusFilter || sourceFilter || typeFilter 
                  ? alpha(theme.palette.primary.main, 0.05) 
                  : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {statusFilter || sourceFilter || typeFilter ? 'Filters Applied' : 'Filters'}
              {(statusFilter || sourceFilter || typeFilter) && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 18,
                    height: 18,
                    ml: 1,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {(statusFilter ? 1 : 0) + (sourceFilter ? 1 : 0) + (typeFilter ? 1 : 0)}
                </Box>
              )}
            </Button>
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleFilterMenuClose}
              PaperProps={{
                sx: {
                  width: 250,
                  mt: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderRadius: 2,
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Filter Leads
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value as LeadStatus | '')}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="contacted">Contacted</MenuItem>
                    <MenuItem value="qualified">Qualified</MenuItem>
                    <MenuItem value="proposal">Proposal</MenuItem>
                    <MenuItem value="negotiation">Negotiation</MenuItem>
                    <MenuItem value="won">Won</MenuItem>
                    <MenuItem value="lost">Lost</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={sourceFilter}
                    label="Source"
                    onChange={(e) => setSourceFilter(e.target.value as LeadSource | '')}
                  >
                    <MenuItem value="">All Sources</MenuItem>
                    <MenuItem value="website">Website</MenuItem>
                    <MenuItem value="referral">Referral</MenuItem>
                    <MenuItem value="social">Social Media</MenuItem>
                    <MenuItem value="trade_show">Trade Show</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Type"
                    onChange={(e) => setTypeFilter(e.target.value as LeadType | '')}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                    <MenuItem value="startup">Startup</MenuItem>
                    <MenuItem value="small_business">Small Business</MenuItem>
                    <MenuItem value="individual">Individual</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    size="small"
                    sx={{ borderRadius: 2 }}
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="small"
                    sx={{ borderRadius: 2 }}
                    onClick={handleFilterMenuClose}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Menu>
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                  borderRadius: 2,
                  px: 1.5,
                },
                '& .MuiToggleButton-root:first-of-type': {
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                },
                '& .MuiToggleButton-root:last-of-type': {
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                },
              }}
            >
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              minWidth: { xs: 'auto', sm: 100 },
              minHeight: 48,
              borderRadius: 1.5,
              mx: 0.5,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab 
            label="All Leads" 
            icon={<PeopleAltIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="New" 
            icon={<TodayIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Contacted" 
            icon={<CallMadeIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Qualified" 
            icon={<CheckCircleIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Proposal" 
            icon={<AssignmentIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Won" 
            icon={<CheckCircleIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Display leads */}
      {loading ? (
        renderSkeleton()
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredLeads.map((lead, index) => (
            <Grid item xs={12} sm={6} md={4} key={lead._id}>
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
                    borderRadius: 3,
                    border: `1px solid ${colorPalette.border}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handleLeadClick(lead._id)}
                >
                  {lead.status === 'won' && (
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
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        mr: 2, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        color: theme.palette.primary.main,
                        width: 48,
                        height: 48,
                        fontWeight: 600,
                      }}>
                        {lead.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {lead.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {lead.company}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                          {lead.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                          {lead.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                          {getAssignedToDisplay(lead.assignedTo, userDetails)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                          {lead.location}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Chip
                        label={formatStatusLabel(lead.status)}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(lead.status, theme), 0.1),
                          color: getStatusColor(lead.status, theme),
                          fontWeight: 600,
                          borderRadius: 1.5,
                          px: 1,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="inherit" />
                        Updated {lead.lastContact}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : viewMode === 'list' ? (
        <Stack spacing={2}>
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                sx={{
                  display: 'flex',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: `1px solid ${colorPalette.border}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    transform: 'translateX(4px)',
                  },
                }}
                onClick={() => handleLeadClick(lead._id)}
              >
                <Box sx={{ 
                  width: 8, 
                  bgcolor: getStatusColor(lead.status, theme),
                  flexShrink: 0
                }} />
                <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, py: 2, px: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}>
                    {lead.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{lead.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {lead.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1.5, md: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          {lead.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          {lead.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          {lead.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={formatStatusLabel(lead.status)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(lead.status, theme), 0.1),
                        color: getStatusColor(lead.status, theme),
                        fontWeight: 600,
                        borderRadius: 1.5,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      ) : (
        <Card
          sx={{
            borderRadius: 3,
            border: `1px solid ${colorPalette.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow 
                      key={lead._id}
                    hover
                    onClick={() => handleLeadClick(lead._id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }}
                        >
                          {lead.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body1" fontWeight={500}>
                          {lead.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" color="primary" />
                          <Typography variant="body2">{lead.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="primary" />
                          <Typography variant="body2">{lead.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{getAssignedToDisplay(lead.assignedTo, userDetails)}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatStatusLabel(lead.status)}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(lead.status, theme), 0.1),
                          color: getStatusColor(lead.status, theme),
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                    <TableCell>{lead.source.replace('_', ' ')}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, lead);
                        }}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Context menu for actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          if (selectedLead) handleOpenEditForm(selectedLead);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText>Edit Lead</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (selectedLead) handleOpenAssignAgent(selectedLead);
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
          </ListItemIcon>
          <ListItemText>Assign Lead</ListItemText>
        </MenuItem>
      </Menu>

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
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={editFormData.notes || ''}
                onChange={handleEditFormChange}
                margin="normal"
              />
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Pagination or "No results" message */}
      {filteredLeads.length === 0 && !loading && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            p: 8, 
            borderRadius: 3,
            bgcolor: colorPalette.cardBg,
            border: `1px solid ${colorPalette.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            mt: 3
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            No leads found
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Try adjusting your search or filter criteria
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleClearFilters}
            startIcon={<FilterListIcon />}
            sx={{ borderRadius: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Box>
  );
} 