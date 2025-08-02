import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { WeatherData, Location } from '@/types';
import { getCurrentWeather, getCurrentWeatherByCity, getMockWeatherData } from '@/services/weatherService';
import { getCurrentPosition } from '@/utils/geolocation';

// State interface
interface WeatherState {
  // Current location and weather
  currentLocation: Location | null;
  currentWeather: WeatherData | null;
  
  // Search weather by city
  searchCity: string;
  searchWeather: WeatherData | null;
  
  // Loading states
  locationLoading: boolean;
  weatherLoading: boolean;
  searchLoading: boolean;
  
  // Error states
  locationError: string | null;
  weatherError: string | null;
  searchError: string | null;
  
  // Last updated timestamps
  lastLocationUpdate: number | null;
  lastWeatherUpdate: number | null;
}

// Initial state
const initialState: WeatherState = {
  currentLocation: null,
  currentWeather: null,
  searchCity: '',
  searchWeather: null,
  locationLoading: false,
  weatherLoading: false,
  searchLoading: false,
  locationError: null,
  weatherError: null,
  searchError: null,
  lastLocationUpdate: null,
  lastWeatherUpdate: null,
};

// Async thunks
export const fetchCurrentLocation = createAsyncThunk(
  'weather/fetchCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      const position = await getCurrentPosition();
      return position;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async (location: Location, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { weather: WeatherState };
      
      // Don't refetch if we have recent data (less than 5 minutes old)
      if (state.weather.lastWeatherUpdate && Date.now() - state.weather.lastWeatherUpdate < 5 * 60 * 1000) {
        return state.weather.currentWeather;
      }
      
      const response = await getCurrentWeather(location);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch weather');
      }
      
      return response.data;
    } catch (error: any) {
      console.warn('Weather API failed, using mock data:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const searchWeatherByCity = createAsyncThunk(
  'weather/searchWeatherByCity',
  async (cityName: string, { rejectWithValue, getState }) => {
    try {
      if (!cityName || cityName.length < 2) {
        throw new Error('City name too short');
      }
      
      const state = getState() as { weather: WeatherState };
      
      // Prevent multiple simultaneous search requests
      if (state.weather.searchLoading) {
        throw new Error('Search already in progress');
      }
      
      const response = await getCurrentWeatherByCity(cityName);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch weather for city');
      }
      
      return { cityName, weather: response.data };
    } catch (error: any) {
      console.warn('City weather API failed, using mock data:', error.message);
      return rejectWithValue({ error: error.message, cityName });
    }
  }
);

// Weather slice
export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchCity = '';
      state.searchWeather = null;
      state.searchError = null;
    },
    refreshLocation: (state) => {
      state.lastLocationUpdate = null;
      state.lastWeatherUpdate = null;
    },
    setSearchCity: (state, action: PayloadAction<string>) => {
      state.searchCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch current location
    builder
      .addCase(fetchCurrentLocation.pending, (state) => {
        state.locationLoading = true;
        state.locationError = null;
      })
      .addCase(fetchCurrentLocation.fulfilled, (state, action) => {
        state.locationLoading = false;
        state.currentLocation = action.payload;
        state.locationError = null;
        state.lastLocationUpdate = Date.now();
      })
      .addCase(fetchCurrentLocation.rejected, (state, action) => {
        state.locationLoading = false;
        state.locationError = action.payload as string;
        // Set fallback location
        state.currentLocation = { lat: 40.7128, lon: -74.0060, name: 'New York, NY (fallback)' };
        state.lastLocationUpdate = Date.now();
      });

    // Fetch current weather
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.weatherLoading = true;
        state.weatherError = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.weatherLoading = false;
        state.currentWeather = action.payload;
        state.weatherError = null;
        state.lastWeatherUpdate = Date.now();
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.weatherLoading = false;
        state.weatherError = action.payload as string;
        // Set mock weather data as fallback
        state.currentWeather = getMockWeatherData(state.currentLocation || undefined);
        state.lastWeatherUpdate = Date.now();
      });

    // Search weather by city
    builder
      .addCase(searchWeatherByCity.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchWeatherByCity.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchCity = action.payload.cityName;
        state.searchWeather = action.payload.weather;
        state.searchError = null;
      })
      .addCase(searchWeatherByCity.rejected, (state, action) => {
        state.searchLoading = false;
        const payload = action.payload as { error: string; cityName: string };
        state.searchError = payload.error;
        state.searchCity = payload.cityName;
        // Set mock weather data for search
        state.searchWeather = getMockWeatherData({ lat: 0, lon: 0, name: payload.cityName });
      });
  },
});

export const { clearSearch, refreshLocation, setSearchCity } = weatherSlice.actions;