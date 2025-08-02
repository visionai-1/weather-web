import { configureStore } from '@reduxjs/toolkit';
import { weatherSlice } from './slices/weatherSlice';
import { alertsSlice } from './slices/alertsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherSlice.reducer,
    alerts: alertsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export everything for easy access
export * from './hooks';
export * from './selectors';
export * from './slices';