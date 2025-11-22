// src/services/authService.ts
import { api } from "@/lib/api";
import { API } from "@/constants/api";
import { UserService, type UserResponse } from "./userService";

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  username?: string;
  role?: string;
  name?: string;
  token?: string;
  refreshToken?: string;
  created_at?: string;
  updated_at?: string;
};

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post(API.AUTH.LOGIN, payload);
    const token = data.access_token;
    
    // Store access_token in localStorage (required for authentication)
    if (token) {
      localStorage.setItem("access_token", token);
    }

    // Extract user data from response
    const user = data.user;
    return {
      id: user?.id,
      email: user?.email,
      username: user?.user_metadata?.email || user?.email,
      role: user?.role,
      name: user?.user_metadata?.name || user?.email,
      token: token,
      refreshToken: data.refresh_token,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
    };
  },

  async register(payload: LoginPayload): Promise<AuthUser> {
    const { data } = await api.post(API.AUTH.REGISTER, payload);
    const token = data.access_token;
    const user = data.user;

    // Store access_token in localStorage (required for authentication)
    if (token) {
      localStorage.setItem("access_token", token);
    }

    // Extract user data from response (same structure as login)
    return {
      id: user?.id,
      email: user?.email,
      username: user?.user_metadata?.email || user?.email,
      role: user?.role,
      name: user?.user_metadata?.name || user?.email,
      token: token,
      refreshToken: data.refresh_token,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
    };
  },

  /**
   * Get current user profile from /user/me endpoint
   */
  async me(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>(API.USER.ME);
    return data;
  },

  async logout(): Promise<void> {
    try {
    await api.post(API.AUTH.LOGOUT, {});
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear access_token from localStorage
      localStorage.removeItem("access_token");
    }
  },

  googleSignInUrl(): string {
    return `${location.origin}${API.AUTH.GOOGLE_OAUTH_START}`.replace(
      `${location.origin}${location.origin}`,
      location.origin
    );
    // or `${API_BASE_URL}${API.AUTH.GOOGLE_OAUTH_START}` if OAuth starts on API domain
  },
};
