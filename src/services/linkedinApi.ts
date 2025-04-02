import axios from 'axios';
import { API_CONFIG } from '@/config/api';

class LinkedInApiService {
  private baseUrl = 'https://api.linkedin.com/v2';
  private accessToken: string;

  constructor() {
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN || '';
  }

  async getLeads() {
    try {
      const response = await axios.get(`${this.baseUrl}/leadGenForms`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const formIds = response.data.elements.map((form: any) => form.id);
      const leads = await Promise.all(
        formIds.map((formId: string) => this.getLeadsByForm(formId))
      );

      return this.transformLinkedInLeads(leads.flat());
    } catch (error) {
      console.error('Error fetching LinkedIn leads:', error);
      throw error;
    }
  }

  private async getLeadsByForm(formId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/leadGenForms/${formId}/leads`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return response.data.elements;
    } catch (error) {
      console.error(`Error fetching leads for form ${formId}:`, error);
      return [];
    }
  }

  private transformLinkedInLeads(leads: any[]) {
    return leads.map((lead) => ({
      id: `l_${lead.id}`,
      name: lead.formValue?.firstName 
        ? `${lead.formValue.firstName} ${lead.formValue.lastName || ''}`
        : 'Unknown',
      email: lead.formValue?.email || '',
      phone: lead.formValue?.phone || '',
      company: lead.formValue?.company || '',
      source: 'linkedin',
      createdAt: lead.createdTime,
      metadata: {
        formId: lead.formId,
        formName: lead.formName,
        status: lead.status,
        campaignId: lead.campaignId,
        campaignName: lead.campaignName,
      },
    }));
  }
}

export const linkedInApiService = new LinkedInApiService(); 