import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Workspace } from "@/lib/services/workspaceService";

const STORAGE_KEY = "workspaces_storage";

interface WorkspacesContextType {
  workspaces: Workspace[];
  getWorkspace: (id: string) => Workspace | undefined;
  createWorkspace: (workspace: Omit<Workspace, "id" | "created_at" | "updated_at" | "systems_count">) => string;
  updateWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (id: string) => void;
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

  // Load workspaces from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWorkspaces(Array.isArray(parsed) ? parsed : []);
      } else {
        // Initialize with mock data if no data exists
        const mockWorkspaces: Workspace[] = [
          {
            id: "ws-001",
            name: "AI Automation Workspace",
            description: "Automate business processes with AI workflows",
            status: "active",
            systems_count: 3,
            user_id: "user-001",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "ws-002",
            name: "Customer Support Systems",
            description: "Manage customer support workflows and chatbots",
            status: "active",
            systems_count: 2,
            user_id: "user-001",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "ws-003",
            name: "Data Processing Hub",
            description: "Process and analyze data with AI models",
            status: "draft",
            systems_count: 1,
            user_id: "user-001",
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        setWorkspaces(mockWorkspaces);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockWorkspaces));
      }
    } catch (error) {
      console.error("Error loading workspaces from localStorage:", error);
      setWorkspaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
        console.log("Workspaces saved to localStorage:", workspaces.length);
      } catch (error) {
        console.error("Error saving workspaces to localStorage:", error);
      }
    }
  }, [workspaces, isLoading]);

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
    isLoading,
  };

  return <WorkspacesContext.Provider value={value}>{children}</WorkspacesContext.Provider>;
};

