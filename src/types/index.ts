// Global TypeScript interfaces and types

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherData {
  weather: Weather[];
  main: MainWeatherData;
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  country: string;
}

export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

export interface Alert {
  id: string;
  location: string;
  locationCoords?: Location;
  parameter: AlertParameter;
  threshold: number;
  isTriggered: boolean;
  createdAt: string;
  lastTriggered?: string;
}

export type AlertParameter = 
  | 'temperature'
  | 'humidity' 
  | 'wind_speed'
  | 'pressure'
  | 'visibility';

export interface CreateAlertRequest {
  location: string;
  locationCoords?: Location;
  parameter: AlertParameter;
  threshold: number;
}

export interface AlertSnapshot {
  totalAlerts: number;
  triggeredAlerts: number;
  alerts: Alert[];
  lastChecked: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}