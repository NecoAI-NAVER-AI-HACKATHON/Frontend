// constants/api.ts

// Base URL — prefer env, fallback for local dev
export const API_BASE_URL =
  import.meta.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

// Common API paths grouped by domain
export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    GOOGLE_OAUTH_START: "/auth/google",
    // Example callback path if backend uses it:
    GOOGLE_OAUTH_CALLBACK: "/auth/google/callback",
  },

  // Add more domains as needed
  USERS: {

  },


} as const;

// Helper to join BASE + path safely
export const apiUrl = (path: string) => {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};

// Optional: small helper to attach query params
export const withQuery = (url: string, params?: Record<string, any>) => {
  if (!params) return url;
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((vv) => q.append(k, String(vv)));
    else q.append(k, String(v));
  });
  const qs = q.toString();
  return qs ? `${url}?${qs}` : url;
};
