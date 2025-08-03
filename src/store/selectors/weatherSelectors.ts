import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

// Basic selectors (simplified)
export const selectWeatherState = (state: RootState) => state.weather;

// Data selectors
export const selectCurrentLocation = (state: RootState) => state.weather.currentLocation;
export const selectCurrentWeather = (state: RootState) => state.weather.currentWeather;
export const selectForecast = (state: RootState) => state.weather.forecast;
export const selectSearchCity = (state: RootState) => state.weather.searchCity;
export const selectSearchWeather = (state: RootState) => state.weather.searchWeather;

// Loading and error selectors (simplified)
export const selectWeatherIsLoading = (state: RootState) => state.weather.isLoading;
export const selectWeatherError = (state: RootState) => state.weather.error;
export const selectWeatherCurrentOperation = (state: RootState) => state.weather.currentOperation;

// Specific operation loading states
export const selectLocationLoading = createSelector(
  [selectWeatherIsLoading, selectWeatherCurrentOperation],
  (isLoading, operation) => isLoading && operation === 'location'
);

export const selectWeatherLoading = createSelector(
  [selectWeatherIsLoading, selectWeatherCurrentOperation],
  (isLoading, operation) => isLoading && operation === 'weather'
);

export const selectSearchLoading = createSelector(
  [selectWeatherIsLoading, selectWeatherCurrentOperation],
  (isLoading, operation) => isLoading && operation === 'search'
);

export const selectForecastLoading = createSelector(
  [selectWeatherIsLoading, selectWeatherCurrentOperation],
  (isLoading, operation) => isLoading && operation === 'forecast'
);

// Derived selectors
export const selectWeatherHasError = createSelector(
  [selectWeatherError],
  (error) => !!error
);

export const selectIsSearchActive = createSelector(
  [selectSearchWeather],
  (searchWeather) => !!searchWeather
);

export const selectDisplayWeather = createSelector(
  [selectSearchWeather, selectCurrentWeather],
  (searchWeather, currentWeather) => searchWeather || currentWeather
);

export const selectDisplayLocation = createSelector(
  [selectSearchWeather, selectCurrentLocation],
  (searchWeather, currentLocation) => {
    if (searchWeather) return searchWeather.location;
    return currentLocation;
  }
);

// Combined loading states (backward compatibility)
export const selectIsLoading = selectWeatherIsLoading;
export const selectHasError = selectWeatherHasError;
export const selectError = selectWeatherError;
export const selectLocationError = selectWeatherError;
export const selectSearchError = selectWeatherError;