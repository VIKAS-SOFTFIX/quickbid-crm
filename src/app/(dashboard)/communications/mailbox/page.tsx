'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, alpha, useTheme } from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { toast } from 'react-hot-toast';

// Import components
import MailboxHeader from './components/MailboxHeader';
import EmailList from './components/EmailList';
import EmailContent from './components/EmailContent';
import ComposeEmail from './components/ComposeEmail';
import EmailAccountDialog from './components/EmailAccountDialog';
import EmailToolbar from './components/EmailToolbar';

// Import types and custom hooks
import { Email, EmailAccount, EmailRecipient, EmailBody, SystemFolders } from './types';
import { useEmailService } from './hooks/useEmailService';

export default function MailboxPage() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [newAccountData, setNewAccountData] = useState<{
    name: string;
    email: string;
    password: string;
    smtpHost: string;
    smtpPort: string;
    imapHost: string;
    imapPort: string;
    useSsl: boolean;
    provider: string;
  }>({ 
    name: '', 
    email: '', 
    password: '',
    smtpHost: '',
    smtpPort: '587',
    imapHost: '',
    imapPort: '993',
    useSsl: true,
    provider: ''
  });
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [serverConfigExpanded, setServerConfigExpanded] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use our email service hook
  const { 
    emailAccounts,
    selectedAccount,
    emails,
    selectedEmail,
    loading,
    error,
    setSelectedAccount,
    setSelectedEmail,
    fetchEmailAccounts,
    fetchEmails,
    addAccount,
    updateAccount,
    removeAccount,
    verifyAccount,
    toggleEmailStar,
    markEmailAsRead,
    sendEmailMessage,
    saveEmailDraft,
    deleteEmailMessage,
    formatDate,
    checkAuthentication
  } = useEmailService();
  
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
  const tabFolders = [
    SystemFolders.INBOX,
    SystemFolders.SENT,
    SystemFolders.DRAFTS,
  ];

  // Get emails filtered by search query
  const filteredEmails = Array.isArray(emails) ? emails.filter(email => 
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    email.from?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setSelectedEmail(null);
    
    // Fetch emails for the selected folder
    if (selectedAccount) {
      fetchEmails({ folder: tabFolders[newValue] });
    }
  };

  // Toggle star status
  const handleToggleStar = (id: string) => {
    if (!Array.isArray(emails)) return;
    const email = emails.find(email => email.id === id);
    if (email) {
      toggleEmailStar(id, !email.starred);
    }
  };

  // Mark email as read when selected
  const handleSelectEmail = (id: string) => {
    setSelectedEmail(id);
    markEmailAsRead(id, true);
  };

  // Get the currently selected email
  const getSelectedEmail = () => {
    if (!Array.isArray(emails)) return null;
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

  // Send email
  const handleSendEmail = async (
    to: string, 
    subject: string, 
    cc: string = '', 
    bcc: string = ''
  ) => {
    if (!editor || !selectedAccount) return;
    
    try {
      // Parse recipients
      const toRecipients: EmailRecipient[] = to.split(',').map(email => ({
        name: email.trim(),
        email: email.trim()
      }));
      
      const ccRecipients: EmailRecipient[] = cc ? cc.split(',').map(email => ({
        name: email.trim(),
        email: email.trim()
      })) : [];
      
      const bccRecipients: EmailRecipient[] = bcc ? bcc.split(',').map(email => ({
        name: email.trim(),
        email: email.trim()
      })) : [];
      
      // Prepare body
      const body: EmailBody = {
        html: editor.getHTML(),
        text: editor.getText()
      };
      
      await sendEmailMessage(
        toRecipients,
        subject,
        body,
        ccRecipients,
        bccRecipients
      );
      
      toast.success('Email sent successfully');
      handleCloseCompose();
      
      // Refresh sent folder if we're on the sent tab
      if (currentTab === 1) {
        fetchEmails({ folder: SystemFolders.SENT });
      }
    } catch (err) {
      toast.error('Failed to send email');
      console.error(err);
    }
  };

  // Save draft
  const handleSaveDraft = async (
    to: string, 
    subject: string, 
    cc: string = '', 
    bcc: string = ''
  ) => {
    if (!editor || !selectedAccount) return;
    
    try {
      // Prepare draft data
      const draftData = {
        to: to.split(',').map(email => ({
          name: email.trim(),
          email: email.trim()
        })),
        cc: cc ? cc.split(',').map(email => ({
          name: email.trim(),
          email: email.trim()
        })) : [],
        bcc: bcc ? bcc.split(',').map(email => ({
          name: email.trim(),
          email: email.trim()
        })) : [],
        subject,
        body: {
          html: editor.getHTML(),
          text: editor.getText()
        }
      };
      
      await saveEmailDraft(draftData);
      
      toast.success('Draft saved');
      handleCloseCompose();
      
      // Refresh drafts folder if we're on the drafts tab
      if (currentTab === 2) {
        fetchEmails({ folder: SystemFolders.DRAFTS });
      }
    } catch (err) {
      toast.error('Failed to save draft');
      console.error(err);
    }
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
      useSsl: true,
      provider: ''
    });
    setEditingAccount(null);
  };

  // Add new email account
  const handleAddAccount = async () => {
    try {
      if (editingAccount) {
        // Update existing account
        const accountData = {
          name: newAccountData.name, 
          email: newAccountData.email,
          smtpHost: newAccountData.smtpHost,
          smtpPort: newAccountData.smtpPort,
          imapHost: newAccountData.imapHost,
          imapPort: newAccountData.imapPort,
          useSsl: newAccountData.useSsl,
          provider: newAccountData.provider,
          // Only include password if provided
          ...(newAccountData.password ? {
            authType: 'password',
            credentials: {
              password: newAccountData.password
            }
          } : {})
        };
        
        await updateAccount(editingAccount, accountData);
        toast.success('Account updated successfully');
      } else {
        // Add new account
        const accountData = {
          name: newAccountData.name,
          email: newAccountData.email,
          smtpHost: newAccountData.smtpHost,
          smtpPort: newAccountData.smtpPort,
          imapHost: newAccountData.imapHost,
          imapPort: newAccountData.imapPort,
          useSsl: newAccountData.useSsl,
          provider: newAccountData.provider,
          authType: 'password',
          credentials: {
            password: newAccountData.password
          }
        };
        
        const newAccount = await addAccount(accountData);
        setSelectedAccount(newAccount.id);
        toast.success('Account added successfully');
      }
      
      handleCloseAccountDialog();
      // Refresh accounts
      fetchEmailAccounts();
    } catch (err) {
      toast.error(editingAccount ? 'Failed to update account' : 'Failed to add account');
      console.error(err);
    }
  };

  // Edit existing account
  const handleEditAccount = (account: EmailAccount) => {
    setEditingAccount(account.id);
    setNewAccountData({ 
      name: account.name, 
      email: account.email, 
      password: '',
      smtpHost: account.smtpHost || '',
      smtpPort: account.smtpPort || '587',
      imapHost: account.imapHost || '',
      imapPort: account.imapPort || '993',
      useSsl: account.useSsl !== undefined ? account.useSsl : true,
      provider: account.provider || ''
    });
    setServerConfigExpanded(true);
    setAccountDialogOpen(true);
  };

  // Toggle server config expansion
  const handleToggleServerConfig = () => {
    setServerConfigExpanded(!serverConfigExpanded);
  };

  // Remove email account
  const handleRemoveAccount = async (accountId: string) => {
    try {
      await removeAccount(accountId);
      toast.success('Account removed successfully');
    } catch (err) {
      toast.error('Failed to remove account');
      console.error(err);
    }
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
      if (!Array.isArray(filteredEmails) || filteredEmails.length === 0) {
        return;
      }
      setSelectedEmails(filteredEmails.map(email => email.id));
      setSelectAllChecked(true);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    const currentFolder = tabFolders[currentTab];
    fetchEmails({ folder: currentFolder }).catch(err => {
      console.error('Error refreshing emails:', err);
      toast.error('Failed to refresh emails');
    });
    setRefreshTrigger(prev => prev + 1);
    toast.success('Refreshed emails');
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) return;
    
    try {
      // Delete each selected email
      for (const emailId of selectedEmails) {
        await deleteEmailMessage(emailId);
      }
      
      setSelectedEmails([]);
      toast.success(`Deleted ${selectedEmails.length} emails`);
    } catch (err) {
      toast.error('Failed to delete some emails');
      console.error(err);
    }
  };

  // Effect to update selectAllChecked state
  useEffect(() => {
    if (Array.isArray(filteredEmails) && filteredEmails.length > 0 && 
        selectedEmails.length === filteredEmails.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [selectedEmails, filteredEmails]);
  
  // Initial data loading
  useEffect(() => {
    // Check authentication status first
    const isAuth = checkAuthentication();
    
    if (isAuth) {
      try {
        // Initial emails load happens automatically when selectedAccount changes in the hook
        fetchEmailAccounts().catch(err => {
          console.error('Error fetching email accounts:', err);
          toast.error('Failed to fetch email accounts');
        });
      } catch (err) {
        console.error('Error initializing email service:', err);
        toast.error('Failed to initialize email service');
      }
    } else {
      toast.error('Please log in to access your emails');
      // You might want to redirect to login here if needed
    }
    
    if (error) {
      toast.error(error);
    }
  }, [checkAuthentication, fetchEmailAccounts, error]);

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
          selectedBusinessEmail={selectedAccount || ''}
          businessEmailAccounts={emailAccounts || []}
          setSelectedBusinessEmail={setSelectedAccount}
          emails={emails || []}
          onRefresh={handleRefresh}
          onEditAccount={handleEditAccount}
          onRemoveAccount={handleRemoveAccount}
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
              onBulkDelete={handleBulkDelete}
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
                  toggleStar={handleToggleStar}
                  formatDate={formatDate}
                  loading={loading}
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
        businessEmailAccounts={emailAccounts || []}
        selectedBusinessEmail={selectedAccount || ''}
        setSelectedBusinessEmail={setSelectedAccount}
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