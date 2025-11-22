// constants/api.ts

// Base URL — prefer env, fallback for local dev
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

// Common API paths grouped by domain
export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    GOOGLE_OAUTH_START: "/auth/google",
    // Example callback path if backend uses it:
    GOOGLE_OAUTH_CALLBACK: "/auth/google/callback",
    REFRESH_TOKEN: "/auth/refresh",
  },

  WORKSPACE: {
    CREATE: "/workspaces",
    LIST: "/workspaces",
    GET_BY_ID: (workspace_id: string) => `/workspaces/${workspace_id}`,
    SEARCH: "/workspaces/search",
    DELETE: (workspace_id: string) => `/workspaces/${workspace_id}`,
  },

  SYSTEM: {
    CREATE: "/workspaces/system",
    GET_ALL: (workspace_id: string) => `/workspaces/${workspace_id}/systems`,
    GET_BY_ID: (workspace_id: string, system_id: string) =>
      `/workspaces/${workspace_id}/systems/${system_id}`,
    ACTIVATE: (workspace_id: string, system_id: string) =>
      `/workspaces/${workspace_id}/systems/${system_id}/activate`,
  },

  WORKFLOW: {
    WORKFLOWS_LIST: (id: string) => `/workspaces/${id}/systems`,
  },

  EXECUTION: {
    CREATE: "/executions",
    GET_BY_ID: (execution_id: string) => `/executions/${execution_id}`,
    START: (execution_id: string) => `/executions/${execution_id}`,
  },

  USER: {
    ME: "/user/me",
  },

  // Add more domains as needed
  USERS: {},
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
