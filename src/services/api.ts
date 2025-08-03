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
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: any) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('❌ Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

// Debug environment variables
console.log('🔍 Environment Variables Check:');
console.log('VITE_ALERTS_API_URL:', import.meta.env.VITE_ALERTS_API_URL);
console.log('VITE_TOMORROW_WEATHER_API_URL:', import.meta.env.VITE_TOMORROW_WEATHER_API_URL);

// API instances
const alertsApiUrl = import.meta.env.VITE_ALERTS_API_URL || 'http://localhost:3001/api/v1';
const weatherApiUrl = import.meta.env.VITE_TOMORROW_WEATHER_API_URL || 'http://localhost:3000/api/v1';

console.log('🔧 Using Alerts API URL:', alertsApiUrl);
console.log('🔧 Using Weather API URL:', weatherApiUrl);

export const alertsApi = createApiInstance(alertsApiUrl);
export const tomorrowWeatherApi = createApiInstance(weatherApiUrl);

// Generic API helper functions
export const apiRequest = async <T>(
  instance: AxiosInstance,
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await instance(config);
    // API response already has {success, data, message} format
    return response.data as ApiResponse<T>;
  } catch (error: any) {
    return {
      data: {} as T,
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};