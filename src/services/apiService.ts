import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Check if there's a BASE_URL constant at the top of the file and update it
// If not, add one
const BASE_URL = 'http://localhost:7505';

// Axios instance without authentication token
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios instance with authentication token
const authApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token in authenticated requests
authApiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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

// HTTP method wrappers with token
export const authGet = <T>(url: string, params?: any): Promise<T> => {
  return authRequest<T>({ method: 'GET', url, params });
};

export const authPost = <T>(url: string, data?: any): Promise<T> => {
  return authRequest<T>({ method: 'POST', url, data });
};

export const authPut = <T>(url: string, data?: any): Promise<T> => {
  return authRequest<T>({ method: 'PUT', url, data });
};

export const authDel = <T>(url: string): Promise<T> => {
  return authRequest<T>({ method: 'DELETE', url });
};