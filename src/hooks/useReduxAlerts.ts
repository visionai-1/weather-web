import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAlerts,
  fetchAlertsSnapshot,
  createNewAlert,
  deleteAlertById,
  refreshData,
} from '@/store/slices/alertsSlice';
import {
  selectAlerts,
  selectAlertsLoading,
  selectAlertsError,
  selectTotalAlerts,
  selectTriggeredAlertsCount,
  selectActiveAlertsCount,
  selectAlertsAge,
  selectShouldRefreshAlerts,
  selectLastAlertsUpdate,
  selectSnapshot,
  selectSnapshotLoading,
  selectSnapshotError,
  selectSnapshotAge,
  selectShouldRefreshSnapshot,
  selectLastSnapshotUpdate,
  selectCreating,
  selectDeleting,
  selectIsDeleting,
  selectAlertById,
  selectTriggeredAlerts,
  selectActiveAlerts,
  selectAlertsIsLoading,
  selectAlertsHasError,
  selectAlertsSummary,
} from '@/store/selectors/alertsSelectors';
import type { CreateAlertRequest } from '@/types';

// Individual hooks for specific alerts data
export const useAlertsList = () => {
  const dispatch = useAppDispatch();
  
  const alerts = useAppSelector(selectAlerts);
  const loading = useAppSelector(selectAlertsLoading);
  const error = useAppSelector(selectAlertsError);
  const totalCount = useAppSelector(selectTotalAlerts);
  const triggeredCount = useAppSelector(selectTriggeredAlertsCount);
  const activeCount = useAppSelector(selectActiveAlertsCount);
  const age = useAppSelector(selectAlertsAge);
  const shouldRefresh = useAppSelector(selectShouldRefreshAlerts);
  const lastUpdate = useAppSelector(selectLastAlertsUpdate);

  const refetch = useCallback(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  return {
    alerts,
    loading,
    error,
    totalCount,
    triggeredCount,
    activeCount,
    age,
    shouldRefresh,
    lastUpdate,
    refetch,
  };
};

export const useAlertsSnapshot = () => {
  const dispatch = useAppDispatch();
  
  const snapshot = useAppSelector(selectSnapshot);
  const loading = useAppSelector(selectSnapshotLoading);
  const error = useAppSelector(selectSnapshotError);
  const age = useAppSelector(selectSnapshotAge);
  const shouldRefresh = useAppSelector(selectShouldRefreshSnapshot);
  const lastUpdate = useAppSelector(selectLastSnapshotUpdate);

  const refetch = useCallback(() => {
    dispatch(fetchAlertsSnapshot());
  }, [dispatch]);

  return {
    snapshot,
    loading,
    error,
    age,
    shouldRefresh,
    lastUpdate,
    refetch,
  };
};

export const useCreateAlert = () => {
  const dispatch = useAppDispatch();
  
  const loading = useAppSelector(selectCreating);

  const createAlert = useCallback((alertData: CreateAlertRequest) => {
    dispatch(createNewAlert(alertData));
  }, [dispatch]);

  return {
    createAlert,
    loading,
  };
};

export const useDeleteAlert = () => {
  const dispatch = useAppDispatch();
  
  const deletingStates = useAppSelector(selectDeleting);

  const deleteAlert = useCallback((alertId: string) => {
    dispatch(deleteAlertById(alertId));
  }, [dispatch]);

  const isDeleting = useCallback((alertId: string) => {
    return deletingStates[alertId] || false;
  }, [deletingStates]);

  return {
    deleteAlert,
    isDeleting,
    deletingStates,
  };
};

export const useAlertById = (alertId: string) => {
  const alert = useAppSelector(selectAlertById(alertId));
  const isDeleting = useAppSelector(selectIsDeleting(alertId));

  return {
    alert,
    isDeleting,
  };
};

// Combined hook for components that need alerts management
export const useAlertsManagement = () => {
  const dispatch = useAppDispatch();
  
  // Data selectors
  const alerts = useAppSelector(selectAlerts);
  const snapshot = useAppSelector(selectSnapshot);
  const triggeredAlerts = useAppSelector(selectTriggeredAlerts);
  const activeAlerts = useAppSelector(selectActiveAlerts);
  
  // Loading states
  const isLoading = useAppSelector(selectAlertsIsLoading);
  const alertsLoading = useAppSelector(selectAlertsLoading);
  const snapshotLoading = useAppSelector(selectSnapshotLoading);
  const creating = useAppSelector(selectCreating);
  const deleting = useAppSelector(selectDeleting);
  
  // Error states
  const hasError = useAppSelector(selectAlertsHasError);
  const alertsError = useAppSelector(selectAlertsError);
  const snapshotError = useAppSelector(selectSnapshotError);
  
  // Computed data
  const summary = useAppSelector(selectAlertsSummary);
  
  // Counts
  const totalAlerts = useAppSelector(selectTotalAlerts);
  const triggeredAlertsCount = useAppSelector(selectTriggeredAlertsCount);
  const activeAlertsCount = useAppSelector(selectActiveAlertsCount);
  
  // Status
  const shouldRefreshAlerts = useAppSelector(selectShouldRefreshAlerts);
  const shouldRefreshSnapshot = useAppSelector(selectShouldRefreshSnapshot);

  // Actions
  const fetchAlertsAction = useCallback(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const fetchSnapshotAction = useCallback(() => {
    dispatch(fetchAlertsSnapshot());
  }, [dispatch]);

  const createAlert = useCallback((alertData: CreateAlertRequest) => {
    dispatch(createNewAlert(alertData));
  }, [dispatch]);

  const deleteAlert = useCallback((alertId: string) => {
    dispatch(deleteAlertById(alertId));
  }, [dispatch]);

  const refreshDataAction = useCallback(() => {
    dispatch(refreshData());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    refreshDataAction();
    fetchAlertsAction();
    fetchSnapshotAction();
  }, [refreshDataAction, fetchAlertsAction, fetchSnapshotAction]);

  // Convenience getters
  const isDeleting = useCallback((alertId: string) => {
    return deleting[alertId] || false;
  }, [deleting]);

  const getAlertById = useCallback((alertId: string) => {
    return alerts.find(alert => alert.id === alertId);
  }, [alerts]);

  // Auto-fetch on mount
  useEffect(() => {
    if (!alerts.length) {
      fetchAlertsAction();
    }
    if (!snapshot) {
      fetchSnapshotAction();
    }
  }, [alerts.length, snapshot, fetchAlertsAction, fetchSnapshotAction]);

  return {
    // Data
    alerts,
    snapshot,
    triggeredAlerts,
    activeAlerts,
    
    // Loading states
    isLoading,
    alertsLoading,
    snapshotLoading,
    creating,
    deleting,
    
    // Error states
    hasError,
    alertsError,
    snapshotError,
    
    // Computed data
    summary,
    
    // Counts
    totalAlerts,
    triggeredAlertsCount,
    activeAlertsCount,
    
    // Status
    shouldRefreshAlerts,
    shouldRefreshSnapshot,
    
    // Actions
    fetchAlerts: fetchAlertsAction,
    fetchSnapshot: fetchSnapshotAction,
    createAlert,
    deleteAlert,
    refreshData: refreshDataAction,
    handleRefresh,
    
    // Convenience getters
    isDeleting,
    getAlertById,
  };
};