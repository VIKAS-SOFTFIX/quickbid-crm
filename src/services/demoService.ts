import { authGet, authPost, authPut, authDel, get, post, put, del } from './apiService';

export interface DemoRequest {
  id: string;
  name: string;
  email: string;
  mobile: string;
  businessName: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  interestedIn: string;
  services: string[];
  industry: string;
  notes?: string;
  requirements?: string;
  assignedTo?: string;
  assignedAgentName?: string;
  createdAt: string;
  updatedAt: string;
}

interface DemoResponse {
  success: boolean;
  data: DemoRequest;
}

interface DemosResponse {
  success: boolean;
  data: DemoRequest[];
}

// Get all demo requests - using non-authenticated endpoint for testing
export const getDemoRequests = async (): Promise<DemosResponse> => {
  try {
    console.log('Fetching demo requests...');
    // Use non-authenticated request for now to test
    const response = await get<DemosResponse>('/api/demos');
    console.log('Demo requests response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    // Return empty data on error to prevent UI crashes
    return { success: false, data: [] };
  }
};

// Get a specific demo request by ID
export const getDemoRequest = async (demoId: string): Promise<{ success: boolean; data: DemoRequest | null }> => {
  try {
    console.log(`Fetching demo request with ID: ${demoId}`);
    const response = await get<{ success: boolean; data: DemoRequest }>(`/api/demos/${demoId}`);
    console.log('Demo request response:', response);
    return response;
  } catch (error) {
    console.error(`Error fetching demo request with ID: ${demoId}:`, error);
    return { success: false, data: null };
  }
};

// Create a new demo request - using non-authenticated endpoint for testing
export const createDemoRequest = async (demo: Omit<DemoRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<DemoResponse> => {
  try {
    console.log('Creating demo request with data:', demo);
    const response = await post<DemoResponse>('/api/demos', demo);
    console.log('Create demo response:', response);
    return response;
  } catch (error) {
    console.error('Error creating demo request:', error);
    throw error;
  }
};

// Update an existing demo request
export const updateDemoRequest = async (
  id: string,
  demoData: Partial<DemoRequest>
): Promise<{ success: boolean; data: DemoRequest | null }> => {
  try {
    console.log(`Updating demo request with ID: ${id}`, demoData);
    const response = await put<{ success: boolean; data: DemoRequest }>(`/api/demos/${id}`, demoData);
    console.log('Update demo response:', response);
    return response;
  } catch (error) {
    console.error(`Error updating demo request with ID: ${id}:`, error);
    return { success: false, data: null };
  }
};

// Delete a demo request
export const deleteDemoRequest = async (id: string): Promise<{ success: boolean }> => {
  try {
    console.log(`Deleting demo request with ID: ${id}`);
    const response = await del<{ success: boolean }>(`/api/demos/${id}`);
    console.log('Delete demo response:', response);
    return response;
  } catch (error) {
    console.error(`Error deleting demo request with ID: ${id}`, error);
    throw error;
  }
}; 