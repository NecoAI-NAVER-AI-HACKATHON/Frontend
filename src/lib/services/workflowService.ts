// src/services/workspaceService.ts
import { api } from "@/lib/api";
import { API } from "@/constants/api";

export type Workflow = {
  id: string;
  name: string;
  description?: string;
  workspace_id: string;
  //   nodes_count: number;
  created_at: string;
  updated_at: string;
};

export type WorkflowsResponse = {
  workflows: Workflow[];
  total: number;
};

export const WorksflowService = {
  async getAllWorkflows(workspace_id: string): Promise<WorkflowsResponse> {
    const { data } = await api.get(API.WORKFLOW.WORKFLOWS_LIST(workspace_id));

    return {
      workflows: data.systems || [],
      total: data.total || 0,
    };
  },
};
