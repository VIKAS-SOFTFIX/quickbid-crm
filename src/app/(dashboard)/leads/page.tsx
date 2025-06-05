'use client';

import React, { useState } from 'react';
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
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, HTMLMotionProps } from 'framer-motion';

// Add type for motion div
type MotionDiv = HTMLMotionProps<'div'>;

// Define lead status types
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
type LeadSource = 'website' | 'referral' | 'social' | 'trade_show' | 'other';
type LeadType = 'enterprise' | 'startup' | 'small_business' | 'individual';

// Define the lead interface
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  type: LeadType;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  location: string;
  notes: string;
  tags: string[];
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc.',
    email: 'john.smith@techsolutions.com',
    phone: '+1 (555) 123-4567',
    status: 'new',
    source: 'website',
    type: 'enterprise',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-03-20',
    lastContact: '2024-03-20',
    location: 'New York, USA',
    notes: 'Interested in enterprise features',
    tags: ['enterprise', 'high-value'],
  },
  {
    id: '2',
    name: 'Emma Wilson',
    company: 'Digital Innovations',
    email: 'emma.wilson@digitalinnovations.com',
    phone: '+1 (555) 234-5678',
    status: 'contacted',
    source: 'referral',
    type: 'startup',
    assignedTo: 'Mike Brown',
    createdAt: '2024-03-19',
    lastContact: '2024-03-19',
    location: 'San Francisco, USA',
    notes: 'Looking for integration capabilities',
    tags: ['integration', 'startup'],
  },
  {
    id: '3',
    name: 'Michael Johnson',
    company: 'Growth Solutions LLC',
    email: 'michael@growthsolutions.com',
    phone: '+1 (555) 345-6789',
    status: 'qualified',
    source: 'social',
    type: 'small_business',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-03-18',
    lastContact: '2024-03-21',
    location: 'Chicago, USA',
    notes: 'Ready for product demonstration',
    tags: ['growth', 'sme'],
  },
  {
    id: '4',
    name: 'Sarah Chen',
    company: 'Innovate Technology',
    email: 'sarah.chen@innovatech.com',
    phone: '+1 (555) 456-7890',
    status: 'proposal',
    source: 'trade_show',
    type: 'enterprise',
    assignedTo: 'Mike Brown',
    createdAt: '2024-03-17',
    lastContact: '2024-03-19',
    location: 'Boston, USA',
    notes: 'Proposal under review by leadership team',
    tags: ['enterprise', 'high-value'],
  },
  {
    id: '5',
    name: 'David Thompson',
    company: 'Nexus Partners',
    email: 'david@nexuspartners.com',
    phone: '+1 (555) 567-8901',
    status: 'negotiation',
    source: 'referral',
    type: 'enterprise',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-03-16',
    lastContact: '2024-03-20',
    location: 'Seattle, USA',
    notes: 'Discussing contract terms',
    tags: ['enterprise', 'priority'],
  },
  {
    id: '6',
    name: 'Jennifer Martin',
    company: 'Creative Solutions',
    email: 'jennifer@creativesolutions.com',
    phone: '+1 (555) 678-9012',
    status: 'won',
    source: 'website',
    type: 'small_business',
    assignedTo: 'Mike Brown',
    createdAt: '2024-03-15',
    lastContact: '2024-03-22',
    location: 'Denver, USA',
    notes: 'Contract signed, onboarding scheduled',
    tags: ['converted', 'sme'],
  },
];

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

export default function LeadsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('');
  const [typeFilter, setTypeFilter] = useState<LeadType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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

  // Filter the leads based on current filters
  const filteredLeads = leads.filter(lead => {
    if (statusFilter && lead.status !== statusFilter) return false;
    if (sourceFilter && lead.source !== sourceFilter) return false;
    if (typeFilter && lead.type !== typeFilter) return false;
    
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = lead.name.toLowerCase().includes(query);
      const matchesCompany = lead.company.toLowerCase().includes(query);
      const matchesEmail = lead.email.toLowerCase().includes(query);
      const matchesAssignedTo = lead.assignedTo.toLowerCase().includes(query);
      if (!matchesName && !matchesCompany && !matchesEmail && !matchesAssignedTo) {
        return false;
      }
    }
    
    return true;
  });

  // Get counts for status chips
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const contactedLeadsCount = leads.filter(l => l.status === 'contacted').length;
  const qualifiedLeadsCount = leads.filter(l => l.status === 'qualified').length;
  const proposalLeadsCount = leads.filter(l => l.status === 'proposal').length;
  const negotiationLeadsCount = leads.filter(l => l.status === 'negotiation').length;
  const wonLeadsCount = leads.filter(l => l.status === 'won').length;
  const lostLeadsCount = leads.filter(l => l.status === 'lost').length;

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
                  label={`Total: ${leads.length}`} 
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
            <Grid item xs={12} sm={6} md={4} key={lead.id}>
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
                  onClick={() => handleLeadClick(lead.id)}
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
                          {lead.assignedTo}
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
              key={lead.id}
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
                onClick={() => handleLeadClick(lead.id)}
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
                    key={lead.id}
                    hover
                    onClick={() => handleLeadClick(lead.id)}
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
                    <TableCell>{lead.assignedTo}</TableCell>
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
                          handleMenuOpen(e);
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
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Lead</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PhoneIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Call Lead</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleMenuClose} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

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