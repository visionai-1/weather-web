// Global TypeScript interfaces and types

export interface WeatherData {
  location: Location;
  timestamp?: Date | string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  precipitation: {
    intensity: number;
    probability: number;
  };
  condition: string;
  // Optional fields that may not be available from all APIs
  humidity?: number;
  visibility?: number;
  uvIndex?: number;
  cloudCover?: number;
  pressure?: number;
  weatherCode?: number;
  description?: string;
}

export interface ForecastData {
  location: Location;
  timestep: '1d' | '1h';
  intervals: Array<{
    time: Date | string;
    temperature: number;              // hourly: temperature, daily: max temp
    feelsLike: number;               // hourly: apparent, daily: max apparent
    humidity: number;                // avg humidity
    cloudCover: number;              // avg cloud cover
    precipitationChance: number;     // max precipitation probability
    windSpeed: number;               // avg wind speed
    uvIndex: number;                 // max uv
    sunrise?: string;                // only in daily
    sunset?: string;                 // only in daily
    weatherCode: number;
    description: string;
  }>;
}

export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

export type AlertOperator = '>' | '<' | '>=' | '<=' | '==' | '!=';

export interface Alert {
  _id?: string; // MongoDB ObjectId
  id?: string; // For compatibility
  type: 'realtime' | 'forecast';
  parameter: string;
  operator: AlertOperator;
  threshold: number;
  location: LocationQuery;
  timestep?: '1h' | '1d';
  name?: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastState?: 'triggered' | 'not_triggered';
}

export interface LocationQuery {
  lat?: number;
  lon?: number;
  city?: string;
}

export type AlertParameter = 
  | 'temperature'
  | 'humidity' 
  | 'wind_speed'
  | 'pressure'
  | 'visibility'
  | 'precipitation'
  | 'cloud_cover'
  | 'uv_index';


export interface CreateAlertRequest {
  type: 'realtime' | 'forecast';
  parameter: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  threshold: number;
  location: LocationQuery;
  timestep?: '1h' | '1d';
  name?: string;
  description?: string;
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