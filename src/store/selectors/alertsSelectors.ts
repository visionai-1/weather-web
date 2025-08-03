import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

// Basic selectors (simplified - no snapshots)
export const selectAlertsState = (state: RootState) => state.alerts;

// Data selectors
export const selectAlerts = (state: RootState) => state.alerts.alerts;

// Loading and error selectors (simplified)
export const selectAlertsIsLoading = (state: RootState) => state.alerts.isLoading;
export const selectAlertsError = (state: RootState) => state.alerts.error;
export const selectAlertsCurrentOperation = (state: RootState) => state.alerts.currentOperation;
export const selectDeletingId = (state: RootState) => state.alerts.deletingId;

// Specific operation loading states
export const selectAlertsLoading = createSelector(
  [selectAlertsIsLoading, selectAlertsCurrentOperation],
  (isLoading, operation) => isLoading && operation === 'alerts'
);

export const selectCreating = createSelector(
  [selectAlertsIsLoading, selectAlertsCurrentOperation],
  (isLoading, operation) => isLoading && operation === 'create'
);

export const selectDeleting = createSelector(
  [selectDeletingId],
  (deletingId) => deletingId ? { [deletingId]: true } : {}
);

// Derived selectors
export const selectAlertsHasError = createSelector(
  [selectAlertsError],
  (error) => !!error
);

export const selectTotalAlerts = createSelector(
  [selectAlerts],
  (alerts) => alerts.length
);

export const selectTriggeredAlerts = createSelector(
  [selectAlerts],
  (alerts) => alerts.filter(alert => alert.lastState === 'triggered')
);

export const selectActiveAlerts = createSelector(
  [selectAlerts],
  (alerts) => alerts.filter(alert => alert.lastState !== 'triggered')
);

export const selectTriggeredAlertsCount = createSelector(
  [selectTriggeredAlerts],
  (triggeredAlerts) => triggeredAlerts.length
);

export const selectActiveAlertsCount = createSelector(
  [selectActiveAlerts],
  (activeAlerts) => activeAlerts.length
);

// Helper selectors
export const selectAlertById = (alertId: string) => createSelector(
  [selectAlerts],
  (alerts) => alerts.find(alert => alert.id === alertId || alert._id === alertId)
);

export const selectIsDeleting = (alertId: string) => createSelector(
  [selectDeletingId],
  (deletingId) => deletingId === alertId
);

// Summary selector (no snapshots needed)
export const selectAlertsSummary = createSelector(
  [selectTotalAlerts, selectTriggeredAlertsCount, selectActiveAlertsCount],
  (total, triggered, active) => ({
    total,
    triggered,
    active,
    status: triggered > 0 ? 'alert' : 'normal'
  })
);

// Backward compatibility exports (avoid naming conflicts)
export const selectIsLoading = selectAlertsIsLoading;
export const selectHasError = selectAlertsHasError;
export const selectError = selectAlertsError;