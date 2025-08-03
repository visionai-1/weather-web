import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { WeatherData, Location, ForecastData } from '@/types';
import { getCurrentWeather, getCurrentWeatherByCity, getWeatherForecast } from '@/services/weatherService';
import { getCurrentLocation } from '@/services/locationService';

// Simplified state interface
interface WeatherState {
  // Data
  currentLocation: Location | null;
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  searchCity: string;
  searchWeather: WeatherData | null;
  
  // Simple loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Operation tracking (simplified)
  currentOperation: 'location' | 'weather' | 'forecast' | 'search' | null;
}

// Initial state
const initialState: WeatherState = {
  currentLocation: null,
  currentWeather: null,
  forecast: null,
  searchCity: '',
  searchWeather: null,
  isLoading: false,
  error: null,
  currentOperation: null,
};

// Async thunks (simplified - no complex deduplication)
export const fetchCurrentLocation = createAsyncThunk(
  'weather/fetchCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🌍 Fetching location...');
      const response = await getCurrentLocation();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to get location');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Location error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async (location: Location, { rejectWithValue }) => {
    try {
      console.log('☀️ Fetching weather for:', location.name);
      const response = await getCurrentWeather(location);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch weather');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Weather error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeatherForecast = createAsyncThunk(
  'weather/fetchWeatherForecast',
  async (location: Location, { rejectWithValue }) => {
    try {
      console.log('📊 Fetching forecast for:', location.name);
      const response = await getWeatherForecast(location, '1h'); // Hourly forecast
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch weather forecast');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Forecast error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const searchWeatherByCity = createAsyncThunk(
  'weather/searchWeatherByCity',
  async (cityName: string, { rejectWithValue }) => {
    try {
      if (!cityName || cityName.length < 2) {
        throw new Error('City name too short');
      }
      
      console.log('🔍 Searching weather for:', cityName);
      const response = await getCurrentWeatherByCity(cityName);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch weather for city');
      }
      
      return { cityName, weather: response.data };
    } catch (error: any) {
      console.error('❌ Search error:', error.message);
      return rejectWithValue({ error: error.message, cityName });
    }
  }
);

// Weather slice (simplified)
export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchCity = '';
      state.searchWeather = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearForecast: (state) => {
      state.forecast = null;
    },
    setSearchCity: (state, action: PayloadAction<string>) => {
      state.searchCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Location
    builder
      .addCase(fetchCurrentLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOperation = 'location';
      })
      .addCase(fetchCurrentLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLocation = action.payload;
        state.currentOperation = null;
      })
      .addCase(fetchCurrentLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOperation = null;
        // Set fallback location
        state.currentLocation = { lat: 40.7128, lon: -74.0060, name: 'New York, NY (fallback)' };
      });

    // Weather
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOperation = 'weather';
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWeather = action.payload;
        state.currentOperation = null;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOperation = null;
      });

    // Forecast
    builder
      .addCase(fetchWeatherForecast.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOperation = 'forecast';
      })
      .addCase(fetchWeatherForecast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.forecast = action.payload;
        state.currentOperation = null;
      })
      .addCase(fetchWeatherForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentOperation = null;
      });

    // Search
    builder
      .addCase(searchWeatherByCity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOperation = 'search';
      })
      .addCase(searchWeatherByCity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchCity = action.payload.cityName;
        state.searchWeather = action.payload.weather;
        state.currentOperation = null;
      })
      .addCase(searchWeatherByCity.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { error: string; cityName: string };
        state.error = payload.error;
        state.searchCity = payload.cityName;
        state.searchWeather = null;
        state.currentOperation = null;
      });
  },
});

export const { 
  clearSearch, 
  clearError: clearWeatherError,
  clearForecast,
  setSearchCity 
} = weatherSlice.actions;