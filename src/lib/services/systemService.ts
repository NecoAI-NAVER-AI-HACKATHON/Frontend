// src/services/systemService.ts
import { api } from "@/lib/api";
import { API } from "@/constants/api";

export type System = {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  nodes_count: number;
  created_at: string;
  updated_at: string;
};

export type SystemsResponse = {
  systems: System[];
  total: number;
};

// Helper to get context if available
let systemsContext: { getSystemsByWorkspace: (workspaceId: string) => System[] } | null = null;

export const setSystemsContext = (context: { getSystemsByWorkspace: (workspaceId: string) => System[] }) => {
  systemsContext = context;
};

export const SystemService = {
  async getAllSystems(workspace_id: string): Promise<SystemsResponse> {
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
      const { data } = await api.get(API.WORKFLOW.WORKFLOWS_LIST(workspace_id));
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
};
