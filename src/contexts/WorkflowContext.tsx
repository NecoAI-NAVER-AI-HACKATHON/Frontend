import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import type { WorkflowNode, ExecutionLog, Workflow } from "../types/workflow";

interface WorkflowContextType {
  workflow: Workflow | null;
  nodes: WorkflowNode[];
  logs: ExecutionLog[];
  selectedNodeId: string | null;
  setNodes: (nodes: WorkflowNode[]) => void;
  setLogs: (logs: ExecutionLog[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  addNode: (node: WorkflowNode) => void;
  deleteNode: (nodeId: string) => void;
  addLog: (log: ExecutionLog) => void;
  saveWorkflow: () => void;
  updateWorkflowName: (name: string) => void;
  updateWorkflowVariables: (variables: any[] | undefined) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
  initialWorkflow?: Workflow;
  onWorkflowChange?: (workflow: Workflow) => void;
}

export const WorkflowProvider = ({ children, initialWorkflow, onWorkflowChange }: WorkflowProviderProps) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(initialWorkflow || null);
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialWorkflow?.nodes || []);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Update workflow when initialWorkflow changes (e.g., after loading from storage)
  useEffect(() => {
    if (initialWorkflow) {
      setWorkflow(initialWorkflow);
      setNodes(initialWorkflow.nodes || []);
    }
  }, [initialWorkflow?.id]);

  // Ref to track if this is the initial load (to avoid saving on mount)
  const isInitialLoad = useRef(true);

  // Update workflow state locally when nodes change (but don't auto-save)
  // This keeps the workflow object in sync for UI purposes
  useEffect(() => {
    if (workflow) {
      const updatedWorkflow: Workflow = {
        ...workflow,
        nodes,
        connections: nodes.reduce((acc, node) => {
          if (node.connections?.output) {
            node.connections.output.forEach((targetId) => {
              acc.push({ from: node.id, to: targetId });
            });
          }
          return acc;
        }, [] as Array<{ from: string; to: string }>),
        // Preserve variables when updating workflow
        variables: workflow.variables,
      };
      // Only update workflow state if nodes actually changed (prevent unnecessary updates)
      const nodesChanged = JSON.stringify(workflow.nodes) !== JSON.stringify(nodes);
      if (nodesChanged) {
        setWorkflow(updatedWorkflow);
        // Don't auto-save - only update local state
        console.log("Workflow State Updated (local only):", updatedWorkflow);
      }
    }
    
    // Mark initial load as complete after first render
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [nodes, workflow?.id, workflow?.name, workflow?.variables]);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, ...updates } : node))
    );
  }, []);

  const addNode = useCallback((node: WorkflowNode) => {
    setNodes((prev) => [...prev, node]);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => {
      const updatedNodes = prev.filter((node) => node.id !== nodeId);
      // Clean up connections
      return updatedNodes.map((node) => {
        const connections = { ...node.connections };
        if (connections.input) {
          connections.input = connections.input.filter((id) => id !== nodeId);
        }
        if (connections.output) {
          connections.output = connections.output.filter((id) => id !== nodeId);
        }
        return {
          ...node,
          connections: Object.keys(connections).length > 0 ? connections : undefined,
        };
      });
    });
  }, []);

  const addLog = useCallback((log: ExecutionLog) => {
    setLogs((prev) => [log, ...prev]);
  }, []);

  const saveWorkflow = useCallback(() => {
    if (workflow) {
      // Build the current workflow state from nodes
      const currentWorkflow: Workflow = {
        ...workflow,
        nodes,
        connections: nodes.reduce((acc, node) => {
          if (node.connections?.output) {
            node.connections.output.forEach((targetId) => {
              acc.push({ from: node.id, to: targetId });
            });
          }
          return acc;
        }, [] as Array<{ from: string; to: string }>),
        // Preserve variables when saving
        variables: workflow.variables,
      };
      
      // Update local workflow state
      setWorkflow(currentWorkflow);
      
      // Persist to storage via callback if provided
      if (onWorkflowChange) {
        onWorkflowChange(currentWorkflow);
        console.log("Workflow manually saved:", currentWorkflow.id);
      } else {
        console.warn("Cannot save workflow: onWorkflowChange not available");
      }
    } else {
      console.warn("Cannot save workflow: workflow is null");
    }
  }, [workflow, nodes, onWorkflowChange]);

  const updateWorkflowName = useCallback((name: string) => {
    if (workflow) {
      const updatedWorkflow: Workflow = {
        ...workflow,
        name,
      };
      setWorkflow(updatedWorkflow);
      // Don't auto-save name changes - only update local state
    }
  }, [workflow]);

  const updateWorkflowVariables = useCallback((variables: any[] | undefined) => {
    if (workflow) {
      const updatedWorkflow: Workflow = {
        ...workflow,
        variables: variables || [],
      };
      setWorkflow(updatedWorkflow);
      // Don't auto-save variable changes - only update local state
    }
  }, [workflow]);

  const value: WorkflowContextType = {
    workflow,
    nodes,
    logs,
    selectedNodeId,
    setNodes,
    setLogs,
    setSelectedNodeId,
    updateNode,
    addNode,
    deleteNode,
    addLog,
    saveWorkflow,
    updateWorkflowName,
    updateWorkflowVariables,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

