import type { AlertParameter, Location } from '@/types';

// Weather related constants
export const WEATHER_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const GEOLOCATION_TIMEOUT = 10000; // 10 seconds
export const GEOLOCATION_MAX_AGE = 300000; // 5 minutes

// Alert parameter configurations
export const ALERT_PARAMETERS: Record<AlertParameter, {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}> = {
  temperature: {
    label: 'Temperature',
    unit: '°C',
    min: -50,
    max: 60,
    step: 0.5,
  },
  humidity: {
    label: 'Humidity',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
  },
  wind_speed: {
    label: 'Wind Speed',
    unit: 'm/s',
    min: 0,
    max: 50,
    step: 0.1,
  },
  pressure: {
    label: 'Pressure',
    unit: 'hPa',
    min: 800,
    max: 1200,
    step: 1,
  },
  visibility: {
    label: 'Visibility',
    unit: 'km',
    min: 0,
    max: 50,
    step: 0.1,
  },
};

// Default/fallback locations
export const FALLBACK_LOCATIONS: Location[] = [
  { lat: 40.7128, lon: -74.0060, name: 'New York, NY' },
  { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
  { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
  { lat: 48.8566, lon: 2.3522, name: 'Paris, France' },
  { lat: 37.7749, lon: -122.4194, name: 'San Francisco, CA' },
];

// Wind direction mappings
export const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
];

// Status color mappings
export const STATUS_COLORS = {
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
} as const;

// API configuration
export const API_TIMEOUTS = {
  default: 10000,
  weather: 8000,
  alerts: 12000,
} as const;

// Cache configuration
export const CACHE_TIMES = {
  weather: 5 * 60 * 1000, // 5 minutes
  alerts: 2 * 60 * 1000, // 2 minutes
  snapshot: 30 * 1000, // 30 seconds
} as const;

// Responsive breakpoints (matching theme)
export const BREAKPOINTS = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
} as const;

// Weather condition icons mapping
export const WEATHER_ICONS = {
  '01d': 'clear-day',
  '01n': 'clear-night',
  '02d': 'partly-cloudy-day',
  '02n': 'partly-cloudy-night',
  '03d': 'cloudy',
  '03n': 'cloudy',
  '04d': 'overcast',
  '04n': 'overcast',
  '09d': 'showers',
  '09n': 'showers',
  '10d': 'rain',
  '10n': 'rain',
  '11d': 'thunderstorm',
  '11n': 'thunderstorm',
  '13d': 'snow',
  '13n': 'snow',
  '50d': 'fog',
  '50n': 'fog',
} as const;