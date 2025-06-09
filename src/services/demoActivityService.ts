import { get, post } from './apiService';

export interface DemoActivity {
  _id: string;
  demoId: string;
  action: string;
  description: string;
  performedBy: string;
  performedAt: string;
  priority: 'high' | 'medium' | 'low';
  details: any;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface DemoActivityResponse {
  success: boolean;
  data: DemoActivity;
}

interface DemoActivitiesResponse {
  success: boolean;
  data: DemoActivity[];
}

// Get all activities for a specific demo
export const getDemoActivities = async (demoId: string): Promise<DemoActivitiesResponse | DemoActivity[]> => {
  try {
    console.log(`Fetching activities for demo ID: ${demoId}`);
    const endpoint = `/api/demo-activities/demo/${demoId}`;
    console.log(`Calling activities endpoint: ${endpoint}`);
    const response = await get<DemoActivitiesResponse | DemoActivity[]>(endpoint);
    console.log('Raw demo activities response:', response);
    
    // Add extra logging to debug the API response
    if (Array.isArray(response)) {
      console.log(`Successfully retrieved ${response.length} activities (array format)`);
      return response;
    } else if (response && response.success && Array.isArray(response.data)) {
      console.log(`Successfully retrieved ${response.data.length} activities (object format)`);
      return response;
    } else {
      console.warn('Activities response format issue:', response);
      // Return empty array on invalid format
      return [];
    }
  } catch (error) {
    console.error(`Error fetching activities for demo ID: ${demoId}`, error);
    // Return empty data on error to prevent UI crashes
    return [];
  }
};

// Add a note to a demo
export const addDemoNote = async (
  demoId: string,
  note: string,
  performedBy: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<DemoActivityResponse> => {
  try {
    const activityData = {
      demoId,
      action: 'note_added',
      description: 'Note added to demo',
      performedBy,
      priority,
      details: {
        field: 'notes',
        newValue: note
      }
    };

    const response = await post<DemoActivityResponse>('/api/demo-activities/', activityData);
    return response;
  } catch (error) {
    console.error(`Error adding note to demo ID: ${demoId}`, error);
    throw error;
  }
};

// Schedule a follow-up for a demo
export const scheduleFollowUp = async (
  demoId: string,
  followUpDate: string,
  description: string,
  performedBy: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<DemoActivityResponse> => {
  try {
    const activityData = {
      demoId,
      action: 'follow_up_scheduled',
      description,
      performedBy,
      priority,
      followUpDate,
      details: {
        field: 'followUpDate',
        newValue: followUpDate
      }
    };

    const response = await post<DemoActivityResponse>('/api/demo-activities/', activityData);
    return response;
  } catch (error) {
    console.error(`Error scheduling follow-up for demo ID: ${demoId}`, error);
    throw error;
  }
};

// Add a meeting link to a demo
export const addMeetingLink = async (
  demoId: string,
  meetingLink: string,
  performedBy: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<DemoActivityResponse> => {
  try {
    const activityData = {
      demoId,
      action: 'meeting_link_added',
      description: 'Meeting link added for the demo',
      performedBy,
      priority,
      details: {
        field: 'googleMeetLink',
        newValue: meetingLink,
        meetingLink
      }
    };

    const response = await post<DemoActivityResponse>('/api/demo-activities/', activityData);
    return response;
  } catch (error) {
    console.error(`Error adding meeting link to demo ID: ${demoId}`, error);
    throw error;
  }
};

// Mark a demo as completed
export const completeDemoActivity = async (
  demoId: string,
  feedback: string,
  performedBy: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<DemoActivityResponse> => {
  try {
    const activityData = {
      demoId,
      action: 'demo_completed',
      description: 'Demo completed successfully with client',
      performedBy,
      priority,
      details: {
        field: 'status',
        oldValue: 'scheduled',
        newValue: 'completed',
        feedbackDetails: feedback
      }
    };

    const response = await post<DemoActivityResponse>('/api/demo-activities/', activityData);
    return response;
  } catch (error) {
    console.error(`Error marking demo as completed for ID: ${demoId}`, error);
    throw error;
  }
}; 