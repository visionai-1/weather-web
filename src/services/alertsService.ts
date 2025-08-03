import { alertsApi, apiRequest } from './api';
import type { Alert, CreateAlertRequest, AlertSnapshot, ApiResponse } from '@/types';

// Mock data for demo purposes
const getMockAlerts = (): Alert[] => {
  return [
    {
      id: '1',
      _id: '507f1f77bcf86cd799439011',
      type: 'realtime',
      parameter: 'temperature',
      operator: '>',
      threshold: 30,
      location: {
        lat: 40.7128,
        lon: -74.0060,
        city: 'New York, NY',
      },
      name: 'NYC Heat Alert',
      description: 'Alert when temperature exceeds 30°C in New York',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      lastState: 'triggered',
    },
    {
      id: '2',
      _id: '507f1f77bcf86cd799439012',
      type: 'forecast',
      parameter: 'humidity',
      operator: '>=',
      threshold: 80,
      location: {
        lat: 51.5074,
        lon: -0.1278,
        city: 'London, UK',
      },
      timestep: '1h',
      name: 'London Humidity Alert',
      description: 'Alert when humidity reaches 80% or higher',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z',
      lastState: 'not_triggered',
    },
    {
      id: '3',
      _id: '507f1f77bcf86cd799439013',
      type: 'realtime',
      parameter: 'wind_speed',
      operator: '>',
      threshold: 15,
      location: {
        lat: 35.6762,
        lon: 139.6503,
        city: 'Tokyo, Japan',
      },
      name: 'Tokyo Wind Alert',
      description: 'High wind speed alert for Tokyo',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-19T11:20:00Z',
      lastState: 'triggered',
    },
    {
      id: '4',
      _id: '507f1f77bcf86cd799439014',
      type: 'forecast',
      parameter: 'pressure',
      operator: '<',
      threshold: 1000,
      location: {
        lat: -33.8688,
        lon: 151.2093,
        city: 'Sydney, Australia',
      },
      timestep: '1d',
      name: 'Sydney Pressure Drop',
      description: 'Low pressure alert for Sydney',
      createdAt: '2024-01-18T12:30:00Z',
      updatedAt: '2024-01-18T12:30:00Z',
      lastState: 'not_triggered',
    },
  ];
};

// Get all alerts
export const getAlerts = async (): Promise<ApiResponse<Alert[]>> => {
  // For demo purposes, return mock data if API is not available
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return {
      data: getMockAlerts(),
      success: true,
    };
  }

  return apiRequest<Alert[]>(alertsApi, {
    method: 'GET',
    url: '/alerts',
  });
};

// Create a new alert
export const createAlert = async (alertData: CreateAlertRequest): Promise<ApiResponse<Alert>> => {
  // For demo purposes, return mock response
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    const newAlert: Alert = {
      id: Date.now().toString(),
      _id: new Date().getTime().toString(16) + Math.random().toString(16).substr(2, 8),
      type: alertData.type,
      parameter: alertData.parameter,
      operator: alertData.operator,
      threshold: alertData.threshold,
      location: alertData.location,
      timestep: alertData.timestep,
      name: alertData.name,
      description: alertData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastState: Math.random() > 0.7 ? 'triggered' : 'not_triggered', // Random state for demo
    };
    
    return {
      data: newAlert,
      success: true,
      message: 'Alert created successfully',
    };
  }

  return apiRequest<Alert>(alertsApi, {
    method: 'POST',
    url: '/alerts',
    data: alertData,
  });
};

// Update an alert
export const updateAlert = async (alertId: string, alertData: Partial<Alert>): Promise<ApiResponse<Alert>> => {
  return apiRequest<Alert>(alertsApi, {
    method: 'PUT',
    url: `/alerts/${alertId}`,
    data: alertData,
  });
};

// Delete an alert
export const deleteAlert = async (alertId: string): Promise<ApiResponse<void>> => {
  return apiRequest<void>(alertsApi, {
    method: 'DELETE',
    url: `/alerts/${alertId}`,
  });
};

// Get current state of all alerts
export const getAlertsSnapshot = async (): Promise<ApiResponse<AlertSnapshot>> => {
  // For demo purposes, return mock data
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    const alerts = getMockAlerts();
    const triggeredAlerts = alerts.filter(alert => alert.lastState === 'triggered');
    
    return {
      data: {
        totalAlerts: alerts.length,
        triggeredAlerts: triggeredAlerts.length,
        alerts,
        lastChecked: new Date().toISOString(),
      },
      success: true,
    };
  }

  return apiRequest<AlertSnapshot>(alertsApi, {
    method: 'GET',
    url: '/alerts/snapshot',
  });
};


// Alerts service object for backward compatibility (optional)
export const alertsService = {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertsSnapshot,
};