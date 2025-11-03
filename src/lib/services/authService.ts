// src/services/authService.ts
import { api } from "@/lib/api";
import { API } from "@/constants/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  token?: string; // if your backend returns a JWT
};

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post(API.AUTH.LOGIN, payload);
    return data;
    // If backend sets cookie-based session, no need to handle token here
  },
  async register(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post(API.AUTH.REGISTER, payload);
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get(API.AUTH.ME);
    return data;
  },

  async logout(): Promise<void> {
    await api.post(API.AUTH.LOGOUT, {});
  },

  googleSignInUrl(): string {
    return `${location.origin}${API.AUTH.GOOGLE_OAUTH_START}`.replace(
      `${location.origin}${location.origin}`,
      location.origin
    );
    // or `${API_BASE_URL}${API.AUTH.GOOGLE_OAUTH_START}` if OAuth starts on API domain
  },
};
