import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { System } from "@/lib/services/systemService";

const STORAGE_KEY = "systems_storage";

interface SystemsContextType {
  systems: System[];
  getSystem: (id: string) => System | undefined;
  getSystemsByWorkspace: (workspaceId: string) => System[];
  createSystem: (system: Omit<System, "id" | "created_at" | "updated_at" | "nodes_count">) => string;
  updateSystem: (system: System) => void;
  deleteSystem: (id: string) => void;
  isLoading: boolean;
}

const SystemsContext = createContext<SystemsContextType | undefined>(undefined);

export const useSystems = () => {
  const context = useContext(SystemsContext);
  if (!context) {
    throw new Error("useSystems must be used within a SystemsProvider");
  }
  return context;
};

interface SystemsProviderProps {
  children: ReactNode;
}

export const SystemsProvider = ({ children }: SystemsProviderProps) => {
  const [systems, setSystems] = useState<System[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load systems from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSystems(Array.isArray(parsed) ? parsed : []);
      } else {
        // Initialize with mock data if no data exists
        const mockSystems: System[] = [
          {
            id: "sys-001",
            name: "Daily Feedback Batch Processor",
            description: "Process daily customer feedback with AI analysis",
            workspace_id: "ws-001",
            nodes_count: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "sys-002",
            name: "Email Classification System",
            description: "Automatically classify and route emails",
            workspace_id: "ws-001",
            nodes_count: 8,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "sys-003",
            name: "Image Processing Pipeline",
            description: "Process and analyze images with AI models",
            workspace_id: "ws-001",
            nodes_count: 12,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "sys-004",
            name: "Customer Support Bot",
            description: "AI-powered customer support chatbot",
            workspace_id: "ws-002",
            nodes_count: 6,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "sys-005",
            name: "Ticket Routing System",
            description: "Route support tickets to appropriate teams",
            workspace_id: "ws-002",
            nodes_count: 7,
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "sys-006",
            name: "Data Analysis Workflow",
            description: "Analyze and visualize data streams",
            workspace_id: "ws-003",
            nodes_count: 9,
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        setSystems(mockSystems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSystems));
      }
    } catch (error) {
      console.error("Error loading systems from localStorage:", error);
      setSystems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save systems to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
        console.log("Systems saved to localStorage:", systems.length);
      } catch (error) {
        console.error("Error saving systems to localStorage:", error);
      }
    }
  }, [systems, isLoading]);

  const getSystem = useCallback((id: string): System | undefined => {
    return systems.find((s) => s.id === id);
  }, [systems]);

  const getSystemsByWorkspace = useCallback((workspaceId: string): System[] => {
    return systems.filter((s) => s.workspace_id === workspaceId);
  }, [systems]);

  const createSystem = useCallback((system: Omit<System, "id" | "created_at" | "updated_at" | "nodes_count">): string => {
    const newId = `sys_${Date.now()}`;
    const newSystem: System = {
      ...system,
      id: newId,
      nodes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSystems((prev) => [...prev, newSystem]);
    console.log("System created:", newId);
    return newId;
  }, []);

  const updateSystem = useCallback((system: System) => {
    setSystems((prev) => {
      const index = prev.findIndex((s) => s.id === system.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...system, updated_at: new Date().toISOString() };
        console.log("System updated:", system.id);
        return updated;
      } else {
        console.log("System not found, adding as new:", system.id);
        return [...prev, system];
      }
    });
  }, []);

  const deleteSystem = useCallback((id: string) => {
    setSystems((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      console.log("System deleted:", id);
      return filtered;
    });
  }, []);

  const value: SystemsContextType = {
    systems,
    getSystem,
    getSystemsByWorkspace,
    createSystem,
    updateSystem,
    deleteSystem,
    isLoading,
  };

  return <SystemsContext.Provider value={value}>{children}</SystemsContext.Provider>;
};

