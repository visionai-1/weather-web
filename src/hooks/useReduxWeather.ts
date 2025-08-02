import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCurrentLocation,
  fetchCurrentWeather,
  searchWeatherByCity,
  clearSearch,
  refreshLocation,
} from '@/store/slices/weatherSlice';
import {
  selectCurrentLocation,
  selectLocationLoading,
  selectLocationError,
  selectIsLocationReady,
  selectLocationAge,
  selectCurrentWeather,
  selectWeatherLoading,
  selectWeatherError,
  selectIsWeatherReady,
  selectShouldRefreshWeather,
  selectWeatherAge,
  selectLastWeatherUpdate,
  selectSearchCity,
  selectSearchWeather,
  selectSearchLoading,
  selectSearchError,
  selectIsSearchActive,
  selectDisplayWeather,
  selectDisplayLocation,
  selectWeatherIsLoading,
  selectWeatherHasError,
} from '@/store/selectors/weatherSelectors';

// Individual hooks for specific weather data
export const useCurrentLocation = () => {
  const dispatch = useAppDispatch();
  
  const location = useAppSelector(selectCurrentLocation);
  const loading = useAppSelector(selectLocationLoading);
  const error = useAppSelector(selectLocationError);
  const isReady = useAppSelector(selectIsLocationReady);
  const age = useAppSelector(selectLocationAge);

  const refetch = useCallback(() => {
    dispatch(fetchCurrentLocation());
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(refreshLocation());
  }, [dispatch]);

  return {
    location,
    loading,
    error,
    isReady,
    age,
    refetch,
    refresh,
  };
};

export const useCurrentWeather = () => {
  const dispatch = useAppDispatch();
  
  const weather = useAppSelector(selectCurrentWeather);
  const loading = useAppSelector(selectWeatherLoading);
  const error = useAppSelector(selectWeatherError);
  const isReady = useAppSelector(selectIsWeatherReady);
  const shouldRefresh = useAppSelector(selectShouldRefreshWeather);
  const age = useAppSelector(selectWeatherAge);
  const lastUpdate = useAppSelector(selectLastWeatherUpdate);
  const currentLocation = useAppSelector(selectCurrentLocation);

  const refetch = useCallback(() => {
    if (currentLocation) {
      dispatch(fetchCurrentWeather(currentLocation));
    }
  }, [dispatch, currentLocation]);

  return {
    weather,
    loading,
    error,
    isReady,
    shouldRefresh,
    age,
    lastUpdate,
    refetch,
  };
};

export const useWeatherSearch = () => {
  const dispatch = useAppDispatch();
  
  const searchCity = useAppSelector(selectSearchCity);
  const searchWeather = useAppSelector(selectSearchWeather);
  const loading = useAppSelector(selectSearchLoading);
  const error = useAppSelector(selectSearchError);
  const isActive = useAppSelector(selectIsSearchActive);

  const searchByCity = useCallback((cityName: string) => {
    dispatch(searchWeatherByCity(cityName));
  }, [dispatch]);

  const clearSearchAction = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  return {
    searchCity,
    searchWeather,
    loading,
    error,
    isActive,
    searchByCity,
    clearSearch: clearSearchAction,
  };
};

// Combined hook for components that need both location and weather
export const useLocationAndWeather = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const location = useAppSelector(selectCurrentLocation);
  const weather = useAppSelector(selectCurrentWeather);
  const searchCity = useAppSelector(selectSearchCity);
  const searchWeather = useAppSelector(selectSearchWeather);
  const displayWeather = useAppSelector(selectDisplayWeather);
  const displayLocation = useAppSelector(selectDisplayLocation);
  const isLoading = useAppSelector(selectWeatherIsLoading);
  const locationLoading = useAppSelector(selectLocationLoading);
  const weatherLoading = useAppSelector(selectWeatherLoading);
  const searchLoading = useAppSelector(selectSearchLoading);
  const hasError = useAppSelector(selectWeatherHasError);
  const locationError = useAppSelector(selectLocationError);
  const weatherError = useAppSelector(selectWeatherError);
  const searchError = useAppSelector(selectSearchError);
  const isLocationReady = useAppSelector(selectIsLocationReady);
  const isWeatherReady = useAppSelector(selectIsWeatherReady);
  const isSearchActive = useAppSelector(selectIsSearchActive);
  const shouldRefreshWeather = useAppSelector(selectShouldRefreshWeather);

  // Actions
  const getCurrentLocation = useCallback(() => {
    dispatch(fetchCurrentLocation());
  }, [dispatch]);

  const refreshWeather = useCallback(() => {
    if (location) {
      dispatch(fetchCurrentWeather(location));
    }
  }, [dispatch, location]);

  const searchByCity = useCallback((cityName: string) => {
    dispatch(searchWeatherByCity(cityName));
  }, [dispatch]);

  const clearSearchAction = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const refreshLocationAction = useCallback(() => {
    dispatch(refreshLocation());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    if (isSearchActive) {
      clearSearchAction();
    } else {
      refreshLocationAction();
      refreshWeather();
    }
  }, [isSearchActive, clearSearchAction, refreshLocationAction, refreshWeather]);

  // Auto-fetch location on mount
  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [location, getCurrentLocation]);

  // Auto-fetch weather when location changes
  useEffect(() => {
    if (location && !weather) {
      refreshWeather();
    }
  }, [location, weather, refreshWeather]);

  return {
    // Current data
    location,
    weather,
    
    // Search data
    searchCity,
    searchWeather,
    
    // Display data (search takes priority)
    displayWeather,
    displayLocation,
    
    // Loading states
    isLoading,
    locationLoading,
    weatherLoading,
    searchLoading,
    
    // Error states
    hasError,
    locationError,
    weatherError,
    searchError,
    
    // Status
    isLocationReady,
    isWeatherReady,
    isSearchActive,
    shouldRefreshWeather,
    
    // Actions
    getCurrentLocation,
    refreshWeather,
    searchByCity,
    clearSearch: clearSearchAction,
    refreshLocation: refreshLocationAction,
    handleRefresh,
  };
};