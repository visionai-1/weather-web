import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAlerts as fetchAlertsAction } from '@/store/slices/alertsSlice';
import {
  selectAlerts,
  selectTriggeredAlerts,
  selectTriggeredAlertsCount,
  selectAlertsIsLoading,
  selectAlertsHasError,
  selectAlertsError,
} from '@/store/selectors/alertsSelectors';


/**
 * Hook for CurrentState page - monitoring and status overview
 */
export const useAlertsStatus = () => {
  const dispatch = useAppDispatch();
  
  // All alerts data for overview
  const alerts = useAppSelector(selectAlerts);
  const triggeredAlerts = useAppSelector(selectTriggeredAlerts);
  
  // Loading and error states
  const isLoading = useAppSelector(selectAlertsIsLoading);
  const hasError = useAppSelector(selectAlertsHasError);
  const alertsError = useAppSelector(selectAlertsError);
  
  // Computed values for status display
  const totalAlerts = alerts.length;
  const triggeredAlertsCount = useAppSelector(selectTriggeredAlertsCount);

  // Refresh actions for status monitoring
  const fetchAlerts = useCallback(async () => {
    const result = await dispatch(fetchAlertsAction());
    return result;
  }, [dispatch]);

  const refreshAll = useCallback(() => {
    console.log('🔄 Refreshing alerts status...');
    fetchAlerts();
  }, [fetchAlerts]);

  const handleRefresh = useCallback(() => {
    refreshAll();
  }, [refreshAll]);

  // Auto-fetch alerts on mount
  useEffect(() => {
    if (alerts.length === 0) {
      console.log('📋 Fetching alerts for status...');
      fetchAlerts();
    }
  }, []); // Run once on mount

  return {
    // Data for status display
    alerts,
    triggeredAlerts,
    
    // Loading and error states
    isLoading,
    hasError,
    alertsError,
    
    // Status metrics
    totalAlerts,
    triggeredAlertsCount,
    
    // Refresh functionality
    handleRefresh,
    refreshAll,
  };
};