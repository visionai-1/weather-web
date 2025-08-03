import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAlerts as fetchAlertsAction,
  createNewAlert,
  deleteAlertById,
} from '@/store/slices/alertsSlice';
import {
  selectAlerts,
  selectAlertsLoading,
  selectAlertsError,
  selectCreating,
  selectDeleting,
} from '@/store/selectors/alertsSelectors';

import type { CreateAlertRequest } from '@/types';

/**
 * Hook for Alerts page - CRUD operations and alert management
 */
export const useAlertsManagement = () => {
  const dispatch = useAppDispatch();
  
  // Alerts data for management
  const alerts = useAppSelector(selectAlerts);
  const loading = useAppSelector(selectAlertsLoading);
  const error = useAppSelector(selectAlertsError);
  const creating = useAppSelector(selectCreating);
  const deleting = useAppSelector(selectDeleting);

  // Actions for CRUD operations
  const fetchAlerts = useCallback(async () => {
    console.log('📋 Fetching alerts for management...');
    const result = await dispatch(fetchAlertsAction());
    return result;
  }, [dispatch]);

  const createAlert = useCallback(async (alertData: CreateAlertRequest) => {
    console.log('🚨 Creating new alert:', alertData.name);
    const result = await dispatch(createNewAlert(alertData));
    return result;
  }, [dispatch]);

  const deleteAlert = useCallback(async (alertId: string) => {
    console.log('🗑️ Deleting alert:', alertId);
    const result = await dispatch(deleteAlertById(alertId));
    return result;
  }, [dispatch]);

  const isDeleting = useCallback((alertId: string) => {
    return deleting[alertId] || false;
  }, [deleting]);

  // Auto-fetch alerts on mount
  useEffect(() => {
    if (alerts.length === 0 && !loading) {
      fetchAlerts();
    }
  }, []); // Run once on mount

  return {
    // Data for table/list display
    alerts,
    
    // Loading states for UI
    alertsLoading: loading,
    alertsError: error,
    creating,
    
    // CRUD actions
    createAlert,
    deleteAlert,
    fetchAlerts,
    
    // Helper functions
    isDeleting,
  };
};