'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, alpha, useTheme } from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

// Import components
import MailboxHeader from './components/MailboxHeader';
import EmailList from './components/EmailList';
import EmailContent from './components/EmailContent';
import ComposeEmail from './components/ComposeEmail';
import EmailAccountDialog from './components/EmailAccountDialog';
import EmailToolbar from './components/EmailToolbar';

// Import types and mock data
import { Email, EmailAccount } from './types';
import { mockEmails, businessEmails } from './mockData';

export default function MailboxPage() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedBusinessEmail, setSelectedBusinessEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [businessEmailAccounts, setBusinessEmailAccounts] = useState<EmailAccount[]>(businessEmails);
  const [newAccountData, setNewAccountData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    smtpHost: '',
    smtpPort: '587',
    imapHost: '',
    imapPort: '993',
    useSsl: true
  });
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [serverConfigExpanded, setServerConfigExpanded] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  
  // TipTap editor for compose
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
    // Fix SSR hydration mismatch
    immediatelyRender: false,
  });

  // Filters for different tabs
  const tabFilters = [
    (email: Email) => email.folder === 'inbox',
    (email: Email) => email.folder === 'sent',
    (email: Email) => email.folder === 'drafts',
  ];

  // Get emails filtered by current tab and search query
  const filteredEmails = emails.filter(email => {
    const matchesTab = tabFilters[currentTab](email);
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         email.from.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setSelectedEmail(null);
  };

  // Toggle star status
  const toggleStar = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  // Mark email as read when selected
  const handleSelectEmail = (id: string) => {
    setSelectedEmail(id);
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    ));
  };

  // Get the currently selected email
  const getSelectedEmail = () => {
    return emails.find(email => email.id === selectedEmail);
  };

  // Handle compose dialog
  const handleOpenCompose = () => {
    setComposeOpen(true);
  };

  const handleCloseCompose = () => {
    setComposeOpen(false);
    if (editor) {
      editor.commands.setContent('');
    }
  };

  // Handle menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  // Send email (mock)
  const handleSendEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleCloseCompose();
      // Add the sent email to the list (would be an API call in a real app)
    }, 1500);
  };

  // Save draft (mock)
  const handleSaveDraft = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleCloseCompose();
      // Add the draft to the list (would be an API call in a real app)
    }, 1000);
  };

  // Handle account dialog
  const handleOpenAccountDialog = () => {
    setAccountDialogOpen(true);
  };

  const handleCloseAccountDialog = () => {
    setAccountDialogOpen(false);
    setNewAccountData({ 
      name: '', 
      email: '', 
      password: '',
      smtpHost: '',
      smtpPort: '587',
      imapHost: '',
      imapPort: '993',
      useSsl: true
    });
    setEditingAccount(null);
  };

  // Add new email account
  const handleAddAccount = () => {
    if (editingAccount) {
      // Update existing account
      setBusinessEmailAccounts(businessEmailAccounts.map(account => 
        account.id === editingAccount 
          ? { 
              ...account, 
              name: newAccountData.name, 
              email: newAccountData.email,
              smtpHost: newAccountData.smtpHost,
              smtpPort: newAccountData.smtpPort,
              imapHost: newAccountData.imapHost,
              imapPort: newAccountData.imapPort,
              useSsl: newAccountData.useSsl,
              isLoggedIn: true 
            } 
          : account
      ));
    } else {
      // Add new account
      const newAccount: EmailAccount = {
        id: `${businessEmailAccounts.length + 1}`,
        name: newAccountData.name,
        email: newAccountData.email,
        smtpHost: newAccountData.smtpHost,
        smtpPort: newAccountData.smtpPort,
        imapHost: newAccountData.imapHost,
        imapPort: newAccountData.imapPort,
        useSsl: newAccountData.useSsl,
        isLoggedIn: true,
      };
      setBusinessEmailAccounts([...businessEmailAccounts, newAccount]);
    }
    handleCloseAccountDialog();
  };

  // Edit existing account
  const handleEditAccount = (account: any) => {
    setEditingAccount(account.id);
    setNewAccountData({ 
      name: account.name, 
      email: account.email, 
      password: '',
      smtpHost: account.smtpHost || '',
      smtpPort: account.smtpPort || '587',
      imapHost: account.imapHost || '',
      imapPort: account.imapPort || '993',
      useSsl: account.useSsl !== undefined ? account.useSsl : true
    });
    setServerConfigExpanded(true);
    setAccountDialogOpen(true);
  };

  // Toggle server config expansion
  const handleToggleServerConfig = () => {
    setServerConfigExpanded(!serverConfigExpanded);
  };

  // Login to email account
  const handleLoginAccount = (accountId: string) => {
    setBusinessEmailAccounts(businessEmailAccounts.map(account => 
      account.id === accountId ? { ...account, isLoggedIn: true } : account
    ));
  };

  // Remove email account
  const handleRemoveAccount = (accountId: string) => {
    setBusinessEmailAccounts(businessEmailAccounts.filter(account => account.id !== accountId));
  };

  // Handle profile menu
  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileMenuAnchor(null);
  };

  // Handle email selection
  const handleToggleSelectEmail = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId) 
        : [...prev, emailId]
    );
  };

  // Handle select all emails
  const handleToggleSelectAll = () => {
    if (selectAllChecked || selectedEmails.length > 0) {
      setSelectedEmails([]);
      setSelectAllChecked(false);
    } else {
      setSelectedEmails(filteredEmails.map(email => email.id));
      setSelectAllChecked(true);
    }
  };

  // Effect to update selectAllChecked state
  useEffect(() => {
    if (filteredEmails.length > 0 && selectedEmails.length === filteredEmails.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [selectedEmails, filteredEmails]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 0, 
          mb: 3, 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          height: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with account switcher and tabs */}
        <MailboxHeader 
          currentTab={currentTab}
          handleTabChange={handleTabChange}
          handleOpenCompose={handleOpenCompose}
          handleOpenAccountDialog={handleOpenAccountDialog}
          handleOpenMenu={handleOpenMenu}
          handleCloseMenu={handleCloseMenu}
          handleOpenProfileMenu={handleOpenProfileMenu}
          handleCloseProfileMenu={handleCloseProfileMenu}
          menuAnchor={menuAnchor}
          profileMenuAnchor={profileMenuAnchor}
          selectedBusinessEmail={selectedBusinessEmail}
          businessEmailAccounts={businessEmailAccounts}
          setSelectedBusinessEmail={setSelectedBusinessEmail}
          emails={emails}
        />

        {/* Main content area */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Email list and content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Search and select toolbar */}
            <EmailToolbar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectAllChecked={selectAllChecked}
              handleToggleSelectAll={handleToggleSelectAll}
              selectedEmails={selectedEmails}
            />

            {/* Email list and content */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Email list */}
              <Box sx={{ width: '40%', overflow: 'hidden', display: 'flex' }}>
                <EmailList 
                  emails={filteredEmails}
                  selectedEmail={selectedEmail}
                  selectedEmails={selectedEmails}
                  handleSelectEmail={handleSelectEmail}
                  handleToggleSelectEmail={handleToggleSelectEmail}
                  toggleStar={toggleStar}
                  formatDate={formatDate}
                />
              </Box>

              {/* Email content */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.paper' }}>
                <EmailContent 
                  selectedEmail={selectedEmail}
                  getSelectedEmail={getSelectedEmail}
                  formatDate={formatDate}
                  handleOpenCompose={handleOpenCompose}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Compose Email Dialog */}
      <ComposeEmail 
        open={composeOpen}
        onClose={handleCloseCompose}
        loading={loading}
        editor={editor}
        businessEmailAccounts={businessEmailAccounts}
        selectedBusinessEmail={selectedBusinessEmail}
        setSelectedBusinessEmail={setSelectedBusinessEmail}
        handleSendEmail={handleSendEmail}
        handleSaveDraft={handleSaveDraft}
      />

      {/* Account Management Dialog */}
      <EmailAccountDialog 
        open={accountDialogOpen}
        onClose={handleCloseAccountDialog}
        editingAccount={editingAccount}
        newAccountData={newAccountData}
        setNewAccountData={setNewAccountData}
        serverConfigExpanded={serverConfigExpanded}
        handleToggleServerConfig={handleToggleServerConfig}
        handleAddAccount={handleAddAccount}
      />
    </Box>
  );
} 