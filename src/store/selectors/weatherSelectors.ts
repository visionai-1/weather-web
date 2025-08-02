import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Base selectors
const selectWeatherState = (state: RootState) => state.weather;

// Location selectors
export const selectCurrentLocation = createSelector(
  [selectWeatherState],
  (weather) => weather.currentLocation
);

export const selectLocationLoading = createSelector(
  [selectWeatherState],
  (weather) => weather.locationLoading
);

export const selectLocationError = createSelector(
  [selectWeatherState],
  (weather) => weather.locationError
);

export const selectLastLocationUpdate = createSelector(
  [selectWeatherState],
  (weather) => weather.lastLocationUpdate
);

// Weather selectors
export const selectCurrentWeather = createSelector(
  [selectWeatherState],
  (weather) => weather.currentWeather
);

export const selectWeatherLoading = createSelector(
  [selectWeatherState],
  (weather) => weather.weatherLoading
);

export const selectWeatherError = createSelector(
  [selectWeatherState],
  (weather) => weather.weatherError
);

export const selectLastWeatherUpdate = createSelector(
  [selectWeatherState],
  (weather) => weather.lastWeatherUpdate
);

// Search selectors
export const selectSearchCity = createSelector(
  [selectWeatherState],
  (weather) => weather.searchCity
);

export const selectSearchWeather = createSelector(
  [selectWeatherState],
  (weather) => weather.searchWeather
);

export const selectSearchLoading = createSelector(
  [selectWeatherState],
  (weather) => weather.searchLoading
);

export const selectSearchError = createSelector(
  [selectWeatherState],
  (weather) => weather.searchError
);

// Computed selectors
export const selectWeatherIsLoading = createSelector(
  [selectLocationLoading, selectWeatherLoading, selectSearchLoading],
  (locationLoading, weatherLoading, searchLoading) => 
    locationLoading || weatherLoading || searchLoading
);

export const selectWeatherHasError = createSelector(
  [selectLocationError, selectWeatherError, selectSearchError],
  (locationError, weatherError, searchError) => 
    !!locationError || !!weatherError || !!searchError
);

export const selectDisplayWeather = createSelector(
  [selectSearchWeather, selectCurrentWeather],
  (searchWeather, currentWeather) => searchWeather || currentWeather
);

export const selectDisplayLocation = createSelector(
  [selectSearchCity, selectCurrentLocation],
  (searchCity, currentLocation) => 
    searchCity || currentLocation?.name || 'Unknown Location'
);

export const selectIsLocationReady = createSelector(
  [selectCurrentLocation, selectLocationLoading],
  (location, loading) => !!location && !loading
);

export const selectIsWeatherReady = createSelector(
  [selectCurrentWeather, selectWeatherLoading],
  (weather, loading) => !!weather && !loading
);

export const selectIsSearchActive = createSelector(
  [selectSearchCity, selectSearchWeather],
  (searchCity, searchWeather) => !!searchCity || !!searchWeather
);

export const selectShouldRefreshWeather = createSelector(
  [selectCurrentLocation, selectWeatherLoading, selectLastWeatherUpdate],
  (location, loading, lastUpdate) => {
    if (!location || loading) return false;
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate > 5 * 60 * 1000; // 5 minutes
  }
);

export const selectWeatherAge = createSelector(
  [selectLastWeatherUpdate],
  (lastUpdate) => {
    if (!lastUpdate) return null;
    return Date.now() - lastUpdate;
  }
);

export const selectLocationAge = createSelector(
  [selectLastLocationUpdate],
  (lastUpdate) => {
    if (!lastUpdate) return null;
    return Date.now() - lastUpdate;
  }
);