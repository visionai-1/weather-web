import { apiRequest, tomorrowWeatherApi } from './api';
import type { WeatherData, ForecastData, Location, ApiResponse } from '@/types';

// Get current weather by location coordinates
export const getCurrentWeather = async (location: Location): Promise<ApiResponse<WeatherData>> => {
  return apiRequest<WeatherData>(tomorrowWeatherApi, {
    method: 'GET',
    url: 'weather/realtime',
    params: {
      lat: location.lat,
      lon: location.lon,
      units: 'metric',
      format: 'full',
    },
  });
};

// Get current weather by city name
export const getCurrentWeatherByCity = async (cityName: string): Promise<ApiResponse<WeatherData>> => {
  return apiRequest<WeatherData>(tomorrowWeatherApi, {
    method: 'GET',
    url: 'weather/realtime',
    params: {
      city: cityName,
      units: 'metric',
      format: 'full',
    },
  });
};

// Get weather forecast by location coordinates
export const getWeatherForecast = async (
  location: Location, 
  timesteps: '1h' | '1d' = '1h'
): Promise<ApiResponse<ForecastData>> => {
  return apiRequest<ForecastData>(tomorrowWeatherApi, {
    method: 'GET',
    url: 'weather/forecast',
    params: {
      lat: location.lat,
      lon: location.lon,
      timesteps,
      units: 'metric',
    },
  });
};

// Get weather forecast by city name
export const getWeatherForecastByCity = async (
  cityName: string, 
  timesteps: '1h' | '1d' = '1h'
): Promise<ApiResponse<ForecastData>> => {
  return apiRequest<ForecastData>(tomorrowWeatherApi, {
    method: 'GET',
    url: 'weather/forecast',
    params: {
      city: cityName,
      timesteps,
      units: 'metric',
    },
  });
};

// Get weather by coordinates (alias for getCurrentWeather)
export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<ApiResponse<WeatherData>> => {
  return getCurrentWeather({ lat, lon });
};

// Weather service object for backward compatibility
export const weatherService = {
  getCurrentWeather,
  getCurrentWeatherByCity,
  getWeatherByCoordinates,
  getWeatherForecast,
  getWeatherForecastByCity,
};