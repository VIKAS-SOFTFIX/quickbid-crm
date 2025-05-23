'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  styled,
  useTheme,
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as FileIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as ListIcon,
  FormatListNumbered as OrderedListIcon,
  Link as LinkIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatAlignJustify as AlignJustifyIcon,
  Title as HeadingIcon,
  Image as ImageIcon,
  FormatQuote as QuoteIcon,
  Code as CodeIcon,
  FormatColorText as ColorIcon,
  FormatIndentIncrease as IndentIcon,
  FormatIndentDecrease as OutdentIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  MoreVert as MoreIcon,
  HistoryEdu as TemplateIcon,
} from '@mui/icons-material';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Heading from '@tiptap/extension-heading';
import {  EMAIL_TEMPLATES } from './templates';

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Styled components
const StyledEditorContent = styled(EditorContent)(({ theme }) => ({
  '.ProseMirror': {
    padding: theme.spacing(2),
    minHeight: '300px',
    outline: 'none',
    '&:focus': {
      outline: 'none',
    },
    '& p': {
      margin: '0.5em 0',
    },
    '& ul, & ol': {
      paddingLeft: theme.spacing(3),
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      lineHeight: 1.3,
      fontWeight: 600,
      marginBottom: '0.5em',
      marginTop: '1em',
    },
    '& h1': { fontSize: '1.9em' },
    '& h2': { fontSize: '1.7em' },
    '& h3': { fontSize: '1.5em' },
    '& h4': { fontSize: '1.3em' },
    '& h5': { fontSize: '1.2em' },
    '& h6': { fontSize: '1.1em' },
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.primary.light}`,
      paddingLeft: theme.spacing(2),
      color: theme.palette.text.secondary,
      fontStyle: 'italic',
      margin: '1em 0',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& code': {
      backgroundColor: theme.palette.background.default,
      padding: '0.1em 0.3em',
      borderRadius: '3px',
      fontFamily: 'monospace',
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
    '& hr': {
      border: 'none',
      borderTop: `1px solid ${theme.palette.divider}`,
      margin: '1em 0',
    },
    '& .ProseMirror-placeholder': {
      color: theme.palette.text.disabled,
      pointerEvents: 'none',
    },
    '& p.is-editor-empty:first-child::before': {
      content: 'attr(data-placeholder)',
      color: theme.palette.text.disabled,
      float: 'left',
      pointerEvents: 'none',
      height: 0,
    },
  }
}));

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
}

const MenuButton = ({ onClick, isActive = false, icon, title }: MenuButtonProps) => {
  const theme = useTheme();
  
  return (
    <Tooltip title={title}>
      <IconButton 
        onClick={onClick}
        sx={{ 
          color: isActive ? theme.palette.primary.main : 'inherit',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          }
        }}
        size="small"
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

// Email template interface
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

// Function to calculate time remaining until May 18, 2025
const calculateTimeRemaining = () => {
  const launchDate = new Date('2025-05-18T00:00:00');
  const currentDate = new Date();
  
  // Calculate the difference in milliseconds
  const difference = launchDate.getTime() - currentDate.getTime();
  
  // Calculate days, hours, minutes
  const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
  
  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    isExpired: difference < 0
  };
};

export default function EmailMarketingPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [emailData, setEmailData] = useState({
    subject: '',
    plainText: '',
    htmlContent: '',
    recipients: [] as {address: string}[],
    senderAddress: "DoNotReply@56b2a9ef-273e-4a4f-8036-92dd766e8f7a.azurecomm.net", // Azure Communication Services domain
    attachments: [] as File[],
  });
  const [recipientInput, setRecipientInput] = useState('');
  const [availableLeads, setAvailableLeads] = useState<{id: string, email: string, name: string}[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<{id: string, email: string, name: string}[]>([]);
  const [fileUploadError, setFileUploadError] = useState('');
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Write your email content here...',
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setEmailData({
        ...emailData,
        htmlContent: editor.getHTML(),
        plainText: editor.getText(),
      });
    },
  });

  // Fetch leads (mock data for now)
  useEffect(() => {
    // In a real implementation, you would fetch leads from your API
    setAvailableLeads([
      { id: '1', email: 'lead1@example.com', name: 'John Doe' },
      { id: '2', email: 'lead2@example.com', name: 'Jane Smith' },
      { id: '3', email: 'lead3@example.com', name: 'Bob Johnson' },
      // Add more mock leads as needed
    ]);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddRecipient = () => {
    if (recipientInput && /\S+@\S+\.\S+/.test(recipientInput)) {
      setEmailData({
        ...emailData,
        recipients: [...emailData.recipients, { address: recipientInput }]
      });
      setRecipientInput('');
    }
  };

  const handleRemoveRecipient = (index: number) => {
    const updatedRecipients = [...emailData.recipients];
    updatedRecipients.splice(index, 1);
    setEmailData({
      ...emailData,
      recipients: updatedRecipients
    });
  };

  const handleLeadSelection = (event: any, value: any) => {
    setSelectedLeads(value);
  };

  const handleAddSelectedLeads = () => {
    const newRecipients = [
      ...emailData.recipients,
      ...selectedLeads.map(lead => ({ address: lead.email }))
    ];
    
    // Remove duplicates
    const uniqueRecipients = Array.from(new Set(newRecipients.map(r => r.address)))
      .map(address => ({ address }));
    
    setEmailData({
      ...emailData,
      recipients: uniqueRecipients
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileUploadError('Invalid file type. Please upload a valid document or image file.');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileUploadError('File is too large. Maximum file size is 5MB.');
      return;
    }
    
    setFileUploadError('');
    setEmailData({
      ...emailData,
      attachments: [...emailData.attachments, file]
    });
    
    // Reset file input
    event.target.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = [...emailData.attachments];
    updatedAttachments.splice(index, 1);
    setEmailData({
      ...emailData,
      attachments: updatedAttachments
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const addImageToEditor = () => {
    const url = prompt('Enter the URL of the image:');
    
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Function to dynamically update countdown timer in template
  const updateLaunchCountdown = (templateContent:any) => {
    const countdown = calculateTimeRemaining();
    
    // Replace countdown values in the template
    let updatedContent = templateContent;
    
    // Update days, hours, minutes with calculated values
    updatedContent = updatedContent.replace(
      /<div style="font-size: 24px; font-weight: bold; color: #feac0d;">07<\/div>\s*<div style="font-size: 14px;">Days<\/div>/,
      `<div style="font-size: 24px; font-weight: bold; color: #feac0d;">${countdown.days}</div><div style="font-size: 14px;">Days</div>`
    );
    
    updatedContent = updatedContent.replace(
      /<div style="font-size: 24px; font-weight: bold; color: #feac0d;">00<\/div>\s*<div style="font-size: 14px;">Hours<\/div>/,
      `<div style="font-size: 24px; font-weight: bold; color: #feac0d;">${countdown.hours}</div><div style="font-size: 14px;">Hours</div>`
    );
    
    updatedContent = updatedContent.replace(
      /<div style="font-size: 24px; font-weight: bold; color: #feac0d;">00<\/div>\s*<div style="font-size: 14px;">Minutes<\/div>/,
      `<div style="font-size: 24px; font-weight: bold; color: #feac0d;">${countdown.minutes}</div><div style="font-size: 14px;">Minutes</div>`
    );
    
    // Update message based on countdown status
    if (countdown.isExpired) {
      updatedContent = updatedContent.replace(
        /<p style="font-size: 16px; color: #555; margin-top: 20px;"><strong style="color: #002147;">Just one week away!<\/strong> Mark your calendar for <strong style="color: #002147;">May 18, 2025<\/strong><\/p>/,
        `<p style="font-size: 16px; color: #555; margin-top: 20px;"><strong style="color: #002147;">We're launching today!</strong> Join us for the big event!</p>`
      );
    } else if (parseInt(countdown.days) <= 1) {
      updatedContent = updatedContent.replace(
        /<p style="font-size: 16px; color: #555; margin-top: 20px;"><strong style="color: #002147;">Just one week away!<\/strong> Mark your calendar for <strong style="color: #002147;">May 18, 2025<\/strong><\/p>/,
        `<p style="font-size: 16px; color: #555; margin-top: 20px;"><strong style="color: #002147;">Launch is tomorrow!</strong> Get ready for the May 18, 2025 launch!</p>`
      );
    } else if (parseInt(countdown.days) < 7) {
      updatedContent = updatedContent.replace(
        /<p style="font-size: 16px; color: #555; margin-top: 20px;"><strong style="color: #002147;">Just one week away!<\/strong> Mark your calendar for <strong style="color: #002147;">May 18, 2025<\/strong><\/p>/,
        `<p style="font-size: 16px; color: #555; margin-top: 20px;"><strong style="color: #002147;">Almost here!</strong> Mark your calendar for <strong style="color: #002147;">May 18, 2025</strong></p>`
      );
    }
    
    return updatedContent;
  };

  const applyTemplate = (template: EmailTemplate) => {
    let templateContent = template.content;
    
    // Apply dynamic countdown only for launch announcement template
    if (template.id === 'launch-announcement') {
      templateContent = updateLaunchCountdown(templateContent);
    }
    
    if (editor) {
      editor.commands.setContent(templateContent);
    }
    
    setEmailData({
      ...emailData,
      subject: template.subject,
      htmlContent: templateContent,
      plainText: templateContent.replace(/<[^>]*>/g, ''),
    });
    
    setShowTemplateMenu(false);
  };

  const sendBulkEmails = async () => {
    if (emailData.recipients.length === 0) {
      setErrorMessage('Please add at least one recipient');
      return;
    }

    if (!emailData.subject || (!emailData.plainText && !emailData.htmlContent)) {
      setErrorMessage('Please add a subject and message content');
      return;
    }

    setLoading(true);
    try {
      // Create form data for file uploads
      const formData = new FormData();
      formData.append('subject', emailData.subject);
      formData.append('plainText', emailData.plainText);
      formData.append('htmlContent', emailData.htmlContent);
      formData.append('senderAddress', emailData.senderAddress);
      formData.append('recipients', JSON.stringify(emailData.recipients));
      
      // Add attachments
      emailData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
      
      // Call the API route to send emails
      const response = await fetch('/api/email', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails');
      }
      
      // Show success message
      setSuccessMessage(`Successfully sent ${emailData.recipients.length} emails`);
      setErrorMessage('');
      
      // Reset form after successful send
      setEmailData({
        ...emailData,
        subject: '',
        plainText: '',
        htmlContent: '',
        recipients: [],
        attachments: []
      });
      setSelectedLeads([]);
      
      // Reset editor content
      if (editor) {
        editor.commands.setContent('');
      }
    } catch (error: any) {
      console.error('Error sending emails:', error);
      setErrorMessage(error.message || 'Failed to send emails. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmailIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1">
            Email Marketing
          </Typography>
        </Box>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Create and send marketing emails to your leads and customers
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Compose Email" />
          <Tab label="Recipients" />
          <Tab label="Attachments" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                fullWidth
                label="Email Subject"
                variant="outlined"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                sx={{ mr: 2 }}
              />
              
              <Box sx={{ position: 'relative' }}>
                <Button
                  variant="outlined"
                  startIcon={<TemplateIcon />}
                  onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                >
                  Templates
                </Button>
                
                {showTemplateMenu && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      mt: 1,
                      width: 280,
                      maxHeight: 400,
                      overflow: 'auto',
                      zIndex: 1000,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    <List>
                      {EMAIL_TEMPLATES.map((template) => (
                        <ListItem 
                          key={template.id}
                          onClick={() => applyTemplate(template)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <ListItemIcon>
                            <TemplateIcon />
                          </ListItemIcon>
                          <ListItemText primary={template.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
            </Box>

            <Paper 
              variant="outlined" 
              sx={{ 
                mb: 3, 
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                '&:focus-within': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}0a`,
                },
              }}
            >
              <Box sx={{ 
                p: 1, 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                backgroundColor: theme.palette.background.default,
              }}>
                <MenuButton 
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  isActive={editor?.isActive('bold')}
                  icon={<BoldIcon fontSize="small" />}
                  title="Bold"
                />
                <MenuButton 
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  isActive={editor?.isActive('italic')}
                  icon={<ItalicIcon fontSize="small" />}
                  title="Italic"
                />
                <MenuButton 
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  isActive={editor?.isActive('code')}
                  icon={<CodeIcon fontSize="small" />}
                  title="Inline Code"
                />
                <Divider orientation="vertical" flexItem />
                
                <MenuButton 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  isActive={editor?.isActive('heading', { level: 2 })}
                  icon={<HeadingIcon fontSize="small" />}
                  title="Heading"
                />
                
                <Divider orientation="vertical" flexItem />
                
                <MenuButton 
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  isActive={editor?.isActive('bulletList')}
                  icon={<ListIcon fontSize="small" />}
                  title="Bullet List"
                />
                <MenuButton 
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  isActive={editor?.isActive('orderedList')}
                  icon={<OrderedListIcon fontSize="small" />}
                  title="Numbered List"
                />
                
                <Divider orientation="vertical" flexItem />
                
                <MenuButton 
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  isActive={editor?.isActive('blockquote')}
                  icon={<QuoteIcon fontSize="small" />}
                  title="Quote"
                />
                
                <MenuButton 
                  onClick={() => {
                    const url = window.prompt('URL');
                    if (url) {
                      editor?.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  isActive={editor?.isActive('link')}
                  icon={<LinkIcon fontSize="small" />}
                  title="Add Link"
                />
                
                <MenuButton 
                  onClick={addImageToEditor}
                  icon={<ImageIcon fontSize="small" />}
                  title="Add Image"
                />
                
                <Divider orientation="vertical" flexItem />
                
                <MenuButton 
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  isActive={editor?.isActive({ textAlign: 'left' })}
                  icon={<AlignLeftIcon fontSize="small" />}
                  title="Align Left"
                />
                <MenuButton 
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  isActive={editor?.isActive({ textAlign: 'center' })}
                  icon={<AlignCenterIcon fontSize="small" />}
                  title="Align Center"
                />
                <MenuButton 
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  isActive={editor?.isActive({ textAlign: 'right' })}
                  icon={<AlignRightIcon fontSize="small" />}
                  title="Align Right"
                />
                
                <Divider orientation="vertical" flexItem />
                
                <MenuButton 
                  onClick={() => editor?.chain().focus().undo().run()}
                  icon={<UndoIcon fontSize="small" />}
                  title="Undo"
                />
                <MenuButton 
                  onClick={() => editor?.chain().focus().redo().run()}
                  icon={<RedoIcon fontSize="small" />}
                  title="Redo"
                />
              </Box>
              
              <StyledEditorContent editor={editor} />
              
              {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <Paper sx={{ display: 'flex', p: 0.5, borderRadius: 1 }}>
                    <IconButton 
                      size="small"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                      <BoldIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                      <ItalicIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => {
                        const url = window.prompt('URL');
                        if (url) {
                          editor.chain().focus().setLink({ href: url }).run();
                        }
                      }}
                    >
                      <LinkIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                </BubbleMenu>
              )}
            </Paper>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Preview your email in a new tab">
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Create a temporary HTML page with the email content
                    const emailPreview = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Email Preview - ${emailData.subject}</title>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1">
                          <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                            h1, h2, h3, h4, h5, h6 { color: #444; line-height: 1.3; }
                            a { color: #3f51b5; }
                            hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
                            pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }
                            blockquote { border-left: 4px solid #ddd; padding-left: 15px; color: #666; }
                          </style>
                        </head>
                        <body>
                          <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
                            <strong>Subject:</strong> ${emailData.subject}
                            <br>
                            <strong>From:</strong> ${emailData.senderAddress}
                            <br>
                            <strong>To:</strong> ${emailData.recipients.map(r => r.address).join(', ') || '[Recipients]'}
                          </div>
                          <div class="email-content">
                            ${emailData.htmlContent}
                          </div>
                        </body>
                      </html>
                    `;
                    
                    const previewWindow = window.open();
                    previewWindow?.document.write(emailPreview);
                    previewWindow?.document.close();
                  }}
                  sx={{ mr: 2 }}
                >
                  Preview Email
                </Button>
              </Tooltip>
            </Box>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Add Recipients
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  placeholder="example@email.com"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAddRecipient}>
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddRecipient}
                  sx={{ height: '100%' }}
                >
                  Add Recipient
                </Button>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Select from Leads
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={9}>
                <Autocomplete
                  multiple
                  options={availableLeads}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={selectedLeads}
                  onChange={handleLeadSelection}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Search Leads"
                      placeholder="Select leads"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={`${option.name} (${option.email})`}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddSelectedLeads}
                  disabled={selectedLeads.length === 0}
                  sx={{ height: '100%' }}
                >
                  Add Selected
                </Button>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Current Recipients ({emailData.recipients.length})
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3, maxHeight: '200px', overflow: 'auto' }}>
              {emailData.recipients.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {emailData.recipients.map((recipient, index) => (
                    <Chip
                      key={index}
                      label={recipient.address}
                      onDelete={() => handleRemoveRecipient(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary">No recipients added yet</Typography>
              )}
            </Paper>
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Add Attachments
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  sx={{ mb: 2 }}
                >
                  Attach File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                    accept={ALLOWED_FILE_TYPES.join(',')}
                  />
                </Button>
                
                {fileUploadError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {fileUploadError}
                  </Alert>
                )}
                
                <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
                  Max file size: 5MB. Allowed file types: Images, PDF, Word, Excel, Text
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Current Attachments ({emailData.attachments.length})
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3, maxHeight: '200px', overflow: 'auto' }}>
              {emailData.attachments.length > 0 ? (
                <List>
                  {emailData.attachments.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FileIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={file.name}
                        secondary={formatFileSize(file.size)}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleRemoveAttachment(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">No attachments added yet</Typography>
              )}
            </Paper>
          </Box>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            onClick={sendBulkEmails}
            disabled={loading || emailData.recipients.length === 0}
          >
            {loading ? 'Sending...' : 'Send Emails'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 