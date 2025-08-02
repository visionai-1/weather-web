import { alertsApi, apiRequest } from './api';
import type { Alert, CreateAlertRequest, AlertSnapshot, ApiResponse } from '@/types';

// Mock data for demo purposes
const getMockAlerts = (): Alert[] => {
  return [
    {
      id: '1',
      location: 'New York, NY',
      locationCoords: { lat: 40.7128, lon: -74.0060 },
      parameter: 'temperature',
      threshold: 30,
      isTriggered: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastTriggered: '2024-01-20T14:30:00Z',
    },
    {
      id: '2',
      location: 'London, UK',
      locationCoords: { lat: 51.5074, lon: -0.1278 },
      parameter: 'humidity',
      threshold: 80,
      isTriggered: false,
      createdAt: '2024-01-10T09:15:00Z',
    },
    {
      id: '3',
      location: 'Tokyo, Japan',
      locationCoords: { lat: 35.6762, lon: 139.6503 },
      parameter: 'wind_speed',
      threshold: 15,
      isTriggered: true,
      createdAt: '2024-01-12T16:45:00Z',
      lastTriggered: '2024-01-19T11:20:00Z',
    },
    {
      id: '4',
      location: 'Sydney, Australia',
      locationCoords: { lat: -33.8688, lon: 151.2093 },
      parameter: 'pressure',
      threshold: 1000,
      isTriggered: false,
      createdAt: '2024-01-18T12:30:00Z',
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
      location: alertData.location,
      locationCoords: alertData.locationCoords,
      parameter: alertData.parameter,
      threshold: alertData.threshold,
      isTriggered: Math.random() > 0.7, // Random trigger state for demo
      createdAt: new Date().toISOString(),
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
    const triggeredAlerts = alerts.filter(alert => alert.isTriggered);
    
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

// Check a specific alert against current weather
export const checkAlert = async (alertId: string): Promise<ApiResponse<Alert>> => {
  return apiRequest<Alert>(alertsApi, {
    method: 'POST',
    url: `/alerts/${alertId}/check`,
  });
};

// Alerts service object for backward compatibility (optional)
export const alertsService = {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertsSnapshot,
  checkAlert,
};