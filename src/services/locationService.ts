import type { Location, ApiResponse } from '@/types';

// Free IP geolocation service
const IP_GEOLOCATION_API = 'https://ipapi.co/json/';

export interface IPLocationResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  error?: boolean;
  reason?: string;
}

// Get user's location from IP address (free API)
export const getCurrentLocationFromIP = async (): Promise<ApiResponse<Location>> => {
  try {
    const response = await fetch(IP_GEOLOCATION_API);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: IPLocationResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'Failed to get location');
    }
    
    const location: Location = {
      lat: data.latitude,
      lon: data.longitude,
      name: `${data.city}, ${data.region}, ${data.country_name}`,
    };
    
    return {
      data: location,
      success: true,
      message: 'Location detected successfully',
    };
  } catch (error: any) {
    console.error('IP geolocation failed:', error);
    return {
      data: { lat: 0, lon: 0, name: 'Unknown Location' },
      success: false,
      message: error.message || 'Failed to detect location',
    };
  }
};

// Cache for reverse geocoding to prevent duplicate requests
const reverseGeoCache = new Map<string, string>();

// Enhanced geolocation that tries GPS first, then falls back to IP
export const getCurrentLocation = async (): Promise<ApiResponse<Location>> => {
  // First try browser geolocation (GPS)
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
    
    const coordKey = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
    
    // Check cache first
    if (reverseGeoCache.has(coordKey)) {
      console.log('Using cached location name for coordinates');
      return {
        data: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: reverseGeoCache.get(coordKey)!,
        },
        success: true,
        message: 'GPS location detected successfully (cached)',
      };
    }
    
    // Try to get location name from coordinates using reverse geocoding
    try {
      const reverseGeoResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      );
      
      if (reverseGeoResponse.ok) {
        const geoData = await reverseGeoResponse.json();
        const locationName = geoData.city 
          ? `${geoData.city}, ${geoData.principalSubdivision}, ${geoData.countryName}`
          : coordKey;
        
        // Cache the result
        reverseGeoCache.set(coordKey, locationName);
        
        return {
          data: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: locationName,
          },
          success: true,
          message: 'GPS location detected successfully',
        };
      }
    } catch (reverseGeoError) {
      console.warn('Reverse geocoding failed, using coordinates only');
    }
    
    // Fallback to coordinates only
    const fallbackName = coordKey;
    reverseGeoCache.set(coordKey, fallbackName);
    
    return {
      data: {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: fallbackName,
      },
      success: true,
      message: 'GPS location detected successfully',
    };
    
  } catch (gpsError) {
    console.warn('GPS geolocation failed, falling back to IP geolocation:', gpsError);
    
    // Fallback to IP geolocation
    return getCurrentLocationFromIP();
  }
};

export const locationService = {
  getCurrentLocation,
  getCurrentLocationFromIP,
};