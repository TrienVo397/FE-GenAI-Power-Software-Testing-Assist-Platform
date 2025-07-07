import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import _ from "lodash";
import { API_SERVICE_URL } from "./UrlConfig";
import { API_CONFIG, AUTH_CONFIG } from "./EnvConfig";

// Create a pre-configured Axios instance
const instance: AxiosInstance = axios.create({
  baseURL: API_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
  },
  withCredentials: false, // Set to true if your API requires credentials (cookies)
  timeout: API_CONFIG.timeout,
});

// Request interceptor: Automatically attach the Authorization header if token exists
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // If sending FormData, change Content-Type accordingly
    if (config.data instanceof FormData && config.headers) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handles common errors, such as 401 Unauthorized
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear local storage and redirect to login
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        localStorage.removeItem(AUTH_CONFIG.userKey);
        window.location.href = "/login";
        return Promise.reject(error);
      } catch (refreshError) {
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        localStorage.removeItem(AUTH_CONFIG.userKey);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Utility function to detect if an error is a CORS-related issue
const isCorsError = (error: any): boolean => {
  const message = (error.message || "").toLowerCase();

  return (
    message.includes("cors") ||
    message.includes("cross-origin") ||
    message.includes("access-control-allow-origin") ||
    _.get(error, "name") === "NetworkError" ||
    (error.response === undefined && _.get(error, "request") !== undefined)
  );
};

// Generic HTTP response format
interface HttpResponse<T = any> {
  json: T;
  status: number;
  responseHeader: any;
  error?: boolean;
  corsError?: boolean;
  message?: string;
}

// Main HTTP request function with optional method, data, and headers
export async function sendHttpRequest(
  url: string,
  method: string = "GET",
  data: any = null,
  customHeaders: Record<string, string> | null = null
): Promise<HttpResponse> {
  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      headers: customHeaders || {},
    };

    const response: AxiosResponse = await instance(config);

    return {
      json: response.data,
      status: response.status,
      responseHeader: response.headers,
    };
  } catch (error: any) {
    if (isCorsError(error)) {
      console.error("CORS Error detected", error);
      return {
        json: {},
        status: 0,
        responseHeader: {},
        error: true,
        corsError: true,
        message:
          "Network request failed due to CORS policy. The API server needs to allow requests from this origin.",
      };
    }

    const response = error.response || {};
    return {
      json: response.data || {},
      status: response.status || 500,
      responseHeader: response.headers || {},
      error: true,
      message: response.data?.detail || error.message || "An error occurred",
    };
  }
}

// Helper functions for standard HTTP methods
// Helper functions for standard HTTP methods
export const get = async (
  url: string,
  customHeaders?: Record<string, string>
) => instance.get(url, { headers: customHeaders ?? undefined });

export const post = async (
  url: string,
  data: any = null,
  customHeaders?: Record<string, string>
) => instance.post(url, data, { headers: customHeaders ?? undefined });

export const put = async (
  url: string,
  data: any = null,
  customHeaders?: Record<string, string>
) => instance.put(url, data, { headers: customHeaders ?? undefined });

export const del = async (
  url: string,
  customHeaders?: Record<string, string>
) => instance.delete(url, { headers: customHeaders ?? undefined });
