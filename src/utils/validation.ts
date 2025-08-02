import type { AlertParameter } from '@/types';
import { ALERT_PARAMETERS } from './constants';

// Form validation utilities
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Location validation
export const validateLocation = (location: string): ValidationResult => {
  if (!location) {
    return { isValid: false, message: 'Location is required' };
  }
  
  if (location.length < 2) {
    return { isValid: false, message: 'Location must be at least 2 characters long' };
  }
  
  if (location.length > 100) {
    return { isValid: false, message: 'Location must be less than 100 characters' };
  }
  
  return { isValid: true };
};

// Coordinate validation
export const validateCoordinates = (lat: number, lon: number): ValidationResult => {
  if (lat < -90 || lat > 90) {
    return { isValid: false, message: 'Latitude must be between -90 and 90' };
  }
  
  if (lon < -180 || lon > 180) {
    return { isValid: false, message: 'Longitude must be between -180 and 180' };
  }
  
  return { isValid: true };
};

// Alert threshold validation
export const validateThreshold = (parameter: AlertParameter, value: number): ValidationResult => {
  const config = ALERT_PARAMETERS[parameter];
  
  if (!config) {
    return { isValid: false, message: 'Invalid parameter type' };
  }
  
  if (value < config.min) {
    return { 
      isValid: false, 
      message: `${config.label} must be at least ${config.min}${config.unit}` 
    };
  }
  
  if (value > config.max) {
    return { 
      isValid: false, 
      message: `${config.label} must be at most ${config.max}${config.unit}` 
    };
  }
  
  return { isValid: true };
};

// Generic number validation
export const validateNumber = (
  value: string | number, 
  min?: number, 
  max?: number, 
  fieldName = 'Value'
): ValidationResult => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  
  if (min !== undefined && numValue < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && numValue > max) {
    return { isValid: false, message: `${fieldName} must be at most ${max}` };
  }
  
  return { isValid: true };
};

// String validation
export const validateString = (
  value: string, 
  minLength?: number, 
  maxLength?: number, 
  fieldName = 'Field'
): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  const trimmedValue = value.trim();
  
  if (minLength !== undefined && trimmedValue.length < minLength) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${minLength} characters long` 
    };
  }
  
  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    return { 
      isValid: false, 
      message: `${fieldName} must be less than ${maxLength} characters long` 
    };
  }
  
  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, message: 'URL is required' };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

// Batch validation utility
export const validateFields = (validations: ValidationResult[]): ValidationResult => {
  const failedValidation = validations.find(v => !v.isValid);
  
  if (failedValidation) {
    return failedValidation;
  }
  
  return { isValid: true };
};