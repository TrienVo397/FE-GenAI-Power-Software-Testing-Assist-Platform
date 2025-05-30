import axios from "axios";

// Global config (if needed for interceptors)
const instance = axios.create({
  baseURL: "https://localhost:5000/api",
  headers: {
    "Content-Type":
      data instanceof FormData ? "multipart/form-data" : "application/json",
  },
  withCredentials: true,
});

export async function sendHttpRequest(url, method = "GET", data = null) {
  try {
    const response = await instance({
      url,
      method,
      data,
    });

    return {
      json: response.data,
      status: response.status,
      responseHeader: response.headers,
    };
  } catch (error) {
    const response = error.response || {};
    return {
      json: response.data || {},
      status: response.status || 500,
      responseHeader: response.headers || {},
    };
  }
}
