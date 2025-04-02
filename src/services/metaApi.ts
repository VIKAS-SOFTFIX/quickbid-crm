import axios from 'axios';
import { API_CONFIG } from '@/config/api';

class MetaApiService {
  private baseUrl = 'https://graph.facebook.com/v18.0';
  private accessToken: string;

  constructor() {
    this.accessToken = API_CONFIG.meta.accessToken || '';
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