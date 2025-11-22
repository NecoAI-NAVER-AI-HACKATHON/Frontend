// src/services/workspaceService.ts
import { api } from "@/lib/api";
import { API, withQuery } from "@/constants/api";

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

export type WorkspaceListResponse = {
  workspaces: Workspace[];
  total: number;
  page?: number;
  per_page?: number;
};

export type CreateWorkspaceRequest = {
  name: string;
  description?: string;
  status?: "active" | "inactive" | "draft"; // Valid values per database constraint: "active", "inactive", "draft"
};

export type SearchWorkspaceRequest = {
  name?: string;
  status?: string;
  sorting?: string;
  order?: "asc" | "desc";
};

export type WorkspaceResponse = Workspace;

// Helper to get context if available
let workspacesContext: { workspaces: Workspace[] } | null = null;

export const setWorkspacesContext = (context: { workspaces: Workspace[] }) => {
  workspacesContext = context;
};

export const WorkspaceService = {
  /**
   * Create a new workspace
   */
  async createWorkspace(
    payload: CreateWorkspaceRequest
  ): Promise<WorkspaceResponse> {
    try {
      // Verify token exists before making request
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Ensure status is set to a valid value (default to "active" to match database default)
      // Database constraint only allows: "active", "inactive", "draft"
      const requestPayload = {
        ...payload,
        status: payload.status || "active", // Default to "active" - matches database default and constraint
      };

      const { data } = await api.post<WorkspaceResponse>(
        API.WORKSPACE.CREATE,
        requestPayload
      );
      return data;
    } catch (error: any) {
      console.error("Error creating workspace:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        token: localStorage.getItem("access_token") ? "exists" : "missing",
      });
      
      // If 401, provide more specific error message
      if (error.response?.status === 401) {
        throw new Error(
          "Authentication failed. Please log in again." +
          (error.response?.data?.detail ? ` ${error.response.data.detail}` : "")
        );
      }
      
      throw error;
    }
  },

  /**
   * Get all workspaces with pagination
   */
  async getAllWorkspaces(
    page: number = 1,
    per_page: number = 10
  ): Promise<WorkspaceListResponse> {
    // Try to use context first (localStorage)
    if (workspacesContext) {
      return {
        workspaces: workspacesContext.workspaces,
        total: workspacesContext.workspaces.length,
        page,
        per_page,
      };
    }

    // Fallback to API
    try {
      const url = withQuery(API.WORKSPACE.LIST, { page, per_page });
      const { data } = await api.get<WorkspaceListResponse>(url);
      return {
        workspaces: data.workspaces || [],
        total: data.total || 0,
        page: data.page || page,
        per_page: data.per_page || per_page,
      };
    } catch (error) {
      console.error("Error fetching workspaces from API:", error);
      return {
        workspaces: [],
        total: 0,
        page,
        per_page,
      };
    }
  },

  /**
   * Get workspace by ID
   */
  async getWorkspace(workspace_id: string): Promise<WorkspaceResponse> {
    try {
      const { data } = await api.get<WorkspaceResponse>(
        API.WORKSPACE.GET_BY_ID(workspace_id)
      );
      return data;
    } catch (error: any) {
      console.error("Error fetching workspace:", error);
      throw error;
    }
  },

  /**
   * Search workspaces
   */
  async searchWorkspace(
    payload: SearchWorkspaceRequest
  ): Promise<WorkspaceListResponse> {
    try {
      const { data } = await api.post<WorkspaceListResponse>(
        API.WORKSPACE.SEARCH,
        payload
      );
      return data;
    } catch (error: any) {
      console.error("Error searching workspaces:", error);
      throw error;
    }
  },

  /**
   * Delete workspace
   */
  async deleteWorkspace(workspace_id: string): Promise<{ message: string }> {
    try {
      const { data } = await api.delete<{ message: string }>(
        API.WORKSPACE.DELETE(workspace_id)
      );
      return data;
    } catch (error: any) {
      console.error("Error deleting workspace:", error);
      throw error;
    }
  },
};
