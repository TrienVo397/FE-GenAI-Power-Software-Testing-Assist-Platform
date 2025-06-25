// filepath: src/configs/UrlConfig.js
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const API_SERVICE_URL = `${BASE_URL}`;
export const TEST_CASE_SERVICE_URL = `${API_SERVICE_URL}/test-cases`;
export const AUTH_SERVICE_URL = `${API_SERVICE_URL}/users`;
export const PROJECT_SERVICE_URL = `${API_SERVICE_URL}/projects`;