import _ from 'lodash';
import { sendHttpRequest } from "../configs/RequestConfig";
import { AUTH_SERVICE_URL } from "../configs/UrlConfig";
import { AUTH_CONFIG } from "../configs/EnvConfig";

// Define API endpoints
const AUTH_ENDPOINTS = {
  login: `${AUTH_SERVICE_URL}/login`,
  register: `${AUTH_SERVICE_URL}/register`,
  refreshToken: `${AUTH_SERVICE_URL}/refresh-token`,
  logout: `${AUTH_SERVICE_URL}/logout`,
};

// Environment keys
const TOKEN_KEY = AUTH_CONFIG.tokenKey;
const USER_INFO_KEY = AUTH_CONFIG.userKey;

// Types
interface Credentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  notes?: string;
  roles?: string[];
}

interface UserInfo {
  username: string;
  // Extend this if you store more fields
}

interface AuthResponse {
  json: any;
  status: number;
  responseHeader: any;
  error?: boolean;
  message?: string;
}

/**
 * Login user with username and password
 */
export const login = async (credentials: Credentials): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await sendHttpRequest(
    AUTH_ENDPOINTS.login,
    "POST",
    formData.toString(),
    { 'Content-Type': 'application/x-www-form-urlencoded' }
  );

  if (response.status === 200 && response.json.access_token) {
    localStorage.setItem(TOKEN_KEY, response.json.access_token);

    const userInfo: UserInfo = {
      username: credentials.username,
    };
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }

  return response;
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const payload = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    full_name: `${userData.firstName} ${userData.lastName}`,
    notes: userData.notes || null,
    roles: userData.roles || null,
  };

  return sendHttpRequest(AUTH_ENDPOINTS.register, "POST", payload);
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<{ success: boolean }> => {
  try {
    await sendHttpRequest(AUTH_ENDPOINTS.logout, "POST");
  } catch (error) {
    console.error("Error during logout:", error);
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem("projectInfo");

  return { success: true };
};

/**
 * Get current token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Get current user info
 */
export const getCurrentUser = (): UserInfo | null => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) as UserInfo : null;
};

export default {
  login,
  register,
  logout,
  getToken,
  isAuthenticated,
  getCurrentUser
};
