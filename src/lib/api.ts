// src/lib/api.ts
import axios from "axios";
import { API_BASE_URL } from "@/constants/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // keep if your backend uses cookies
  headers: { "Content-Type": "application/json" },
});

// request interceptor to include the access token in headers
api.interceptors.request.use(
  (config) => {
    // Use localStorage for access_token (required for authentication)
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No access token found in localStorage. Request might fail with 401.");
  }
  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor for error handling
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    
    // Only handle 401 Unauthorized - redirect to login
    // Don't redirect on 500 (server errors) or other errors
    if (status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem("access_token");
      // Redirect to login if not already there
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
        console.warn("Unauthorized (401) - redirecting to login");
        window.location.href = "/login";
      }
    }

    // Extract error message
    const msg =
      err?.response?.data?.detail ?? // FastAPI uses 'detail' for errors
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err.message ??
      "Unknown error";
    
    // Log full error for debugging (but don't redirect on 500)
    if (status === 500) {
      console.error("Server Error (500):", {
        url: err.config?.url,
        status: status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: msg,
      });
    } else if (status !== 401) {
      // Log other errors (but not 401 since we already handled it)
      console.error("API Error:", {
        status: status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: msg,
      });
    }

    return Promise.reject(new Error(msg));
  }
);
