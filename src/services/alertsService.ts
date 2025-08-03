import { alertsApi, apiRequest } from './api';
import type { Alert, CreateAlertRequest, ApiResponse } from '@/types';

// Get all alerts
export const getAlerts = async (): Promise<ApiResponse<Alert[]>> => {
  return apiRequest<Alert[]>(alertsApi, {
    method: 'GET',
    url: '/alerts',
  });
};

// Create a new alert
export const createAlert = async (alertData: CreateAlertRequest): Promise<ApiResponse<Alert>> => {
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

// Check a specific alert against current weather
export const checkAlert = async (alertId: string): Promise<ApiResponse<Alert>> => {
  return apiRequest<Alert>(alertsApi, {
    method: 'POST',
    url: `/alerts/${alertId}/check`,
  });
};

// Alerts service object for backward compatibility
export const alertsService = {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkAlert,
};