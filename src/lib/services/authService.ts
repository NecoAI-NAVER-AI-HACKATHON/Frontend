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
  token?: string;
  refreshToken?: string;
};

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post(API.AUTH.LOGIN, payload);

    return {
      id: data.user?.id,
      email: data.user?.email,
      name: data.user?.user_metadata?.name || data.user?.email,
      token: data.access_token,
      refreshToken: data.refresh_token,
    };
  },

  async register(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post(API.AUTH.REGISTER, payload);
    const user = data.user ?? data.session?.user;

    return {
      id: user?.id,
      email: user?.email,
      token: data.session?.access_token,
      name: user?.user_metadata?.name || user?.email,
    };
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
