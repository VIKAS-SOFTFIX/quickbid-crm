'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { mockLeads } from '@/services/mockData';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

interface CallbackRequest {
  id: string;
  mobileNumber: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  assignedTo: string;
  notes?: string;
}

// Mock data for callback requests
const mockCallbackRequests: CallbackRequest[] = [
  {
    id: '1',
    mobileNumber: '+91 98765 43210',
    status: 'scheduled',
    assignedTo: 'John Doe',
    notes: 'Interested in enterprise features',
  },
  {
    id: '2',
    mobileNumber: '+91 98765 43211',
    status: 'pending',
    assignedTo: 'Jane Smith',
    notes: 'Looking for bulk pricing',
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
} as const;

export default function CallbackRequestsPage() {
  const router = useRouter();
  const theme = useTheme();
  const [requests, setRequests] = useState<CallbackRequest[]>(mockCallbackRequests);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CallbackRequest | null>(null);
  const [filters, setFilters] = useState({
    status: '',
  });

  const handleOpen = (request?: CallbackRequest) => {
    setSelectedRequest(request || null);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRequest(null);
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
    handleClose();
  };

  const handleRowClick = (request: CallbackRequest) => {
    router.push(`/callback-requests/${request.id}`);
  };

  const handleEditClick = (request: CallbackRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/callback-requests/${request.id}`);
  };

  const filteredRequests = requests.filter(request => {
    if (filters.status && request.status !== filters.status) return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Call Requests</Typography>
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
          Schedule Call
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
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
      </Grid>

      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 32, 74, 0.1)',
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow 
                key={request.id}
                onClick={() => handleRowClick(request)}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                  cursor: 'pointer',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2">{request.mobileNumber}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{request.assignedTo}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={statusColors[request.status]}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Tooltip title="Call Now">
                      <IconButton 
                        size="small"
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
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
        }}
      >
        <DialogTitle>
          {selectedRequest ? 'Update Call Request' : 'Add Call Request'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Mobile Number"
              name="mobileNumber"
              fullWidth
              defaultValue={selectedRequest?.mobileNumber}
              placeholder="+91 98765 43210"
              helperText="Enter 10-digit mobile number with country code"
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
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedRequest?.notes}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
              }}
            >
              {selectedRequest ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 