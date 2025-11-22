// src/lib/services/userService.ts
import { api } from "../api";
import { API } from "@/constants/api";

export type UserResponse = {
  email: string;
  username?: string;
  role?: string;
  id: string;
  created_at: string;
  updated_at: string;
};

export const UserService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserResponse> {
    try {
      const { data } = await api.get<UserResponse>(API.USER.ME);
      return data;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
};

