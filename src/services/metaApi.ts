import axios from 'axios';
import { API_CONFIG } from '@/config/api';

class MetaApiService {
  private baseUrl = 'https://graph.facebook.com/v18.0';
  private accessToken: string;
  private whatsappPhoneNumberId: string;
  private whatsappBusinessId: string;

  constructor() {
    this.accessToken = API_CONFIG.meta.accessToken || '';
    this.whatsappPhoneNumberId = String(API_CONFIG.meta.whatsappPhoneNumberId) || '';
    this.whatsappBusinessId = String(API_CONFIG.meta.whatsappBusinessId) || '';
  }

  async getFacebookLeads() {
    try {
      const response = await axios.get(`${this.baseUrl}/me/leads`, {
        params: {
          access_token: this.accessToken,
        },
      });

      return this.transformFacebookLeads(response.data.data);
    } catch (error) {
      console.error('Error fetching Facebook leads:', error);
      throw error;
    }
  }

  async getInstagramLeads() {
    try {
      // Only call this if instagramBusinessAccountId exists
      if (!API_CONFIG.meta.instagramBusinessAccountId) {
        console.warn('Instagram Business Account ID is not configured');
        return [];
      }
      
      const response = await axios.get(
        `${this.baseUrl}/${API_CONFIG.meta.instagramBusinessAccountId}/insights`,
        {
          params: {
            access_token: this.accessToken,
            metric: ['profile_views', 'reach', 'impressions'],
            period: 'day',
          },
        }
      );

      return this.transformInstagramLeads(response.data.data);
    } catch (error) {
      console.error('Error fetching Instagram leads:', error);
      throw error;
    }
  }

  // WhatsApp API methods
  async sendWhatsAppTextMessage(to: string, message: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.whatsappPhoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: {
            body: message,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendWhatsAppTemplateMessage(to: string, templateName: string, languageCode: string, components: any[] = []) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.whatsappPhoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode,
            },
            components,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp template message:', error);
      throw error;
    }
  }

  async getWhatsAppTemplates() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.whatsappBusinessId}/message_templates`,
        {
          params: {
            access_token: this.accessToken,
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching WhatsApp templates:', error);
      throw error;
    }
  }

  async getWhatsAppMessageMedia(mediaId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${mediaId}`,
        {
          params: {
            access_token: this.accessToken,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching WhatsApp media:', error);
      throw error;
    }
  }

  private transformFacebookLeads(leads: any[]) {
    return leads.map((lead) => ({
      id: `f_${lead.id}`,
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      source: 'facebook',
      createdAt: lead.created_time,
      metadata: {
        formId: lead.form_id,
        formName: lead.form_name,
        status: lead.status,
      },
    }));
  }

  private transformInstagramLeads(leads: any[]) {
    return leads.map((lead) => ({
      id: `i_${lead.id}`,
      name: lead.name || '',
      source: 'instagram',
      createdAt: new Date().toISOString(),
      metadata: {
        profileViews: lead.profile_views,
        reach: lead.reach,
        impressions: lead.impressions,
      },
    }));
  }
}

export const metaApiService = new MetaApiService(); 