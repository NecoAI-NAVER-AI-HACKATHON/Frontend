// src/lib/services/executionService.ts
import { api } from "../api";
import { API } from "@/constants/api";

// Types based on backend schemas
export type CreateSystemExecutionRequest = {
  system_id: string;
  system_json: Record<string, any>;
  status?: string;
};

export type SystemExecutionResponse = {
  id: string;
  system_id: string;
  system_json: Record<string, any>;
  logs: string | null;
  status: string;
  started_at: string | null;
  stopped_at: string | null;
};

export type StartExecutionResponse = {
  message: string;
};

export const ExecutionService = {
  /**
   * Create a new system execution
   */
  async createExecution(
    payload: CreateSystemExecutionRequest
  ): Promise<SystemExecutionResponse> {
    try {
      const { data } = await api.post<SystemExecutionResponse>(
        API.EXECUTION.CREATE,
        payload
      );
      return data;
    } catch (error: any) {
      console.error("Error creating execution:", error);
      throw error;
    }
  },

  /**
   * Get execution by ID
   */
  async getExecution(execution_id: string): Promise<SystemExecutionResponse> {
    try {
      const { data } = await api.get<SystemExecutionResponse>(
        API.EXECUTION.GET_BY_ID(execution_id)
      );
      return data;
    } catch (error: any) {
      console.error("Error fetching execution:", error);
      throw error;
    }
  },

  /**
   * Start workflow execution
   */
  async startExecution(execution_id: string): Promise<StartExecutionResponse> {
    try {
      const { data } = await api.post<StartExecutionResponse>(
        API.EXECUTION.START(execution_id)
      );
      return data;
    } catch (error: any) {
      console.error("Error starting execution:", error);
      throw error;
    }
  },
};

