'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
  useTheme,
  alpha,
  Divider,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Storage as StorageIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

// GSTIN validation regex
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Indian states for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

interface EnterpriseRequestFormProps {
  onSubmit: (formData: EnterpriseRequestData) => void;
  isSubmitting?: boolean;
}

export interface EnterpriseRequestData {
  // Business Requirements
  numberOfCompanies: number;
  numberOfDevices: number;
  numberOfTenders: number;
  storageSpace?: number;
  aiQueries?: number;
  
  // Company Information
  companyName: string;
  email: string;
  phoneNumber: string;
  gstin: string;
  
  // Billing Information
  state: string;
  city: string;
  billingAddress: string;
  
  // Metadata
  createdAt?: string;
  status?: 'pending' | 'offer_sent' | 'follow_up' | 'negotiation' | 'converted' | 'rejected';
}

export default function EnterpriseRequestForm({ onSubmit, isSubmitting = false }: EnterpriseRequestFormProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState<EnterpriseRequestData>({
    numberOfCompanies: 1,
    numberOfDevices: 5,
    numberOfTenders: 10,
    storageSpace: 100,
    aiQueries: 1000,
    companyName: '',
    email: '',
    phoneNumber: '',
    gstin: '',
    state: '',
    city: '',
    billingAddress: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const steps = ['Business Requirements', 'Company Information', 'Billing Information', 'Review'];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      // Business Requirements validation
      if (!formData.numberOfCompanies || formData.numberOfCompanies <= 0) {
        newErrors.numberOfCompanies = 'Number of companies is required and must be positive';
      }
      if (!formData.numberOfDevices || formData.numberOfDevices <= 0) {
        newErrors.numberOfDevices = 'Number of devices is required and must be positive';
      }
      if (!formData.numberOfTenders || formData.numberOfTenders <= 0) {
        newErrors.numberOfTenders = 'Number of tenders is required and must be positive';
      }
      if (formData.storageSpace !== undefined && formData.storageSpace < 0) {
        newErrors.storageSpace = 'Storage space must be positive';
      }
      if (formData.aiQueries !== undefined && formData.aiQueries < 0) {
        newErrors.aiQueries = 'Number of AI queries must be positive';
      }
    } else if (step === 1) {
      // Company Information validation
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!EMAIL_REGEX.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.gstin) {
        newErrors.gstin = 'GSTIN is required';
      } else if (!GSTIN_REGEX.test(formData.gstin)) {
        newErrors.gstin = 'Invalid GSTIN format';
      }
    } else if (step === 2) {
      // Billing Information validation
      if (!formData.state) {
        newErrors.state = 'State is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.billingAddress.trim()) {
        newErrors.billingAddress = 'Billing address is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      setFormSubmitted(true);
      onSubmit({
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
    }
  };
  
  const renderStepContent = (step: number) => {
    if (!mounted) {
      return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
    }
    
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Business Requirements
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Number of Companies"
                  name="numberOfCompanies"
                  type="number"
                  value={formData.numberOfCompanies}
                  onChange={handleChange}
                  error={!!errors.numberOfCompanies}
                  helperText={errors.numberOfCompanies}
                  InputProps={{
                    inputProps: { min: 1 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Number of Devices"
                  name="numberOfDevices"
                  type="number"
                  value={formData.numberOfDevices}
                  onChange={handleChange}
                  error={!!errors.numberOfDevices}
                  helperText={errors.numberOfDevices}
                  InputProps={{
                    inputProps: { min: 1 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <StorageIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Number of Tenders"
                  name="numberOfTenders"
                  type="number"
                  value={formData.numberOfTenders}
                  onChange={handleChange}
                  error={!!errors.numberOfTenders}
                  helperText={errors.numberOfTenders}
                  InputProps={{ 
                    inputProps: { min: 1 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Storage Space (GB)"
                  name="storageSpace"
                  type="number"
                  value={formData.storageSpace || ''}
                  onChange={handleChange}
                  error={!!errors.storageSpace}
                  helperText={errors.storageSpace}
                  InputProps={{ 
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Number of AI Queries"
                  name="aiQueries"
                  type="number"
                  value={formData.aiQueries || ''}
                  onChange={handleChange}
                  error={!!errors.aiQueries}
                  helperText={errors.aiQueries}
                  InputProps={{ 
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Company Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="GSTIN"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  error={!!errors.gstin}
                  helperText={errors.gstin || "Format: 2 digits + 5 letters + 4 digits + 1 letter + 1 letter/digit + Z + 1 letter/digit"}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Billing Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.state}>
                  <InputLabel id="state-label">State *</InputLabel>
                  <Select
                    labelId="state-label"
                    name="state"
                    value={formData.state}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                    label="State *"
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {INDIAN_STATES.map(state => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                  {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Billing Address"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  error={!!errors.billingAddress}
                  helperText={errors.billingAddress}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review Your Information
            </Typography>
            
            <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mt: 2, mb: 1 }}>
              Business Requirements
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Number of Companies:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.numberOfCompanies}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Number of Devices:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.numberOfDevices}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Number of Tenders:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.numberOfTenders}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Storage Space:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.storageSpace || 'Not specified'} {formData.storageSpace ? 'GB' : ''}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">AI Queries:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.aiQueries || 'Not specified'}</Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mt: 2, mb: 1 }}>
              Company Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Company Name:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.companyName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Email:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Phone Number:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.phoneNumber || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">GSTIN:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.gstin}</Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mt: 2, mb: 1 }}>
              Billing Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">State:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.state}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">City:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.city}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Billing Address:</Typography>
                <Typography variant="body1" fontWeight={500}>{formData.billingAddress}</Typography>
              </Grid>
            </Grid>
            
            {formSubmitted && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Your enterprise request has been submitted successfully!
              </Alert>
            )}
          </Box>
        );
      default:
        return null;
    }
  };
  
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
      <Box sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Enterprise Subscription Request
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Please provide your details to request an enterprise subscription
        </Typography>
      </Box>
      
      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          pt: 3, 
          px: { xs: 2, sm: 4 },
          '& .MuiStepLabel-label': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }
        }}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent(activeStep)}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || formSubmitted}
              startIcon={formSubmitted ? <CheckIcon /> : undefined}
            >
              {isSubmitting ? 'Submitting...' : formSubmitted ? 'Submitted' : 'Submit Request'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
} 