import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quickbid.co.in/support/api';

// API Client class that handles HTTP requests with axios
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null;

  constructor() {
    this.token = null;
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );

    // Request interceptor for adding auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  // File upload with POST
  async uploadFile<T = any>(url: string, file: File, fieldName: string = 'file', config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, formData, uploadConfig);
    return response.data;
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.request(config);
    return response.data;
  }

  // For requests without authentication token
  async withoutAuth<T = any>(method: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const tempToken = this.token;
    this.token = null;
    
    try {
      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await this.get<T>(url, config);
          break;
        case 'post':
          response = await this.post<T>(url, data, config);
          break;
        case 'put':
          response = await this.put<T>(url, data, config);
          break;
        case 'patch':
          response = await this.patch<T>(url, data, config);
          break;
        case 'delete':
          response = await this.delete<T>(url, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      // Restore the original token
      this.token = tempToken;
      return response;
    } catch (error) {
      // Restore the original token even in case of error
      this.token = tempToken;
      throw error;
    }
  }

  // Error handling
  private handleError(error: any): Promise<never> {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);

      // Handle specific error status codes
      if (error.response.status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        console.error('Unauthorized access, please login again');
        // You might want to dispatch an action to clear auth state
        this.clearToken();
      }

      // Return the error data for better handling by consumers
      return Promise.reject(error.response.data || error.response);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response received from server' });
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
      return Promise.reject({ message: error.message || 'Error setting up request' });
    }
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export default instance
export default apiClient; 