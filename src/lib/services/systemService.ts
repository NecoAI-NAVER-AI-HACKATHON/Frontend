// src/services/workspaceService.ts
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

export const SystemService = {
  async getAllSystems(workspace_id: string): Promise<SystemsResponse> {
    const { data } = await api.get(API.WORKFLOW.WORKFLOWS_LIST(workspace_id));

    return {
      systems: data.systems || [],
      total: data.total || 0,
    };
  },
};
