'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  alpha,
  Stack,
  InputAdornment,
  Tooltip,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Menu,
  Fade,
  Grow,
  CardActions,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Update as UpdateIcon,
  LocalOffer as OfferIcon,
  NotificationAdd as ReminderIcon,
  BusinessCenter as NegotiationIcon,
  CheckCircle as ConvertedIcon,
  Cancel as RejectedIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  AssignmentTurnedIn as AssignmentIcon,
  ReceiptLong as ReceiptIcon,
  Storage as StorageIcon,
  DynamicFeed as FeedIcon,
  Language as LanguageIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { EnterpriseRequestData } from './EnterpriseRequestForm';
import dayjs from 'dayjs';

interface EnterpriseRequestDetailProps {
  request: EnterpriseRequestData;
  onBack: () => void;
  onUpdateStatus: (
    requestId: string, 
    status: EnterpriseRequestData['status'], 
    notes: string, 
    discount?: number,
    followUpDate?: string
  ) => void;
  statusHistory?: StatusHistoryItem[];
  isUpdating?: boolean;
}

export interface StatusHistoryItem {
  status: EnterpriseRequestData['status'];
  timestamp: string;
  notes?: string;
  discount?: number;
  followUpDate?: string;
}

// Status color mapping
const STATUS_COLORS = {
  pending: 'warning',
  offer_sent: 'info',
  follow_up: 'secondary',
  negotiation: 'primary',
  converted: 'success',
  rejected: 'error',
} as const;

// Status display mapping
const STATUS_DISPLAY = {
  pending: 'Pending',
  offer_sent: 'Offer Sent',
  follow_up: 'Follow Up',
  negotiation: 'Negotiation',
  converted: 'Converted',
  rejected: 'Rejected',
} as const;

// Status icons mapping
const STATUS_ICONS = {
  pending: <UpdateIcon />,
  offer_sent: <SendIcon />,
  follow_up: <ReminderIcon />,
  negotiation: <NegotiationIcon />,
  converted: <ConvertedIcon />,
  rejected: <RejectedIcon />,
};

export default function EnterpriseRequestDetail({ 
  request, 
  onBack, 
  onUpdateStatus,
  statusHistory = [],
  isUpdating = false
}: EnterpriseRequestDetailProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Status update form state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<EnterpriseRequestData['status']>(request.status || 'pending');
  const [statusNotes, setStatusNotes] = useState('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [followUpDate, setFollowUpDate] = useState<dayjs.Dayjs | null>(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Menu handlers
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Tab change handler
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Open status change dialog with pre-selected status
  const handleOpenStatusDialog = (status: EnterpriseRequestData['status']) => {
    setNewStatus(status);
    setStatusNotes('');
    setDiscount('');
    setFollowUpDate(null);
    setFormError('');
    setStatusDialogOpen(true);
  };

  // Close status dialog
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };
  
  // Handle status update submission
  const handleStatusUpdate = () => {
    setFormError('');
    
    // Validate form based on status
    if (newStatus === 'offer_sent' && (discount === '' || discount < 0 || discount > 100)) {
      setFormError('Please enter a valid discount percentage (0-100)');
      return;
    }
    
    if (newStatus === 'follow_up' && !followUpDate) {
      setFormError('Please select a follow-up date');
      return;
    }
    
    if (statusNotes.trim() === '') {
      setFormError('Please enter status notes');
      return;
    }
    
    // Format follow-up date if present
    const formattedFollowUpDate = followUpDate ? followUpDate.toISOString() : undefined;
    
    // Submit status update
    onUpdateStatus(
      request.gstin,
      newStatus,
      statusNotes,
      discount === '' ? undefined : Number(discount),
      formattedFollowUpDate
    );
    
    setFormSuccess('Status updated successfully');
    setStatusDialogOpen(false);
  };
  
  // Get appropriate action button based on current status
  const getActionButton = () => {
    switch (request.status) {
      case 'pending':
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={() => handleOpenStatusDialog('offer_sent')}
            sx={{ 
              boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 6px 16px ${alpha(theme.palette.info.main, 0.4)}`,
              }
            }}
          >
            Send Offer
          </Button>
        );
      case 'offer_sent':
        return (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ReminderIcon />}
            onClick={() => handleOpenStatusDialog('follow_up')}
            sx={{ 
              boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.4)}`,
              }
            }}
          >
            Schedule Follow-up
          </Button>
        );
      case 'follow_up':
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<NegotiationIcon />}
            onClick={() => handleOpenStatusDialog('negotiation')}
            sx={{ 
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
              }
            }}
          >
            Start Negotiation
          </Button>
        );
      case 'negotiation':
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<ConvertedIcon />}
              onClick={() => handleOpenStatusDialog('converted')}
              sx={{ 
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.4)}`,
                }
              }}
            >
              Mark as Converted
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RejectedIcon />}
              onClick={() => handleOpenStatusDialog('rejected')}
            >
              Reject
            </Button>
          </Stack>
        );
      case 'converted':
      case 'rejected':
      default:
        return (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<UpdateIcon />}
            onClick={() => handleOpenStatusDialog('pending')}
          >
            Reopen Request
          </Button>
        );
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box>
      {/* Header with back button and actions */}
      <Fade in={true} timeout={800}>
        <Card 
          sx={{ 
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white',
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton 
                    onClick={onBack}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4" fontWeight={700}>
                    Enterprise Request Details
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, ml: 6 }}>
                  <Chip 
                    label={STATUS_DISPLAY[request.status || 'pending']} 
                    icon={STATUS_ICONS[request.status || 'pending']}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '& .MuiSvgIcon-root': { color: 'white' },
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    {request.companyName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1} direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                  {getActionButton()}
                  <IconButton 
                    onClick={handleOpenMenu}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Tabs for History and Details */}
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        variant="fullWidth"
        sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}
      >
        <Tab 
          label="Business Details" 
          icon={<BusinessIcon />}
          iconPosition="start"
        />
        <Tab 
          label={
            <Badge badgeContent={statusHistory.length} color="primary">
              Status History
            </Badge>
          }
          icon={<HistoryIcon />}
          iconPosition="start"
        />
        <Tab 
          label="Pricing" 
          icon={<MoneyIcon />}
          iconPosition="start"
        />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Grow in={true} timeout={800}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          width: 60,
                          height: 60,
                        }}
                      >
                        <BusinessIcon 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: '2rem'
                          }} 
                        />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {request.companyName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Request submitted on {formatDate(request.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <EmailIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body2">{request.email}</Typography>
                          </Box>
                          <Tooltip title="Copy email">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(request.email);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <PhoneIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Phone
                            </Typography>
                            <Typography variant="body2">{request.phoneNumber}</Typography>
                          </Box>
                          <Tooltip title="Copy phone">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(request.phoneNumber);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <ReceiptIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              GSTIN
                            </Typography>
                            <Typography variant="body2">{request.gstin}</Typography>
                          </Box>
                          <Tooltip title="Copy GSTIN">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(request.gstin);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <LocationIcon color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body2">{request.city}, {request.state}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      Billing Address
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        bgcolor: alpha(theme.palette.background.default, 0.5)
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {request.billingAddress}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Grow in={true} timeout={1000}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Subscription Requirements
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box 
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 2,
                            p: 2,
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Badge 
                              badgeContent={request.numberOfCompanies} 
                              color="primary"
                              max={999}
                              sx={{ 
                                '& .MuiBadge-badge': { 
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }
                              }}
                            >
                              <BusinessIcon color="primary" />
                            </Badge>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Companies
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Box 
                          sx={{ 
                            bgcolor: alpha(theme.palette.secondary.main, 0.05),
                            borderRadius: 2,
                            p: 2,
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Badge 
                              badgeContent={request.numberOfDevices} 
                              color="secondary"
                              max={999}
                              sx={{ 
                                '& .MuiBadge-badge': { 
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }
                              }}
                            >
                              <PhoneIcon color="secondary" />
                            </Badge>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Devices
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Box 
                          sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            borderRadius: 2,
                            p: 2,
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Badge 
                              badgeContent={request.numberOfTenders} 
                              color="success"
                              max={999}
                              sx={{ 
                                '& .MuiBadge-badge': { 
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }
                              }}
                            >
                              <FeedIcon color="success" />
                            </Badge>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Tenders
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Box 
                          sx={{ 
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            borderRadius: 2,
                            p: 2,
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Badge 
                              badgeContent={`${request.storageSpace} GB`} 
                              color="info"
                              sx={{ 
                                '& .MuiBadge-badge': { 
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }
                              }}
                            >
                              <StorageIcon color="info" />
                            </Badge>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Storage
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box 
                          sx={{ 
                            bgcolor: alpha(theme.palette.warning.main, 0.05),
                            borderRadius: 2,
                            p: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Badge 
                              badgeContent={request.aiQueries.toLocaleString()} 
                              color="warning"
                              max={999999}
                              sx={{ 
                                '& .MuiBadge-badge': { 
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }
                              }}
                            >
                              <LanguageIcon color="warning" />
                            </Badge>
                            <Typography variant="subtitle2" fontWeight={600}>
                              AI Queries/Month
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<BusinessIcon />}
                      onClick={() => handleOpenStatusDialog(newStatus)}
                    >
                      Update Enterprise Request
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        )}
        
        {tabValue === 1 && (
          <Grow in={true} timeout={800}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Status History
                </Typography>
                
                <Stepper orientation="vertical" activeStep={-1}>
                  {statusHistory.map((item, index) => (
                    <Step key={index} expanded>
                      <StepLabel 
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: alpha(theme.palette[STATUS_COLORS[item.status]].main, 0.1),
                              color: theme.palette[STATUS_COLORS[item.status]].main,
                            }}
                          >
                            {STATUS_ICONS[item.status]}
                          </Avatar>
                        )}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {STATUS_DISPLAY[item.status]}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item.timestamp)}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Box 
                          sx={{ 
                            ml: 0.5, 
                            p: 2, 
                            bgcolor: alpha(theme.palette.background.default, 0.5),
                            borderRadius: 2,
                            border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`
                          }}
                        >
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {item.notes}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {item.discount !== undefined && (
                              <Chip 
                                icon={<OfferIcon />}
                                label={`Discount: ${item.discount}%`}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            )}
                            
                            {item.followUpDate && (
                              <Chip 
                                icon={<ReminderIcon />}
                                label={`Follow-up: ${formatDate(item.followUpDate)}`}
                                color="secondary"
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </Box>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                
                {statusHistory.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      No status history available
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<UpdateIcon />}
                      onClick={() => handleOpenStatusDialog(newStatus)}
                      sx={{ mt: 2 }}
                    >
                      Update Status
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>
        )}
        
        {tabValue === 2 && (
          <Grow in={true} timeout={800}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Pricing Details
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estimated Price Based on Requirements
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Base Subscription
                        </Typography>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={8}>
                            <Typography variant="body2" color="text.secondary">
                              Companies ({request.numberOfCompanies} × ₹2,000)
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                              ₹{(request.numberOfCompanies * 2000).toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={8}>
                            <Typography variant="body2" color="text.secondary">
                              Devices ({request.numberOfDevices} × ₹500)
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                              ₹{(request.numberOfDevices * 500).toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={8}>
                            <Typography variant="body2" color="text.secondary">
                              Tenders ({request.numberOfTenders} × ₹100)
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                              ₹{(request.numberOfTenders * 100).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Grid container>
                          <Grid item xs={8}>
                            <Typography variant="subtitle2">
                              Subtotal
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2">
                              ₹{((request.numberOfCompanies * 2000) + 
                                 (request.numberOfDevices * 500) + 
                                 (request.numberOfTenders * 100)).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Additional Services
                        </Typography>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={8}>
                            <Typography variant="body2" color="text.secondary">
                              Storage ({request.storageSpace} GB × ₹10)
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                              ₹{(request.storageSpace * 10).toLocaleString()}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={8}>
                            <Typography variant="body2" color="text.secondary">
                              AI Queries ({request.aiQueries / 1000}K × ₹50)
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                              ₹{((request.aiQueries / 1000) * 50).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Grid container>
                          <Grid item xs={8}>
                            <Typography variant="subtitle2">
                              Subtotal
                            </Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2">
                              ₹{((request.storageSpace * 10) + 
                                 ((request.aiQueries / 1000) * 50)).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      mt: 3, 
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }}
                  >
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Total Estimated Monthly Cost
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight={600} color="primary">
                          ₹{((request.numberOfCompanies * 2000) + 
                             (request.numberOfDevices * 500) + 
                             (request.numberOfTenders * 100) +
                             (request.storageSpace * 10) + 
                             ((request.aiQueries / 1000) * 50)).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Additional Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Prices are estimates and subject to change based on negotiation
                    <br />
                    • All prices are in Indian Rupees (₹) and exclusive of GST
                    <br />
                    • Annual subscriptions are eligible for up to 20% discount
                    <br />
                    • Custom integrations and training are available at additional cost
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained"
                  color="primary"
                  startIcon={<OfferIcon />}
                  onClick={() => handleOpenStatusDialog('offer_sent')}
                >
                  Create Offer
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AssignmentIcon />}
                  onClick={() => {}}
                >
                  Generate Contract
                </Button>
              </CardActions>
            </Card>
          </Grow>
        )}
      </Box>

      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[STATUS_COLORS[newStatus]].main, 0.1),
                color: theme.palette[STATUS_COLORS[newStatus]].main,
                width: 40,
                height: 40,
              }}
            >
              {STATUS_ICONS[newStatus]}
            </Avatar>
            <Typography variant="h6">
              Update Status to {STATUS_DISPLAY[newStatus]}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          
          <TextField
            label="Status Notes"
            multiline
            rows={3}
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Enter detailed notes about this status update"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
              }
            }}
          />
          
          {newStatus === 'offer_sent' && (
            <TextField
              label="Discount Percentage"
              type="number"
              value={discount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) {
                  setDiscount('');
                } else if (value >= 0 && value <= 100) {
                  setDiscount(value);
                }
              }}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                startAdornment: <InputAdornment position="start"><OfferIcon color="primary" /></InputAdornment>,
                sx: {
                  borderRadius: 2,
                }
              }}
              inputProps={{ min: 0, max: 100 }}
            />
          )}
          
          {newStatus === 'follow_up' && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Follow-up Date"
                value={followUpDate}
                onChange={(newValue) => setFollowUpDate(newValue)}
                sx={{ width: '100%', mt: 2 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    InputProps: {
                      startAdornment: <InputAdornment position="start"><ReminderIcon color="secondary" /></InputAdornment>,
                      sx: {
                        borderRadius: 2,
                      }
                    }
                  }
                }}
                disablePast
              />
            </LocalizationProvider>
          )}
          
          <Box 
            sx={{ 
              mt: 3, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette[STATUS_COLORS[newStatus]].main, 0.05),
              border: `1px dashed ${alpha(theme.palette[STATUS_COLORS[newStatus]].main, 0.3)}`
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} color={theme.palette[STATUS_COLORS[newStatus]].main}>
              {newStatus === 'pending' && 'Request will be marked as new/pending'}
              {newStatus === 'offer_sent' && 'An offer will be recorded as sent to the client'}
              {newStatus === 'follow_up' && 'A follow-up reminder will be set for the selected date'}
              {newStatus === 'negotiation' && 'Request will be marked as in active negotiation'}
              {newStatus === 'converted' && 'Request will be marked as successfully converted'}
              {newStatus === 'rejected' && 'Request will be marked as rejected'}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseStatusDialog}
            variant="outlined"
            color={STATUS_COLORS[newStatus] as any}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleStatusUpdate}
            startIcon={<SaveIcon />}
            disabled={isUpdating}
            sx={{
              bgcolor: theme.palette[STATUS_COLORS[newStatus]].main,
              color: 'white',
              boxShadow: `0 4px 12px ${alpha(theme.palette[STATUS_COLORS[newStatus]].main, 0.3)}`,
              '&:hover': {
                bgcolor: theme.palette[STATUS_COLORS[newStatus]].dark,
                boxShadow: `0 6px 16px ${alpha(theme.palette[STATUS_COLORS[newStatus]].main, 0.4)}`,
              },
              '&:disabled': {
                bgcolor: alpha(theme.palette[STATUS_COLORS[newStatus]].main, 0.6),
                color: 'white',
              }
            }}
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Additional menu options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => {
          handleCloseMenu();
          handleOpenStatusDialog(request.status);
        }}>
          <ListItemIcon>
            <UpdateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Change Status" />
        </MenuItem>
        
        <MenuItem onClick={() => {
          handleCloseMenu();
          // Additional actions can be added here
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Request" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleCloseMenu();
          // For 'pending' status
          if (request.status === 'pending') {
            handleOpenStatusDialog('offer_sent');
          }
        }}>
          <ListItemIcon>
            <SendIcon fontSize="small" color={request.status === 'pending' ? 'primary' : 'disabled'} />
          </ListItemIcon>
          <ListItemText 
            primary="Send Offer" 
            primaryTypographyProps={{
              color: request.status === 'pending' ? 'textPrimary' : 'textSecondary'
            }}
          />
        </MenuItem>
        
        <MenuItem onClick={() => {
          handleCloseMenu();
          // For 'offer_sent' status
          if (request.status === 'offer_sent') {
            handleOpenStatusDialog('follow_up');
          }
        }}>
          <ListItemIcon>
            <ReminderIcon fontSize="small" color={request.status === 'offer_sent' ? 'secondary' : 'disabled'} />
          </ListItemIcon>
          <ListItemText 
            primary="Schedule Follow-up" 
            primaryTypographyProps={{
              color: request.status === 'offer_sent' ? 'textPrimary' : 'textSecondary'
            }}
          />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleCloseMenu();
          // Generate contract action
        }}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Generate Contract" />
        </MenuItem>
      </Menu>
    </Box>
  );
} 