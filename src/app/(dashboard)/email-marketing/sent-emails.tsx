"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  BarChart as StatsIcon,
  Send as SendIcon,
  Visibility as ViewIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useEmailMarketing } from "@/hooks/useEmailMarketing";
import { SentEmail } from "@/services/emailMarketingService";

export default function SentEmailsPage() {
  const theme = useTheme();
  return <div></div>;
  // const {
  //   loading,
  //   error,
  //   success,
  //   sentEmails,
  //   totalCount,
  //   filters,
  //   stats,
  //   selectedEmail,
  //   isClient,
  //   fetchSentEmails,
  //   fetchStats,
  //   fetchEmailById,
  //   updateFilters,
  //   resetFilters,
  //   setSelectedEmail,
  //   setError,
  //   setSuccess
  // } = useEmailMarketing();

  // const [viewEmailDialog, setViewEmailDialog] = useState(false);
  // const [emailContent, setEmailContent] = useState<string>('');
  // const [followUpDialog, setFollowUpDialog] = useState(false);
  // const [showStats, setShowStats] = useState(false);

  // // Available filter options (would come from API in real implementation)
  // const states = ['Karnataka', 'Maharashtra', 'Test State'];
  // const products = ['Mobile', 'Laptop', 'Tablet', 'Accessories'];
  // const categories = ['Electronics', 'Furniture', 'Vehicles', 'Test Category'];
  // const districts = ['Bangalore Urban', 'Mumbai', 'Pune', 'Test District'];
  // const batches = ['Batch 1', 'Batch 2', 'Batch 3'];

  // // View email content
  // const viewEmail = async (email: any) => {
  //   setSelectedEmail(email);

  //   try {
  //     // In a real implementation, you would fetch the email content from the server
  //     // For now, we'll simulate it with a placeholder
  //     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

  //     setEmailContent(`
  //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //         <h2>${email.subject}</h2>
  //         <p>This is a placeholder for the email content. In a real implementation, this would be fetched from the server.</p>
  //         <p>Sent to ${email.recipientCount} recipients on ${new Date(email.sentAt).toLocaleString()}</p>
  //         <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
  //           <p><strong>Statistics:</strong></p>
  //           <p>Opens: ${email.openCount} | Clicks: ${email.clickCount} | Bounces: ${email.bounceCount}</p>
  //         </div>
  //       </div>
  //     `);

  //     setViewEmailDialog(true);
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to fetch email content');
  //   }
  // };

  // // Prepare follow-up email
  // const prepareFollowUp = (email: SentEmail) => {
  //   setSelectedEmail(email);
  //   setFollowUpDialog(true);
  // };

  // // Send follow-up email
  // const sendFollowUp = () => {
  //   // In a real implementation, you would redirect to the compose page with pre-filled data
  //   // For now, we'll just close the dialog and show a success message
  //   setFollowUpDialog(false);
  //   setSuccess('Redirecting to compose page for follow-up...');

  //   // Redirect to compose page
  //   window.location.href = '/email-marketing?followUp=true&emailId=' + selectedEmail?._id;
  // };

  // // Handle page change
  // const handleChangePage = (event: unknown, newPage: number) => {
  //   updateFilters({ page: newPage + 1 }); // API uses 1-based indexing, MUI uses 0-based
  // };

  // // Handle rows per page change
  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   updateFilters({
  //     limit: parseInt(event.target.value, 10),
  //     page: 1
  //   });
  // };

  // // Handle filter change
  // const handleFilterChange = (field: any, value: string) => {
  //   updateFilters({ [field]: value });
  // };

  // // Format date
  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleString();
  // };

  // // If we're server-side rendering, return a minimal placeholder
  // if (!isClient) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // return (
  //   <Box sx={{ p: 3 }}>
  //     <Paper sx={{ p: 3, mb: 3 }}>
  //       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
  //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //           <EmailIcon color="primary" sx={{ mr: 1 }} />
  //           <Typography variant="h5" component="h1">
  //             Sent Emails
  //           </Typography>
  //         </Box>

  //         <Box>
  //           <Button
  //             variant="outlined"
  //             startIcon={<StatsIcon />}
  //             onClick={() => setShowStats(!showStats)}
  //             sx={{ mr: 1 }}
  //           >
  //             {showStats ? 'Hide Stats' : 'Show Stats'}
  //           </Button>

  //           <Button
  //             variant="outlined"
  //             startIcon={<RefreshIcon />}
  //             onClick={() => {
  //               fetchSentEmails();
  //               fetchStats();
  //             }}
  //           >
  //             Refresh
  //           </Button>
  //         </Box>
  //       </Box>

  //       {showStats && stats && (
  //         <Card sx={{ mb: 3, bgcolor: theme.palette.background.default }}>
  //           <CardContent>
  //             <Typography variant="h6" gutterBottom>
  //               Email Campaign Statistics
  //             </Typography>

  //             <Grid container spacing={2}>
  //               <Grid item xs={12} md={3}>
  //                 <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
  //                   <Typography variant="subtitle2" color="textSecondary">Total Sent</Typography>
  //                   <Typography variant="h4">{stats.totalSent}</Typography>
  //                 </Paper>
  //               </Grid>

  //               <Grid item xs={12} md={3}>
  //                 <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: theme.palette.success.light }}>
  //                   <Typography variant="subtitle2" color="textSecondary">Open Rate</Typography>
  //                   <Typography variant="h4">{(stats.openRate * 100).toFixed(1)}%</Typography>
  //                   <Typography variant="body2">{stats.totalOpened} opens</Typography>
  //                 </Paper>
  //               </Grid>

  //               <Grid item xs={12} md={3}>
  //                 <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: theme.palette.info.light }}>
  //                   <Typography variant="subtitle2" color="textSecondary">Click Rate</Typography>
  //                   <Typography variant="h4">{(stats.clickRate * 100).toFixed(1)}%</Typography>
  //                   <Typography variant="body2">{stats.totalClicked} clicks</Typography>
  //                 </Paper>
  //               </Grid>

  //               <Grid item xs={12} md={3}>
  //                 <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: theme.palette.warning.light }}>
  //                   <Typography variant="subtitle2" color="textSecondary">Bounce Rate</Typography>
  //                   <Typography variant="h4">{(stats.bounceRate * 100).toFixed(1)}%</Typography>
  //                   <Typography variant="body2">{stats.totalBounced} bounces</Typography>
  //                 </Paper>
  //               </Grid>
  //             </Grid>
  //           </CardContent>
  //         </Card>
  //       )}

  //       <Box sx={{ mb: 3 }}>
  //         <Typography variant="subtitle1" gutterBottom>
  //           Filters
  //         </Typography>

  //         <Grid container spacing={2}>
  //           <Grid item xs={12} md={2}>
  //             <TextField
  //               fullWidth
  //               label="Search"
  //               variant="outlined"
  //               size="small"
  //               value={filters.search || ''}
  //               onChange={(e) => handleFilterChange('search', e.target.value)}
  //               InputProps={{
  //                 startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
  //               }}
  //             />
  //           </Grid>

  //           <Grid item xs={12} md={2}>
  //             <FormControl fullWidth size="small">
  //               <InputLabel id="state-filter-label">State</InputLabel>
  //               <Select
  //                 labelId="state-filter-label"
  //                 value={filters.state || ''}
  //                 label="State"
  //                 onChange={(e) => handleFilterChange('state', e.target.value)}
  //               >
  //                 <MenuItem value="">All States</MenuItem>
  //                 {states.map((state) => (
  //                   <MenuItem key={state} value={state}>{state}</MenuItem>
  //                 ))}
  //               </Select>
  //             </FormControl>
  //           </Grid>

  //           <Grid item xs={12} md={2}>
  //             <FormControl fullWidth size="small">
  //               <InputLabel id="product-filter-label">Product</InputLabel>
  //               <Select
  //                 labelId="product-filter-label"
  //                 value={filters.product || ''}
  //                 label="Product"
  //                 onChange={(e) => handleFilterChange('product', e.target.value)}
  //               >
  //                 <MenuItem value="">All Products</MenuItem>
  //                 {products.map((product) => (
  //                   <MenuItem key={product} value={product}>{product}</MenuItem>
  //                 ))}
  //               </Select>
  //             </FormControl>
  //           </Grid>

  //           <Grid item xs={12} md={2}>
  //             <FormControl fullWidth size="small">
  //               <InputLabel id="category-filter-label">Category</InputLabel>
  //               <Select
  //                 labelId="category-filter-label"
  //                 value={filters.category || ''}
  //                 label="Category"
  //                 onChange={(e) => handleFilterChange('category', e.target.value)}
  //               >
  //                 <MenuItem value="">All Categories</MenuItem>
  //                 {categories.map((category) => (
  //                   <MenuItem key={category} value={category}>{category}</MenuItem>
  //                 ))}
  //               </Select>
  //             </FormControl>
  //           </Grid>

  //           <Grid item xs={12} md={2}>
  //             <FormControl fullWidth size="small">
  //               <InputLabel id="district-filter-label">District</InputLabel>
  //               <Select
  //                 labelId="district-filter-label"
  //                 value={filters.district || ''}
  //                 label="District"
  //                 onChange={(e) => handleFilterChange('district', e.target.value)}
  //               >
  //                 <MenuItem value="">All Districts</MenuItem>
  //                 {districts.map((district) => (
  //                   <MenuItem key={district} value={district}>{district}</MenuItem>
  //                 ))}
  //               </Select>
  //             </FormControl>
  //           </Grid>

  //           <Grid item xs={12} md={2}>
  //             <FormControl fullWidth size="small">
  //               <InputLabel id="batch-filter-label">Batch</InputLabel>
  //               <Select
  //                 labelId="batch-filter-label"
  //                 value={filters.batch || ''}
  //                 label="Batch"
  //                 onChange={(e) => handleFilterChange('batch', e.target.value)}
  //               >
  //                 <MenuItem value="">All Batches</MenuItem>
  //                 {batches.map((batch) => (
  //                   <MenuItem key={batch} value={batch}>{batch}</MenuItem>
  //                 ))}
  //               </Select>
  //             </FormControl>
  //           </Grid>

  //           <Grid item xs={12} md={4}>
  //             <TextField
  //               fullWidth
  //               label="Start Date"
  //               type="date"
  //               size="small"
  //               value={filters.startDate || ''}
  //               onChange={(e) => handleFilterChange('startDate', e.target.value)}
  //               InputLabelProps={{ shrink: true }}
  //             />
  //           </Grid>

  //           <Grid item xs={12} md={4}>
  //             <TextField
  //               fullWidth
  //               label="End Date"
  //               type="date"
  //               size="small"
  //               value={filters.endDate || ''}
  //               onChange={(e) => handleFilterChange('endDate', e.target.value)}
  //               InputLabelProps={{ shrink: true }}
  //             />
  //           </Grid>

  //           <Grid item xs={12} md={4}>
  //             <Button
  //               fullWidth
  //               variant="outlined"
  //               color="secondary"
  //               onClick={resetFilters}
  //               sx={{ height: '100%' }}
  //             >
  //               Reset Filters
  //             </Button>
  //           </Grid>
  //         </Grid>
  //       </Box>

  //       {error && (
  //         <Alert severity="error" sx={{ mb: 3 }}>
  //           {error}
  //         </Alert>
  //       )}

  //       {success && (
  //         <Alert severity="success" sx={{ mb: 3 }}>
  //           {success}
  //         </Alert>
  //       )}

  //       <TableContainer component={Paper} variant="outlined">
  //         <Table sx={{ minWidth: 650 }}>
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Subject</TableCell>
  //               <TableCell>Recipients</TableCell>
  //               <TableCell>Sent Date</TableCell>
  //               <TableCell>State</TableCell>
  //               <TableCell>Product</TableCell>
  //               <TableCell>Category</TableCell>
  //               <TableCell>District</TableCell>
  //               <TableCell>Batch</TableCell>
  //               <TableCell>Status</TableCell>
  //               <TableCell>Stats</TableCell>
  //               <TableCell>Actions</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {loading ? (
  //               <TableRow>
  //                 <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
  //                   <CircularProgress size={40} />
  //                   <Typography variant="body2" sx={{ mt: 1 }}>
  //                     Loading sent emails...
  //                   </Typography>
  //                 </TableCell>
  //               </TableRow>
  //             ) : sentEmails.length === 0 ? (
  //               <TableRow>
  //                 <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
  //                   <Typography variant="body1">
  //                     No emails found
  //                   </Typography>
  //                   <Typography variant="body2" color="textSecondary">
  //                     Try adjusting your filters or send some emails first
  //                   </Typography>
  //                 </TableCell>
  //               </TableRow>
  //             ) : (
  //               sentEmails.map((email:any) => (
  //                 <TableRow key={email._id} hover>
  //                   <TableCell>{email.subject}</TableCell>
  //                   <TableCell>{email.recipientCount}</TableCell>
  //                   <TableCell>{formatDate(email.sentAt)}</TableCell>
  //                   <TableCell>{email.state || 'N/A'}</TableCell>
  //                   <TableCell>{email.product || 'N/A'}</TableCell>
  //                   <TableCell>{email.category || 'N/A'}</TableCell>
  //                   <TableCell>{email.district || 'N/A'}</TableCell>
  //                   <TableCell>{email.batch || 'N/A'}</TableCell>
  //                   <TableCell>
  //                     <Chip
  //                       label={email.status}
  //                       color={
  //                         email.status === 'sent' ? 'success' :
  //                         email.status === 'failed' ? 'error' : 'warning'
  //                       }
  //                       size="small"
  //                     />
  //                   </TableCell>
  //                   <TableCell>
  //                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //                       <Tooltip title="Opens">
  //                         <Chip
  //                           label={`${email.openCount} opens`}
  //                           size="small"
  //                           variant="outlined"
  //                         />
  //                       </Tooltip>
  //                       <Tooltip title="Clicks">
  //                         <Chip
  //                           label={`${email.clickCount} clicks`}
  //                           size="small"
  //                           variant="outlined"
  //                         />
  //                       </Tooltip>
  //                     </Box>
  //                   </TableCell>
  //                   <TableCell>
  //                     <Box sx={{ display: 'flex', gap: 1 }}>
  //                       <Tooltip title="View Email">
  //                         <IconButton size="small" onClick={() => viewEmail(email)}>
  //                           <ViewIcon fontSize="small" />
  //                         </IconButton>
  //                       </Tooltip>
  //                       <Tooltip title="Send Follow-up">
  //                         <IconButton size="small" onClick={() => prepareFollowUp(email)}>
  //                           <ReplyIcon fontSize="small" />
  //                         </IconButton>
  //                       </Tooltip>
  //                     </Box>
  //                   </TableCell>
  //                 </TableRow>
  //               ))
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>

  //       <TablePagination
  //         rowsPerPageOptions={[5, 10, 25, 50]}
  //         component="div"
  //         count={totalCount}
  //         rowsPerPage={filters.limit || 10}
  //         page={(filters.page || 1) - 1} // Convert 1-based to 0-based for MUI
  //         onPageChange={handleChangePage}
  //         onRowsPerPageChange={handleChangeRowsPerPage}
  //       />
  //     </Paper>

  //     {/* View Email Dialog */}
  //     <Dialog
  //       open={viewEmailDialog}
  //       onClose={() => setViewEmailDialog(false)}
  //       maxWidth="md"
  //       fullWidth
  //     >
  //       <DialogTitle>
  //         Email Details
  //         {selectedEmail && (
  //           <Typography variant="subtitle2" color="textSecondary">
  //             Sent on {formatDate(selectedEmail.sentAt)}
  //           </Typography>
  //         )}
  //       </DialogTitle>
  //       <DialogContent dividers>
  //         {loading ? (
  //           <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
  //             <CircularProgress />
  //           </Box>
  //         ) : (
  //           <Box>
  //             <iframe
  //               title="Email Content"
  //               srcDoc={emailContent}
  //               style={{ width: '100%', height: '500px', border: 'none' }}
  //             />
  //           </Box>
  //         )}
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={() => setViewEmailDialog(false)}>Close</Button>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           startIcon={<ReplyIcon />}
  //           onClick={() => {
  //             setViewEmailDialog(false);
  //             if (selectedEmail) {
  //               prepareFollowUp(selectedEmail);
  //             }
  //           }}
  //         >
  //           Send Follow-up
  //         </Button>
  //       </DialogActions>
  //     </Dialog>

  //     {/* Follow-up Dialog */}
  //     <Dialog
  //       open={followUpDialog}
  //       onClose={() => setFollowUpDialog(false)}
  //       maxWidth="sm"
  //       fullWidth
  //     >
  //       <DialogTitle>Send Follow-up Email</DialogTitle>
  //       <DialogContent dividers>
  //         {selectedEmail && (
  //           <Box>
  //             <Typography variant="subtitle1" gutterBottom>
  //               Original Email: {selectedEmail.subject}
  //             </Typography>
  //             <Typography variant="body2" paragraph>
  //               Sent to {selectedEmail.recipientCount} recipients on {formatDate(selectedEmail.sentAt)}
  //             </Typography>
  //             <Typography variant="body2" paragraph>
  //               You are about to create a follow-up email to the same recipients. You can modify the recipient list on the next screen.
  //             </Typography>
  //             <Alert severity="info">
  //               Follow-up emails typically have higher engagement rates. Consider referencing the original email in your subject line.
  //             </Alert>
  //           </Box>
  //         )}
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={() => setFollowUpDialog(false)}>Cancel</Button>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           startIcon={<SendIcon />}
  //           onClick={sendFollowUp}
  //         >
  //           Create Follow-up
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   </Box>
  // );
}
