'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  TablePagination,
  Tooltip,
  useTheme,
  alpha,
  Button,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  SortByAlpha as SortIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { EnterpriseRequestData } from './EnterpriseRequestForm';

interface EnterpriseRequestListProps {
  requests: EnterpriseRequestData[];
  onViewRequest: (requestId: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
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

export default function EnterpriseRequestList({ 
  requests, 
  onViewRequest, 
  onRefresh, 
  isLoading = false 
}: EnterpriseRequestListProps) {
  const theme = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Filter and sort requests
  const filteredRequests = requests.filter(request => {
    // Apply status filter
    if (statusFilter !== 'all' && request.status !== statusFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.companyName?.toLowerCase().includes(query) ||
        request.email?.toLowerCase().includes(query) ||
        request.gstin?.toLowerCase().includes(query) ||
        request.city?.toLowerCase().includes(query) ||
        request.state?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'companyName':
        valueA = a.companyName || '';
        valueB = b.companyName || '';
        break;
      case 'numberOfCompanies':
        valueA = a.numberOfCompanies || 0;
        valueB = b.numberOfCompanies || 0;
        break;
      case 'status':
        valueA = a.status || 'pending';
        valueB = b.status || 'pending';
        break;
      case 'createdAt':
      default:
        valueA = a.createdAt || '';
        valueB = b.createdAt || '';
        break;
    }
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number) 
        : (valueB as number) - (valueA as number);
    }
  });
  
  // Apply pagination
  const paginatedRequests = sortedRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  
  if (!mounted) {
    return null;
  }
  
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Enterprise Requests
          </Typography>
          
          <Button
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={isLoading}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ 
            width: '100%',
          }}
        >
          <TextField
            placeholder="Search by company, email, or GSTIN"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
            size="small"
          />
          
          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon color="action" fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="offer_sent">Offer Sent</MenuItem>
              <MenuItem value="follow_up">Follow Up</MenuItem>
              <MenuItem value="negotiation">Negotiation</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon color="action" fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="companyName">Company Name</MenuItem>
              <MenuItem value="numberOfCompanies">Companies Count</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Date
                  <IconButton size="small" onClick={() => handleSort('createdAt')}>
                    <SortIcon 
                      fontSize="small" 
                      color={sortBy === 'createdAt' ? 'primary' : 'action'} 
                      sx={{ 
                        transform: sortBy === 'createdAt' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease-in-out'
                      }} 
                    />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Request Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1">Loading requests...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1">No enterprise requests found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((request, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.03) 
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => onViewRequest(request.gstin)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {request.companyName || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(request.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {request.numberOfCompanies} {request.numberOfCompanies === 1 ? 'Company' : 'Companies'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.numberOfDevices} Devices, {request.numberOfTenders} Tenders
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={STATUS_DISPLAY[request.status || 'pending']} 
                      color={STATUS_COLORS[request.status || 'pending']}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewRequest(request.gstin);
                        }}
                        color="primary"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
} 