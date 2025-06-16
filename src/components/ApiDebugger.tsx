import { useState } from 'react';
import { Box, Button, Typography, Paper, TextField } from '@mui/material';
import axios from 'axios';

export default function ApiDebugger() {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('https://api.quickbid.co.in/support/api/demos');

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.get(url);
      console.log('API Response:', result.data);
      setResponse(result.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createDemoRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const demoData = {
        name: "Test User",
        email: "test@example.com",
        mobile: "+1234567890",
        businessName: "Test Company",
        preferredDate: "2023-06-15T10:00:00.000Z",
        preferredTime: "10:00 AM",
        priority: "medium",
        interestedIn: "Product Demo",
        services: ["Web App", "Mobile App"],
        industry: "Technology",
        notes: "Looking for a quick demonstration",
        requirements: "Need to understand key features"
      };
      
      const result = await axios.post(url, demoData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Create Demo Response:', result.data);
      setResponse(result.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>API Debugger</Typography>
      
      <Box sx={{ mb: 2 }}>
        <TextField 
          fullWidth 
          label="API URL" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Button 
          variant="contained" 
          onClick={testApi} 
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? 'Testing...' : 'Test GET Request'}
        </Button>
        
        <Button
          variant="contained"
          onClick={createDemoRequest}
          disabled={loading}
          color="secondary"
        >
          {loading ? 'Creating...' : 'Create Test Demo'}
        </Button>
      </Box>
      
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {response && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Response:</Typography>
          <Box 
            component="pre" 
            sx={{ 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              overflowX: 'auto',
              maxHeight: 400,
              overflowY: 'auto'
            }}
          >
            {JSON.stringify(response, null, 2)}
          </Box>
        </Box>
      )}
    </Paper>
  );
} 