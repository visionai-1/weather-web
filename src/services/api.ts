import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

// Create axios instance with base configuration
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: any) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
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

// API instances
export const weatherApi = createApiInstance(import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5');
export const alertsApi = createApiInstance(import.meta.env.VITE_ALERTS_API_URL || 'http://localhost:3001/api');

// Generic API helper functions
export const apiRequest = async <T>(
  instance: AxiosInstance,
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await instance(config);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    return {
      data: {} as T,
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};

// Weather API helpers
export const getWeatherApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ OpenWeather API key not found. Please set VITE_OPENWEATHER_API_KEY in your .env file');
    return 'demo_key'; // For development purposes
  }
  return apiKey;
};