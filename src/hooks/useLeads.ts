import { useState, useEffect, useCallback } from 'react';
import leadService, { 
  Lead, 
  LeadFilters, 
  CreateLeadRequest, 
  PaginatedLeadResponse 
} from '@/services/leadService';

export interface UseLeadsResult {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: LeadFilters;
  fetchLeads: (newFilters?: LeadFilters) => Promise<void>;
  getLead: (id: string) => Promise<Lead | null>;
  createLead: (leadData: CreateLeadRequest) => Promise<Lead | null>;
  updateLead: (id: string, leadData: Partial<CreateLeadRequest>) => Promise<Lead | null>;
  deleteLead: (id: string) => Promise<boolean>;
  exportLeads: () => Promise<Blob | null>;
  importLeads: (file: File) => Promise<number | null>;
  setFilters: (newFilters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
}

export const useLeads = (initialFilters: LeadFilters = {}): UseLeadsResult => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialFilters.page || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    ...initialFilters
  });
  const [isClient, setIsClient] = useState<boolean>(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  // Fetch leads based on current filters
  const fetchLeads = useCallback(async (newFilters?: Partial<LeadFilters>) => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters 
        ? { ...filters, ...newFilters } 
        : filters;
      
      const response = await leadService.getLeads(currentFilters);
      
      setLeads(response.data);
      setTotalCount(response.pagination.total);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);
      
      if (newFilters) {
        setFilters(prev => ({ ...prev, ...newFilters }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, isClient]);

  // Get single lead
  const getLead = useCallback(async (id: string): Promise<Lead | null> => {
    if (!isClient) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const lead = await leadService.getLeadById(id);
      return lead;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch lead details');
      console.error('Error fetching lead:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Create new lead
  const createLead = useCallback(async (leadData: CreateLeadRequest): Promise<Lead | null> => {
    if (!isClient) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newLead = await leadService.createLead(leadData);
      // Refresh the leads list
      fetchLeads();
      return newLead;
    } catch (err: any) {
      setError(err.message || 'Failed to create lead');
      console.error('Error creating lead:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient, fetchLeads]);

  // Update existing lead
  const updateLead = useCallback(async (id: string, leadData: Partial<CreateLeadRequest>): Promise<Lead | null> => {
    if (!isClient) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedLead = await leadService.updateLead(id, leadData);
      // Refresh the leads list
      fetchLeads();
      return updatedLead;
    } catch (err: any) {
      setError(err.message || 'Failed to update lead');
      console.error('Error updating lead:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient, fetchLeads]);

  // Delete lead
  const deleteLead = useCallback(async (id: string): Promise<boolean> => {
    if (!isClient) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await leadService.deleteLead(id);
      // Refresh the leads list
      fetchLeads();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete lead');
      console.error('Error deleting lead:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient, fetchLeads]);

  // Export leads
  const exportLeads = useCallback(async (): Promise<Blob | null> => {
    if (!isClient) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const blob = await leadService.exportLeads(filters);
      return blob;
    } catch (err: any) {
      setError(err.message || 'Failed to export leads');
      console.error('Error exporting leads:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient, filters]);

  // Import leads
  const importLeads = useCallback(async (file: File): Promise<number | null> => {
    if (!isClient) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await leadService.importLeads(file);
      // Refresh the leads list
      fetchLeads();
      return result.count;
    } catch (err: any) {
      setError(err.message || 'Failed to import leads');
      console.error('Error importing leads:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isClient, fetchLeads]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    // If we're changing anything other than page/limit, reset to page 1
    const shouldResetPage = Object.keys(newFilters).some(key => 
      key !== 'page' && key !== 'limit'
    );
    
    const updatedFilters = { 
      ...filters, 
      ...newFilters,
      ...(shouldResetPage ? { page: 1 } : {})
    };
    
    setFilters(updatedFilters);
    fetchLeads(updatedFilters);
  }, [filters, fetchLeads]);

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      page: 1,
      limit: filters.limit || 10
    };
    
    setFilters(defaultFilters);
    fetchLeads(defaultFilters);
  }, [filters.limit, fetchLeads]);

  // Initial fetch on mount
  useEffect(() => {
    if (isClient) {
      fetchLeads();
    }
  }, [isClient, fetchLeads]);

  return {
    leads,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    filters,
    fetchLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    exportLeads,
    importLeads,
    setFilters: updateFilters,
    resetFilters
  };
};

export default useLeads; 