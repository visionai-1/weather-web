import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCurrentLocation,
  fetchCurrentWeather,
  fetchWeatherForecast,
  searchWeatherByCity,
  clearSearch as clearSearchAction,
  setSearchCity,
} from '@/store/slices/weatherSlice';
import {
  selectCurrentLocation,
  selectLocationLoading,
  selectLocationError,
  selectCurrentWeather,
  selectWeatherLoading,
  selectWeatherError,
  selectForecast,
  selectForecastLoading,
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


/**
 * Simplified hook for weather data management
 * Handles location detection, weather fetching, and city search
 */
export const useLocationAndWeather = () => {
  const dispatch = useAppDispatch();
  
  // Location state
  const location = useAppSelector(selectCurrentLocation);
  const locationLoading = useAppSelector(selectLocationLoading);
  const locationError = useAppSelector(selectLocationError);
  
  // Weather state
  const weather = useAppSelector(selectCurrentWeather);
  const weatherLoading = useAppSelector(selectWeatherLoading);
  const weatherError = useAppSelector(selectWeatherError);
  
  // Forecast state
  const forecast = useAppSelector(selectForecast);
  const forecastLoading = useAppSelector(selectForecastLoading);
  
  // Search state
  const searchCity = useAppSelector(selectSearchCity);
  const searchWeather = useAppSelector(selectSearchWeather);
  const searchLoading = useAppSelector(selectSearchLoading);
  const searchError = useAppSelector(selectSearchError);
  const isSearchActive = useAppSelector(selectIsSearchActive);
  
  // Display state (search takes priority)
  const displayWeather = useAppSelector(selectDisplayWeather);
  const displayLocation = useAppSelector(selectDisplayLocation);
  
  // Combined loading and error states
  const isLoading = useAppSelector(selectWeatherIsLoading);
  const hasError = useAppSelector(selectWeatherHasError);

  // ===== ACTIONS =====
  
  const getCurrentLocation = useCallback(async () => {
    const result = await dispatch(fetchCurrentLocation());
    return result;
  }, [dispatch]);

  const fetchWeather = useCallback(async (weatherLocation = location) => {
    if (!weatherLocation) return;
    const result = await dispatch(fetchCurrentWeather(weatherLocation));
    return result;
  }, [dispatch, location]);

  const fetchForecast = useCallback(async (forecastLocation = location) => {
    if (!forecastLocation) return;
    const result = await dispatch(fetchWeatherForecast(forecastLocation));
    return result;
  }, [dispatch, location]);

  const searchByCity = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    const result = await dispatch(searchWeatherByCity(cityName.trim()));
    return result;
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    dispatch(clearSearchAction());
  }, [dispatch]);

  const updateSearchCity = useCallback((city: string) => {
    dispatch(setSearchCity(city));
  }, [dispatch]);

  const refreshAll = useCallback(() => {
    getCurrentLocation();
    if (location) {
      fetchWeather(location);
      fetchForecast(location);
    }
  }, [getCurrentLocation, location, fetchWeather, fetchForecast]);

  // ===== AUTO-FETCH LOGIC =====
  
  // 1. Get location on component mount
  useEffect(() => {
    if (!location && !locationLoading) {
      console.log('🌍 Fetching user location...');
      getCurrentLocation();
    }
  }, []); // Run once on mount

  // 2. Get weather when location is available
  useEffect(() => {
    if (location && !isSearchActive && !weatherLoading) {
      console.log('☀️ Fetching weather for:', location.name);
      fetchWeather(location);
    }
  }, [location?.lat, location?.lon, isSearchActive]); // React to location changes

  // 3. Get forecast when location is available
  useEffect(() => {
    if (location && !isSearchActive && !forecastLoading && !forecast) {
      console.log('📊 Fetching forecast for:', location.name);
      fetchForecast(location);
    }
  }, [location?.lat, location?.lon, isSearchActive, forecast]); // React to location changes

  // Handle refresh - clear search or refresh location/weather
  const handleRefresh = useCallback(() => {
    if (isSearchActive) {
      clearSearch();
    } else {
      refreshAll();
    }
  }, [isSearchActive, clearSearch, refreshAll]);

  // ===== RETURN API =====
  
  return {
    // Raw data
    location,
    weather,
    forecast,
    searchWeather,
    
    // Display data (handles search priority)
    displayWeather,
    displayLocation,
    
    // Loading states
    isLoading,
    locationLoading,
    weatherLoading,
    forecastLoading,
    searchLoading,
    
    // Error states
    hasError,
    locationError,
    weatherError,
    searchError,
    
    // Search state
    searchCity,
    isSearchActive,
    
    // Actions (simplified API)
    getCurrentLocation,
    fetchWeather,
    fetchForecast,
    searchByCity,
    clearSearch,
    updateSearchCity,
    refreshAll,
    handleRefresh,
  };
};