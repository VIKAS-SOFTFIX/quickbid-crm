import apiClient from './apiClient';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  state?: string;
  district?: string;
  category?: string;
  product?: string;
  batchNumber?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  search?: string;
  state?: string;
  district?: string;
  category?: string;
  product?: string;
  batchNumber?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  phone: string;
  state?: string;
  district?: string;
  category?: string;
  product?: string;
  batchNumber?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
}

export interface LeadResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  state?: string;
  district?: string;
  category?: string;
  product?: string;
  batchNumber?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedLeadResponse {
  data: LeadResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

class LeadService {
  private baseUrl = '/leads';

  // Get leads with pagination and filters
  async getLeads(filters: LeadFilters = {}): Promise<PaginatedLeadResponse> {
    return await apiClient.get<PaginatedLeadResponse>(this.baseUrl, {
      params: filters
    });
  }

  // Get lead by ID
  async getLeadById(id: string): Promise<LeadResponse> {
    return await apiClient.get<LeadResponse>(`${this.baseUrl}/${id}`);
  }

  // Create new lead
  async createLead(leadData: CreateLeadRequest): Promise<LeadResponse> {
    return await apiClient.post<LeadResponse>(this.baseUrl, leadData);
  }

  // Update existing lead
  async updateLead(id: string, leadData: Partial<CreateLeadRequest>): Promise<LeadResponse> {
    return await apiClient.put<LeadResponse>(`${this.baseUrl}/${id}`, leadData);
  }

  // Delete lead
  async deleteLead(id: string): Promise<{ success: boolean }> {
    return await apiClient.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }

  // Get lead statistics
  async getLeadStats(): Promise<any> {
    return await apiClient.get<any>(`${this.baseUrl}/stats`);
  }

  // Import leads from CSV or Excel
  async importLeads(file: File): Promise<{ success: boolean; count: number }> {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient.post<{ success: boolean; count: number }>(
      `${this.baseUrl}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  // Export leads to CSV
  async exportLeads(filters: LeadFilters = {}): Promise<Blob> {
    return await apiClient.request<Blob>({
      url: `${this.baseUrl}/export`,
      method: 'GET',
      params: filters,
      responseType: 'blob'
    });
  }

  // Get lead by email
  async getLeadByEmail(email: string): Promise<LeadResponse | null> {
    try {
      return await apiClient.get<LeadResponse>(`${this.baseUrl}/byEmail/${email}`);
    } catch (error) {
      return null;
    }
  }

  // Get leads by state
  async getLeadsByState(state: string): Promise<LeadResponse[]> {
    return await apiClient.get<LeadResponse[]>(`${this.baseUrl}/byState/${state}`);
  }
}

// Create a singleton instance
export const leadService = new LeadService();

// Export default instance
export default leadService; 