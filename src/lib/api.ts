// API service for user management

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://api.quickbid.co.in/support/api';
const AUTH_COOKIE_NAME = 'auth_token';

// Helper function to ensure the auth token is set as a cookie
const ensureAuthCookie = (): void => {
  if (typeof window !== 'undefined') {
    // If token exists in localStorage but not in cookies, set it in cookies
    const localStorageToken = localStorage.getItem(AUTH_COOKIE_NAME);
    const cookieToken = Cookies.get(AUTH_COOKIE_NAME);

    if (localStorageToken && !cookieToken) {
      Cookies.set(AUTH_COOKIE_NAME, localStorageToken);
    }
  }
};

// Create axios instance with cookies but no auth header
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',

    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }

});

// Add request interceptor to ensure auth cookie is set
apiClient.interceptors.request.use(
  (config) => {
    ensureAuthCookie();
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      if (error.response.status === 401) {
        console.error('Authentication error: Token may be invalid or expired');
      }
      console.error(`API Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// User API functions
export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users');

    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Role API functions
export const fetchRoles = async () => {
  try {
    const response = await apiClient.get('/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const fetchUserRoles = async (userId: string) => {
  try {
    const response = await apiClient.get(`/roles/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error);
    throw error;
  }
};

// Permission API functions
export const fetchPermissions = async () => {
  try {
    const response = await apiClient.get('/roles/permissions');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData: any) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update a user
export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// Create a new role
export const createRole = async (roleData: any) => {
  try {
    const response = await apiClient.post('/roles', roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Update a role
export const updateRole = async (roleId: string, roleData: any) => {
  try {
    const response = await apiClient.put(`/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error(`Error updating role ${roleId}:`, error);
    throw error;
  }
};

// Delete a role
export const deleteRole = async (roleId: string) => {
  try {
    const response = await apiClient.delete(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting role ${roleId}:`, error);
    throw error;
  }
};

// Update permissions for a role
export const updateRolePermissions = async (roleId: string, permissions: string[]) => {
  try {
    const response = await apiClient.put(`/roles/${roleId}/permissions`, { permissions });
    return response.data;
  } catch (error) {
    console.error(`Error updating permissions for role ${roleId}:`, error);
    throw error;
  }
};

// Lead API functions
interface LeadFilter {
  status?: string;
  assignedTo?: string;
  source?: string;
  search?: string;
  tags?: string[];
}

export interface LeadData {
  id?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status?: string;
  source?: string;
  type?: string;
  assignedTo?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  [key: string]: any;
}

export interface LeadActivityData {
  id?: string;
  leadId: string;
  type: string;
  description: string;
  dueDate?: string;
  completed?: boolean;
  assignedTo?: string;
  notes?: string;
  [key: string]: any;
}

// Create a lead
export const createLead = async (leadData: LeadData) => {
  try {
    const response = await apiClient.post('/leads', leadData);
    return response.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

// Get a lead by ID
export const fetchLeadById = async (leadId: string) => {
  try {
    // MongoDB uses _id, so ensure we're using the correct parameter
    const response = await apiClient.get(`/leads/${leadId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lead ${leadId}:`, error);
    throw error;
  }
};

// Update a lead
export const updateLead = async (leadId: string, leadData: Partial<LeadData>) => {
  try {
    const response = await apiClient.put(`/leads/${leadId}`, leadData);
    return response.data;
  } catch (error) {
    console.error(`Error updating lead ${leadId}:`, error);
    throw error;
  }
};

// Delete a lead
export const deleteLead = async (leadId: string) => {
  try {
    const response = await apiClient.delete(`/leads/${leadId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting lead ${leadId}:`, error);
    throw error;
  }
};

// Get all leads with optional filtering and pagination
export const fetchLeads = async (filters?: LeadFilter, page: number = 1, limit: number = 10) => {
  try {
    let queryParams = new URLSearchParams();

    // Add pagination parameters
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    // Add filter parameters if they exist
    if (filters) {
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
      if (filters.source) queryParams.append('source', filters.source);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.tags && filters.tags.length > 0) queryParams.append('tags', filters.tags.join(','));
    }

    const response = await apiClient.get(`/leads?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

// Get lead counts by status
export const fetchLeadCounts = async () => {
  try {
    const response = await apiClient.get('/leads/counts');
    return response.data;
  } catch (error) {
    console.error('Error fetching lead counts:', error);
    throw error;
  }
};

// Create a lead activity
export const createLeadActivity = async (activityData: LeadActivityData) => {
  try {
    // Create a new object for the API request with the correct property name
    const apiRequestData = {
      lead: activityData.leadId,
      type: activityData.type,
      description: activityData.description,
      dueDate: activityData.dueDate,
      completed: activityData.completed,
      assignedTo: activityData.assignedTo,
      notes: activityData.notes,
      // Add any other properties
      ...(activityData.id && { id: activityData.id })
    };

    const response = await apiClient.post('/leads/activities', apiRequestData);
    return response.data;
  } catch (error) {
    console.error('Error creating lead activity:', error);
    throw error;
  }
};

// Get a lead activity by ID
export const fetchLeadActivityById = async (activityId: string) => {
  try {
    const response = await apiClient.get(`/leads/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lead activity ${activityId}:`, error);
    throw error;
  }
};

// Update a lead activity
export const updateLeadActivity = async (activityId: string, activityData: Partial<LeadActivityData>) => {
  try {
    const response = await apiClient.put(`/leads/activities/${activityId}`, activityData);
    return response.data;
  } catch (error) {
    console.error(`Error updating lead activity ${activityId}:`, error);
    throw error;
  }
};

// Delete a lead activity
export const deleteLeadActivity = async (activityId: string) => {
  try {
    const response = await apiClient.delete(`/leads/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting lead activity ${activityId}:`, error);
    throw error;
  }
};

// Get all activities for a lead
export const fetchLeadActivities = async (leadId: string, page: number = 1, limit: number = 10) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await apiClient.get(`/leads/${leadId}/activities?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activities for lead ${leadId}:`, error);
    throw error;
  }
};

// Schedule a new activity for a lead
export const scheduleLeadActivity = async (activityData: LeadActivityData) => {
  try {
    // Create a new object for the API request with the correct property name
    const apiRequestData = {
      lead: activityData.leadId,
      type: activityData.type,
      description: activityData.description,
      dueDate: activityData.dueDate,
      completed: activityData.completed,
      assignedTo: activityData.assignedTo,
      notes: activityData.notes,
      // Add any other properties
      ...(activityData.id && { id: activityData.id })
    };

    const response = await apiClient.post('/leads/schedule-activity', apiRequestData);
    return response.data;
  } catch (error) {
    console.error('Error scheduling lead activity:', error);
    throw error;
  }
};

// Mark an activity as complete
export const completeLeadActivity = async (activityId: string) => {
  try {
    const response = await apiClient.put(`/leads/activities/${activityId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Error completing lead activity ${activityId}:`, error);
    throw error;
  }
};

// Assign a lead to a user
export const assignLead = async (leadId: string, userId: string) => {
  try {
    const response = await apiClient.put(`/leads/${leadId}`, { assignedTo: userId });
    return response.data;
  } catch (error) {
    console.error(`Error assigning lead ${leadId} to user ${userId}:`, error);
    throw error;
  }
}; 