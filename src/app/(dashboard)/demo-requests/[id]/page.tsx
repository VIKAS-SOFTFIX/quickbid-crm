'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Fade,
  Grow,
  Badge,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
  Note as NoteIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  VideoCall as VideoCallIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as ContentCopyIcon,
  CalendarMonth as CalendarMonthIcon,
  Share as ShareIcon,
  Report as ReportIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  FileCopy as FileCopyIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  WhatsApp as WhatsAppIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  Slideshow as SlideshowIcon,
  OndemandVideo as OndemandVideoIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Email as EmailIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDemoDetail } from '@/hooks/useDemoDetail';

// DemoResource interface for demo materials
interface DemoResource {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'video' | 'link';
  size?: string;
  url: string;
  category: 'script' | 'presentation' | 'guide' | 'video' | 'other';
  lastUpdated: string;
  isDefault: boolean;
}

// Main page component
export default function DemoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  // Use the custom hook which now includes all state and handlers
  const {
    demoRequest,
    loading,
    submitting,
    error,
    timelineFilter,
    snackbar,
    filteredTimeline,
    openEdit,
    editNotes,
    openFollowUp,
    followUpDate,
    followUpNotes,
    menuAnchorEl,
    activeTab,
    whatsappDialogOpen,
    whatsappNumber,
    meetingLinkDialogOpen,
    meetingLink,
    setTimelineFilter,
    addNote,
    scheduleFollowUp,
    addMeetingLink,
    updateStatus,
    updateWhatsAppNumber,
    closeSnackbar,
    refresh,
    handleOpenEdit,
    handleCloseEdit,
    handleSaveNotes,
    handleOpenFollowUp,
    handleCloseFollowUp,
    handleAddFollowUp,
    handleOpenWhatsappDialog,
    handleCloseWhatsappDialog,
    handleSaveWhatsappNumber,
    handleOpenMeetingLinkDialog,
    handleCloseMeetingLinkDialog,
    handleSaveMeetingLink,
    handleOpenMenu,
    handleCloseMenu,
    handleChangeTab,
    handleCopyToClipboard,
    getStatusColor,
    getUrgencyColor,
    getTimelineIcon,
    setEditNotes,
    setFollowUpDate,
    setFollowUpNotes,
    setWhatsappNumber,
    setMeetingLink
  } = useDemoDetail(id as string);

  // Helper function to map icon type string to icon component
  const renderTimelineIcon = (iconType: string) => {
    switch (iconType) {
      case 'EventIcon':
        return <EventIcon />;
      case 'NoteIcon':
        return <NoteIcon />;
      case 'CheckCircleIcon':
        return <CheckCircleIcon />;
      case 'ScheduleIcon':
        return <ScheduleIcon />;
      case 'PersonIcon':
        return <PersonIcon />;
      case 'LinkIcon':
        return <LinkIcon />;
      case 'PhoneIcon':
        return <PhoneIcon />;
      case 'HistoryIcon':
      default:
        return <HistoryIcon />;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Error state
  if (error || !demoRequest) {
    return (
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%' }}>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            {error || 'Demo request not found'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/demo-requests')}
            sx={{ mt: 2 }}
          >
            Go Back to Demo Requests
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, maxWidth: '100%' }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            mb: 3,
            p: { xs: 2, md: 3 },
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url("/demo-bg-pattern.svg")`,
              opacity: 0.05,
              zIndex: 0,
            }
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} sm={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <ArrowBackIcon 
                  sx={{ mr: 1, cursor: 'pointer', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} 
                  onClick={() => router.push('/demo-requests')}
                />
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}>
                  {demoRequest.name}'s Demo
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 }, 
                alignItems: 'center', 
                mb: 2,
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}>
                <Chip
                  label={demoRequest.status}
                  color="default"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '& .MuiChip-label': { fontWeight: 500, textTransform: 'capitalize' },
                    [theme.breakpoints.up('sm')]: {
                      height: 32 // medium size height
                    }
                  }}
                />
                <Chip
                  icon={<PriorityHighIcon />}
                  label={demoRequest.priority}
                  color="default"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '& .MuiChip-label': { fontWeight: 500, textTransform: 'capitalize' },
                    [theme.breakpoints.up('sm')]: {
                      height: 32 // medium size height
                    }
                  }}
                />
                <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Created on {new Date(demoRequest.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" sx={{ 
                opacity: 0.9,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                {demoRequest.interestedIn || 'Product Demo'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Stack 
                spacing={{ xs: 1, sm: 2 }}
                direction={{ xs: 'row', md: 'row' }} 
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                sx={{ mt: { xs: 2, md: 0 }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
              >
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleOpenEdit}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    width: { xs: 'auto', sm: 'auto' },
                    [theme.breakpoints.up('sm')]: {
                      padding: '8px 16px', // medium button padding
                      fontSize: '0.875rem'
                    }
                  }}
                >
                  Notes
                </Button>
                <Button
                  variant="contained"
                  startIcon={<VideoCallIcon />}
                  size="small"
                  sx={{ 
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    width: { xs: 'auto', sm: 'auto' },
                    [theme.breakpoints.up('sm')]: {
                      padding: '8px 16px', // medium button padding
                      fontSize: '0.875rem'
                    }
                  }}
                >
                  Start Demo
                </Button>
                <IconButton 
                  onClick={handleOpenMenu}
                  size="small"
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    [theme.breakpoints.up('sm')]: {
                      padding: '8px', // medium IconButton padding
                    }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Tabs
        value={activeTab}
        onChange={handleChangeTab}
        variant="fullWidth"
        sx={{ 
          mb: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          '& .MuiTab-root': {
            minHeight: { xs: 48, sm: 64 },
            fontWeight: 500,
            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
            py: { xs: 1, sm: 1.5 }
          },
          '& .Mui-selected': {
            color: theme.palette.primary.main,
          }
        }}
      >
        <Tab 
          label="Details" 
          icon={<PersonIcon fontSize="small" sx={{ [theme.breakpoints.up('sm')]: { fontSize: '1.5rem' } }} />} 
          iconPosition="start"
        />
        <Tab 
          label={
            <Badge 
              badgeContent={demoRequest.timeline.length} 
              color="primary"
              showZero={false}
            >
              Timeline
            </Badge>
          } 
          icon={<HistoryIcon fontSize="small" sx={{ [theme.breakpoints.up('sm')]: { fontSize: '1.5rem' } }} />}
          iconPosition="start"
        />
      </Tabs>

      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Main Content - Left Side */}
            <Grid item xs={12} md={8}>
              {/* Contact Information Card */}
              <Paper 
                elevation={0} 
                variant="outlined" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="h6">Contact Information</Typography>
                </Box>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    mb: 3, 
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: 2
                  }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        width: { xs: 60, sm: 70 },
                        height: { xs: 60, sm: 70 },
                        fontSize: { xs: '1.5rem', sm: '1.75rem' },
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {demoRequest.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        mb: 0.5
                      }}>
                        {demoRequest.name}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mb: 1
                      }}>
                        <BusinessIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle1" sx={{
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          color: theme.palette.text.secondary,
                          fontWeight: 500
                        }}>
                          {demoRequest.businessName}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    overflow: 'hidden',
                    mb: 3
                  }}>
                    <Grid container>
                      <Grid item xs={12} sm={6} sx={{ 
                        p: 2,
                        borderRight: { xs: 'none', sm: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` },
                        borderBottom: { xs: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, sm: 'none' }
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          mb: 1.5, 
                          color: theme.palette.text.secondary,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}>
                          Contact Details
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2
                          }}>
                            <Avatar sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1), 
                              color: theme.palette.primary.main,
                              width: 36,
                              height: 36
                            }}>
                              <PhoneIcon fontSize="small" />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                                Phone
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {demoRequest.mobile}
                              </Typography>
                            </Box>
                            <Box>
                              <Tooltip title="Copy phone number">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleCopyToClipboard(
                                    demoRequest.mobile,
                                    'Phone number copied to clipboard'
                                  )}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Update phone number">
                                <IconButton 
                                  size="small"
                                  onClick={handleOpenWhatsappDialog}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2
                          }}>
                            <Avatar sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1), 
                              color: theme.palette.primary.main,
                              width: 36,
                              height: 36
                            }}>
                              <EmailIcon fontSize="small" />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                                Email
                              </Typography>
                              <Typography variant="body1" sx={{ 
                                fontWeight: 500,
                                wordBreak: 'break-word'
                              }}>
                                {demoRequest.email}
                              </Typography>
                            </Box>
                            <Tooltip title="Copy email">
                              <IconButton 
                                size="small"
                                onClick={() => handleCopyToClipboard(
                                  demoRequest.email,
                                  'Email copied to clipboard'
                                )}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          
                          {demoRequest.mobile && (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2
                            }}>
                              <Avatar sx={{ 
                                bgcolor: alpha(theme.palette.success.main, 0.1), 
                                color: theme.palette.success.main,
                                width: 36,
                                height: 36
                              }}>
                                <WhatsAppIcon fontSize="small" />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                                  WhatsApp
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {demoRequest.mobile}
                                </Typography>
                              </Box>
                              <Tooltip title="Open WhatsApp">
                                <IconButton 
                                  size="small"
                                  color="success"
                                  onClick={() => {
                                    window.open(`https://wa.me/${demoRequest.mobile.replace(/\+/g, '').replace(/\s/g, '')}`, '_blank');
                                  }}
                                >
                                  <ShareIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Stack>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ 
                          mb: 1.5, 
                          color: theme.palette.text.secondary,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}>
                          Demo Schedule
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2
                          }}>
                            <Avatar sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1), 
                              color: theme.palette.primary.main,
                              width: 36,
                              height: 36
                            }}>
                              <CalendarMonthIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                                Demo Date
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {new Date(demoRequest.preferredDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2
                          }}>
                            <Avatar sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1), 
                              color: theme.palette.primary.main,
                              width: 36,
                              height: 36
                            }}>
                              <AccessTimeIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                                Demo Time
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {demoRequest.preferredTime}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <CardActions sx={{ 
                  justifyContent: 'space-between', 
                  borderTop: `1px solid ${theme.palette.divider}`, 
                  p: { xs: 1.5, sm: 2 },
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Button 
                    variant="contained"
                    startIcon={<VideoCallIcon />}
                    sx={{ 
                      width: { xs: '100%', sm: 'auto' },
                      mb: { xs: 1, sm: 0 }
                    }}
                    onClick={() => {
                      // Handle starting demo
                    }}
                  >
                    Start Demo
                  </Button>
                  
                  <Box sx={{ 
                    display: 'flex',
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-end' },
                    gap: 1
                  }}>
                    <Tooltip title="Add meeting link">
                      <Button
                        variant="outlined"
                        startIcon={<LinkIcon />}
                        size="small"
                        onClick={handleOpenMeetingLinkDialog}
                        sx={{ flex: { xs: 1, sm: 'none' } }}
                      >
                        Add Link
                      </Button>
                    </Tooltip>
                    <Tooltip title="Share contact">
                      <Button
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        size="small"
                        sx={{ flex: { xs: 1, sm: 'none' } }}
                      >
                        Share
                      </Button>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Paper>

              {/* Notes Card */}
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6">Notes</Typography>
                  <Button
                    startIcon={<EditIcon />}
                    size="small"
                    onClick={handleOpenEdit}
                  >
                    Edit
                  </Button>
                </Box>
                <CardContent>
                  <Typography variant="body2" sx={{ 
                    whiteSpace: 'pre-wrap',
                    minHeight: 100,
                    p: 2,
                    border: demoRequest.notes ? 'none' : `1px dashed ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: demoRequest.notes ? 'transparent' : alpha(theme.palette.background.default, 0.5),
                    fontStyle: demoRequest.notes ? 'normal' : 'italic',
                    color: demoRequest.notes ? 'text.primary' : 'text.secondary',
                  }}>
                    {demoRequest.notes || 'No notes added yet. Click Edit to add notes.'}
                  </Typography>
                </CardContent>
              </Paper>

              {/* Requirements Card */}
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="h6">Requirements</Typography>
                </Box>
                <CardContent>
                  <Typography variant="body2" sx={{ 
                    whiteSpace: 'pre-wrap',
                    minHeight: 100,
                    p: 2,
                    border: demoRequest.requirements ? 'none' : `1px dashed ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: demoRequest.requirements ? 'transparent' : alpha(theme.palette.background.default, 0.5),
                    fontStyle: demoRequest.requirements ? 'normal' : 'italic',
                    color: demoRequest.requirements ? 'text.primary' : 'text.secondary',
                  }}>
                    {demoRequest.requirements || 'No specific requirements provided.'}
                  </Typography>
                </CardContent>
              </Paper>
            </Grid>

            {/* Sidebar - Right Side */}
            <Grid item xs={12} md={4}>
              {/* Assigned Agent Card */}
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="h6">Assigned Agent</Typography>
                </Box>
                <CardContent>
                  {demoRequest.assignedTo ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>
                          {demoRequest.assignedAgentName?.[0] || 'A'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {demoRequest.assignedAgentName || 'Agent'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon color="primary" fontSize="small" sx={{ [theme.breakpoints.up('sm')]: { fontSize: '1.25rem' } }} />
                            <Typography variant="body2" color="text.secondary">
                              {demoRequest.assignedTo}
                            </Typography>
                            <Tooltip title="Copy email">
                              <IconButton 
                                size="small"
                                onClick={() => handleCopyToClipboard(
                                  demoRequest.assignedTo || '',
                                  'Agent email copied to clipboard'
                                )}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      border: `1px dashed ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        No agent assigned yet
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Assign Agent
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Paper>

              {/* Status Update Card */}
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="h6">Status</Typography>
                </Box>
                <CardContent>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    {(['pending', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
                      <Grid item xs={6} key={status}>
                        <Button
                          variant={demoRequest.status === status ? 'contained' : 'outlined'}
                          fullWidth
                          size="small"
                          color={
                            status === 'cancelled'
                              ? 'error' 
                              : status === 'completed'
                              ? 'success'
                              : status === 'scheduled'
                              ? 'info'
                              : 'warning'
                          }
                          onClick={() => updateStatus(status)}
                          disabled={demoRequest.status === status || submitting}
                          sx={{
                            textTransform: 'capitalize',
                            ...(demoRequest.status === status && { boxShadow: 3 }),
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                            padding: { xs: '4px 8px', sm: '6px 16px' },
                            [theme.breakpoints.up('sm')]: {
                              height: 36, // Medium button height
                            }
                          }}
                          startIcon={
                            status === 'completed' ? <CheckCircleIcon fontSize="small" /> :
                            status === 'cancelled' ? <DeleteIcon fontSize="small" /> :
                            status === 'scheduled' ? <EventIcon fontSize="small" /> :
                            <ScheduleIcon fontSize="small" />
                          }
                        >
                          {status}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Paper>

              {/* Quick Actions Card */}
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="h6">Quick Actions</Typography>
                </Box>
                <CardContent>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<ScheduleIcon fontSize="small" sx={{ [theme.breakpoints.up('sm')]: { fontSize: '1.25rem' } }} />}
                      fullWidth
                      size="small"
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        [theme.breakpoints.up('sm')]: {
                          padding: '8px 16px', // medium button padding
                        }
                      }}
                      onClick={handleOpenFollowUp}
                    >
                      Schedule Follow-up
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LinkIcon fontSize="small" sx={{ [theme.breakpoints.up('sm')]: { fontSize: '1.25rem' } }} />}
                      fullWidth
                      size="small"
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        [theme.breakpoints.up('sm')]: {
                          padding: '8px 16px', // medium button padding
                        }
                      }}
                      onClick={handleOpenMeetingLinkDialog}
                    >
                      Add Meeting Link
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon fontSize="small" sx={{ [theme.breakpoints.up('sm')]: { fontSize: '1.25rem' } }} />}
                      fullWidth
                      size="small"
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        [theme.breakpoints.up('sm')]: {
                          padding: '8px 16px', // medium button padding
                        }
                      }}
                      onClick={() => {
                        window.open(`mailto:${demoRequest.email}?subject=Regarding Your Demo Request&body=Hello ${demoRequest.name},`);
                      }}
                    >
                      Send Email
                    </Button>
                  </Stack>
                </CardContent>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0} 
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Typography variant="h6">Timeline</Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                width: { xs: '100%', sm: 'auto' },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <TextField
                  placeholder="Search timeline..."
                  size="small"
                  value={timelineFilter}
                  onChange={(e) => setTimelineFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 200 },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenFollowUp}
                  size="small"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Add Activity
                </Button>
              </Box>
            </Box>
            <CardContent sx={{ p: { xs: 2, md: 0 } }}>
              <Box sx={{ position: 'relative', p: { xs: 2, md: 3 } }}>
                {filteredTimeline.length > 0 ? (
                  filteredTimeline.map((event, index) => (
                    <Fade in={true} key={event.id} timeout={500 + index * 100}>
                      <Box
                        sx={{
                          position: 'relative',
                          pb: 3,
                          '&:last-child': { pb: 0 },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 15,
                            top: 30,
                            bottom: 0,
                            width: 2,
                            backgroundColor: theme.palette.divider,
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                          <Box 
                            sx={{ 
                              color: 'white', 
                              backgroundColor: theme.palette.primary.main,
                              width: { xs: 24, sm: 32 },
                              height: { xs: 24, sm: 32 },
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1,
                              position: 'relative',
                              alignSelf: { xs: 'flex-start', sm: 'center' },
                              mt: { xs: 1, sm: 0 }
                            }}
                          >
                            {renderTimelineIcon(getTimelineIcon(event.type))}
                          </Box>
                          <Box 
                            sx={{ 
                              flex: 1, 
                              p: { xs: 1.5, sm: 2 }, 
                              borderRadius: 2, 
                              border: `1px solid ${theme.palette.divider}`,
                              backgroundColor: alpha(theme.palette.background.paper, 0.7),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                boxShadow: 1
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              mb: 1,
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: { xs: 0.5, sm: 0 }
                            }}>
                              <Typography variant="subtitle2" color="primary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                {event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                {new Date(`${event.date}T${event.time}`).toLocaleString()}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              {event.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Avatar 
                                sx={{ 
                                  width: { xs: 20, sm: 24 }, 
                                  height: { xs: 20, sm: 24 }, 
                                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                  bgcolor: theme.palette.secondary.main
                                }}
                              >
                                {event.user[0]?.toUpperCase()}
                              </Avatar>
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                {event.user}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Fade>
                  ))
                ) : timelineFilter ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No timeline events match the filter &quot;{timelineFilter}&quot;
                    </Typography>
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => setTimelineFilter('')}
                    >
                      Clear Filter
                    </Button>
                  </Box>
                ) : demoRequest.timeline.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No timeline events found. Add an activity to get started.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={handleOpenFollowUp}
                      startIcon={<AddIcon />}
                    >
                      Add Activity
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Timeline events aren&apos;t being displayed properly.
                    </Typography>
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={refresh}
                    >
                      Refresh Data
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Paper>
        </motion.div>
      )}

      {/* Dialogs */}
      <Dialog 
        open={openEdit} 
        onClose={handleCloseEdit} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
            width: { xs: '100%', sm: '90%', md: '80%' },
            mx: 'auto'
          },
        }}
      >
        <DialogTitle>Edit Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSaveNotes} 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openFollowUp} 
        onClose={handleCloseFollowUp} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
            width: { xs: '100%', sm: '90%', md: '80%' },
            mx: 'auto'
          },
        }}
      >
        <DialogTitle>Schedule Follow-up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Follow-up Date"
            type="date"
            fullWidth
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={followUpNotes}
            onChange={(e) => setFollowUpNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFollowUp} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleAddFollowUp} 
            variant="contained" 
            disabled={!followUpDate || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
          >
            {submitting ? 'Scheduling...' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={whatsappDialogOpen}
        onClose={handleCloseWhatsappDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
            width: { xs: '100%', sm: '90%', md: '80%' },
            mx: 'auto'
          },
        }}
      >
        <DialogTitle>Update Mobile/WhatsApp Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mobile Number"
            fullWidth
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Enter the mobile number including country code (e.g., +91 98765 43210)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWhatsappDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSaveWhatsappNumber} 
            variant="contained" 
            disabled={!whatsappNumber || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
            color="primary"
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={meetingLinkDialogOpen}
        onClose={handleCloseMeetingLinkDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
            width: { xs: '100%', sm: '90%', md: '80%' },
            mx: 'auto'
          },
        }}
      >
        <DialogTitle>Add Meeting Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Meeting Link"
            fullWidth
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="https://meet.google.com/abc-defg-hij"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Enter the full meeting link (e.g., Google Meet, Zoom, Microsoft Teams)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMeetingLinkDialog} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleSaveMeetingLink} 
            variant="contained" 
            disabled={!meetingLink || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : undefined}
            color="primary"
          >
            {submitting ? 'Saving...' : 'Add Link'}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          }
        }}
      >
        <MenuItem onClick={() => {
          handleCloseMenu();
          router.push('/demo-requests');
        }}>
          <ListItemIcon>
            <ArrowBackIcon fontSize="small" />
          </ListItemIcon>
          Back to Demo Requests
        </MenuItem>
        <MenuItem onClick={() => {
          handleCopyToClipboard(
            `${window.location.origin}/demo-requests/${demoRequest.id}`,
            'Link copied to clipboard'
          );
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          Share Demo Request
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          updateStatus(demoRequest.status === 'completed' ? 'scheduled' : 'completed');
          handleCloseMenu();
        }}>
          <ListItemIcon>
            {demoRequest.status === 'completed' ? 
              <ScheduleIcon fontSize="small" color="primary" /> : 
              <CheckCircleIcon fontSize="small" color="success" />
            }
          </ListItemIcon>
          <Typography>
            {demoRequest.status === 'completed' ? 'Mark as Scheduled' : 'Mark as Completed'}
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          updateStatus('cancelled');
          handleCloseMenu();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Cancel Demo</Typography>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 