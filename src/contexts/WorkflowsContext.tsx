import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Workflow } from "../types/workflow";
import { mockWorkflow, mockWorkflowId } from "../mockdata/WorkflowData";

const STORAGE_KEY = "workflows_storage";

interface WorkflowsContextType {
  workflows: Workflow[];
  getWorkflow: (id: string) => Workflow | undefined;
  createWorkflow: (workflow: Omit<Workflow, "id"> & { id?: string }) => string;
  saveWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (id: string) => void;
  revertMockWorkflow: () => void;
  isLoading: boolean;
}

const WorkflowsContext = createContext<WorkflowsContextType | undefined>(undefined);

export const useWorkflows = () => {
  const context = useContext(WorkflowsContext);
  if (!context) {
    throw new Error("useWorkflows must be used within a WorkflowsProvider");
  }
  return context;
};

interface WorkflowsProviderProps {
  children: ReactNode;
}

export const WorkflowsProvider = ({ children }: WorkflowsProviderProps) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load workflows from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const workflows = Array.isArray(parsed) ? parsed : [];
        
        // Check if mock workflow exists in storage, otherwise add original mock data
        const hasMockWorkflow = workflows.some((w) => w.id === mockWorkflow.id);
        if (!hasMockWorkflow) {
          workflows.push(mockWorkflow);
        }
        
        setWorkflows(workflows);
      } else {
        // Initialize with mock workflow data if no data exists
        // The mock workflow is linked to sys-001 system in ws-001 workspace
        setWorkflows([mockWorkflow]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([mockWorkflow]));
      }
    } catch (error) {
      console.error("Error loading workflows from localStorage:", error);
      setWorkflows([mockWorkflow]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save workflows to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
        console.log("Workflows saved to localStorage:", workflows.length);
      } catch (error) {
        console.error("Error saving workflows to localStorage:", error);
      }
    }
  }, [workflows, isLoading]);

  const getWorkflow = useCallback((id: string): Workflow | undefined => {
    return workflows.find((w) => w.id === id);
  }, [workflows]);

  const createWorkflow = useCallback((workflow: Omit<Workflow, "id"> & { id?: string }): string => {
    const newId = workflow.id || `wf_${Date.now()}`;
    const newWorkflow: Workflow = {
      ...workflow,
      id: newId,
    };
    setWorkflows((prev) => {
      // Check if workflow with this ID already exists
      const exists = prev.find((w) => w.id === newId);
      if (exists) {
        console.log("Workflow already exists:", newId);
        return prev;
      }
      return [...prev, newWorkflow];
    });
    console.log("Workflow created:", newId);
    return newId;
  }, []);

  const saveWorkflow = useCallback((workflow: Workflow) => {
    setWorkflows((prev) => {
      const index = prev.findIndex((w) => w.id === workflow.id);
      if (index >= 0) {
        // Update existing workflow
        const updated = [...prev];
        updated[index] = workflow;
        console.log("Workflow updated:", workflow.id);
        return updated;
      } else {
        // Add new workflow if not found (shouldn't happen, but handle it)
        console.log("Workflow not found, adding as new:", workflow.id);
        return [...prev, workflow];
      }
    });
  }, []);

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      console.log("Workflow deleted:", id);
      return filtered;
    });
  }, []);

  const revertMockWorkflow = useCallback(() => {
    setWorkflows((prev) => {
      // Replace mock workflow with original mock data
      const updated = prev.filter((w) => w.id !== mockWorkflowId);
      updated.push(mockWorkflow);
      console.log("Mock workflow reverted to original data");
      return updated;
    });
  }, []);

  const value: WorkflowsContextType = {
    workflows,
    getWorkflow,
    createWorkflow,
    saveWorkflow,
    deleteWorkflow,
    revertMockWorkflow,
    isLoading,
  };

  return <WorkflowsContext.Provider value={value}>{children}</WorkflowsContext.Provider>;
};

