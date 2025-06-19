import { useState, useEffect, useCallback } from 'react';
import * as WhatsAppService from '@/services/whatsappService';
import {
  WhatsAppContact,
  WhatsAppMessage,
  WhatsAppTemplate,
  SendMessageRequest,
  SendTemplateRequest,
  CreateContactRequest
} from '@/services/whatsappService';

interface UseWhatsAppProps {
  initialContactId?: string;
}

export const useWhatsApp = (props?: UseWhatsAppProps) => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Contacts state
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  
  // Messages state
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  
  // Templates state
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  
  // Webhook status
  const [webhookStatus, setWebhookStatus] = useState<any>(null);

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await WhatsAppService.getContacts();
      setContacts(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Fetch single contact
  const fetchContact = useCallback(async (waId: string) => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await WhatsAppService.getContact(waId);
      setSelectedContact(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contact');
      console.error('Error fetching contact:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Fetch messages for a contact
  const fetchMessages = useCallback(async (waId: string) => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await WhatsAppService.getContactMessages(waId);
      setMessages(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await WhatsAppService.getTemplates();
      setTemplates(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch templates');
      console.error('Error fetching templates:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Send text message
  const sendTextMessage = useCallback(async (data: SendMessageRequest) => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await WhatsAppService.sendTextMessage(data);
      setSuccess('Message sent successfully');
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Send template message
  const sendTemplateMessage = useCallback(async (data: SendTemplateRequest) => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await WhatsAppService.sendTemplateMessage(data);
      setSuccess('Template message sent successfully');
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send template message');
      console.error('Error sending template message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Create contact
  const createContact = useCallback(async (data: CreateContactRequest) => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await WhatsAppService.createContact(data);
      setSuccess('Contact created successfully');
      setContacts(prevContacts => [...prevContacts, result]);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create contact');
      console.error('Error creating contact:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Test webhook
  const testWebhook = useCallback(async (phoneNumber: string) => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await WhatsAppService.testWebhook(phoneNumber);
      setSuccess('Webhook test message sent successfully');
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to test webhook');
      console.error('Error testing webhook:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Get webhook status
  const getWebhookStatus = useCallback(async () => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await WhatsAppService.getWebhookStatus();
      setWebhookStatus(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to get webhook status');
      console.error('Error getting webhook status:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Initial data fetch
  useEffect(() => {
    if (isClient) {
      fetchContacts();
      fetchTemplates();
      
      // If initialContactId is provided, fetch that contact and its messages
      if (props?.initialContactId) {
        fetchContact(props.initialContactId);
        fetchMessages(props.initialContactId);
      }
    }
  }, [isClient, props?.initialContactId, fetchContacts, fetchTemplates, fetchContact, fetchMessages]);

  // Select contact and fetch messages
  const selectContact = useCallback(async (contact: WhatsAppContact) => {
    setSelectedContact(contact);
    if (contact.waId) {
      await fetchMessages(contact.waId);
    }
  }, [fetchMessages]);

  // Add message optimistically to UI
  const addOptimisticMessage = useCallback((message: WhatsAppMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  return {
    // State
    loading,
    error,
    success,
    contacts,
    selectedContact,
    messages,
    templates,
    webhookStatus,
    isClient,
    
    // Actions
    fetchContacts,
    fetchContact,
    fetchMessages,
    fetchTemplates,
    sendTextMessage,
    sendTemplateMessage,
    createContact,
    testWebhook,
    getWebhookStatus,
    selectContact,
    setSelectedContact,
    setError,
    setSuccess,
    addOptimisticMessage,
  };
}; 