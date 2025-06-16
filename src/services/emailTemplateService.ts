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

export interface EmailTemplateVariable {
  name: string;
  defaultValue?: string;
  description?: string;
  required: boolean;
}

export interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  html: string;
  plainText?: string;
  description?: string;
  tags: string[];
  variables: EmailTemplateVariable[];
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmailTemplateData {
  name: string;
  subject: string;
  html: string;
  plainText?: string;
  description?: string;
  tags?: string[];
  variables?: EmailTemplateVariable[];
  isActive?: boolean;
}

export interface EmailTemplateFilter {
  search?: string;
  tags?: string[];
  isActive?: boolean;
}

// Get all email templates
export const getEmailTemplates = async (filters?: EmailTemplateFilter): Promise<EmailTemplate[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) {
      queryParams.append('search', filters.search);
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      queryParams.append('tags', filters.tags.join(','));
    }
    
    if (filters?.isActive !== undefined) {
      queryParams.append('isActive', String(filters.isActive));
    }
    
    const queryString = queryParams.toString();
    const url = `/marketing/templates${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    console.log('Email templates API response:', JSON.stringify(response.data, null, 2));
    
    // Handle the API response structure that includes data, pagination, etc.
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // If response.data is already an array, return it
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If we can't find an array, return an empty array
    console.warn('Unexpected API response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
};

// Get email template by ID
export const getEmailTemplateById = async (id: string): Promise<EmailTemplate> => {
  try {
    const response = await apiClient.get(`/marketing/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching email template ${id}:`, error);
    throw error;
  }
};

// Create new email template
export const createEmailTemplate = async (templateData: CreateEmailTemplateData): Promise<EmailTemplate> => {
  try {
    const response = await apiClient.post('/marketing/templates', templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating email template:', error);
    throw error;
  }
};

// Update email template
export const updateEmailTemplate = async (id: string, templateData: Partial<CreateEmailTemplateData>): Promise<EmailTemplate> => {
  try {
    const response = await apiClient.put(`/marketing/templates/${id}`, templateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating email template ${id}:`, error);
    throw error;
  }
};

// Delete email template
export const deleteEmailTemplate = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/marketing/templates/${id}`);
  } catch (error) {
    console.error(`Error deleting email template ${id}:`, error);
    throw error;
  }
};

// Preview email template
export const previewEmailTemplate = async (id: string): Promise<{ html: string; subject: string }> => {
  try {
    const response = await apiClient.post(`/marketing/templates/${id}/preview`, {
    
    });
    return response.data;
  } catch (error) {
    console.error(`Error previewing email template ${id}:`, error);
    throw error;
  }
};

// Test email template
export const testEmailTemplate = async (id: string, email: string, variables: Record<string, string>): Promise<void> => {
  try {
    await apiClient.post(`/marketing/email/test-template`, {
      templateId: id,
      email,
      variables,
    });
  } catch (error) {
    console.error(`Error testing email template ${id}:`, error);
    throw error;
  }
}; 