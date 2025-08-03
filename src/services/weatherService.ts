import { apiRequest, tomorrowWeatherApi } from './api';
import type { WeatherData, ForecastData, Location, ApiResponse } from '@/types';

// Mock weather data for development/demo
export const getMockWeatherData = (location?: Location): WeatherData => {
  const randomTemp = Math.floor(Math.random() * 35) + 5; // 5-40°C
  const randomHumidity = Math.floor(Math.random() * 60) + 30; // 30-90%
  
  return {
    location: location || { lat: 40.7128, lon: -74.0060, name: 'Demo Location' },
    timestamp: new Date().toISOString(),
    temperature: randomTemp,
    humidity: randomHumidity,
    windSpeed: Math.random() * 10 + 2,
    windDirection: Math.floor(Math.random() * 360),
    precipitation: {
      intensity: Math.random() * 5,
      probability: Math.random() * 100,
    },
    visibility: 10000 + Math.floor(Math.random() * 5000),
    uvIndex: Math.floor(Math.random() * 11),
    cloudCover: Math.floor(Math.random() * 100),
    pressure: 1013 + Math.floor(Math.random() * 40) - 20,
    weatherCode: 1000,
    description: 'Clear sky',
  };
};

// Get current weather by location coordinates
export const getCurrentWeather = async (location: Location): Promise<ApiResponse<WeatherData>> => {
  // For demo purposes, return mock data if API is not available
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return {
      data: getMockWeatherData(location),
      success: true,
    };
  }

  return apiRequest<WeatherData>(tomorrowWeatherApi, {
    method: 'GET',
    url: 'weather/realtime',
    params: {
      lat: location.lat,
      lon: location.lon,
      units: 'metric',
      format: 'json',
    },
  });
};

// Get current weather by city name
export const getCurrentWeatherByCity = async (cityName: string): Promise<ApiResponse<WeatherData>> => {
  // For demo purposes, return mock data if API is not available
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return {
      data: getMockWeatherData({ lat: 0, lon: 0, name: cityName }),
      success: true,
    };
  }

  return apiRequest<WeatherData>(tomorrowWeatherApi, {
    method: 'GET',
    url: 'weather/realtime',
    params: {
      city: cityName,
      units: 'metric',
      format: 'json',
    },
  });
};

// Get weather forecast by location coordinates
export const getWeatherForecast = async (
  location: Location, 
  timesteps: '1h' | '1d' = '1h'
): Promise<ApiResponse<ForecastData>> => {
  // For demo purposes, return mock data if API is not available
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    const intervals = Array.from({ length: timesteps === '1h' ? 24 : 7 }, (_, i) => {
      const time = new Date();
      if (timesteps === '1h') {
        time.setHours(time.getHours() + i);
      } else {
        time.setDate(time.getDate() + i);
      }
      
      return {
        time: time.toISOString(),
        temperature: Math.floor(Math.random() * 35) + 5,
        feelsLike: Math.floor(Math.random() * 35) + 5,
        humidity: Math.floor(Math.random() * 60) + 30,
        cloudCover: Math.floor(Math.random() * 100),
        precipitationChance: Math.floor(Math.random() * 100),
        windSpeed: Math.random() * 10 + 2,
        uvIndex: Math.floor(Math.random() * 11),
        sunrise: timesteps === '1d' ? '06:30' : undefined,
        sunset: timesteps === '1d' ? '18:45' : undefined,
        weatherCode: 1000,
        description: 'Clear sky',
      };
    });

    return {
      data: {
        location: location || { lat: 40.7128, lon: -74.0060, name: 'Demo Location' },
        timestep: timesteps,
        intervals,
      },
      success: true,
    };
  }

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
  // For demo purposes, return mock data if API is not available
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    const intervals = Array.from({ length: timesteps === '1h' ? 24 : 7 }, (_, i) => {
      const time = new Date();
      if (timesteps === '1h') {
        time.setHours(time.getHours() + i);
      } else {
        time.setDate(time.getDate() + i);
      }
      
      return {
        time: time.toISOString(),
        temperature: Math.floor(Math.random() * 35) + 5,
        feelsLike: Math.floor(Math.random() * 35) + 5,
        humidity: Math.floor(Math.random() * 60) + 30,
        cloudCover: Math.floor(Math.random() * 100),
        precipitationChance: Math.floor(Math.random() * 100),
        windSpeed: Math.random() * 10 + 2,
        uvIndex: Math.floor(Math.random() * 11),
        sunrise: timesteps === '1d' ? '06:30' : undefined,
        sunset: timesteps === '1d' ? '18:45' : undefined,
        weatherCode: 1000,
        description: 'Clear sky',
      };
    });

    return {
      data: {
        location: { lat: 0, lon: 0, name: cityName },
        timestep: timesteps,
        intervals,
      },
      success: true,
    };
  }

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

// Weather service object for backward compatibility (optional)
export const weatherService = {
  getCurrentWeather,
  getCurrentWeatherByCity,
  getWeatherByCoordinates,
  getWeatherForecast,
  getWeatherForecastByCity,
  getMockWeatherData,
};