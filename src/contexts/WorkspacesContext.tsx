import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Workspace } from "@/lib/services/workspaceService";
import { WorkspaceService } from "@/lib/services/workspaceService";

const STORAGE_KEY = "workspaces_storage";

interface WorkspacesContextType {
  workspaces: Workspace[];
  getWorkspace: (id: string) => Workspace | undefined;
  createWorkspace: (workspace: Omit<Workspace, "id" | "created_at" | "updated_at" | "systems_count">) => string;
  updateWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (id: string) => void;
  fetchWorkspaces: () => Promise<void>;
  isLoading: boolean;
}

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(undefined);

export const useWorkspaces = () => {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error("useWorkspaces must be used within a WorkspacesProvider");
  }
  return context;
};

interface WorkspacesProviderProps {
  children: ReactNode;
}

export const WorkspacesProvider = ({ children }: WorkspacesProviderProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch workspaces from backend API
  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await WorkspaceService.getAllWorkspaces();
      setWorkspaces(response.workspaces);
    } catch (error) {
      console.error("Error fetching workspaces from API:", error);
      setWorkspaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const getWorkspace = useCallback((id: string): Workspace | undefined => {
    return workspaces.find((w) => w.id === id);
  }, [workspaces]);

  const createWorkspace = useCallback((workspace: Omit<Workspace, "id" | "created_at" | "updated_at" | "systems_count">): string => {
    const newId = `ws_${Date.now()}`;
    const newWorkspace: Workspace = {
      ...workspace,
      id: newId,
      systems_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
    console.log("Workspace created:", newId);
    return newId;
  }, []);

  const updateWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaces((prev) => {
      const index = prev.findIndex((w) => w.id === workspace.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...workspace, updated_at: new Date().toISOString() };
        console.log("Workspace updated:", workspace.id);
        return updated;
      } else {
        console.log("Workspace not found, adding as new:", workspace.id);
        return [...prev, workspace];
      }
    });
  }, []);

  const deleteWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      console.log("Workspace deleted:", id);
      return filtered;
    });
  }, []);

  const value: WorkspacesContextType = {
    workspaces,
    getWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    fetchWorkspaces,
    isLoading,
  };

  return <WorkspacesContext.Provider value={value}>{children}</WorkspacesContext.Provider>;
};

