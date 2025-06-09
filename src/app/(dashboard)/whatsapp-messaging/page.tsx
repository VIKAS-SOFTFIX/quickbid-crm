'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Description as TemplateIcon,
  PersonSearch as PersonSearchIcon,
} from '@mui/icons-material';
import { API_CONFIG } from '@/config/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`whatsapp-tabpanel-${index}`}
      aria-labelledby={`whatsapp-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Message {
  id: string;
  type: 'sent' | 'received';
  content: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount?: number;
}

interface Template {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
}

export default function WhatsAppMessagingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [alertOpen, setAlertOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock leads data
  const mockLeads = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      company: 'Tech Solutions Pvt Ltd',
      source: 'website',
      status: 'new',
      priority: 'high',
      assignedTo: 'sales1',
      notes: [
        {
          id: '1',
          leadId: '1',
          content: 'Interested in enterprise plan',
          createdBy: 'sales1',
          createdAt: '2024-03-25T10:00:00Z',
          type: 'note'
        }
      ],
      createdAt: '2024-03-25T10:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 98765 43211',
      company: 'Digital Marketing Agency',
      source: 'google_ads',
      status: 'contacted',
      priority: 'medium',
      assignedTo: 'sales2',
      notes: [
        {
          id: '4',
          leadId: '2',
          content: 'Looking for bulk pricing',
          createdBy: 'sales2',
          createdAt: '2024-03-24T09:00:00Z',
          type: 'note'
        }
      ],
      createdAt: '2024-03-24T09:00:00Z'
    }
  ];

  // Mock templates data
  const mockTemplates = [
    {
      id: '1',
      name: 'welcome_message',
      status: 'approved',
      category: 'MARKETING',
      language: 'en'
    },
    {
      id: '2',
      name: 'appointment_reminder',
      status: 'approved',
      category: 'UTILITY',
      language: 'en'
    },
    {
      id: '3',
      name: 'demo_confirmation',
      status: 'approved',
      category: 'UTILITY',
      language: 'en'
    }
  ];

  useEffect(() => {
    // Initialize contacts from leads
    const leadContacts = mockLeads.map(lead => ({
      id: lead.id,
      name: lead.name,
      phone: lead.phone || '',
      lastMessage: {
        content: 'No messages yet',
        timestamp: new Date()
      },
      unreadCount: 0
    })).filter(contact => contact.phone);
    
    setContacts(leadContacts);
    
    // Set mock templates
    setTemplates(mockTemplates);
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would be an API call
      setTemplates(mockTemplates);
      return mockTemplates;
    } catch (error) {
      console.error('Error loading templates:', error);
      showAlert('Failed to load WhatsApp templates', 'error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !phoneNumber.trim()) return;
    
    try {
      setSendingMessage(true);
      
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Sending message to:', formattedPhone);
      console.log('Message content:', messageInput);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to messages
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'sent',
        content: messageInput,
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages([...messages, newMessage]);
      setMessageInput('');
      showAlert('Message sent successfully', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showAlert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendTemplate = async () => {
    if (!selectedTemplate || !phoneNumber.trim()) return;
    
    try {
      setSendingMessage(true);
      
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Sending template to:', formattedPhone);
      
      const template = templates.find(t => t.name === selectedTemplate);
      
      if (!template) {
        showAlert('Selected template not found', 'error');
        return;
      }
      
      console.log('Using template:', template);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to messages
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'sent',
        content: `Template: ${template.name}`,
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages([...messages, newMessage]);
      showAlert('Template message sent successfully', 'success');
    } catch (error) {
      console.error('Error sending template message:', error);
      showAlert(`Failed to send template message: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setPhoneNumber(contact.phone);
    
    // In a real app, you would fetch messages for this contact
    // For now, we'll use mock messages
    const mockContactMessages: Message[] = [
      {
        id: '1',
        type: 'received',
        content: 'Hello, I\'m interested in your product',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: '2',
        type: 'sent',
        content: 'Thank you for your interest! How can I help you?',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: '3',
        type: 'received',
        content: 'Can you tell me more about pricing?',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];
    
    setMessages(mockContactMessages);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-numeric characters except the + sign at the beginning
    let cleaned = phone.trim();
    
    // If it starts with +, remove it as WhatsApp API doesn't need it
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    
    // Remove any remaining non-numeric characters
    cleaned = cleaned.replace(/\D/g, '');
    
    // Debug the phone number being sent
    console.log('Formatted phone number:', cleaned);
    
    return cleaned;
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleTestWebhook = async () => {
    try {
      setLoading(true);
      
      if (!phoneNumber.trim()) {
        showAlert('Please enter your phone number to test the webhook', 'error');
        return;
      }
      
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showAlert('Webhook test message sent successfully', 'success');
    } catch (error) {
      console.error('Error testing webhook:', error);
      showAlert(`Failed to test webhook: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGetWebhookStatus = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showAlert('Webhook is configured and active', 'success');
    } catch (error) {
      console.error('Error getting webhook status:', error);
      showAlert(`Failed to get webhook status: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWebhookSetup = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showAlert('Webhook setup completed successfully', 'success');
    } catch (error) {
      console.error('Error setting up webhook:', error);
      showAlert(`Failed to set up webhook: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 3, px: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          <WhatsAppIcon sx={{ color: '#25D366', mr: 1, verticalAlign: 'middle' }} />
          WhatsApp Messaging
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={async () => {
            try {
              setLoading(true);
              showAlert('Testing WhatsApp API connection...', 'success');
              
              // First try to get templates to verify API connection
              const templates = await loadTemplates();
              console.log('WhatsApp templates response:', templates);
              
              // Log API configuration for debugging
              console.log('WhatsApp Phone Number ID:', API_CONFIG.meta.whatsappPhoneNumberId);
              console.log('WhatsApp Business ID:', API_CONFIG.meta.whatsappBusinessId);
              console.log('Access Token (partial):', API_CONFIG.meta.accessToken.substring(0, 10) + '...');
              
              if (templates && Array.isArray(templates)) {
                showAlert(`Connection successful! Found ${templates.length} templates.`, 'success');
              } else {
                showAlert('Connection successful but no templates found.', 'success');
              }
            } catch (error) {
              console.error('API Test Error:', error);
              showAlert(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
            } finally {
              setLoading(false);
            }
          }}
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
        >
          Test Connection
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="WhatsApp messaging tabs"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Send Message" icon={<MessageIcon />} iconPosition="start" />
        <Tab label="Templates" icon={<TemplateIcon />} iconPosition="start" />
        <Tab label="Contacts" icon={<PersonSearchIcon />} iconPosition="start" />
        <Tab label="Webhook Setup" icon={<RefreshIcon />} iconPosition="start" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, height: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contacts
                <IconButton size="small" onClick={() => {}} sx={{ ml: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </Typography>
              
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search contacts..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                <Stack spacing={1}>
                  {filteredContacts.map((contact) => (
                    <Card 
                      key={contact.id} 
                      variant="outlined" 
                      sx={{ 
                        cursor: 'pointer', 
                        bgcolor: selectedContact?.id === contact.id ? 'action.selected' : 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' } 
                      }}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">{contact.name}</Typography>
                          {contact.unreadCount ? (
                            <Chip 
                              label={contact.unreadCount} 
                              size="small" 
                              color="primary" 
                              sx={{ height: 20, minWidth: 20 }} 
                            />
                          ) : null}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {contact.phone}
                        </Typography>
                        {contact.lastMessage && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                              display: 'block', 
                              mt: 1, 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis' 
                            }}
                          >
                            {contact.lastMessage.content}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredContacts.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      No contacts found
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper elevation={0} variant="outlined" sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                {selectedContact ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6">{selectedContact.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        <PhoneIcon fontSize="small" sx={{ mr: 0.5, fontSize: 14, verticalAlign: 'middle' }} />
                        {selectedContact.phone}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label="Recipient Phone Number"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </Box>
              
              <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto', bgcolor: '#F5F5F5' }}>
                {messages.length > 0 ? (
                  <Stack spacing={2}>
                    {messages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.type === 'sent' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            borderRadius: 2,
                            bgcolor: message.type === 'sent' ? '#DCF8C6' : '#FFFFFF',
                          }}
                        >
                          <Typography variant="body2">{message.content}</Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {message.type === 'sent' && message.status && (
                              <span style={{ marginLeft: 4 }}>
                                {message.status === 'read' ? '✓✓' : '✓'}
                              </span>
                            )}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {phoneNumber ? 'No messages yet. Start the conversation!' : 'Enter a phone number to start messaging'}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={!phoneNumber || sendingMessage}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim() || !phoneNumber || sendingMessage}
                            color="primary"
                          >
                            {sendingMessage ? <CircularProgress size={24} /> : <SendIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Send Template Message
                <IconButton size="small" onClick={loadTemplates} sx={{ ml: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </Typography>
              
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Recipient Phone Number"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControl fullWidth>
                  <InputLabel id="template-select-label">Select Template</InputLabel>
                  <Select
                    labelId="template-select-label"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    label="Select Template"
                  >
                    {templates.map((template) => (
                      <MenuItem key={template.id} value={template.name}>
                        {template.name} ({template.language})
                      </MenuItem>
                    ))}
                    {templates.length === 0 && (
                      <MenuItem disabled value="">
                        {loading ? 'Loading templates...' : 'No templates available'}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
                
                <Button
                  variant="contained"
                  startIcon={sendingMessage ? <CircularProgress size={20} /> : <SendIcon />}
                  disabled={!selectedTemplate || !phoneNumber || sendingMessage}
                  onClick={handleSendTemplate}
                  fullWidth
                >
                  {sendingMessage ? 'Sending...' : 'Send Template Message'}
                </Button>
              </Stack>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Available Templates</Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {templates.length > 0 ? (
                    <Grid container spacing={2}>
                      {templates.map((template) => (
                        <Grid item xs={12} sm={6} key={template.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1">{template.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Language: {template.language}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip 
                                  label={template.status} 
                                  size="small" 
                                  color={template.status === 'APPROVED' ? 'success' : 'warning'}
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={template.category} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <Typography color="text.secondary">
                        No templates available. Templates need to be created in the Meta Business Manager.
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => window.open('https://business.facebook.com/', '_blank')}
                      >
                        Go to Meta Business Manager
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Manage Contacts</Typography>
                <TextField
                  placeholder="Search contacts..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 300 }}
                />
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {filteredContacts.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredContacts.map((contact) => (
                    <Grid item xs={12} sm={6} md={4} key={contact.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1">{contact.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            <PhoneIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            {contact.phone}
                          </Typography>
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<WhatsAppIcon />}
                              onClick={() => {
                                setPhoneNumber(contact.phone);
                                setSelectedContact(contact);
                                setActiveTab(0);
                              }}
                            >
                              Message
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography color="text.secondary">No contacts found</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Webhook Configuration</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Webhook URL
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={window.location.origin + '/api/webhook/whatsapp'}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + '/api/webhook/whatsapp');
                            showAlert('Webhook URL copied to clipboard', 'success');
                          }}
                        >
                          <IconButton size="small">
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  This is the URL you need to register in the Meta Developer Portal
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Verify Token
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Enter your webhook verify token"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  This token should match the WHATSAPP_VERIFY_TOKEN in your environment variables
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                onClick={handleWebhookSetup}
                startIcon={loading ? <CircularProgress size={20} /> : undefined}
                disabled={loading}
              >
                Update Webhook Subscription
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Test Webhook Connection</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Your WhatsApp Number
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Enter your WhatsApp number with country code"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  We'll send a test message to this number. Reply to test incoming messages.
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                onClick={handleTestWebhook}
                startIcon={loading ? <CircularProgress size={20} /> : undefined}
                disabled={loading}
                sx={{ mr: 2 }}
              >
                Send Test Message
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleGetWebhookStatus}
                startIcon={loading ? <CircularProgress size={20} /> : undefined}
                disabled={loading}
              >
                Check Webhook Status
              </Button>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Troubleshooting Steps:
                </Typography>
                <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
                  <li>Verify your webhook URL is publicly accessible</li>
                  <li>Ensure the verify token matches your environment variable</li>
                  <li>Check that you've subscribed to the 'messages' webhook field</li>
                  <li>Confirm your access token has the 'whatsapp_business_messaging' permission</li>
                  <li>Review server logs for incoming webhook requests</li>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 