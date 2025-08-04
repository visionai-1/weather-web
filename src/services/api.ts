import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

// Create axios instance with base configuration
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 50000,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    withCredentials: false, // Disable credentials for CORS
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: any) => {
      // Add CORS headers for production
      if (import.meta.env.PROD) {
        config.headers['Origin'] = window.location.origin;
      }
      
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor with CORS error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      // Handle CORS errors specifically
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        console.error('❌ CORS Error:', error.message);
        return Promise.reject({
          ...error,
          message: 'Network error: Unable to connect to the server. Please check your internet connection.',
        });
      }
      
      // Handle other network errors
      if (!error.response) {
        console.error('❌ Network Error:', error.message);
        return Promise.reject({
          ...error,
          message: 'Network error: Unable to reach the server.',
        });
      }
      
      console.error('❌ Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

// Debug environment variables
console.log('🔍 Environment Variables Check:');
console.log('NODE_ENV:', import.meta.env.MODE);
console.log('VITE_ALERTS_API_URL:', import.meta.env.VITE_ALERTS_API_URL);
console.log('VITE_TOMORROW_WEATHER_API_URL:', import.meta.env.VITE_TOMORROW_WEATHER_API_URL);

// API instances with fallback URLs
const alertsApiUrl = `${import.meta.env.VITE_ALERTS_API_URL}/api/v1`
const weatherApiUrl = `${import.meta.env.VITE_TOMORROW_WEATHER_API_URL}/api/v1`

console.log('🔧 Using Alerts API URL:', alertsApiUrl);
console.log('🔧 Using Weather API URL:', weatherApiUrl);

export const alertsApi = createApiInstance(alertsApiUrl);
export const tomorrowWeatherApi = createApiInstance(weatherApiUrl);

// Generic API helper functions with retry logic
export const apiRequest = async <T>(
  instance: AxiosInstance,
  config: AxiosRequestConfig,
  retries = 2
): Promise<ApiResponse<T>> => {
  try {
    const response = await instance(config);
    // API response already has {success, data, message} format
    return response.data as ApiResponse<T>;
  } catch (error: any) {
    // Retry logic for network errors
    if (retries > 0 && (error.code === 'ERR_NETWORK' || !error.response)) {
      console.log(`🔄 Retrying request... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return apiRequest(instance, config, retries - 1);
    }
    
    return {
      data: {} as T,
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};