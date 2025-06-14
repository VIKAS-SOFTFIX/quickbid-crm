import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';

interface EmailToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectAllChecked: boolean;
  handleToggleSelectAll: () => void;
  selectedEmails: string[];
}

const EmailToolbar: React.FC<EmailToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectAllChecked,
  handleToggleSelectAll,
  selectedEmails,
}) => {
  return (
    <Box sx={{ 
      p: 1, 
      borderBottom: '1px solid', 
      borderColor: 'divider', 
      bgcolor: 'background.paper',
      display: 'flex',
      alignItems: 'center'
    }}>
      <IconButton 
        size="small" 
        onClick={handleToggleSelectAll}
        sx={{ mr: 1, color: selectAllChecked ? 'primary.main' : 'text.secondary' }}
      >
        {selectAllChecked ? <CheckBoxIcon fontSize="small" /> : <CheckBoxOutlineBlankIcon fontSize="small" />}
      </IconButton>
      
      <TextField
        placeholder="Search emails..."
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          sx: { 
            borderRadius: 4,
            bgcolor: alpha('#f5f5f5', 0.8),
            '&:hover': { bgcolor: alpha('#f5f5f5', 1) },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }
        }}
        variant="outlined"
        size="small"
      />
      
      <IconButton size="small" sx={{ ml: 1, color: 'text.secondary' }}>
        <FilterListIcon fontSize="small" />
      </IconButton>
      
      {selectedEmails.length > 0 && (
        <Box sx={{ 
          ml: 1, 
          px: 1.5, 
          py: 0.5, 
          borderRadius: 1, 
          bgcolor: alpha('#e3f2fd', 0.7),
          color: 'primary.main',
          fontSize: '0.75rem',
          fontWeight: 'medium'
        }}>
          {selectedEmails.length} selected
        </Box>
      )}
    </Box>
  );
};

export default EmailToolbar; 