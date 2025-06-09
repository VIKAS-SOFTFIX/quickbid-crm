'use client';

import { useState } from 'react';
import { Box, Container, Typography, Alert, useTheme, alpha } from '@mui/material';
import EnterpriseRequestForm, { EnterpriseRequestData } from '@/components/enterprise/EnterpriseRequestForm';

export default function EnterpriseRequestPage() {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle form submission
  const handleSubmit = (formData: EnterpriseRequestData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Submitted form data:', formData);
      
      // Simulate successful submission
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // In a real application, you would send this data to your backend
      // and handle success/error accordingly
    }, 1500);
  };
  
  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textFillColor: 'transparent',
            }}
          >
            Enterprise Subscription Request
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Need a custom solution for your organization? Fill out the form below to request an enterprise subscription with tailored features and pricing.
          </Typography>
        </Box>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        {submitSuccess ? (
          <Alert 
            severity="success" 
            variant="outlined"
            sx={{ 
              p: 4, 
              borderRadius: 3,
              borderColor: theme.palette.success.main,
              backgroundColor: alpha(theme.palette.success.main, 0.05),
              mb: 3,
              '& .MuiAlert-icon': {
                fontSize: '2rem',
              }
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: theme.palette.success.dark }}>
                Request Submitted Successfully!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Thank you for your interest in our enterprise solution. Our team will review your request and get back to you within 24-48 business hours.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A confirmation email has been sent to your provided email address with details about your request.
              </Typography>
            </Box>
          </Alert>
        ) : (
          <EnterpriseRequestForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Container>
    </Box>
  );
} 