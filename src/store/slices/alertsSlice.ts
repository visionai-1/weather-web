import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Alert, CreateAlertRequest } from '@/types';
import { getAlerts, createAlert, deleteAlert } from '@/services/alertsService';
import { message } from 'antd';

// Simplified state interface (no snapshots)
interface AlertsState {
  // Data
  alerts: Alert[];
  
  // Simple loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Operation tracking (simplified)
  currentOperation: 'alerts' | 'create' | 'delete' | null;
  deletingId: string | null; // Track which alert is being deleted
}

// Initial state
const initialState: AlertsState = {
  alerts: [],
  isLoading: false,
  error: null,
  currentOperation: null,
  deletingId: null,
};

// Async thunks (simplified - no snapshots)
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📋 Fetching alerts...');
      const response = await getAlerts();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch alerts');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Alerts fetch error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createNewAlert = createAsyncThunk(
  'alerts/createNewAlert',
  async (alertData: CreateAlertRequest, { rejectWithValue }) => {
    try {
      console.log('🚨 Creating alert:', alertData.name);
      const response = await createAlert(alertData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create alert');
      }
      
      message.success('Alert created successfully!');
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Create alert error:', error.message);
      message.error(error.message || 'Failed to create alert');
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAlertById = createAsyncThunk(
  'alerts/deleteAlertById',
  async (alertId: string, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting alert:', alertId);
      const response = await deleteAlert(alertId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete alert');
      }
      
      message.success('Alert deleted successfully!');
      
      return alertId;
    } catch (error: any) {
      console.error('❌ Delete alert error:', error.message);
      message.error(error.message || 'Failed to delete alert');
      return rejectWithValue({ error: error.message, alertId });
    }
  }
);

// Alerts slice (simplified - no snapshots)
export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch alerts
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOperation = 'alerts';
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload;
        state.currentOperation = null;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOperation = null;
      });

    // Create new alert
    builder
      .addCase(createNewAlert.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOperation = 'create';
      })
      .addCase(createNewAlert.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts.push(action.payload);
        state.currentOperation = null;
      })
      .addCase(createNewAlert.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOperation = null;
      });

    // Delete alert
    builder
      .addCase(deleteAlertById.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.currentOperation = 'delete';
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteAlertById.fulfilled, (state, action) => {
        state.isLoading = false;
        const alertId = action.payload;
        state.alerts = state.alerts.filter(alert => alert.id !== alertId);
        state.currentOperation = null;
        state.deletingId = null;
      })
      .addCase(deleteAlertById.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { error: string; alertId: string };
        state.error = payload.error;
        state.currentOperation = null;
        state.deletingId = null;
      });
  },
});

export const { clearError: clearAlertsError } = alertsSlice.actions;