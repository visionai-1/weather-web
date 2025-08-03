import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AlertParameter } from '@/types';

dayjs.extend(relativeTime);

// Temperature formatting
export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

// Humidity formatting
export const formatHumidity = (humidity: number): string => {
  return `${humidity}%`;
};

// Wind speed formatting
export const formatWindSpeed = (speed: number): string => {
  return `${speed.toFixed(1)} m/s`;
};

// Pressure formatting
export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

// Visibility formatting
export const formatVisibility = (visibility: number): string => {
  return `${(visibility / 1000).toFixed(1)} km`;
};

// Generic parameter formatter
export const formatParameter = (parameter: string | AlertParameter, value: number): string => {
  switch (parameter) {
    case 'temperature':
      return formatTemperature(value);
    case 'humidity':
      return formatHumidity(value);
    case 'wind_speed':
      return formatWindSpeed(value);
    case 'pressure':
      return formatPressure(value);
    case 'visibility':
      return formatVisibility(value);
    case 'precipitation':
      return `${value.toFixed(1)} mm`;
    case 'cloud_cover':
      return `${value}%`;
    case 'uv_index':
      return value.toString();
    default:
      return value.toString();
  }
};

// Parameter labels
export const getParameterLabel = (parameter: string | AlertParameter): string => {
  switch (parameter) {
    case 'temperature':
      return 'Temperature';
    case 'humidity':
      return 'Humidity';
    case 'wind_speed':
      return 'Wind Speed';
    case 'pressure':
      return 'Pressure';
    case 'visibility':
      return 'Visibility';
    case 'precipitation':
      return 'Precipitation';
    case 'cloud_cover':
      return 'Cloud Cover';
    case 'uv_index':
      return 'UV Index';
    default:
      // Capitalize and format string parameters
      return parameter.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
  }
};

// Parameter units
export const getParameterUnit = (parameter: string | AlertParameter): string => {
  switch (parameter) {
    case 'temperature':
      return '°C';
    case 'humidity':
      return '%';
    case 'wind_speed':
      return 'm/s';
    case 'pressure':
      return 'hPa';
    case 'visibility':
      return 'km';
    case 'precipitation':
      return 'mm';
    case 'cloud_cover':
      return '%';
    case 'uv_index':
      return '';
    default:
      return '';
  }
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

// Weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};