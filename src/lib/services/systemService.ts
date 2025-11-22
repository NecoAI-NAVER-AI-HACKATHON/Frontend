// src/services/systemService.ts
import { api } from "@/lib/api";
import { API } from "@/constants/api";

export type System = {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  global_config?: Record<string, any>;
  metadata_info?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
};

export type SystemListResponse = {
  systems: System[];
  total: number;
};

export type CreateSystemRequest = {
  name: string;
  description?: string;
  workspace_id: string;
  global_config?: Record<string, any>;
  metadata_info?: Record<string, any>;
};

export type SystemResponse = System;

// Helper to get context if available
let systemsContext: { getSystemsByWorkspace: (workspaceId: string) => System[] } | null = null;

export const setSystemsContext = (context: { getSystemsByWorkspace: (workspaceId: string) => System[] }) => {
  systemsContext = context;
};

export const SystemService = {
  /**
   * Create a new system
   */
  async createSystem(payload: CreateSystemRequest): Promise<SystemResponse> {
    try {
      const { data } = await api.post<SystemResponse>(
        API.SYSTEM.CREATE,
        payload
      );
      return data;
    } catch (error: any) {
      console.error("Error creating system:", error);
      throw error;
    }
  },

  /**
   * Get all systems in a workspace
   */
  async getAllSystems(workspace_id: string): Promise<SystemListResponse> {
    // Try to use context first (localStorage)
    if (systemsContext) {
      const systems = systemsContext.getSystemsByWorkspace(workspace_id);
      return {
        systems,
        total: systems.length,
      };
    }

    // Fallback to API
    try {
      const { data } = await api.get<SystemListResponse>(
        API.SYSTEM.GET_ALL(workspace_id)
      );
      return {
        systems: data.systems || [],
        total: data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching systems from API:", error);
      return {
        systems: [],
        total: 0,
      };
    }
  },

  /**
   * Get system by ID
   */
  async getSystem(
    workspace_id: string,
    system_id: string
  ): Promise<SystemResponse> {
    try {
      const { data } = await api.get<SystemResponse>(
        API.SYSTEM.GET_BY_ID(workspace_id, system_id)
      );
      return data;
    } catch (error: any) {
      console.error("Error fetching system:", error);
      throw error;
    }
  },

  /**
   * Activate system
   */
  async activateSystem(
    workspace_id: string,
    system_id: string
  ): Promise<{ message: string }> {
    try {
      const { data } = await api.post<{ message: string }>(
        API.SYSTEM.ACTIVATE(workspace_id, system_id)
      );
      return data;
    } catch (error: any) {
      console.error("Error activating system:", error);
      throw error;
    }
  },
};
