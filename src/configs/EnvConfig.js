// filepath: src/configs/EnvConfig.js
import _ from 'lodash';

/**
 * Environment configuration with default values
 * Uses lodash for safe access to environment variables
 */

// Base API configuration
export const API_CONFIG = {
  baseUrl: _.get(import.meta.env, 'VITE_API_BASE_URL', 'https://localhost:5000'),
  timeout: parseInt(_.get(import.meta.env, 'VITE_API_TIMEOUT', '30000'), 10)
};

// Authentication configuration
export const AUTH_CONFIG = {
  tokenKey: _.get(import.meta.env, 'VITE_AUTH_TOKEN_KEY', 'auth_token'),
  userKey: _.get(import.meta.env, 'VITE_AUTH_USER_KEY', 'user_info'),
  enableGoogleLogin: _.get(import.meta.env, 'VITE_ENABLE_GOOGLE_LOGIN', 'true') === 'true'
};

// Feature flags
export const FEATURES = {
  googleLogin: AUTH_CONFIG.enableGoogleLogin
};

// Helper function to get environment variables with default values
export const getEnv = (key, defaultValue) => {
  return _.get(import.meta.env, key, defaultValue);
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
  FEATURES,
  getEnv
};
