import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  Typography,
  Divider,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Label as LabelIcon,
} from '@mui/icons-material';

interface EmailListProps {
  emails: any[];
  selectedEmail: string | null;
  selectedEmails: string[];
  handleSelectEmail: (id: string) => void;
  handleToggleSelectEmail: (id: string) => void;
  toggleStar: (id: string) => void;
  formatDate: (date: string) => string;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmail,
  selectedEmails,
  handleSelectEmail,
  handleToggleSelectEmail,
  toggleStar,
  formatDate,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto' }}>
      <List disablePadding>
        {emails.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No emails found</Typography>
          </Box>
        ) : (
          emails.map((email) => (
            <Box key={email.id}>
              <ListItemButton
                selected={selectedEmail === email.id}
                onClick={() => handleSelectEmail(email.id)}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  borderLeft: selectedEmail === email.id ? '3px solid' : '3px solid transparent',
                  borderLeftColor: 'primary.main',
                  bgcolor: email.read ? 'background.paper' : alpha('#e3f2fd', 0.5),
                  '&:hover': { bgcolor: alpha('#e3f2fd', 0.3) },
                  '&.Mui-selected': { bgcolor: alpha('#e3f2fd', 0.7) }
                }}
              >
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                  {/* Checkbox for multi-select */}
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelectEmail(email.id);
                    }}
                    sx={{ 
                      p: 0.5, 
                      mr: 1, 
                      color: selectedEmails.includes(email.id) ? 'primary.main' : 'text.secondary' 
                    }}
                  >
                    {selectedEmails.includes(email.id) ? 
                      <CheckBoxIcon fontSize="small" /> : 
                      <CheckBoxOutlineBlankIcon fontSize="small" />
                    }
                  </IconButton>
                  
                  <Box sx={{ pr: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(email.id);
                      }}
                      sx={{ p: 0.5 }}
                    >
                      {email.starred ? (
                        <StarIcon fontSize="small" color="warning" />
                      ) : (
                        <StarBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography 
                      variant="body2" 
                      noWrap 
                      fontWeight={email.read ? 'normal' : 'bold'}
                      color="text.primary"
                    >
                      {email.folder === 'inbox' ? email.from : email.to}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {email.tags && email.tags.length > 0 && (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mr: 0.5,
                          }}
                        >
                          <LabelIcon 
                            fontSize="small" 
                            sx={{ 
                              fontSize: '0.75rem', 
                              color: email.tags[0].color || theme.palette.primary.main 
                            }} 
                          />
                        </Box>
                      )}
                      <Typography 
                        variant="body2" 
                        fontWeight={email.read ? 'normal' : 'bold'} 
                        noWrap
                        color="text.primary"
                        sx={{ flex: 1 }}
                      >
                        {email.subject}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        noWrap
                        sx={{ maxWidth: '70%' }}
                      >
                        {email.body.substring(0, 40)}...
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                      >
                        {formatDate(email.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItemButton>
              <Divider />
            </Box>
          ))
        )}
      </List>
    </Box>
  );
};

export default EmailList; 