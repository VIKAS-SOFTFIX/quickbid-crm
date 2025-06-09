'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Container, Alert, useTheme, alpha } from '@mui/material';
import EnterpriseRequestList from '@/components/enterprise/EnterpriseRequestList';
import EnterpriseRequestDetail from '@/components/enterprise/EnterpriseRequestDetail';
import { EnterpriseRequestData } from '@/components/enterprise/EnterpriseRequestForm';
import { StatusHistoryItem } from '@/components/enterprise/EnterpriseRequestDetail';

// Sample data - In a real app, this would come from an API
const SAMPLE_REQUESTS: EnterpriseRequestData[] = [
  {
    numberOfCompanies: 3,
    numberOfDevices: 25,
    numberOfTenders: 50,
    storageSpace: 500,
    aiQueries: 10000,
    companyName: 'Acme Technologies',
    email: 'procurement@acmetech.com',
    phoneNumber: '+91 9876543210',
    gstin: '27AADCB2230M1ZT',
    state: 'Maharashtra',
    city: 'Mumbai',
    billingAddress: '123 Business Park, Andheri East, Mumbai, 400069',
    createdAt: '2023-06-15T10:30:00.000Z',
    status: 'offer_sent',
  },
  {
    numberOfCompanies: 1,
    numberOfDevices: 10,
    numberOfTenders: 20,
    storageSpace: 200,
    aiQueries: 5000,
    companyName: 'Global Solutions Ltd',
    email: 'info@globalsolutions.com',
    phoneNumber: '+91 8765432109',
    gstin: '29AAGCG1234A1ZK',
    state: 'Karnataka',
    city: 'Bangalore',
    billingAddress: '456 Tech Park, Whitefield, Bangalore, 560066',
    createdAt: '2023-06-20T14:45:00.000Z',
    status: 'pending',
  },
  {
    numberOfCompanies: 5,
    numberOfDevices: 50,
    numberOfTenders: 100,
    storageSpace: 1000,
    aiQueries: 20000,
    companyName: 'Reliance Industries',
    email: 'procurement@ril.com',
    phoneNumber: '+91 7654321098',
    gstin: '27AAACR5055K1ZK',
    state: 'Maharashtra',
    city: 'Mumbai',
    billingAddress: 'Maker Chambers IV, Nariman Point, Mumbai, 400021',
    createdAt: '2023-06-25T09:15:00.000Z',
    status: 'negotiation',
  },
  {
    numberOfCompanies: 2,
    numberOfDevices: 15,
    numberOfTenders: 30,
    storageSpace: 300,
    aiQueries: 8000,
    companyName: 'TechStar Solutions',
    email: 'business@techstar.in',
    phoneNumber: '+91 6543210987',
    gstin: '06AABCT3518Q1ZV',
    state: 'Haryana',
    city: 'Gurugram',
    billingAddress: '789 Cyber City, Sector 54, Gurugram, 122001',
    createdAt: '2023-07-01T11:20:00.000Z',
    status: 'follow_up',
  },
  {
    numberOfCompanies: 10,
    numberOfDevices: 100,
    numberOfTenders: 200,
    storageSpace: 2000,
    aiQueries: 50000,
    companyName: 'Tata Consultancy Services',
    email: 'procurement@tcs.com',
    phoneNumber: '+91 5432109876',
    gstin: '27AABCT3518Q1ZT',
    state: 'Maharashtra',
    city: 'Mumbai',
    billingAddress: 'TCS House, Raveline Street, Fort, Mumbai, 400001',
    createdAt: '2023-07-05T16:30:00.000Z',
    status: 'converted',
  },
  {
    numberOfCompanies: 4,
    numberOfDevices: 40,
    numberOfTenders: 80,
    storageSpace: 800,
    aiQueries: 15000,
    companyName: 'Infosys Limited',
    email: 'procurement@infosys.com',
    phoneNumber: '+91 4321098765',
    gstin: '29AAACI4741P1ZT',
    state: 'Karnataka',
    city: 'Bangalore',
    billingAddress: 'Electronics City, Hosur Road, Bangalore, 560100',
    createdAt: '2023-07-10T13:45:00.000Z',
    status: 'rejected',
  },
];

// Sample status history data
const SAMPLE_STATUS_HISTORY: Record<string, StatusHistoryItem[]> = {
  '27AADCB2230M1ZT': [
    {
      status: 'pending',
      timestamp: '2023-06-15T10:30:00.000Z',
      notes: 'Initial request received',
    },
    {
      status: 'offer_sent',
      timestamp: '2023-06-17T14:20:00.000Z',
      notes: 'Sent initial offer with standard enterprise pricing',
      discount: 10,
    },
  ],
  '29AAGCG1234A1ZK': [
    {
      status: 'pending',
      timestamp: '2023-06-20T14:45:00.000Z',
      notes: 'Initial request received',
    },
  ],
  '27AAACR5055K1ZK': [
    {
      status: 'pending',
      timestamp: '2023-06-25T09:15:00.000Z',
      notes: 'Initial request received',
    },
    {
      status: 'offer_sent',
      timestamp: '2023-06-26T11:30:00.000Z',
      notes: 'Sent custom enterprise pricing based on volume',
      discount: 15,
    },
    {
      status: 'follow_up',
      timestamp: '2023-06-30T10:15:00.000Z',
      notes: 'Scheduled follow-up call to discuss offer details',
      followUpDate: '2023-07-05T14:00:00.000Z',
    },
    {
      status: 'negotiation',
      timestamp: '2023-07-05T15:30:00.000Z',
      notes: 'Client requested additional discount for 3-year commitment',
    },
  ],
  '06AABCT3518Q1ZV': [
    {
      status: 'pending',
      timestamp: '2023-07-01T11:20:00.000Z',
      notes: 'Initial request received',
    },
    {
      status: 'offer_sent',
      timestamp: '2023-07-02T13:45:00.000Z',
      notes: 'Sent standard enterprise pricing',
      discount: 8,
    },
    {
      status: 'follow_up',
      timestamp: '2023-07-07T09:30:00.000Z',
      notes: 'No response yet, scheduling follow-up',
      followUpDate: '2023-07-12T11:00:00.000Z',
    },
  ],
  '27AABCT3518Q1ZT': [
    {
      status: 'pending',
      timestamp: '2023-07-05T16:30:00.000Z',
      notes: 'Initial request received',
    },
    {
      status: 'offer_sent',
      timestamp: '2023-07-06T10:15:00.000Z',
      notes: 'Sent premium enterprise package with volume discount',
      discount: 20,
    },
    {
      status: 'follow_up',
      timestamp: '2023-07-10T14:30:00.000Z',
      notes: 'Client requested clarification on API limits',
      followUpDate: '2023-07-15T10:00:00.000Z',
    },
    {
      status: 'negotiation',
      timestamp: '2023-07-15T11:45:00.000Z',
      notes: 'Discussed custom SLA and support requirements',
    },
    {
      status: 'converted',
      timestamp: '2023-07-20T15:00:00.000Z',
      notes: 'Client accepted offer with premium support package',
    },
  ],
  '29AAACI4741P1ZT': [
    {
      status: 'pending',
      timestamp: '2023-07-10T13:45:00.000Z',
      notes: 'Initial request received',
    },
    {
      status: 'offer_sent',
      timestamp: '2023-07-11T10:30:00.000Z',
      notes: 'Sent standard enterprise pricing',
      discount: 10,
    },
    {
      status: 'follow_up',
      timestamp: '2023-07-15T13:00:00.000Z',
      notes: 'Client requested information about security features',
      followUpDate: '2023-07-18T11:00:00.000Z',
    },
    {
      status: 'rejected',
      timestamp: '2023-07-22T14:15:00.000Z',
      notes: 'Client chose competitor solution due to existing relationship',
    },
  ],
};

export default function EnterpriseDashboardPage() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<EnterpriseRequestData[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
    
    // Simulate API fetch
    setTimeout(() => {
      setRequests(SAMPLE_REQUESTS);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Get selected request
  const selectedRequest = requests.find(request => request.gstin === selectedRequestId);
  
  // Handle viewing a request
  const handleViewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
  };
  
  // Handle going back to the list
  const handleBackToList = () => {
    setSelectedRequestId(null);
  };
  
  // Handle refreshing the list
  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API fetch
    setTimeout(() => {
      setRequests(SAMPLE_REQUESTS);
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle updating a request status
  const handleUpdateStatus = (
    requestId: string,
    status: EnterpriseRequestData['status'],
    notes: string,
    discount?: number,
    followUpDate?: string
  ) => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update the request
      const updatedRequests = requests.map(request => {
        if (request.gstin === requestId) {
          return { ...request, status };
        }
        return request;
      });
      
      setRequests(updatedRequests);
      
      // Update status history (in a real app, this would be handled by the backend)
      const timestamp = new Date().toISOString();
      
      if (!SAMPLE_STATUS_HISTORY[requestId]) {
        SAMPLE_STATUS_HISTORY[requestId] = [];
      }
      
      SAMPLE_STATUS_HISTORY[requestId].push({
        status,
        timestamp,
        notes,
        discount,
        followUpDate,
      });
      
      setIsUpdating(false);
    }, 1000);
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Container maxWidth="xl">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {!selectedRequestId ? (
          <EnterpriseRequestList
            requests={requests}
            onViewRequest={handleViewRequest}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        ) : selectedRequest ? (
          <EnterpriseRequestDetail
            request={selectedRequest}
            onBack={handleBackToList}
            onUpdateStatus={handleUpdateStatus}
            statusHistory={SAMPLE_STATUS_HISTORY[selectedRequest.gstin] || []}
            isUpdating={isUpdating}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              Request not found
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
} 