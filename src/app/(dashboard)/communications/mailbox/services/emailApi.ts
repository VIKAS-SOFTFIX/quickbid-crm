import axios from 'axios';
import Cookies from 'js-cookie';

// Types
import { 
  EmailAccount, 
  Email, 
  Folder, 
  Tag, 
  Attachment, 
  EmailRecipient,
  EmailBody 
} from '../types';

const API_BASE_URL = 'http://localhost:7505/api/email';

// Helper function to add auth headers
const getAuthHeaders = () => {
  // Get token from localStorage or sessionStorage with the correct key
  let token;
  if (typeof window !== 'undefined') {
    // Try to get token from auth_token which is the correct key used in the application
    token = localStorage.getItem('auth_token') || 
            sessionStorage.getItem('auth_token') || 
            Cookies.get('auth_token');
  }
  
  // For debugging
  console.log('Using auth token:', token);
  
  return {
    headers: {
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    }
  };
};

// Email Account Management
export const getEmailAccounts = async (): Promise<EmailAccount[]> => {
  const response = await axios.get(`${API_BASE_URL}/accounts`, getAuthHeaders());
  return response.data;
};

export const getEmailAccount = async (id: string): Promise<EmailAccount> => {
  const response = await axios.get(`${API_BASE_URL}/accounts/${id}`, getAuthHeaders());
  return response.data;
};

export const addEmailAccount = async (accountData: any): Promise<EmailAccount> => {
  const response = await axios.post(`${API_BASE_URL}/accounts`, accountData, getAuthHeaders());
  return response.data;
};

export const updateEmailAccount = async (id: string, accountData: any): Promise<EmailAccount> => {
  const response = await axios.put(`${API_BASE_URL}/accounts/${id}`, accountData, getAuthHeaders());
  return response.data;
};

export const deleteEmailAccount = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/accounts/${id}`, getAuthHeaders());
};

export const verifyEmailAccount = async (id: string): Promise<boolean> => {
  const response = await axios.post(`${API_BASE_URL}/accounts/${id}/verify`, {}, getAuthHeaders());
  return response.data.verified;
};

// Email Operations
export const getEmails = async (
  accountId: string, 
  params: {
    page?: number;
    limit?: number;
    folder?: string;
    unread?: boolean;
    starred?: boolean;
    from?: string;
    to?: string;
    subject?: string;
    after?: string;
    before?: string;
  } = {}
): Promise<{ emails: Email[], total: number }> => {
  const response = await axios.get(
    `${API_BASE_URL}/${accountId}/messages`, 
    {
      ...getAuthHeaders(),
      params
    }
  );
  return response.data;
};

export const getEmailDetails = async (accountId: string, messageId: string): Promise<Email> => {
  const response = await axios.get(
    `${API_BASE_URL}/${accountId}/messages/${messageId}`,
    getAuthHeaders()
  );
  return response.data;
};

export const sendEmail = async (
  accountId: string, 
  emailData: {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    subject: string;
    body: EmailBody;
    attachments?: any[];
  }
): Promise<Email> => {
  const response = await axios.post(
    `${API_BASE_URL}/${accountId}/messages`, 
    emailData, 
    getAuthHeaders()
  );
  return response.data;
};

export const saveDraft = async (
  accountId: string, 
  draftData: any
): Promise<Email> => {
  const response = await axios.post(
    `${API_BASE_URL}/${accountId}/messages/draft`, 
    draftData, 
    getAuthHeaders()
  );
  return response.data;
};

export const updateEmail = async (
  accountId: string, 
  messageId: string, 
  emailData: any
): Promise<Email> => {
  const response = await axios.put(
    `${API_BASE_URL}/${accountId}/messages/${messageId}`, 
    emailData, 
    getAuthHeaders()
  );
  return response.data;
};

export const deleteEmail = async (accountId: string, messageId: string): Promise<void> => {
  await axios.delete(
    `${API_BASE_URL}/${accountId}/messages/${messageId}`, 
    getAuthHeaders()
  );
};

export const markAsRead = async (
  accountId: string, 
  messageId: string, 
  isRead: boolean
): Promise<void> => {
  await axios.put(
    `${API_BASE_URL}/${accountId}/messages/${messageId}/read`,
    { isRead },
    getAuthHeaders()
  );
};

export const toggleStar = async (
  accountId: string, 
  messageId: string, 
  isStarred: boolean
): Promise<void> => {
  await axios.put(
    `${API_BASE_URL}/${accountId}/messages/${messageId}/star`,
    { isStarred },
    getAuthHeaders()
  );
};

export const moveToFolder = async (
  accountId: string, 
  messageId: string, 
  folderId: string
): Promise<void> => {
  await axios.put(
    `${API_BASE_URL}/${accountId}/messages/${messageId}/folder`,
    { folderId },
    getAuthHeaders()
  );
};

// Folder Management
export const getFolders = async (accountId: string): Promise<Folder[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/${accountId}/folders`,
    getAuthHeaders()
  );
  return response.data;
};

export const createFolder = async (accountId: string, name: string): Promise<Folder> => {
  const response = await axios.post(
    `${API_BASE_URL}/${accountId}/folders`,
    { name },
    getAuthHeaders()
  );
  return response.data;
};

export const updateFolder = async (
  accountId: string, 
  folderId: string, 
  name: string
): Promise<Folder> => {
  const response = await axios.put(
    `${API_BASE_URL}/${accountId}/folders/${folderId}`,
    { name },
    getAuthHeaders()
  );
  return response.data;
};

export const deleteFolder = async (accountId: string, folderId: string): Promise<void> => {
  await axios.delete(
    `${API_BASE_URL}/${accountId}/folders/${folderId}`,
    getAuthHeaders()
  );
};

// Tag Management
export const getTags = async (): Promise<Tag[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/tags`,
    getAuthHeaders()
  );
  return response.data;
};

export const createTag = async (name: string, color: string): Promise<Tag> => {
  const response = await axios.post(
    `${API_BASE_URL}/tags`,
    { name, color },
    getAuthHeaders()
  );
  return response.data;
};

export const updateTag = async (tagId: string, data: { name?: string, color?: string }): Promise<Tag> => {
  const response = await axios.put(
    `${API_BASE_URL}/tags/${tagId}`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteTag = async (tagId: string): Promise<void> => {
  await axios.delete(
    `${API_BASE_URL}/tags/${tagId}`,
    getAuthHeaders()
  );
};

export const addTagToEmail = async (
  accountId: string, 
  messageId: string, 
  tagId: string
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/${accountId}/messages/${messageId}/tags`,
    { tagId },
    getAuthHeaders()
  );
};

export const removeTagFromEmail = async (
  accountId: string, 
  messageId: string, 
  tagId: string
): Promise<void> => {
  await axios.delete(
    `${API_BASE_URL}/${accountId}/messages/${messageId}/tags/${tagId}`,
    getAuthHeaders()
  );
};

// Attachment Management
export const getAttachments = async (
  accountId: string, 
  messageId: string
): Promise<Attachment[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/${accountId}/messages/${messageId}/attachments`,
    getAuthHeaders()
  );
  return response.data;
};

export const uploadAttachment = async (
  accountId: string, 
  file: File, 
  draftId: string
): Promise<Attachment> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('draftId', draftId);
  
  const response = await axios.post(
    `${API_BASE_URL}/${accountId}/messages/attachments`,
    formData,
    {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

export const deleteAttachment = async (
  accountId: string, 
  messageId: string, 
  attachmentId: string
): Promise<void> => {
  await axios.delete(
    `${API_BASE_URL}/${accountId}/messages/${messageId}/attachments/${attachmentId}`,
    getAuthHeaders()
  );
};

// Search
export const searchEmails = async (
  accountId: string,
  query: string,
  params: {
    page?: number;
    limit?: number;
    folder?: string;
    unread?: boolean;
    starred?: boolean;
    hasAttachments?: boolean;
    from?: string;
    to?: string;
    after?: string;
    before?: string;
  } = {}
): Promise<{ emails: Email[], total: number }> => {
  const response = await axios.get(
    `${API_BASE_URL}/${accountId}/search`,
    {
      ...getAuthHeaders(),
      params: {
        query,
        ...params
      }
    }
  );
  return response.data;
}; 