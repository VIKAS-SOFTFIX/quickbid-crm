import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
  getEmailAccounts,
  getEmails,
  getEmailDetails,
  sendEmail,
  saveDraft,
  toggleStar,
  markAsRead,
  deleteEmail,
  moveToFolder,
  addEmailAccount,
  updateEmailAccount,
  deleteEmailAccount,
  verifyEmailAccount,
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  addTagToEmail,
  removeTagFromEmail,
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  searchEmails,
} from '../services/emailApi';

import {
  Email,
  EmailAccount,
  Folder,
  Tag,
  Attachment,
  EmailBody,
  EmailRecipient,
  SystemFolders,
  EmailSearchParams,
} from '../types';

export const useEmailService = () => {
  // State management
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [emailDetails, setEmailDetails] = useState<Email | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalEmails, setTotalEmails] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  
  // Check if user is authenticated based on token existence
  const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem('auth_token') || 
                  sessionStorage.getItem('auth_token') || 
                  Cookies.get('auth_token');
    
    const isAuth = !!token;
    setIsAuthenticated(isAuth);
    
    if (!isAuth) {
      setError('Authentication required. Please log in to access your emails.');
    } else {
      setError(null);
    }
    
    return isAuth;
  }, []);

  // Helper function to get the account ID regardless of whether it's id or _id
  const getAccountId = (account: any): string => {
    return account.id || account._id || '';
  };

  // Fetch all email accounts
  const fetchEmailAccounts = useCallback(async () => {
    // First check if user is authenticated
    if (!checkAuthentication()) return;
    
    try {
      setLoading(true);
      const response = await getEmailAccounts();
      
      // Handle different API response formats
      // The API might return accounts directly or nested in a data property
      let accounts: EmailAccount[] = [];
      
      if (response) {
        if (Array.isArray(response)) {
          accounts = response;
        } else if (typeof response === 'object') {
          // Handle response with data property
          const responseObj = response as any;
          if (responseObj.data && Array.isArray(responseObj.data)) {
            accounts = responseObj.data;
          } else if (responseObj.success && responseObj.data && Array.isArray(responseObj.data)) {
            accounts = responseObj.data;
          }
        }
      }
      
      // Ensure each account has an id property
      accounts = accounts.map(account => ({
        ...account,
        id: getAccountId(account)
      }));
      
      setEmailAccounts(accounts);
      
      // Set first account as selected if none is selected
      if (!selectedAccount && accounts.length > 0) {
        setSelectedAccount(getAccountId(accounts[0]));
      }
      
      setError(null);
    } catch (err: any) {
      // Handle authentication errors specifically
      if (err.response && err.response.status === 401) {
        setError('Authentication failed. Please log in again.');
        console.error('Authentication error:', err);
        setIsAuthenticated(false);
      } else {
        setError(err.message || 'Failed to fetch email accounts');
        console.error('API error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, checkAuthentication]);

  // Add a new email account
  const addAccount = useCallback(async (accountData: any) => {
    try {
      setLoading(true);
      const response = await addEmailAccount(accountData);
      
      // Handle different API response formats
      // The API might return either the account directly or nested in a data property
      const newAccount = response && typeof response === 'object' && 'data' in response 
        ? response.data as EmailAccount
        : response as EmailAccount;
      
      // Ensure we're working with an array for emailAccounts
      setEmailAccounts(prev => {
        // If prev is not an array (e.g., undefined, null, or an object), start with an empty array
        const currentAccounts = Array.isArray(prev) ? prev : [];
        return [...currentAccounts, newAccount] as EmailAccount[];
      });
      
      setError(null);
      return newAccount;
    } catch (err: any) {
      setError(err.message || 'Failed to add email account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an email account
  const updateAccount = useCallback(async (id: string, accountData: any) => {
    try {
      setLoading(true);
      const response = await updateEmailAccount(id, accountData);
      
      // Handle different API response formats
      const updatedAccount = response && typeof response === 'object' && 'data' in response 
        ? response.data as EmailAccount
        : response as EmailAccount;
      
      // Ensure we're working with an array for emailAccounts
      setEmailAccounts(prev => {
        // If prev is not an array, start with an empty array
        const currentAccounts = Array.isArray(prev) ? prev : [];
        return currentAccounts.map(account => 
          getAccountId(account) === id ? updatedAccount : account
        );
      });
      
      setError(null);
      return updatedAccount;
    } catch (err: any) {
      setError(err.message || 'Failed to update email account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an email account
  const removeAccount = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteEmailAccount(id);
      
      // Ensure we're working with an array for emailAccounts
      setEmailAccounts(prev => {
        // If prev is not an array, start with an empty array
        const currentAccounts = Array.isArray(prev) ? prev : [];
        return currentAccounts.filter(account => getAccountId(account) !== id);
      });
      
      // If removed account was selected, select the first available account
      if (selectedAccount === id) {
        const remainingAccounts = Array.isArray(emailAccounts) 
          ? emailAccounts.filter(account => getAccountId(account) !== id)
          : [];
        setSelectedAccount(remainingAccounts.length > 0 ? getAccountId(remainingAccounts[0]) : null);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete email account');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, emailAccounts]);

  // Verify email account credentials
  const verifyAccount = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const isVerified = await verifyEmailAccount(id);
      setError(null);
      return isVerified;
    } catch (err: any) {
      setError(err.message || 'Failed to verify email account');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch emails with filters
  const fetchEmails = useCallback(async (params: EmailSearchParams = {}) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const response = await getEmails(selectedAccount, {
        page,
        limit,
        ...params
      });
      
      // Handle different API response formats
      let fetchedEmails: Email[] = [];
      let total = 0;
      
      // Type the response as any to handle different response formats
      const responseObj = response as any;
      
      if (responseObj) {
        // Direct format: { emails: [...], total: number }
        if (responseObj.emails && Array.isArray(responseObj.emails)) {
          fetchedEmails = responseObj.emails;
          total = responseObj.total || 0;
        } 
        // Nested format: { data: { emails: [...], pagination: { total: number } } }
        else if (responseObj.data) {
          if (responseObj.data.emails && Array.isArray(responseObj.data.emails)) {
            fetchedEmails = responseObj.data.emails;
            total = responseObj.data.pagination?.total || 0;
          }
        }
        // Nested format: { success: true, data: { emails: [...], pagination: { total: number } } }
        else if (responseObj.success && responseObj.data) {
          if (responseObj.data.emails && Array.isArray(responseObj.data.emails)) {
            fetchedEmails = responseObj.data.emails;
            total = responseObj.data.pagination?.total || 0;
          }
        }
      }
      
      setEmails(fetchedEmails);
      setTotalEmails(total);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch emails');
      // Set emails to empty array on error
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, page, limit]);

  // Fetch a specific email's details
  const fetchEmailDetails = useCallback(async (emailId: string) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const details = await getEmailDetails(selectedAccount, emailId);
      setEmailDetails(details);
      setError(null);
      
      // Mark as read when viewing details
      await markEmailAsRead(emailId, true);
      
      return details;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch email details');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  // Search emails
  const searchEmailMessages = useCallback(async (query: string, params: Omit<EmailSearchParams, 'query'> = {}) => {
    if (!selectedAccount) return [];
    
    try {
      setLoading(true);
      const response = await searchEmails(selectedAccount, query, {
        page,
        limit,
        ...params
      });
      
      // Handle different API response formats
      let searchResults: Email[] = [];
      let total = 0;
      
      // Type the response as any to handle different response formats
      const responseObj = response as any;
      
      if (responseObj) {
        // Direct format: { emails: [...], total: number }
        if (responseObj.emails && Array.isArray(responseObj.emails)) {
          searchResults = responseObj.emails;
          total = responseObj.total || 0;
        } 
        // Nested format: { data: { emails: [...], pagination: { total: number } } }
        else if (responseObj.data) {
          if (responseObj.data.emails && Array.isArray(responseObj.data.emails)) {
            searchResults = responseObj.data.emails;
            total = responseObj.data.pagination?.total || 0;
          }
        }
        // Nested format: { success: true, data: { emails: [...], pagination: { total: number } } }
        else if (responseObj.success && responseObj.data) {
          if (responseObj.data.emails && Array.isArray(responseObj.data.emails)) {
            searchResults = responseObj.data.emails;
            total = responseObj.data.pagination?.total || 0;
          }
        }
      }
      
      setEmails(searchResults);
      setTotalEmails(total);
      setError(null);
      return searchResults;
    } catch (err: any) {
      setError(err.message || 'Failed to search emails');
      setEmails([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, page, limit]);

  // Send a new email
  const sendEmailMessage = useCallback(async (
    to: EmailRecipient[],
    subject: string,
    body: EmailBody,
    cc: EmailRecipient[] = [],
    bcc: EmailRecipient[] = [],
    attachments: any[] = []
  ) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const sentEmail = await sendEmail(selectedAccount, {
        to,
        cc,
        bcc,
        subject,
        body,
        attachments
      });
      
      // Refresh sent folder if needed
      fetchEmails({ folder: SystemFolders.SENT });
      
      setError(null);
      return sentEmail;
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, fetchEmails]);

  // Save draft email
  const saveEmailDraft = useCallback(async (draftData: any) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const draft = await saveDraft(selectedAccount, draftData);
      
      // Refresh drafts folder if needed
      fetchEmails({ folder: SystemFolders.DRAFTS });
      
      setError(null);
      return draft;
    } catch (err: any) {
      setError(err.message || 'Failed to save draft');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, fetchEmails]);

  // Toggle starred status
  const toggleEmailStar = useCallback(async (emailId: string, isStarred: boolean) => {
    if (!selectedAccount) return;
    
    try {
      await toggleStar(selectedAccount, emailId, isStarred);
      
      // Update local state
      setEmails(prev => 
        prev.map(email => 
          email.id === emailId ? { ...email, starred: isStarred } : email
        )
      );
      
      // Update detail view if needed
      if (emailDetails && emailDetails.id === emailId) {
        setEmailDetails({ ...emailDetails, starred: isStarred });
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update starred status');
    }
  }, [selectedAccount, emailDetails]);

  // Mark email as read/unread
  const markEmailAsRead = useCallback(async (emailId: string, isRead: boolean) => {
    if (!selectedAccount) return;
    
    try {
      await markAsRead(selectedAccount, emailId, isRead);
      
      // Update local state
      setEmails(prev => 
        prev.map(email => 
          email.id === emailId ? { ...email, read: isRead } : email
        )
      );
      
      // Update detail view if needed
      if (emailDetails && emailDetails.id === emailId) {
        setEmailDetails({ ...emailDetails, read: isRead });
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update read status');
    }
  }, [selectedAccount, emailDetails]);

  // Move email to folder
  const moveEmailToFolder = useCallback(async (emailId: string, folderId: string) => {
    if (!selectedAccount) return;
    
    try {
      await moveToFolder(selectedAccount, emailId, folderId);
      
      // Remove from current list since it's moved to another folder
      setEmails(prev => prev.filter(email => email.id !== emailId));
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to move email');
    }
  }, [selectedAccount]);

  // Delete an email
  const deleteEmailMessage = useCallback(async (emailId: string) => {
    if (!selectedAccount) return;
    
    try {
      await deleteEmail(selectedAccount, emailId);
      
      // Remove from current list
      setEmails(prev => prev.filter(email => email.id !== emailId));
      
      // Clear details if deleted email is selected
      if (selectedEmail === emailId) {
        setSelectedEmail(null);
        setEmailDetails(null);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete email');
    }
  }, [selectedAccount, selectedEmail]);

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const fetchedFolders = await getFolders(selectedAccount);
      setFolders(fetchedFolders);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  // Create new folder
  const createNewFolder = useCallback(async (name: string) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const newFolder = await createFolder(selectedAccount, name);
      setFolders(prev => [...prev, newFolder]);
      setError(null);
      return newFolder;
    } catch (err: any) {
      setError(err.message || 'Failed to create folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  // Update folder
  const updateExistingFolder = useCallback(async (folderId: string, name: string) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const updatedFolder = await updateFolder(selectedAccount, folderId, name);
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId ? updatedFolder : folder
        )
      );
      setError(null);
      return updatedFolder;
    } catch (err: any) {
      setError(err.message || 'Failed to update folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  // Delete folder
  const deleteExistingFolder = useCallback(async (folderId: string) => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      await deleteFolder(selectedAccount, folderId);
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTags = await getTags();
      setTags(fetchedTags);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new tag
  const createNewTag = useCallback(async (name: string, color: string) => {
    try {
      setLoading(true);
      const newTag = await createTag(name, color);
      setTags(prev => [...prev, newTag]);
      setError(null);
      return newTag;
    } catch (err: any) {
      setError(err.message || 'Failed to create tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update tag
  const updateExistingTag = useCallback(async (tagId: string, data: { name?: string, color?: string }) => {
    try {
      setLoading(true);
      const updatedTag = await updateTag(tagId, data);
      setTags(prev => 
        prev.map(tag => 
          tag.id === tagId ? updatedTag : tag
        )
      );
      setError(null);
      return updatedTag;
    } catch (err: any) {
      setError(err.message || 'Failed to update tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete tag
  const deleteExistingTag = useCallback(async (tagId: string) => {
    try {
      setLoading(true);
      await deleteTag(tagId);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add tag to email
  const addTagToEmailMessage = useCallback(async (emailId: string, tagId: string) => {
    if (!selectedAccount) return;
    
    try {
      await addTagToEmail(selectedAccount, emailId, tagId);
      
      // Find tag to add
      const tagToAdd = tags.find(tag => tag.id === tagId);
      if (!tagToAdd) return;
      
      // Update local state
      setEmails(prev => 
        prev.map(email => {
          if (email.id === emailId) {
            const updatedTags = [...(email.tags || [])];
            if (!updatedTags.some(tag => tag.id === tagId)) {
              updatedTags.push(tagToAdd);
            }
            return { ...email, tags: updatedTags };
          }
          return email;
        })
      );
      
      // Update detail view if needed
      if (emailDetails && emailDetails.id === emailId) {
        const updatedTags = [...(emailDetails.tags || [])];
        if (!updatedTags.some(tag => tag.id === tagId)) {
          updatedTags.push(tagToAdd);
        }
        setEmailDetails({ ...emailDetails, tags: updatedTags });
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add tag to email');
    }
  }, [selectedAccount, tags, emailDetails]);

  // Remove tag from email
  const removeTagFromEmailMessage = useCallback(async (emailId: string, tagId: string) => {
    if (!selectedAccount) return;
    
    try {
      await removeTagFromEmail(selectedAccount, emailId, tagId);
      
      // Update local state
      setEmails(prev => 
        prev.map(email => {
          if (email.id === emailId && email.tags) {
            return {
              ...email,
              tags: email.tags.filter(tag => tag.id !== tagId)
            };
          }
          return email;
        })
      );
      
      // Update detail view if needed
      if (emailDetails && emailDetails.id === emailId && emailDetails.tags) {
        setEmailDetails({
          ...emailDetails,
          tags: emailDetails.tags.filter(tag => tag.id !== tagId)
        });
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to remove tag from email');
    }
  }, [selectedAccount, emailDetails]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Load initial data when component mounts or selected account changes
  useEffect(() => {
    fetchEmailAccounts();
  }, [fetchEmailAccounts]);
  
  useEffect(() => {
    if (selectedAccount) {
      fetchEmails({ folder: SystemFolders.INBOX });
      fetchFolders();
    }
  }, [selectedAccount, fetchEmails, fetchFolders]);
  
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    // State
    emailAccounts,
    selectedAccount,
    emails,
    selectedEmail,
    emailDetails,
    folders,
    tags,
    loading,
    error,
    totalEmails,
    page,
    limit,
    isAuthenticated,
    
    // Setters
    setSelectedAccount,
    setSelectedEmail,
    setPage,
    setLimit,
    
    // Authentication
    checkAuthentication,
    
    // Account operations
    fetchEmailAccounts,
    addAccount,
    updateAccount,
    removeAccount,
    verifyAccount,
    
    // Email operations
    fetchEmails,
    fetchEmailDetails,
    searchEmailMessages,
    sendEmailMessage,
    saveEmailDraft,
    toggleEmailStar,
    markEmailAsRead,
    moveEmailToFolder,
    deleteEmailMessage,
    
    // Folder operations
    fetchFolders,
    createNewFolder,
    updateExistingFolder,
    deleteExistingFolder,
    
    // Tag operations
    fetchTags,
    createNewTag,
    updateExistingTag,
    deleteExistingTag,
    addTagToEmailMessage,
    removeTagFromEmailMessage,
    
    // Helpers
    formatDate
  };
}; 