import axios from 'axios';

// Use environment variable or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quickbid.co.in/support/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for requests
});

// Types
export interface WhatsAppContact {
  _id: string;
  name: string;
  phoneNumber: string;
  waId?: string;
  profilePicture?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppMessage {
  _id: string;
  waId: string;
  messageId: string;
  from: string;
  to: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'sticker' | 'location' | 'contacts' | 'template';
  text?: {
    body: string;
  };
  image?: {
    id: string;
    url?: string;
    caption?: string;
  };
  document?: {
    id: string;
    url?: string;
    filename?: string;
    caption?: string;
  };
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  isFromMe: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  category: string;
  components: Array<{
    type: string;
    text?: string;
    parameters?: Array<{
      type: string;
      text?: string;
    }>;
  }>;
  status: string;
}

export interface SendMessageRequest {
  phoneNumber: string;
  message: string;
}

export interface SendTemplateRequest {
  phoneNumber: string;
  templateName: string;
  languageCode?: string;
  components?: Array<{
    type: string;
    parameters: Array<{
      type: string;
      text?: string;
      image?: {
        link: string;
      };
      document?: {
        link: string;
        filename?: string;
      };
    }>;
  }>;
}

export interface CreateContactRequest {
  name: string;
  phoneNumber: string;
}

// API functions
export const sendTextMessage = async (data: SendMessageRequest): Promise<any> => {
  try {
    const response = await apiClient.post('/whatsapp/send', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to send message');
    }
    throw new Error('Failed to send message. Please check your connection.');
  }
};

export const sendTemplateMessage = async (data: SendTemplateRequest): Promise<any> => {
  try {
    const response = await apiClient.post('/whatsapp/send-template', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to send template message');
    }
    throw new Error('Failed to send template message. Please check your connection.');
  }
};

export const getTemplates = async (): Promise<WhatsAppTemplate[]> => {
  try {
    const response = await apiClient.get('/whatsapp/templates');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to get templates');
    }
    throw new Error('Failed to get templates. Please check your connection.');
  }
};

export const getContacts = async (): Promise<WhatsAppContact[]> => {
  try {
    const response = await apiClient.get('/whatsapp/contacts');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to get contacts');
    }
    throw new Error('Failed to get contacts. Please check your connection.');
  }
};

export const getContact = async (waId: string): Promise<WhatsAppContact> => {
  try {
    const response = await apiClient.get(`/whatsapp/contacts/${waId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to get contact');
    }
    throw new Error('Failed to get contact. Please check your connection.');
  }
};

export const getContactMessages = async (waId: string): Promise<WhatsAppMessage[]> => {
  try {
    const response = await apiClient.get(`/whatsapp/contacts/${waId}/messages`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to get messages');
    }
    throw new Error('Failed to get messages. Please check your connection.');
  }
};

export const createContact = async (data: CreateContactRequest): Promise<WhatsAppContact> => {
  try {
    const response = await apiClient.post('/whatsapp/contacts', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to create contact');
    }
    throw new Error('Failed to create contact. Please check your connection.');
  }
};

export const testWebhook = async (phoneNumber: string): Promise<any> => {
  try {
    const response = await apiClient.post('/whatsapp/webhook/test', { phoneNumber });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to test webhook');
    }
    throw new Error('Failed to test webhook. Please check your connection.');
  }
};

export const getWebhookStatus = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/whatsapp/webhook/status');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to get webhook status');
    }
    throw new Error('Failed to get webhook status. Please check your connection.');
  }
}; 