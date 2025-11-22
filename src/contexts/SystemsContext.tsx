import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { System } from "@/lib/services/systemService";
import { SystemService } from "@/lib/services/systemService";

interface SystemsContextType {
  systems: System[];
  getSystem: (id: string) => System | undefined;
  getSystemsByWorkspace: (workspaceId: string) => System[];
  createSystem: (system: Omit<System, "id" | "created_at" | "updated_at">) => string;
  updateSystem: (system: System) => void;
  deleteSystem: (id: string) => void;
  fetchSystems: (workspaceId?: string) => Promise<void>;
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

  // Fetch systems from backend API
  const fetchSystems = useCallback(async (workspaceId?: string) => {
    try {
      setIsLoading(true);
      // If workspaceId is provided, fetch systems for that workspace
      // Otherwise, we need to fetch all systems (but SystemService.getAllSystems requires workspaceId)
      // For now, we'll only fetch when workspaceId is provided
      if (workspaceId) {
        const response = await SystemService.getAllSystems(workspaceId);
        // Update only systems for this workspace
        setSystems((prev) => {
          const filtered = prev.filter((s) => s.workspace_id !== workspaceId);
          return [...filtered, ...response.systems];
        });
      } else {
        // Fetch all systems - this would require a different API endpoint
        // For now, we'll just set empty array if no workspaceId
        setSystems([]);
      }
    } catch (error) {
      console.error("Error fetching systems from API:", error);
      // Don't clear existing systems on error, just log it
    } finally {
      setIsLoading(false);
    }
  }, []);


  const getSystem = useCallback((id: string): System | undefined => {
    return systems.find((s) => s.id === id);
  }, [systems]);

  const getSystemsByWorkspace = useCallback((workspaceId: string): System[] => {
    return systems.filter((s) => s.workspace_id === workspaceId);
  }, [systems]);

  const createSystem = useCallback((system: Omit<System, "id" | "created_at" | "updated_at">): string => {
    const newId = `sys_${Date.now()}`;
    const newSystem: System = {
      ...system,
      id: newId,
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
    fetchSystems,
    isLoading,
  };

  return <SystemsContext.Provider value={value}>{children}</SystemsContext.Provider>;
};

