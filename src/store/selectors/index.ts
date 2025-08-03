// Export weather selectors
export * from './weatherSelectors';

// Export alerts selectors with prefixes to avoid conflicts
export {
  selectAlerts,
  selectAlertsIsLoading,
  selectAlertsError,
  selectAlertsCurrentOperation,
  selectDeletingId,
  selectAlertsLoading,
  selectCreating,
  selectDeleting,
  selectAlertsHasError,
  selectTotalAlerts,
  selectTriggeredAlerts,
  selectActiveAlerts,
  selectTriggeredAlertsCount,
  selectActiveAlertsCount,
  selectAlertById,
  selectIsDeleting,
  selectAlertsSummary,
  // Specific exports to avoid naming conflicts
  selectIsLoading as selectAlertsIsLoadingCompat,
  selectHasError as selectAlertsHasErrorCompat,
  selectError as selectAlertsErrorCompat,
} from './alertsSelectors';