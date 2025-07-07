// Read environment variables from Vite
export const BASE_URL: string = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Define API endpoint URLs
export const API_BASE_URL: string = BASE_URL;
export const API_SERVICE_URL: string = `${BASE_URL}`;
export const TEST_CASE_SERVICE_URL: string = `${API_SERVICE_URL}/test-cases`;
export const AUTH_SERVICE_URL: string = `${API_SERVICE_URL}/users`;
export const PROJECT_SERVICE_URL: string = `${API_SERVICE_URL}/projects`;
