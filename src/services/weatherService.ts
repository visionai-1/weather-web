import { weatherApi, apiRequest, getWeatherApiKey } from './api';
import type { WeatherData, Location, ApiResponse } from '@/types';

// Get API key helper
const getApiKey = () => getWeatherApiKey();

// Mock method for demo purposes when API key is not available
export const getMockWeatherData = (location?: Location): WeatherData => {
  return {
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    main: {
      temp: 22.5,
      feels_like: 24.1,
      temp_min: 20.0,
      temp_max: 25.0,
      pressure: 1013,
      humidity: 60,
    },
    visibility: 10000,
    wind: {
      speed: 3.2,
      deg: 180,
    },
    name: location?.name || 'Demo City',
    country: 'XX',
  };
};

// Get current weather by location coordinates
export const getCurrentWeather = async (location: Location): Promise<ApiResponse<WeatherData>> => {
  return apiRequest<WeatherData>(weatherApi, {
    method: 'GET',
    url: '/weather',
    params: {
      lat: location.lat,
      lon: location.lon,
      appid: getApiKey(),
      units: 'metric', // Celsius
    },
  });
};

// Get current weather by city name
export const getCurrentWeatherByCity = async (cityName: string): Promise<ApiResponse<WeatherData>> => {
  return apiRequest<WeatherData>(weatherApi, {
    method: 'GET',
    url: '/weather',
    params: {
      q: cityName,
      appid: getApiKey(),
      units: 'metric',
    },
  });
};

// Get weather by coordinates (alias for getCurrentWeather)
export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<ApiResponse<WeatherData>> => {
  return getCurrentWeather({ lat, lon });
};

// Geocoding service to convert city names to coordinates
export const geocodeCity = async (cityName: string): Promise<ApiResponse<Location[]>> => {
  return apiRequest<Location[]>(weatherApi, {
    method: 'GET',
    url: '/geo/1.0/direct',
    params: {
      q: cityName,
      limit: 5,
      appid: getApiKey(),
    },
  });
};

// Reverse geocoding to get city name from coordinates
export const reverseGeocode = async (lat: number, lon: number): Promise<ApiResponse<Location[]>> => {
  return apiRequest<Location[]>(weatherApi, {
    method: 'GET',
    url: '/geo/1.0/reverse',
    params: {
      lat,
      lon,
      limit: 1,
      appid: getApiKey(),
    },
  });
};

// Weather service object for backward compatibility (optional)
export const weatherService = {
  getCurrentWeather,
  getCurrentWeatherByCity,
  getWeatherByCoordinates,
  geocodeCity,
  reverseGeocode,
  getMockWeatherData,
};