import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  IconButton,
  Paper,
  CircularProgress,
  Typography,
  Chip,
  useTheme,
  alpha,
  Collapse,
  Divider,
  Tooltip,
  Autocomplete,
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Label as LabelIcon,
  Add as AddIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Link as LinkIcon,
  FormatQuote as FormatQuoteIcon,
  Code as CodeIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
} from '@mui/icons-material';
import { EditorContent } from '@tiptap/react';
import { styled } from '@mui/material/styles';

// Styled components for the email editor
const StyledEditorContent = styled(EditorContent)(({ theme }) => ({
  '.ProseMirror': {
    padding: theme.spacing(2),
    minHeight: '200px',
    outline: 'none',
    '&:focus': {
      outline: 'none',
    },
    '& p': {
      margin: '0.5em 0',
    },
    '& ul, & ol': {
      padding: '0 1rem',
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      lineHeight: 1.2,
    },
    '& code': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      padding: '0.2em 0.4em',
      borderRadius: '3px',
    },
    '& blockquote': {
      borderLeft: `3px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(1),
      color: theme.palette.text.secondary,
      margin: '1em 0',
    },
    '& a': {
      color: theme.palette.primary.main,
    },
  }
}));

// Styled component for formatting buttons
const FormatButton = styled(IconButton)(({ theme, active }: { theme: any, active: boolean }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  padding: theme.spacing(0.5),
  margin: theme.spacing(0, 0.25),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

interface ComposeEmailProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  editor: any;
  businessEmailAccounts: any[];
  selectedBusinessEmail: string;
  setSelectedBusinessEmail: (id: string) => void;
  handleSendEmail: (to: string, subject: string, cc?: string, bcc?: string) => void;
  handleSaveDraft: (to: string, subject: string, cc?: string, bcc?: string) => void;
}

// Sample email contacts for autocomplete
const emailContacts = [
  { name: 'VIKAS KUMAR VERMA', email: 'vikassoftix@gmail.com' }
];

const ComposeEmail: React.FC<ComposeEmailProps> = ({
  open,
  onClose,
  loading,
  editor,
  businessEmailAccounts,
  selectedBusinessEmail,
  setSelectedBusinessEmail,
  handleSendEmail,
  handleSaveDraft,
}) => {
  const theme = useTheme();
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [emailData, setEmailData] = useState<{
    to: { name: string; email: string }[];
    cc: { name: string; email: string }[];
    bcc: { name: string; email: string }[];
    subject: string;
  }>({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
  });
  const [tags, setTags] = useState<{id: string, name: string, color: string}[]>([]);
  const [showTagsMenu, setShowTagsMenu] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Available tags
  const availableTags = [
    { id: '1', name: 'Important', color: theme.palette.error.main },
    { id: '2', name: 'Work', color: theme.palette.primary.main },
    { id: '3', name: 'Personal', color: theme.palette.success.main },
    { id: '4', name: 'Urgent', color: theme.palette.warning.main },
    { id: '5', name: 'Follow-up', color: theme.palette.info.main },
  ];

  const handleAddTag = (tag: {id: string, name: string, color: string}) => {
    if (!tags.find(t => t.id === tag.id)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData({
      ...emailData,
      subject: e.target.value,
    });
  };

  const handleInsertLink = () => {
    if (editor && linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  // Update character count when editor content changes
  useEffect(() => {
    if (editor) {
      const updateCharCount = () => {
        const text = editor.getText();
        setCharCount(text.length);
      };
      
      editor.on('update', updateCharCount);
      
      return () => {
        editor.off('update', updateCharCount);
      };
    }
  }, [editor]);

  // Validate if we can send the email
  const canSendEmail = emailData.to.length > 0 && emailData.subject.trim() !== '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.primary', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">New Message</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ bgcolor: 'background.paper', p: 0 }}>
        <Box sx={{ p: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="from-email-label" sx={{ color: 'text.secondary' }}>From</InputLabel>
            <Select
              labelId="from-email-label"
              value={selectedBusinessEmail}
              onChange={(e) => setSelectedBusinessEmail(e.target.value as string)}
              input={<OutlinedInput label="From" />}
              sx={{ bgcolor: alpha('#f5f5f5', 0.5) }}
            >
              {Array.isArray(businessEmailAccounts) ? businessEmailAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} ({account.email})
                </MenuItem>
              )) : (
                <MenuItem disabled value="">
                  No accounts available
                </MenuItem>
              )}
            </Select>
          </FormControl>
          
          <Autocomplete
            multiple
            id="to-email"
            options={emailContacts}
            getOptionLabel={(option) => `${option.name} <${option.email}>`}
            value={emailData.to}
            onChange={(_, newValue) => setEmailData({...emailData, to: newValue})}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={`${option.name} <${option.email}>`}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                placeholder="Add recipients"
                size="small"
                sx={{ mb: 1, bgcolor: alpha('#f5f5f5', 0.5) }}
                InputLabelProps={{
                  sx: { color: 'text.secondary' }
                }}
              />
            )}
          />
          
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              size="small" 
              onClick={() => setShowCcBcc(!showCcBcc)}
              endIcon={showCcBcc ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showCcBcc ? 'Hide' : 'Show'} Cc & Bcc
            </Button>
          </Box>
          
          <Collapse in={showCcBcc}>
            <Autocomplete
              multiple
              id="cc-email"
              options={emailContacts}
              getOptionLabel={(option) => `${option.name} <${option.email}>`}
              value={emailData.cc}
              onChange={(_, newValue) => setEmailData({...emailData, cc: newValue})}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`${option.name} <${option.email}>`}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cc"
                  placeholder="Add Cc recipients"
                  size="small"
                  sx={{ mb: 1, bgcolor: alpha('#f5f5f5', 0.5) }}
                  InputLabelProps={{
                    sx: { color: 'text.secondary' }
                  }}
                />
              )}
            />
            
            <Autocomplete
              multiple
              id="bcc-email"
              options={emailContacts}
              getOptionLabel={(option) => `${option.name} <${option.email}>`}
              value={emailData.bcc}
              onChange={(_, newValue) => setEmailData({...emailData, bcc: newValue})}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`${option.name} <${option.email}>`}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bcc"
                  placeholder="Add Bcc recipients"
                  size="small"
                  sx={{ mb: 2, bgcolor: alpha('#f5f5f5', 0.5) }}
                  InputLabelProps={{
                    sx: { color: 'text.secondary' }
                  }}
                />
              )}
            />
          </Collapse>
          
          <TextField 
            fullWidth 
            label="Subject" 
            name="subject"
            variant="outlined"
            size="small" 
            sx={{ mb: 2, bgcolor: alpha('#f5f5f5', 0.5) }}
            value={emailData.subject}
            onChange={handleSubjectChange}
            InputLabelProps={{
              sx: { color: 'text.secondary' }
            }}
          />
          
          {/* Tags section */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Tags</Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />} 
                onClick={() => setShowTagsMenu(!showTagsMenu)}
              >
                Add Tag
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {tags.map(tag => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  icon={<LabelIcon style={{ color: tag.color }} />}
                  onDelete={() => handleRemoveTag(tag.id)}
                  sx={{ 
                    bgcolor: alpha(tag.color, 0.1),
                    color: tag.color,
                  }}
                />
              ))}
              
              {tags.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No tags added
                </Typography>
              )}
            </Box>
            
            <Collapse in={showTagsMenu}>
              <Paper variant="outlined" sx={{ mt: 1, p: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Select tags to add:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {availableTags.map(tag => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      icon={<LabelIcon style={{ color: tag.color }} />}
                      onClick={() => handleAddTag(tag)}
                      sx={{ 
                        bgcolor: alpha(tag.color, 0.1),
                        color: tag.color,
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Collapse>
          </Box>

          <Paper variant="outlined" sx={{ p: 1, mb: 2 }}>
            {/* Text formatting toolbar */}
            <Box sx={{ 
              display: 'flex', 
              borderBottom: '1px solid rgba(0,0,0,0.12)', 
              pb: 1, 
              mb: 1,
              flexWrap: 'wrap'
            }}>
              <Box sx={{ display: 'flex', mr: 1 }}>
                <Tooltip title="Bold">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('bold')} 
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                  >
                    <FormatBoldIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
                
                <Tooltip title="Italic">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('italic')} 
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                  >
                    <FormatItalicIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
                
                <Tooltip title="Underline">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('underline')} 
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  >
                    <FormatUnderlinedIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
              </Box>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              
              <Box sx={{ display: 'flex', mr: 1 }}>
                <Tooltip title="Bullet List">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('bulletList')} 
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  >
                    <FormatListBulletedIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
                
                <Tooltip title="Numbered List">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('orderedList')} 
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  >
                    <FormatListNumberedIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
              </Box>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              
              <Box sx={{ display: 'flex', mr: 1 }}>
                <Tooltip title="Link">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('link')} 
                    onClick={() => setShowLinkDialog(true)}
                  >
                    <LinkIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
                
                <Tooltip title="Quote">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('blockquote')} 
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  >
                    <FormatQuoteIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
                
                <Tooltip title="Code">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive('code')} 
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                  >
                    <CodeIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
              </Box>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              
              <Box sx={{ display: 'flex' }}>
                <Tooltip title="Align Left">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive({ textAlign: 'left' })} 
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  >
                    <FormatAlignLeftIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
                
                <Tooltip title="Align Center">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive({ textAlign: 'center' })} 
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  >
                    <FormatAlignCenterIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
                
                <Tooltip title="Align Right">
                  <FormatButton 
                    size="small" 
                    active={editor?.isActive({ textAlign: 'right' })} 
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  >
                    <FormatAlignRightIcon fontSize="small" />
                  </FormatButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ ml: 'auto' }}>
                <IconButton size="small" color="primary">
                  <AttachFileIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <StyledEditorContent editor={editor} />
            
            {/* Character counter */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 1, 
              color: 'text.secondary',
              fontSize: '0.75rem' 
            }}>
              {charCount} characters
            </Box>
            
            {/* Link Dialog */}
            <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)} maxWidth="xs" fullWidth>
              <DialogTitle>Insert Link</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="URL"
                  type="url"
                  fullWidth
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  variant="outlined"
                  placeholder="https://example.com"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowLinkDialog(false)}>Cancel</Button>
                <Button onClick={handleInsertLink} variant="contained" disabled={!linkUrl}>
                  Insert
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={() => handleSaveDraft(emailData.to.map(e => e.email).join(','), emailData.subject, emailData.cc.map(e => e.email).join(','), emailData.bcc.map(e => e.email).join(','))} disabled={loading} variant="outlined">
          Save as Draft
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleSendEmail(emailData.to.map(e => e.email).join(','), emailData.subject, emailData.cc.map(e => e.email).join(','), emailData.bcc.map(e => e.email).join(','))} 
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          disabled={loading || !canSendEmail}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComposeEmail; 