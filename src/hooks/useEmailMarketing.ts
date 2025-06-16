import { useState, useEffect, useCallback } from 'react';
import {
  sendEmail,
  getSentEmails,
  getEmailStats,
  getEmailById,
  EmailFilters,
  SentEmail,
  EmailStats,
  SendEmailRequest,
  EmailRecipient
} from '@/services/emailMarketingService';

interface UseEmailMarketingProps {
  initialFilters?: EmailFilters;
}

export const useEmailMarketing = (props?: UseEmailMarketingProps) => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Email list state
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<EmailFilters>(props?.initialFilters || {
    page: 1,
    limit: 10
  });
  
  // Stats state
  const [stats, setStats] = useState<EmailStats | null>(null);
  
  // Selected email state
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  
  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch sent emails
  const fetchEmails = useCallback(async (newFilters?: EmailFilters) => {
    if (!isClient) return;
    
    const currentFilters = newFilters || filters;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getSentEmails(currentFilters);
      setEmails(result.data);
      setTotalCount(result.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sent emails');
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, isClient]);

  // Fetch email statistics
  const fetchStats = useCallback(async () => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getEmailStats();
      setStats(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch email statistics');
      console.error('Error fetching email statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Fetch email by ID
  const fetchEmailById = useCallback(async (emailId: string) => {
    if (!isClient) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const email = await getEmailById(emailId);
      setSelectedEmail(email);
      return email;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch email details');
      console.error('Error fetching email details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Send email
  const sendMarketingEmail = useCallback(async (emailData: SendEmailRequest) => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await sendEmail(emailData);
      setSuccess(result.message || 'Email sent successfully');
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
      console.error('Error sending email:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Update filters and fetch emails
  const updateFilters = useCallback((newFilters: Partial<EmailFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Reset to page 1 if filters other than pagination change
    if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
      updatedFilters.page = 1;
    }
    
    setFilters(updatedFilters);
    fetchEmails(updatedFilters);
  }, [filters, fetchEmails]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const resetFilters = {
      page: 1,
      limit: filters.limit || 10
    };
    setFilters(resetFilters);
    fetchEmails(resetFilters);
  }, [filters.limit, fetchEmails]);

  // Initial data fetch
  useEffect(() => {
    if (isClient) {
      fetchEmails();
    }
  }, [isClient, fetchEmails]);

  return {
    // State
    loading,
    error,
    success,
    emails,
    totalCount,
    filters,
    stats,
    selectedEmail,
    isClient,
    
    // Actions
    fetchEmails,
    fetchStats,
    fetchEmailById,
    sendMarketingEmail,
    updateFilters,
    resetFilters,
    setSelectedEmail,
    setError,
    setSuccess,
  };
}; 