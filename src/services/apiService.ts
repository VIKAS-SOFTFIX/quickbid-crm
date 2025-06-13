import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Check if there's a BASE_URL constant at the top of the file and update it
// If not, add one
const BASE_URL = 'http://localhost:7505';

// Update the cookie name to match what the server sends
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

// Create a custom axios instance that sends cookies but no auth header
const createAxiosInstance = (includeAuth: boolean = false) => {
  const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
    withCredentials: includeAuth, // Include cookies only for authenticated requests
  });
  
  if (includeAuth) {
    // For authenticated requests, ensure auth cookie is set before making the request
    instance.interceptors.request.use(
      (config) => {
        ensureAuthCookie();
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
  }
  
  return instance;
};

// Axios instance without authentication token
const apiClient = createAxiosInstance();

// Axios instance with authentication token
const authApiClient = createAxiosInstance(true);

// Add response interceptor to handle common errors
authApiClient.interceptors.response.use(
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

// Generic request function without token
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Generic request function with token
export const authRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await authApiClient(config);
    return response.data;
  } catch (error) {
    console.error('Auth API request error:', error);
    throw error;
  }
};

// HTTP method wrappers without token
export const get = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error(`GET request failed for ${url}:`, error);
    throw error;
  }
};

export const post = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`POST request failed for ${url}:`, error);
    throw error;
  }
};

export const put = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`PUT request failed for ${url}:`, error);
    throw error;
  }
};

export const del = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error(`DELETE request failed for ${url}:`, error);
    throw error;
  }
};

// HTTP method wrappers with token (using cookies)
export const authGet = <T>(url: string, params?: any): Promise<T> => {
  ensureAuthCookie(); // Make sure auth cookie is set before request
  return authRequest<T>({ method: 'GET', url, params });
};

export const authPost = <T>(url: string, data?: any): Promise<T> => {
  ensureAuthCookie(); // Make sure auth cookie is set before request
  return authRequest<T>({ method: 'POST', url, data });
};

export const authPut = <T>(url: string, data?: any): Promise<T> => {
  ensureAuthCookie(); // Make sure auth cookie is set before request
  return authRequest<T>({ method: 'PUT', url, data });
};

export const authDel = <T>(url: string): Promise<T> => {
  ensureAuthCookie(); // Make sure auth cookie is set before request
  return authRequest<T>({ method: 'DELETE', url });
};