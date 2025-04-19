'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { fetchWaitlistUsers } from '@/services/waitlistService';

// Type definition for waitlist user data
interface WaitlistUser {
  _id: string;
  discoveryMethod: string[];
  frustrations: string[];
  managementMethod: string[];
  states: string[];
  tenderCount: string;
  name: string;
  companyName: string;
  email: string;
  mobile: string;
  designation: string;
  businessType: string;
  notifyOnLaunch: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fallback mock data in case API fails
const mockWaitlistData = [
  {
    _id: '68035fdec50dd5a9ea8ac103',
    discoveryMethod: [
      'Manually browse multiple government e-tender portals like GeM/CPPP/State e-Procurement Portals',
      'Use a tender information aggregator at a premium yearly cost',
      'Often miss tender opportunities due to lack of tracking & notifications'
    ],
    frustrations: [
      'Reading & understanding complex and long tender documents',
      'Too much manual paper work',
      'Repetitive tasks like printing, signing & scanning',
      'Understanding tender compliance requirements',
      'Missing EMD & PBG release dates',
      'Keeping track of documents',
      'Disqualification in technical evaluation due to document error by staff'
    ],
    managementMethod: [
      'Manually set reminders on phone',
      'Maintain Excel or Google Calendar',
      'Often miss tender updates or last dates'
    ],
    states: ['Gujarat', 'Uttar Pradesh'],
    tenderCount: '5–15',
    name: 'Anuj Kacker',
    companyName: 'Toplogic',
    email: 'anuj@toplogic.in',
    mobile: '9838504067',
    designation: 'CEO',
    businessType: 'Pvt. Ltd. Company',
    notifyOnLaunch: true,
    createdAt: '2025-04-19T08:33:34.669Z',
    updatedAt: '2025-04-19T08:33:34.669Z',
  }
];

export default function WaitlistPage() {
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState<WaitlistUser | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [waitlistData, setWaitlistData] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWaitlistUsers();
      setWaitlistData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch waitlist data:', err);
      setError('Failed to load waitlist data. Please try again later.');
      // Fallback to mock data in case of error
      setWaitlistData(mockWaitlistData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetailDialog = (user: WaitlistUser) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Waitlist
        </Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={loading}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : waitlistData.length === 0 ? (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No waitlist entries found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are currently no users on the waitlist.
          </Typography>
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Business Type</TableCell>
                  <TableCell>Tender Count</TableCell>
                  <TableCell>States</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {waitlistData.map((user) => (
                  <TableRow 
                    key={user._id}
                    hover
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.04) 
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: theme.palette.primary.main,
                            width: 40,
                            height: 40, 
                          }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">{user.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.companyName}</TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{user.mobile}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.businessType}</TableCell>
                    <TableCell>{user.tenderCount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {user.states.map((state) => (
                          <Chip 
                            key={state} 
                            label={state} 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontSize: '0.75rem',
                            }} 
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDetailDialog(user)}
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 32, 74, 0.15)',
          },
        }}
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 48,
                    height: 48,
                  }}
                >
                  {selectedUser.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.companyName} • {selectedUser.designation}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Basic Info" />
                <Tab label="Tender Insights" />
              </Tabs>

              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Contact Information</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography>{selectedUser.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography>{selectedUser.mobile}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <BusinessIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography>{selectedUser.businessType}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <LocationOnIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="subtitle2">Operating States</Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                {selectedUser.states.map((state: string) => (
                                  <Chip 
                                    key={state} 
                                    label={state} 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      color: theme.palette.primary.main,
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Preferences</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2">Tender Count Range</Typography>
                            <Chip 
                              label={selectedUser.tenderCount} 
                              size="small" 
                              sx={{ 
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                color: theme.palette.secondary.main,
                              }} 
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2">Notify on Launch</Typography>
                            <Chip 
                              label={selectedUser.notifyOnLaunch ? 'Yes' : 'No'} 
                              size="small" 
                              color={selectedUser.notifyOnLaunch ? 'success' : 'default'}
                              sx={{ 
                                bgcolor: selectedUser.notifyOnLaunch ? alpha(theme.palette.success.main, 0.1) : undefined,
                                color: selectedUser.notifyOnLaunch ? theme.palette.success.main : undefined,
                              }} 
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2">Joined On</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Discovery Method</Typography>
                        <List>
                          {selectedUser.discoveryMethod.map((method: string, index: number) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemText 
                                primary={method}
                                primaryTypographyProps={{ 
                                  variant: 'body2',
                                  sx: { display: 'list-item', ml: 2 }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Management Method</Typography>
                        <List>
                          {selectedUser.managementMethod.map((method: string, index: number) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                              <ListItemText 
                                primary={method}
                                primaryTypographyProps={{ 
                                  variant: 'body2',
                                  sx: { display: 'list-item', ml: 2 }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Frustrations</Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          {selectedUser.frustrations.map((frustration: string, index: number) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card 
                                elevation={0} 
                                sx={{ 
                                  p: 1.5, 
                                  bgcolor: alpha(theme.palette.error.main, 0.04),
                                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                                  borderRadius: 1,
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography variant="body2">{frustration}</Typography>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 