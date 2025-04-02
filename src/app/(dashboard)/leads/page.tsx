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

export default function LeadsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [leads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | ''>('');
  const [typeFilter, setTypeFilter] = useState<LeadType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'grid' | 'list' | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleLeadClick = (leadId: string) => {
    router.push(`/leads/${leadId}`);
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

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4">Lead Management</Typography>
            <Box 
              component={motion.div as React.ComponentType<MotionDiv>}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ mt: 1 }}
            >
              <Chip 
                label={`Total: ${leads.length}`} 
                size="small" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label={`New Today: ${leads.filter(l => l.createdAt === new Date().toISOString().split('T')[0]).length}`} 
                size="small" 
                color="primary" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label={`In Progress: ${leads.filter(l => ['contacted', 'qualified', 'proposal', 'negotiation'].includes(l.status)).length}`} 
                size="small" 
                color="info" 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              New Lead
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            value={0} 
            label="Active" 
            icon={<TodayIcon />} 
            iconPosition="start"
          />
          <Tab 
            value={1} 
            label="Qualified" 
            icon={<CheckCircleIcon />} 
            iconPosition="start"
          />
          <Tab 
            value={2} 
            label="Won" 
            icon={<CheckCircleIcon />} 
            iconPosition="start"
          />
          <Tab 
            value={3} 
            label="Lost" 
            icon={<DeleteIcon />} 
            iconPosition="start"
          />
        </Tabs>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
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
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
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
              <FormControl size="small" sx={{ minWidth: 120 }}>
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
              <FormControl size="small" sx={{ minWidth: 120 }}>
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
            </Stack>
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

      {loading ? (
        renderSkeleton()
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {leads.map((lead, index) => (
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
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-4px)',
                      transition: 'all 0.2s ease-in-out',
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

                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="primary" fontSize="small" />
                        <Typography variant="body2">{lead.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="primary" fontSize="small" />
                        <Typography variant="body2">{lead.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="primary" fontSize="small" />
                        <Typography variant="body2">{lead.assignedTo}</Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={lead.status}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(lead.status, theme), 0.1),
                          color: getStatusColor(lead.status, theme),
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={2}>
          {leads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                onClick={() => handleLeadClick(lead.id)}
              >
                <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="h6">{lead.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {lead.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="primary" fontSize="small" />
                        <Typography variant="body2">{lead.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="primary" fontSize="small" />
                        <Typography variant="body2">{lead.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="primary" fontSize="small" />
                        <Typography variant="body2">{lead.assignedTo}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={lead.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(lead.status, theme), 0.1),
                        color: getStatusColor(lead.status, theme),
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      )}
    </Box>
  );
} 