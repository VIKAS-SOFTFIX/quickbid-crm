'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  useTheme,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Description as TemplateIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { WhatsAppContact, WhatsAppMessage, WhatsAppTemplate } from '@/services/whatsappService';

// Extended interfaces to match the API data structure
interface ExtendedWhatsAppContact extends Omit<WhatsAppContact, 'lastMessageAt'> {
  lastMessageAt?: string;
  lastMessage?: string;
  unreadCount?: number;
  conversationStarted?: boolean;
}

// Define a completely custom interface for the messages from the API
interface ApiWhatsAppMessage {
  _id: string;
  messageId: string;
  waId: string;
  contactId?: string;
  direction?: 'inbound' | 'outbound';
  type?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  content?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  text?: {
    body: string;
  };
  image?: {
    url?: string;
    caption?: string;
  };
  document?: {
    url?: string;
    filename?: string;
  };
  isFromMe?: boolean;
}

export default function WhatsAppMessagingPage() {
  const theme = useTheme();
  const {
    loading,
    error,
    success,
    contacts,
    selectedContact,
    messages,
    templates,
    isClient,
    fetchContacts,
    fetchTemplates,
    fetchMessages,
    sendTextMessage,
    sendTemplateMessage,
    createContact,
    testWebhook,
    selectContact,
    setError,
    setSuccess,
    addOptimisticMessage,
  } = useWhatsApp();

  // Local state
  const [tabValue, setTabValue] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [newContactDialogOpen, setNewContactDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phoneNumber: '' });
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [webhookTestDialogOpen, setWebhookTestDialogOpen] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Long polling effect for messages
  useEffect(() => {
    const startPolling = () => {
      if (!selectedContact?.waId || isPolling) return;

      setIsPolling(true);
      
      const pollMessages = async () => {
        try {
          if (selectedContact?.waId && fetchMessages) {
            await fetchMessages(selectedContact.waId);
          }
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      };

      // Initial fetch
      pollMessages();

      // Set up interval for long polling every 3 seconds (changed from 4s)
      pollingIntervalRef.current = setInterval(pollMessages, 3000);
    };

    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setIsPolling(false);
    };

    if (selectedContact?.waId) {
      startPolling();
    } else {
      stopPolling();
    }

    // Cleanup on unmount or contact change
    return () => {
      stopPolling();
    };
  }, [selectedContact?.waId, fetchMessages]);

  // Cleanup polling on component unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle sending a text message
  const handleSendMessage = async () => {
    if (!selectedContact || !messageText.trim()) return;

    try {
      // Create an optimistic message to show immediately
      const optimisticMessage: WhatsAppMessage = {
        _id: `temp-${Date.now()}`,
        messageId: `temp-${Date.now()}`,
        waId: selectedContact.waId || '',
        from: 'me',
        to: selectedContact.phoneNumber,
        type: 'text',
        text: {
          body: messageText.trim()
        },
        status: 'sent',
        timestamp: new Date().toISOString(),
        isFromMe: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add optimistic message to the UI immediately
      const messageToSend = messageText.trim();
      setMessageText('');
      
      // Add the optimistic message to the UI
      addOptimisticMessage(optimisticMessage);
      
      // Send the message to the API
      await sendTextMessage({
        phoneNumber: selectedContact.phoneNumber,
        message: messageToSend,
      });
      
      // Fetch messages after sending to sync with server
      if (selectedContact.waId && fetchMessages) {
        await fetchMessages(selectedContact.waId?.toString() || '');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Handle sending a template message
  const handleSendTemplate = async () => {
    if (!selectedContact || !selectedTemplate) return;

    try {
      // Get the template details 
      const template = templates.find(t => t.name === selectedTemplate);
      
      // Create an optimistic template message
      const optimisticMessage: WhatsAppMessage = {
        _id: `temp-${Date.now()}`,
        messageId: `temp-${Date.now()}`,
        waId: selectedContact.waId || '',
        from: 'me',
        to: selectedContact.phoneNumber,
        type: 'template',
        text: {
          body: `Template: ${selectedTemplate}`
        },
        status: 'sent',
        timestamp: new Date().toISOString(),
        isFromMe: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add optimistic message to UI
      addOptimisticMessage(optimisticMessage);
      
      // Close dialog and reset selected template
      setTemplateDialogOpen(false);
      setSelectedTemplate('');
      
      await sendTemplateMessage({
        phoneNumber: selectedContact.phoneNumber,
        templateName: selectedTemplate,
        languageCode: 'en', // Default to English
      });
      
      // Fetch messages after sending to sync with server
      if (selectedContact.waId && fetchMessages) {
        await fetchMessages(selectedContact.waId || '');
      }
    } catch (err) {
      console.error('Error sending template message:', err);
      setError('Failed to send template message. Please try again.');
    }
  };

  // Handle creating a new contact
  const handleCreateContact = async () => {
    if (!newContact.name || !newContact.phoneNumber) return;

    try {
      await createContact({
        name: newContact.name,
        phoneNumber: newContact.phoneNumber,
      });
      setNewContactDialogOpen(false);
      setNewContact({ name: '', phoneNumber: '' });
      fetchContacts();
    } catch (err) {
      console.error('Error creating contact:', err);
    }
  };

  // Handle testing the webhook
  const handleTestWebhook = async () => {
    if (!testPhoneNumber) return;

    try {
      await testWebhook(testPhoneNumber);
      setWebhookTestDialogOpen(false);
      setTestPhoneNumber('');
    } catch (err) {
      console.error('Error testing webhook:', err);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format last message time
  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins > 0) {
      return `${diffMins}m ago`;
    }
    
    return 'Just now';
  };

  // If we're server-side rendering, return a minimal placeholder
  if (!isClient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WhatsAppIcon sx={{ color: '#25D366', mr: 1, fontSize: 30 }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            WhatsApp Messaging
          </Typography>
          {isPolling && (
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="caption" color="textSecondary">
                Live
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Send and manage WhatsApp messages to your contacts
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setNewContactDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            New Contact
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={() => {
              fetchContacts();
              fetchTemplates();
              if (selectedContact?.waId && fetchMessages) {
                fetchMessages(selectedContact.waId);
              }
            }}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setWebhookTestDialogOpen(true)}
          >
            Test Webhook
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Contacts List */}
          <Grid item xs={12} md={3}>
            <Paper 
              variant="outlined" 
              sx={{ 
                height: '70vh', 
                overflow: 'auto',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <List sx={{ p: 0 }}>
                <ListItem sx={{ bgcolor: theme.palette.background.default, position: 'sticky', top: 0, zIndex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Contacts ({contacts.length})
                  </Typography>
                </ListItem>
                <Divider />
                {loading && contacts.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : contacts.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">No contacts found</Typography>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={() => setNewContactDialogOpen(true)}
                      sx={{ mt: 1 }}
                    >
                      Add Contact
                    </Button>
                  </Box>
                ) : (
                  contacts.map((contact) => (
                    <React.Fragment key={contact._id}>
                      <ListItemButton
                        selected={selectedContact?._id === contact._id}
                        onClick={() => selectContact(contact)}
                        sx={{
                          '&.Mui-selected': {
                            bgcolor: 'rgba(37, 211, 102, 0.1)',
                          },
                          '&:hover': {
                            bgcolor: 'rgba(37, 211, 102, 0.05)',
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge 
                            color="success" 
                            badgeContent={(contact as ExtendedWhatsAppContact).unreadCount || 0} 
                            invisible={!(contact as ExtendedWhatsAppContact).unreadCount}
                            overlap="circular"
                          >
                            <Avatar sx={{ bgcolor: 'rgba(37, 211, 102, 0.8)' }}>
                              {contact.profilePicture ? (
                                <img src={contact.profilePicture} alt={contact.name} />
                              ) : (
                                <PersonIcon />
                              )}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={contact.name}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                                sx={{ display: 'block' }}
                              >
                                {contact.phoneNumber}
                              </Typography>
                              {(contact as ExtendedWhatsAppContact).lastMessage && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ 
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '120px',
                                    fontSize: '0.75rem',
                                    opacity: 0.8
                                  }}
                                >
                                  {(contact as ExtendedWhatsAppContact).lastMessage}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                          primaryTypographyProps={{
                            fontWeight: selectedContact?._id === contact._id ? 'bold' : 'normal',
                          }}
                        />
                        {contact.lastMessageAt && (
                          <Typography 
                            variant="caption" 
                            color="textSecondary"
                            sx={{ 
                              fontSize: '0.7rem',
                              opacity: 0.7
                            }}
                          >
                            {formatLastMessageTime(contact.lastMessageAt)}
                          </Typography>
                        )}
                      </ListItemButton>
                      <Divider />
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
          
          {/* Chat Area */}
          <Grid item xs={12} md={9}>
            {selectedContact ? (
              <Paper 
                variant="outlined" 
                sx={{ 
                  height: '70vh', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}
              >
                {/* Contact Header */}
                <Box sx={{ p: 2, bgcolor: 'rgba(37, 211, 102, 0.1)', borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1, bgcolor: 'rgba(37, 211, 102, 0.8)' }}>
                      {selectedContact.profilePicture ? (
                        <img src={selectedContact.profilePicture} alt={selectedContact.name} />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {selectedContact.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedContact.phoneNumber}
                        {isPolling && (
                          <Typography 
                            component="span" 
                            variant="caption" 
                            sx={{ ml: 1, color: '#25D366', fontWeight: 'bold' }}
                          >
                            • Live
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Tooltip title="Send Template Message">
                        <IconButton onClick={() => setTemplateDialogOpen(true)}>
                          <TemplateIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Call">
                        <IconButton>
                          <PhoneIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
                
                {/* Messages */}
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto', 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: '#f5f5f5',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2325d366\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                  }}
                >
                  {loading && messages.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress />
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                      <WhatsAppIcon sx={{ fontSize: 40, color: '#25D366', opacity: 0.5, mb: 2 }} />
                      <Typography color="textSecondary">No messages yet. Start the conversation!</Typography>
                    </Box>
                  ) : (
                    messages.map((message) => {
                      const apiMessage = message as ApiWhatsAppMessage;
                      // Determine if message is from me based on direction or isFromMe property
                      const isFromMe = apiMessage.direction === 'outbound' || apiMessage.isFromMe;
                      
                      return (
                        <Box
                          key={message._id}
                          sx={{
                            alignSelf: isFromMe ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            mb: 2,
                          }}
                        >
                          <Paper
                            sx={{
                              p: 1.5,
                              bgcolor: isFromMe ? '#DCF8C6' : '#FFFFFF',
                              color: '#303030',
                              borderRadius: '12px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              position: 'relative',
                              '&::before': isFromMe ? {
                                content: '""',
                                position: 'absolute',
                                right: '-8px',
                                top: '8px',
                                border: '8px solid transparent',
                                borderLeft: '8px solid #DCF8C6',
                                borderTop: '8px solid #DCF8C6',
                                transform: 'rotate(45deg)',
                              } : {
                                content: '""',
                                position: 'absolute',
                                left: '-8px',
                                top: '8px',
                                border: '8px solid transparent',
                                borderRight: '8px solid #FFFFFF',
                                borderTop: '8px solid #FFFFFF',
                                transform: 'rotate(-45deg)',
                              }
                            }}
                          >
                            {/* Display message content from either text.body or content property */}
                            {(apiMessage.text || apiMessage.content) && (
                              <Typography variant="body1">
                                {apiMessage.text?.body || apiMessage.content}
                              </Typography>
                            )}
                            {apiMessage.image && (
                              <Box>
                                <img
                                  src={apiMessage.image.url || ''}
                                  alt="Image"
                                  style={{ maxWidth: '100%', borderRadius: 8 }}
                                />
                                {apiMessage.image.caption && (
                                  <Typography variant="caption">{apiMessage.image.caption}</Typography>
                                )}
                              </Box>
                            )}
                            {apiMessage.document && (
                              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1 }}>
                                <IconButton size="small" component="a" href={apiMessage.document.url} target="_blank">
                                  <FileIcon />
                                </IconButton>
                                <Typography variant="body2">{apiMessage.document.filename}</Typography>
                              </Box>
                            )}
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                mt: 0.5, 
                                textAlign: 'right',
                                fontSize: '0.7rem',
                                color: 'rgba(0,0,0,0.5)'
                              }}
                            >
                              {formatTimestamp(apiMessage.timestamp)}
                              {apiMessage.status === 'read' && (
                                <CheckCircleIcon fontSize="inherit" sx={{ ml: 0.5, color: '#34B7F1' }} />
                              )}
                              {apiMessage.status === 'delivered' && (
                                <CheckIcon fontSize="inherit" sx={{ ml: 0.5, color: '#8C8C8C' }} />
                              )}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </Box>
                
                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', bgcolor: '#FFFFFF' }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message"
                    variant="outlined"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    size="small"
                    sx={{ 
                      mr: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: '#f0f0f0',
                        '&:hover': {
                          backgroundColor: '#e8e8e8',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                        }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    sx={{ 
                      borderRadius: '20px',
                      bgcolor: '#25D366',
                      '&:hover': {
                        bgcolor: '#128C7E',
                      }
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  height: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  bgcolor: 'rgba(37, 211, 102, 0.03)'
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 80, color: '#25D366', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Select a contact to start messaging
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3, maxWidth: '400px' }}>
                  Choose a contact from the list or create a new one to start a conversation
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setNewContactDialogOpen(true)}
                  sx={{ 
                    borderRadius: '20px',
                    bgcolor: '#25D366',
                    '&:hover': {
                      bgcolor: '#128C7E',
                    }
                  }}
                >
                  New Contact
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>


      {/* New Contact Dialog */}
      <Dialog open={newContactDialogOpen} onClose={() => setNewContactDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={newContact.phoneNumber}
              onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
              margin="normal"
              helperText="Include country code (e.g., +1 for US)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewContactDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateContact}
            disabled={!newContact.name || !newContact.phoneNumber}
            sx={{ 
              bgcolor: '#25D366',
              '&:hover': {
                bgcolor: '#128C7E',
              }
            }}
          >
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Message Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Template Message</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="template-select-label">Template</InputLabel>
              <Select
                labelId="template-select-label"
                value={selectedTemplate}
                label="Template"
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                {templates.length === 0 ? (
                  <MenuItem disabled>No templates available</MenuItem>
                ) : (
                  templates.map((template) => (
                    <MenuItem key={template.name} value={template.name}>
                      {template.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>
                Select a template to send to {selectedContact?.name}
              </FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendTemplate}
            disabled={!selectedTemplate}
            sx={{ 
              bgcolor: '#25D366',
              '&:hover': {
                bgcolor: '#128C7E',
              }
            }}
          >
            Send Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Webhook Test Dialog */}
      <Dialog open={webhookTestDialogOpen} onClose={() => setWebhookTestDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Test Webhook</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" paragraph>
              This will send a test message to verify that your webhook is properly configured.
            </Typography>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={testPhoneNumber}
              onChange={(e) => setTestPhoneNumber(e.target.value)}
              margin="normal"
              helperText="Include country code (e.g., +1 for US)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWebhookTestDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTestWebhook}
            disabled={!testPhoneNumber}
            sx={{ 
              bgcolor: '#25D366',
              '&:hover': {
                bgcolor: '#128C7E',
              }
            }}
          >
            Send Test Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 