import apiClient from './apiClient';

// Types
export interface Recipient {
  address: string;
  name?: string;
}

export interface SendEmailRequest {
  subject: string;
  html: string;
  text?: string;
  senderAddress: string;
  connectionString: string;
  recipients: {
    to: Recipient[];
    cc?: Recipient[];
    bcc?: Recipient[];
  };
  dataSourceType?: string;
  state?: string;
  product?: string;
  category?: string;
  district?: string;
  batchNumber?: string;
}

export interface EmailResponse {
  id: string;
  messageId: string;
  status: string;
  sentAt: string;
  recipients: number;
}

export interface SentEmail {
  id: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
  status: string;
}

// Email Marketing Service Class
class EmailMarketingService {
  private baseUrl = '/marketing';

  // Send a marketing email
  async sendEmail(data: SendEmailRequest): Promise<EmailResponse> {
    return await apiClient.post<EmailResponse>(`${this.baseUrl}/email/send`, data);
  }

  // Send a test email
  async sendTestEmail(to: string, subject: string, html: string): Promise<EmailResponse> {
    return await apiClient.post<EmailResponse>(`${this.baseUrl}/email/test`, {
      to,
      subject,
      html
    });
  }

  // Get list of sent emails
  async getSentEmails(page: number = 1, limit: number = 10): Promise<SentEmail[]> {
    return await apiClient.get<SentEmail[]>(`${this.baseUrl}/email/sent`, {
      params: { page, limit }
    });
  }

  // Get details of a specific email
  async getEmailDetails(emailId: string): Promise<EmailResponse> {
    return await apiClient.get<EmailResponse>(`${this.baseUrl}/email/${emailId}`);
  }

  // Get analytics for emails
  async getEmailAnalytics(dateFrom?: string, dateTo?: string): Promise<any> {
    return await apiClient.get<any>(`${this.baseUrl}/email/analytics`, {
      params: { dateFrom, dateTo }
    });
  }
}

// Create a singleton instance
export const emailMarketingService = new EmailMarketingService();

// Export default instance
export default emailMarketingService; 