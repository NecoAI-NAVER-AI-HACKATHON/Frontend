// src/lib/api.ts
import axios from "axios";
import { API_BASE_URL } from "@/constants/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // keep if your backend uses cookies
  headers: { "Content-Type": "application/json" },
});

// request interceptor to include the access token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// optional: normalize errors
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err.message ??
      "Unknown error";
    return Promise.reject(new Error(msg));
  }
);
