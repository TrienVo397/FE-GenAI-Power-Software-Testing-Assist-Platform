// filepath: src/services/authService.js
import _ from 'lodash';
import { sendHttpRequest } from "../configs/RequestConfig";
import { AUTH_SERVICE_URL } from "../configs/UrlConfig";
import { AUTH_CONFIG } from "../configs/EnvConfig";

const AUTH_ENDPOINTS = {
  login: `${AUTH_SERVICE_URL}/login`,
  register: `${AUTH_SERVICE_URL}/register`,
  refreshToken: `${AUTH_SERVICE_URL}/refresh-token`,
  logout: `${AUTH_SERVICE_URL}/logout`,
};

// Local storage keys from environment variables
const TOKEN_KEY = AUTH_CONFIG.tokenKey;
const USER_INFO_KEY = AUTH_CONFIG.userKey;

/**
 * Login user with username and password using OAuth2 password flow
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Response with token data
 */
export const login = async (credentials) => {
  // Format data as x-www-form-urlencoded for OAuth2
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  
  // Send as form data with specific content type
  const response = await sendHttpRequest(
    AUTH_ENDPOINTS.login, 
    "POST", 
    formData.toString(),
    { 'Content-Type': 'application/x-www-form-urlencoded' }
  );
  
  if (response.status === 200 && response.json.access_token) {
    // Store token
    localStorage.setItem(TOKEN_KEY, response.json.access_token);
    
    // Since user info isn't returned with token, we could fetch user info separately
    // or store minimal information for now
    const userInfo = {
      username: credentials.username,
      // Add any other fields you want to track locally
    };
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }
  
  return response;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response with registration status
 */
export const register = async (userData) => {
  const payload = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    full_name: `${userData.firstName} ${userData.lastName}`,
    notes: userData.notes || null,
    roles: userData.roles || null
  };
  
  return sendHttpRequest(AUTH_ENDPOINTS.register, "POST", payload);
};

/**
 * Logout the current user
 * @returns {Promise<Object>} Response with logout status
 */
export const logout = async () => {
  // First try to call the logout endpoint
  try {
    await sendHttpRequest(AUTH_ENDPOINTS.logout, "POST");
  } catch (error) {
    console.error("Error during logout:", error);
  }
  
  // Always clear local storage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem("mockProject"); // Remove existing mock project as well
  
  return { success: true };
};

/**
 * Get the current authentication token
 * @returns {string|null} The current token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get the current user information
 * @returns {Object|null} User information or null if not logged in
 */
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

export default {
  login,
  register,
  logout,
  getToken,
  isAuthenticated,
  getCurrentUser
};
