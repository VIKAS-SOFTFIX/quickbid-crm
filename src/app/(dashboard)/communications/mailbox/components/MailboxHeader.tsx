import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Badge,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Email as EmailIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Refresh as RefreshIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Inbox as InboxIcon,
  Send as SendIcon,
  Drafts as DraftsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

interface MailboxHeaderProps {
  currentTab: number;
  handleTabChange: (_: React.SyntheticEvent, newValue: number) => void;
  handleOpenCompose: () => void;
  handleOpenAccountDialog: () => void;
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseMenu: () => void;
  handleOpenProfileMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseProfileMenu: () => void;
  menuAnchor: HTMLElement | null;
  profileMenuAnchor: HTMLElement | null;
  selectedBusinessEmail: string;
  businessEmailAccounts: any[];
  setSelectedBusinessEmail: (id: string) => void;
  emails: any[];
  onRefresh?: () => void;
  onEditAccount?: (account: any) => void;
  onRemoveAccount?: (accountId: string) => void;
}

const MailboxHeader: React.FC<MailboxHeaderProps> = ({
  currentTab,
  handleTabChange,
  handleOpenCompose,
  handleOpenAccountDialog,
  handleOpenMenu,
  handleCloseMenu,
  handleOpenProfileMenu,
  handleCloseProfileMenu,
  menuAnchor,
  profileMenuAnchor,
  selectedBusinessEmail,
  businessEmailAccounts,
  setSelectedBusinessEmail,
  emails,
  onRefresh,
  onEditAccount,
  onRemoveAccount,
}) => {
  const theme = useTheme();
  
  return (
    <>
      {/* Top toolbar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EmailIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h1" color="text.primary">
            Business Mail
          </Typography>
        </Box>
        
        {/* Email profile switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCompose}
            sx={{ borderRadius: '8px', mr: 2 }}
            color="primary"
          >
            Compose
          </Button>
          
          <Box 
            onClick={handleOpenProfileMenu}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              mr: 1,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 30, 
                height: 30, 
                bgcolor: theme.palette.primary.main,
                fontSize: '0.9rem',
                fontWeight: 'bold',
                mr: 1
              }}
            >
              {selectedBusinessEmail && Array.isArray(businessEmailAccounts) ? 
                businessEmailAccounts.find(acc => acc?.id === selectedBusinessEmail)?.name?.[0] || 'M' 
                : 'M'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight="medium" color="text.primary" noWrap>
                {selectedBusinessEmail && Array.isArray(businessEmailAccounts) ? 
                  businessEmailAccounts.find(acc => acc?.id === selectedBusinessEmail)?.name || 'Select Account' 
                  : 'Select Account'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {selectedBusinessEmail && Array.isArray(businessEmailAccounts) ? 
                  businessEmailAccounts.find(acc => acc?.id === selectedBusinessEmail)?.email || 'No account selected' 
                  : 'No account selected'}
              </Typography>
            </Box>
            <ArrowDropDownIcon sx={{ ml: 0.5, color: theme.palette.primary.main }} />
          </Box>
          
          <IconButton onClick={handleOpenMenu} sx={{ color: 'primary.main' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Folder navigation tabs */}
      <Box sx={{ 
        bgcolor: alpha('#f5f5f5', 0.5), 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        px: 2
      }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            minHeight: '48px',
            '& .MuiTab-root': {
              minHeight: '48px',
              py: 1.5
            }
          }}
        >
          <Tab 
            icon={
              <Badge 
                color="error" 
                badgeContent={emails.filter(e => e.folder === 'inbox' && !e.read).length}
                max={99}
                sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: '16px', minWidth: '16px' } }}
              >
                <InboxIcon fontSize="small" />
              </Badge>
            } 
            label="Inbox" 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            icon={<SendIcon fontSize="small" />} 
            label="Sent" 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            icon={<DraftsIcon fontSize="small" />} 
            label="Drafts" 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
        
        <Box sx={{ ml: 'auto' }}>
          <IconButton size="small" color="primary">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleCloseProfileMenu}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1.5, 
            borderRadius: 2,
            minWidth: 250,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold', color: 'text.secondary' }}>
          Switch Account
        </Typography>
        <Divider />
        {Array.isArray(businessEmailAccounts) ? businessEmailAccounts.map((account) => (
          <MenuItem 
            key={account.id} 
            onClick={() => {
              setSelectedBusinessEmail(account.id);
              handleCloseProfileMenu();
            }}
            selected={selectedBusinessEmail === account.id}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              <Avatar 
                sx={{ 
                  width: 30, 
                  height: 30, 
                  bgcolor: account.isLoggedIn ? theme.palette.primary.main : theme.palette.grey[300],
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary={account.name} 
              secondary={account.email}
              primaryTypographyProps={{ fontWeight: 'medium', variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
            {account.isLoggedIn && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: 'success.main',
                  borderRadius: '50%',
                  ml: 1
                }}
              />
            )}
          </MenuItem>
        )) : (
          <MenuItem disabled>
            <ListItemText primary="No accounts available" />
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => {
          handleCloseProfileMenu();
          handleOpenAccountDialog();
        }}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add Account" />
        </MenuItem>
      </Menu>
      
      {/* More menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, borderRadius: 1 }
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MailboxHeader; 