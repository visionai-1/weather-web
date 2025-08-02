import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Alert, AlertSnapshot, CreateAlertRequest } from '@/types';
import { getAlerts, createAlert, deleteAlert, getAlertsSnapshot } from '@/services/alertsService';
import { message } from 'antd';

// State interface
interface AlertsState {
  // Alerts list
  alerts: Alert[];
  alertsLoading: boolean;
  alertsError: string | null;
  
  // Alerts snapshot (current state)
  snapshot: AlertSnapshot | null;
  snapshotLoading: boolean;
  snapshotError: string | null;
  
  // Operations loading
  creating: boolean;
  deleting: Record<string, boolean>; // alertId -> isDeleting
  
  // Last updated timestamps
  lastAlertsUpdate: number | null;
  lastSnapshotUpdate: number | null;
}

// Initial state
const initialState: AlertsState = {
  alerts: [],
  alertsLoading: false,
  alertsError: null,
  snapshot: null,
  snapshotLoading: false,
  snapshotError: null,
  creating: false,
  deleting: {},
  lastAlertsUpdate: null,
  lastSnapshotUpdate: null,
};

// Async thunks
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { alerts: AlertsState };
      
      // Prevent multiple simultaneous requests
      if (state.alerts.alertsLoading) {
        throw new Error('Already loading alerts');
      }
      
      // Don't refetch if we have recent data (less than 2 minutes old)
      if (state.alerts.lastAlertsUpdate && Date.now() - state.alerts.lastAlertsUpdate < 2 * 60 * 1000) {
        return state.alerts.alerts;
      }
      
      const response = await getAlerts();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch alerts');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlertsSnapshot = createAsyncThunk(
  'alerts/fetchAlertsSnapshot',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { alerts: AlertsState };
      
      // Prevent multiple simultaneous requests
      if (state.alerts.snapshotLoading) {
        throw new Error('Already loading snapshot');
      }
      
      // Don't refetch if we have recent data (less than 30 seconds old)
      if (state.alerts.lastSnapshotUpdate && Date.now() - state.alerts.lastSnapshotUpdate < 30 * 1000) {
        return state.alerts.snapshot;
      }
      
      const response = await getAlertsSnapshot();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch alerts snapshot');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewAlert = createAsyncThunk(
  'alerts/createNewAlert',
  async (alertData: CreateAlertRequest, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as { alerts: AlertsState };
      
      // Prevent multiple simultaneous create operations
      if (state.alerts.creating) {
        throw new Error('Already creating alert');
      }
      
      const response = await createAlert(alertData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create alert');
      }
      
      message.success('Alert created successfully!');
      
      // Refresh snapshot after creating (but don't wait for it)
      setTimeout(() => dispatch(fetchAlertsSnapshot()), 100);
      
      return response.data;
    } catch (error: any) {
      message.error(error.message || 'Failed to create alert');
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAlertById = createAsyncThunk(
  'alerts/deleteAlertById',
  async (alertId: string, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as { alerts: AlertsState };
      
      // Prevent multiple delete operations for the same alert
      if (state.alerts.deleting[alertId]) {
        throw new Error('Already deleting alert');
      }
      
      const response = await deleteAlert(alertId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete alert');
      }
      
      message.success('Alert deleted successfully!');
      
      // Refresh snapshot after deleting (but don't wait for it)
      setTimeout(() => dispatch(fetchAlertsSnapshot()), 100);
      
      return alertId;
    } catch (error: any) {
      message.error(error.message || 'Failed to delete alert');
      return rejectWithValue({ error: error.message, alertId });
    }
  }
);

// Alerts slice
export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    refreshData: (state) => {
      state.lastAlertsUpdate = null;
      state.lastSnapshotUpdate = null;
    },
    setDeleting: (state, action: PayloadAction<{ alertId: string; isDeleting: boolean }>) => {
      const { alertId, isDeleting } = action.payload;
      state.deleting[alertId] = isDeleting;
    },
  },
  extraReducers: (builder) => {
    // Fetch alerts
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = action.payload;
        state.alertsError = null;
        state.lastAlertsUpdate = Date.now();
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload as string;
      });

    // Fetch alerts snapshot
    builder
      .addCase(fetchAlertsSnapshot.pending, (state) => {
        state.snapshotLoading = true;
        state.snapshotError = null;
      })
      .addCase(fetchAlertsSnapshot.fulfilled, (state, action) => {
        state.snapshotLoading = false;
        state.snapshot = action.payload;
        state.snapshotError = null;
        state.lastSnapshotUpdate = Date.now();
      })
      .addCase(fetchAlertsSnapshot.rejected, (state, action) => {
        state.snapshotLoading = false;
        state.snapshotError = action.payload as string;
      });

    // Create new alert
    builder
      .addCase(createNewAlert.pending, (state) => {
        state.creating = true;
      })
      .addCase(createNewAlert.fulfilled, (state, action) => {
        state.creating = false;
        state.alerts.push(action.payload);
        state.lastAlertsUpdate = Date.now();
      })
      .addCase(createNewAlert.rejected, (state) => {
        state.creating = false;
      });

    // Delete alert
    builder
      .addCase(deleteAlertById.pending, (state, action) => {
        const alertId = action.meta.arg;
        state.deleting[alertId] = true;
      })
      .addCase(deleteAlertById.fulfilled, (state, action) => {
        const alertId = action.payload;
        state.alerts = state.alerts.filter(alert => alert.id !== alertId);
        delete state.deleting[alertId];
        state.lastAlertsUpdate = Date.now();
      })
      .addCase(deleteAlertById.rejected, (state, action) => {
        const payload = action.payload as { error: string; alertId: string };
        state.deleting[payload.alertId] = false;
      });
  },
});

export const { refreshData, setDeleting } = alertsSlice.actions;