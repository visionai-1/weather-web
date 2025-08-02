import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Base selector
const selectAlertsState = (state: RootState) => state.alerts;

// Alerts list selectors
export const selectAlerts = createSelector(
  [selectAlertsState],
  (alerts) => alerts.alerts
);

export const selectAlertsLoading = createSelector(
  [selectAlertsState],
  (alerts) => alerts.alertsLoading
);

export const selectAlertsError = createSelector(
  [selectAlertsState],
  (alerts) => alerts.alertsError
);

export const selectLastAlertsUpdate = createSelector(
  [selectAlertsState],
  (alerts) => alerts.lastAlertsUpdate
);

// Snapshot selectors
export const selectSnapshot = createSelector(
  [selectAlertsState],
  (alerts) => alerts.snapshot
);

export const selectSnapshotLoading = createSelector(
  [selectAlertsState],
  (alerts) => alerts.snapshotLoading
);

export const selectSnapshotError = createSelector(
  [selectAlertsState],
  (alerts) => alerts.snapshotError
);

export const selectLastSnapshotUpdate = createSelector(
  [selectAlertsState],
  (alerts) => alerts.lastSnapshotUpdate
);

// Operations selectors
export const selectCreating = createSelector(
  [selectAlertsState],
  (alerts) => alerts.creating
);

export const selectDeleting = createSelector(
  [selectAlertsState],
  (alerts) => alerts.deleting
);

export const selectIsDeleting = (alertId: string) =>
  createSelector(
    [selectDeleting],
    (deleting) => deleting[alertId] || false
  );

// Computed selectors
export const selectAlertsIsLoading = createSelector(
  [selectAlertsLoading, selectSnapshotLoading],
  (alertsLoading, snapshotLoading) => alertsLoading || snapshotLoading
);

export const selectAlertsHasError = createSelector(
  [selectAlertsError, selectSnapshotError],
  (alertsError, snapshotError) => !!alertsError || !!snapshotError
);

export const selectTotalAlerts = createSelector(
  [selectAlerts],
  (alerts) => alerts.length
);

export const selectTriggeredAlerts = createSelector(
  [selectAlerts],
  (alerts) => alerts.filter(alert => alert.isTriggered)
);

export const selectTriggeredAlertsCount = createSelector(
  [selectTriggeredAlerts],
  (triggeredAlerts) => triggeredAlerts.length
);

export const selectActiveAlerts = createSelector(
  [selectAlerts],
  (alerts) => alerts.filter(alert => !alert.isTriggered)
);

export const selectActiveAlertsCount = createSelector(
  [selectActiveAlerts],
  (activeAlerts) => activeAlerts.length
);

// Alert finder
export const selectAlertById = (alertId: string) =>
  createSelector(
    [selectAlerts],
    (alerts) => alerts.find(alert => alert.id === alertId)
  );

// Status selectors
export const selectShouldRefreshAlerts = createSelector(
  [selectAlertsLoading, selectLastAlertsUpdate],
  (loading, lastUpdate) => {
    if (loading) return false;
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate > 2 * 60 * 1000; // 2 minutes
  }
);

export const selectShouldRefreshSnapshot = createSelector(
  [selectSnapshotLoading, selectLastSnapshotUpdate],
  (loading, lastUpdate) => {
    if (loading) return false;
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate > 30 * 1000; // 30 seconds
  }
);

export const selectAlertsAge = createSelector(
  [selectLastAlertsUpdate],
  (lastUpdate) => {
    if (!lastUpdate) return null;
    return Date.now() - lastUpdate;
  }
);

export const selectSnapshotAge = createSelector(
  [selectLastSnapshotUpdate],
  (lastUpdate) => {
    if (!lastUpdate) return null;
    return Date.now() - lastUpdate;
  }
);

// Summary selector
export const selectAlertsSummary = createSelector(
  [selectAlerts, selectTriggeredAlertsCount, selectActiveAlertsCount, selectLastAlertsUpdate],
  (alerts, triggered, active, lastUpdate) => ({
    total: alerts.length,
    triggered,
    active,
    hasData: alerts.length > 0,
    lastUpdate,
  })
);