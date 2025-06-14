import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  Collapse,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  alpha,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

interface EmailAccountDialogProps {
  open: boolean;
  onClose: () => void;
  editingAccount: string | null;
  newAccountData: {
    name: string;
    email: string;
    password: string;
    smtpHost: string;
    smtpPort: string;
    imapHost: string;
    imapPort: string;
    useSsl: boolean;
    provider: string;
  };
  setNewAccountData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    smtpHost: string;
    smtpPort: string;
    imapHost: string;
    imapPort: string;
    useSsl: boolean;
    provider: string;
  }>>;
  serverConfigExpanded: boolean;
  handleToggleServerConfig: () => void;
  handleAddAccount: () => void;
}

const EmailAccountDialog: React.FC<EmailAccountDialogProps> = ({
  open,
  onClose,
  editingAccount,
  newAccountData,
  setNewAccountData,
  serverConfigExpanded,
  handleToggleServerConfig,
  handleAddAccount,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAccountData({
      ...newAccountData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewAccountData({
        ...newAccountData,
        [name]: value,
      });
      
      // Auto-fill server settings based on provider
      if (name === 'provider') {
        let smtpHost = '';
        let smtpPort = '587';
        let imapHost = '';
        let imapPort = '993';
        let useSsl = true;
        
        switch (value) {
          case 'gmail':
            smtpHost = 'smtp.gmail.com';
            imapHost = 'imap.gmail.com';
            break;
          case 'outlook':
            smtpHost = 'smtp.office365.com';
            imapHost = 'outlook.office365.com';
            break;
          case 'yahoo':
            smtpHost = 'smtp.mail.yahoo.com';
            imapHost = 'imap.mail.yahoo.com';
            break;
          case 'godaddy':
            smtpHost = 'smtpout.secureserver.net';
            imapHost = 'imap.secureserver.net';
            break;
          case 'zoho':
            smtpHost = 'smtp.zoho.com';
            imapHost = 'imap.zoho.com';
            break;
          case 'aol':
            smtpHost = 'smtp.aol.com';
            imapHost = 'imap.aol.com';
            break;
          default:
            // Custom provider, don't change settings
            break;
        }
        
        if (value !== 'custom') {
          setNewAccountData(prev => ({
            ...prev,
            provider: value as string,
            smtpHost,
            smtpPort,
            imapHost,
            imapPort,
            useSsl,
          }));
          
          // Expand server config section when provider is selected
          if (!serverConfigExpanded) {
            handleToggleServerConfig();
          }
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
        {editingAccount ? 'Edit Email Account' : 'Add New Email Account'}
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: 'background.paper' }}>
        <Box sx={{ p: 1 }}>
          <TextField 
            fullWidth 
            label="Account Name" 
            name="name"
            variant="outlined"
            size="small" 
            sx={{ mb: 2 }}
            value={newAccountData.name}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: 'text.secondary' }
            }}
          />
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="provider-label">Email Provider</InputLabel>
            <Select
              labelId="provider-label"
              name="provider"
              value={newAccountData.provider || ''}
              label="Email Provider"
              onChange={handleSelectChange as any}
            >
              <MenuItem value="gmail">Gmail</MenuItem>
              <MenuItem value="outlook">Outlook / Office 365</MenuItem>
              <MenuItem value="yahoo">Yahoo Mail</MenuItem>
              <MenuItem value="godaddy">GoDaddy</MenuItem>
              <MenuItem value="zoho">Zoho Mail</MenuItem>
              <MenuItem value="aol">AOL Mail</MenuItem>
              <MenuItem value="custom">Custom Provider</MenuItem>
            </Select>
          </FormControl>
          
          <TextField 
            fullWidth 
            label="Email Address" 
            name="email"
            variant="outlined"
            size="small" 
            sx={{ mb: 2 }}
            value={newAccountData.email}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: 'text.secondary' }
            }}
          />
          
          <TextField 
            fullWidth 
            label="Password" 
            name="password"
            type="password"
            variant="outlined"
            size="small" 
            sx={{ mb: 2 }}
            value={newAccountData.password}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: 'text.secondary' }
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Button 
              onClick={handleToggleServerConfig} 
              variant="outlined" 
              size="small" 
              fullWidth
              color="primary"
              endIcon={serverConfigExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              Server Configuration
            </Button>
          </Box>
          
          <Collapse in={serverConfigExpanded}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary', fontWeight: 'medium' }}>
                Outgoing Mail Server (SMTP)
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField 
                    fullWidth 
                    label="SMTP Host" 
                    name="smtpHost"
                    placeholder="smtp.example.com"
                    variant="outlined"
                    size="small" 
                    sx={{ mb: 2 }}
                    value={newAccountData.smtpHost}
                    onChange={handleChange}
                    InputLabelProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField 
                    fullWidth 
                    label="Port" 
                    name="smtpPort"
                    placeholder="587"
                    variant="outlined"
                    size="small" 
                    sx={{ mb: 2 }}
                    value={newAccountData.smtpPort}
                    onChange={handleChange}
                    InputLabelProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary', fontWeight: 'medium' }}>
                Incoming Mail Server (IMAP)
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField 
                    fullWidth 
                    label="IMAP Host" 
                    name="imapHost"
                    placeholder="imap.example.com"
                    variant="outlined"
                    size="small" 
                    sx={{ mb: 2 }}
                    value={newAccountData.imapHost}
                    onChange={handleChange}
                    InputLabelProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField 
                    fullWidth 
                    label="Port" 
                    name="imapPort"
                    placeholder="993"
                    variant="outlined"
                    size="small" 
                    sx={{ mb: 2 }}
                    value={newAccountData.imapPort}
                    onChange={handleChange}
                    InputLabelProps={{
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </Grid>
              </Grid>
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={newAccountData.useSsl}
                    onChange={handleChange}
                    name="useSsl"
                    color="primary"
                  />
                }
                label="Use SSL/TLS"
                sx={{ color: 'text.primary' }}
              />
            </Paper>
          </Collapse>
          
          <Typography variant="caption" color="text.secondary">
            Your credentials will be securely stored and used to connect to your email provider.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleAddAccount}
          disabled={!newAccountData.name || !newAccountData.email || !newAccountData.password}
        >
          {editingAccount ? 'Update Account' : 'Add Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailAccountDialog; 