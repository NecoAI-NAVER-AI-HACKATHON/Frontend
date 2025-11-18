// src/services/workspaceService.ts
import { api } from "@/lib/api";
import { API } from "@/constants/api";

export type Workspace = {
  id: string;
  name?: string;
  description?: string;
  status: string;
  systems_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type WorkspacesResponse = {
  workspaces: Workspace[];
  total: number;
};

// Helper to get context if available
let workspacesContext: { workspaces: Workspace[] } | null = null;

export const setWorkspacesContext = (context: { workspaces: Workspace[] }) => {
  workspacesContext = context;
};

export const WorkspaceService = {
  async getAllWorkspaces(): Promise<WorkspacesResponse> {
    // Try to use context first (localStorage)
    if (workspacesContext) {
      return {
        workspaces: workspacesContext.workspaces,
        total: workspacesContext.workspaces.length,
      };
    }

    // Fallback to API
    try {
      const { data } = await api.get(API.WORKSPACE.WORKSPACES_LIST);
      return {
        workspaces: data.workspaces || [],
        total: data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching workspaces from API:", error);
      return {
        workspaces: [],
        total: 0,
      };
    }
  },
};
