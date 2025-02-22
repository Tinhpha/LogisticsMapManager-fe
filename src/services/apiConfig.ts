/**
 * API Configuration
 * Contains all API endpoints used in the application
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const API_BASE_URL = 'https://eb69-118-70-54-222.ngrok-free.app/api';

export const API_ENDPOINTS = {
  LOCATIONS: API_BASE_URL + '/locations',
} as const;

// Create custom Axios instance
const axiosInstance: AxiosInstance = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
  },
  withCredentials: false,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const requestId = Math.random().toString(36).substring(7);
    console.group(`🌐 API Request [${requestId}]`);
    console.log('URL:', config.url);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Headers:', config.headers);
    if (config.params) {
      console.log('Query Params:', config.params);
    }
    if (config.data) {
      console.log('Request Body:', config.data);
    }
    console.groupEnd();
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.group('✅ API Response');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    if (response.data) {
      console.log('Response Data:', {
        total: response.data.total,
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        locations_count: response.data.locations?.length
      });
    }
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group('❌ API Error');
    if (error.response) {
      console.log('URL:', error.config.url);
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Error Data:', error.response.data);
    } else if (error.request) {
      console.log('Request made but no response received');
      console.log('Request:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    console.log('Error Config:', error.config);
    console.groupEnd();
    return Promise.reject(error);
  }
);

// Add global API logging interceptors
axios.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      config: error.config,
      response: error.response,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Export type for the endpoints
export type ApiEndpointKeys = keyof typeof API_ENDPOINTS;

// Import the Location type
import { Location } from '../types/location';

// Type for the API response
export type LocationsResponse = Location[];
