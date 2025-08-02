import type { Location, GeolocationPosition } from '@/types';

export interface GeolocationError {
  code: number;
  message: string;
}

export const getCurrentPosition = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        
        reject({
          code: error.code,
          message,
        });
      },
      options
    );
  });
};

// Fallback locations for demo purposes
export const fallbackLocations: Location[] = [
  { lat: 40.7128, lon: -74.0060, name: 'New York, NY' },
  { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
  { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
];

export const getRandomFallbackLocation = (): Location => {
  const randomIndex = Math.floor(Math.random() * fallbackLocations.length);
  return fallbackLocations[randomIndex];
};