import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
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
}

export const WorkflowProvider = ({ children, initialWorkflow }: WorkflowProviderProps) => {
  const [workflow, setWorkflow] = useState<Workflow | null>(initialWorkflow || null);
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialWorkflow?.nodes || []);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Update workflow when nodes change
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
      };
      setWorkflow(updatedWorkflow);
      
      // Console log the workflow state
      console.log("Workflow State Updated:", updatedWorkflow);
    }
  }, [nodes, workflow?.id, workflow?.name]);

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
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

