import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Reply as ReplyIcon,
  ReplyAll as ReplyAllIcon,
  Forward as ForwardIcon,
  Email as EmailIcon,
  Label as LabelIcon,
} from '@mui/icons-material';

interface EmailContentProps {
  selectedEmail: string | null;
  getSelectedEmail: () => any;
  formatDate: (date: string) => string;
  handleOpenCompose: () => void;
}

const EmailContent: React.FC<EmailContentProps> = ({
  selectedEmail,
  getSelectedEmail,
  formatDate,
  handleOpenCompose,
}) => {
  const theme = useTheme();
  const email = getSelectedEmail();

  if (!selectedEmail) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        flexDirection: 'column',
        p: 3,
      }}>
        <EmailIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.disabled, 0.5), mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Select an email to view
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', maxWidth: 300 }}>
          Choose an email from the list to view its contents here
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        bgcolor: alpha('#f5f5f5', 0.3)
      }}>
        <Typography variant="h6" gutterBottom color="text.primary">
          {email.subject}
        </Typography>
        
        {email.tags && email.tags.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {email.tags.map((tag: any, index: number) => (
              <Chip 
                key={index} 
                label={tag.name} 
                size="small" 
                icon={<LabelIcon />}
                sx={{ 
                  bgcolor: alpha(tag.color || theme.palette.primary.main, 0.1),
                  color: tag.color || theme.palette.primary.main,
                  borderRadius: 1
                }}
              />
            ))}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.primary">
              <strong>
                {email.folder === 'inbox' ? 'From: ' : 'To: '}
              </strong>
              {email.folder === 'inbox' ? email.from : email.to}
            </Typography>
            
            {email.cc && (
              <Typography variant="body2" color="text.primary">
                <strong>Cc: </strong>
                {email.cc}
              </Typography>
            )}
            
            {email.bcc && (
              <Typography variant="body2" color="text.primary">
                <strong>Bcc: </strong>
                {email.bcc}
              </Typography>
            )}
            
            <Typography variant="body2" color="text.secondary">
              {formatDate(email.date || '')}
            </Typography>
          </Box>
          
          <Box>
            <Tooltip title="Reply">
              <IconButton size="small" onClick={handleOpenCompose} color="primary">
                <ReplyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reply All">
              <IconButton size="small" onClick={handleOpenCompose} color="primary">
                <ReplyAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Forward">
              <IconButton size="small" onClick={handleOpenCompose} color="primary">
                <ForwardIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Archive">
              <IconButton size="small" color="default">
                <ArchiveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
        <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
          {email.body}
        </Typography>
        
        {email.attachments && email.attachments.length > 0 && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1 }}>
              Attachments ({email.attachments.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {email.attachments.map((attachment: any, index: number) => (
                <Chip
                  key={index}
                  label={attachment.name}
                  variant="outlined"
                  size="small"
                  onClick={() => {}}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default EmailContent; 