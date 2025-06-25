// filepath: src/configs/RequestConfig.js
import axios from "axios";
import _ from 'lodash';
import { API_SERVICE_URL } from "./UrlConfig";
import { API_CONFIG, AUTH_CONFIG } from "./EnvConfig";

// Global config with interceptors
const instance = axios.create({
  baseURL: API_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add CORS headers that the browser will include in preflight requests
    "Accept": "application/json, text/plain, */*",
  },
  // Only set withCredentials to true if your API requires sending cookies/auth headers
  // For many JWT-based APIs, this can be false as the token is sent in Authorization header
  withCredentials: false,
  timeout: API_CONFIG.timeout,
});

// Add request interceptor to automatically add the JWT token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Handle FormData content type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized error (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // You can implement token refresh logic here if needed
        // const refreshResponse = await instance.post('/auth/refresh-token');
        // localStorage.setItem(AUTH_CONFIG.tokenKey, refreshResponse.data.access_token);
        // originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
        // return instance(originalRequest);
        
        // For now, just clear auth and let the app handle redirect
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        localStorage.removeItem(AUTH_CONFIG.userKey);
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        localStorage.removeItem(AUTH_CONFIG.userKey);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Utility function to detect CORS errors
const isCorsError = (error) => {
  const message = (error.message || '').toLowerCase();
  
  return (
    message.includes('cors') ||
    message.includes('cross-origin') ||
    message.includes('access-control-allow-origin') ||
    // Network errors when CORS blocks the response
    (_.get(error, 'name') === 'NetworkError') ||
    // When response isn't available due to CORS
    (error.response === undefined && _.get(error, 'request') !== undefined)
  );
};

export async function sendHttpRequest(url, method = "GET", data = null, customHeaders = null) {
  try {
    const config = {
      url,
      method,
      data,
    };
    
    // Apply any custom headers if provided
    if (customHeaders) {
      config.headers = { ...config.headers, ...customHeaders };
    }
    
    const response = await instance(config);

    return {
      json: response.data,
      status: response.status,
      responseHeader: response.headers,
    };
  } catch (error) {
    // Check specifically for CORS errors
    if (isCorsError(error)) {
      console.error('CORS Error detected', error);
      return {
        json: {},
        status: 0,
        responseHeader: {},
        error: true,
        corsError: true,
        message: 'Network request failed due to CORS policy. The API server needs to allow requests from this origin.'
      };
    }
    
    const response = error.response || {};
    return {
      json: response.data || {},
      status: response.status || 500,
      responseHeader: response.headers || {},
      error: true,
      message: response.data?.detail || error.message || 'An error occurred',
    };
  }
}

// HTTP method helper functions
export const get = async (url, customHeaders = null) => {
  const response = await instance.get(url, { headers: customHeaders });
  return response;
};

export const post = async (url, data = null, customHeaders = null) => {
  const response = await instance.post(url, data, { headers: customHeaders });
  return response;
};

export const put = async (url, data = null, customHeaders = null) => {
  const response = await instance.put(url, data, { headers: customHeaders });
  return response;
};

export const del = async (url, customHeaders = null) => {
  const response = await instance.delete(url, { headers: customHeaders });
  return response;
};
