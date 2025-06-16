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
export interface EmailRecipient {
  address: string;
}

export interface SendEmailRequest {
  subject: string;
  text: string;
  html: string;
  connectionString: string;
  senderAddress: string;
  recipients: {
    to: EmailRecipient[];
  };
  state?: string;
  product?: string;
  category?: string;
  district?: string;
  batchNumber?: string;
}

export interface SentEmail {
  _id: string;
  subject: string;
  recipients: EmailRecipient[];
  recipientCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  sentAt: string;
  state?: string;
  product?: string;
  category?: string;
  district?: string;
  batch?: string;
  status: 'sent' | 'failed' | 'pending';
}

export interface EmailStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  byState: { [key: string]: number };
  byCategory: { [key: string]: number };
  byDistrict: { [key: string]: number };
  byBatch: { [key: string]: number };
}

export interface EmailFilters {
  search?: string;
  state?: string;
  product?: string;
  category?: string;
  district?: string;
  batch?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// API functions
export const sendEmail = async (emailData: SendEmailRequest): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/marketing/email/send', emailData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      // Handle validation errors
      if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ');
        throw new Error(errorMessages || 'Failed to send emails');
      } else {
        throw new Error(error.response.data.error || error.response.data.message || 'Failed to send emails');
      }
    }
    throw new Error('Failed to send emails. Please check your connection.');
  }
};

export const getSentEmails = async (filters: EmailFilters = {}): Promise<{ data: SentEmail[]; pagination: { total: number; page: number; limit: number; pages: number } }> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.state) queryParams.append('state', filters.state);
    if (filters.product) queryParams.append('product', filters.product);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.district) queryParams.append('district', filters.district);
    if (filters.batch) queryParams.append('batch', filters.batch);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    // Pagination
    queryParams.append('page', String(filters.page || 1));
    queryParams.append('limit', String(filters.limit || 10));
    
    const response = await apiClient.get(`/marketing/email/list?${queryParams.toString()}`);
    
    if (response.data.success) {
      return {
        data: response.data.data,
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, pages: 0 }
      };
    }
    
    throw new Error(response.data.message || 'Failed to fetch sent emails');
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to fetch sent emails');
    }
    throw new Error('Failed to fetch sent emails. Please check your connection.');
  }
};

export const getEmailStats = async (): Promise<EmailStats> => {
  try {
    const response = await apiClient.get('/marketing/email/stats');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch email statistics');
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to fetch email statistics');
    }
    throw new Error('Failed to fetch email statistics. Please check your connection.');
  }
};

export const getEmailById = async (emailId: string): Promise<SentEmail> => {
  try {
    const response = await apiClient.get(`/marketing/email/${emailId}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch email details');
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to fetch email details');
    }
    throw new Error('Failed to fetch email details. Please check your connection.');
  }
}; 