import { useState, useEffect, useCallback } from 'react';
import emailMarketingService, { SendEmailRequest, SentEmail } from '@/services/emailMarketingService';

export const useEmailMarketing = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  // Send marketing email
  const sendMarketingEmail = useCallback(async (data: SendEmailRequest): Promise<boolean> => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await emailMarketingService.sendEmail(data);
      
      setSuccess(`Email sent successfully to ${data.recipients.to.length} recipients`);
      return true;
    } catch (err: any) {
      // Handle specific error formats from API or general errors
      let errorMessage = 'Failed to send email. Please try again.';
      
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.map((e: any) => e.msg).join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Send test email
  const sendTestEmail = useCallback(async (to: string, subject: string, html: string): Promise<boolean> => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await emailMarketingService.sendTestEmail(to, subject, html);
      
      setSuccess(`Test email sent successfully to ${to}`);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send test email');
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Get sent emails
  const fetchSentEmails = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const emails = await emailMarketingService.getSentEmails(page, limit);
      setSentEmails(emails);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sent emails');
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Clear error and success messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    loading,
    error,
    success,
    sentEmails,
    sendMarketingEmail,
    sendTestEmail,
    fetchSentEmails,
    clearMessages,
    isClient
  };
};

export default useEmailMarketing; 