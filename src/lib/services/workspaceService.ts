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

export const WorkspaceService = {
  async getAllWorkspaces(): Promise<WorkspacesResponse> {
    const { data } = await api.get(API.WORKSPACE.WORKSPACES_LIST);

    return {
      workspaces: data.workspaces || [],
      total: data.total || 0,
    };
  },
};
