import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AlertParameter } from '@/types';

dayjs.extend(relativeTime);

// Temperature formatting
export const formatTemperature = (temp: number | undefined | null): string => {
  if (temp === undefined || temp === null || isNaN(temp)) {
    return '--°C';
  }
  return `${Math.round(temp)}°C`;
};

// Humidity formatting
export const formatHumidity = (humidity: number | undefined | null): string => {
  if (humidity === undefined || humidity === null || isNaN(humidity)) {
    return '--%';
  }
  return `${Math.round(humidity)}%`;
};

// Wind speed formatting
export const formatWindSpeed = (speed: number | undefined | null): string => {
  if (speed === undefined || speed === null || isNaN(speed)) {
    return '-- m/s';
  }
  return `${speed.toFixed(1)} m/s`;
};

// Pressure formatting
export const formatPressure = (pressure: number | undefined | null): string => {
  if (pressure === undefined || pressure === null || isNaN(pressure)) {
    return '-- hPa';
  }
  return `${Math.round(pressure)} hPa`;
};

// Visibility formatting
export const formatVisibility = (visibility: number | undefined | null): string => {
  if (visibility === undefined || visibility === null || isNaN(visibility)) {
    return '-- km';
  }
  return `${(visibility / 1000).toFixed(1)} km`;
};

// Generic parameter formatter
export const formatParameter = (parameter: string | AlertParameter, value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '--';
  }
  
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
      return `${Math.round(value)}%`;
    case 'uv_index':
      return Math.round(value).toString();
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
export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) {
    return '--';
  }
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};

export const formatRelativeTime = (date: string | Date | undefined | null): string => {
  if (!date) {
    return '--';
  }
  return dayjs(date).fromNow();
};

// Weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Capitalize first letter
export const capitalize = (str: string | undefined | null): string => {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};