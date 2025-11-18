import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WorkflowNav from "../../components/workflow/WorkflowNav";
import NodeBarSection from "../../components/workflow/NodeBarSection";
import NodeConfigSection from "../../components/workflow/NodeConfigSection";
import CanvasSection from "../../components/workflow/CanvasSection";
import LogSection from "../../components/workflow/LogSection";
import { WorkflowProvider, useWorkflow } from "../../contexts/WorkflowContext";
import { useWorkflows } from "../../contexts/WorkflowsContext";
import { useSystems } from "../../contexts/SystemsContext";
import { SystemService } from "@/lib/services/systemService";
import type {
  WorkflowNode,
  NodeDefinition,
  ExecutionLog,
  Workflow,
} from "../../types/workflow";
import {
  mockWorkflowId,
  mockWorkflow,
  mockWorkflowNodes,
  mockExecutionLogs,
} from "../../mockdata/WorkflowData";

interface WorkflowContentProps {
  workspaceId?: string;
  systemId?: string;
}

const WorkflowContent = ({ workspaceId, systemId }: WorkflowContentProps) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const workflowId = systemId || id;
  const isMockWorkflow = workflowId === mockWorkflowId;
  const { workflow, saveWorkflow } = useWorkflow();
  const { deleteWorkflow: deleteWorkflowFromStorage } = useWorkflows();
  
  const workflowName = workflow?.name || (isMockWorkflow ? mockWorkflow.name : id || "New Workflow");

  // Use workflow context
  const {
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
  } = useWorkflow();

  const [selectedNodeType, setSelectedNodeType] = useState<string | undefined>(
    undefined
  );
  const [showConfig, setShowConfig] = useState(false);

  // Load nodes from workflow when workflow changes
  useEffect(() => {
    if (workflow) {
      // Load nodes from the workflow
      if (workflow.nodes && workflow.nodes.length > 0) {
        setNodes(workflow.nodes);
        // Select first node by default if none selected
        if (!selectedNodeId && workflow.nodes.length > 0) {
          setSelectedNodeId(workflow.nodes[0].id);
          setSelectedNodeType(workflow.nodes[0].type);
        }
      } else {
        // Empty workflow - no nodes yet
        setNodes([]);
        setSelectedNodeId(null);
      }
    } else if (isMockWorkflow) {
      // Fallback for mock workflow
      setNodes(mockWorkflowNodes);
      setLogs(mockExecutionLogs);
      if (mockWorkflowNodes.length > 0) {
        setSelectedNodeId(mockWorkflowNodes[0].id);
        setSelectedNodeType(mockWorkflowNodes[0].type);
        setShowConfig(true);
      }
    } else {
      // No workflow loaded yet
      setNodes([]);
      setLogs([]);
      setSelectedNodeId(null);
      setShowConfig(false);
    }
  }, [workflow, isMockWorkflow, setNodes, setLogs, setSelectedNodeId, selectedNodeId]);

  // Handlers
  const handleNodeSelect = useCallback((nodeDef: NodeDefinition) => {
    setSelectedNodeType(nodeDef.type);
    // Add new node to canvas with better positioning
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeDef.type,
      name: nodeDef.label,
      position: {
        // Place new nodes in a grid-like pattern
        x: 300 + (nodes.length % 3) * 250,
        y: 150 + Math.floor(nodes.length / 3) * 150,
      },
      config: nodeDef.defaultConfig || { name: nodeDef.label },
    };
    addNode(newNode);
    setSelectedNodeId(newNode.id);
    setShowConfig(true);
  }, [nodes.length, addNode, setSelectedNodeId]);

  const handleNodeClick = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    setShowConfig(nodeId !== null);
  }, [setSelectedNodeId]);

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      updateNode(nodeId, updates);
    },
    [updateNode]
  );

  const handleNodeDelete = useCallback((nodeId: string) => {
    deleteNode(nodeId);
    
    // Clear selection if deleted node was selected
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setShowConfig(false);
    }
  }, [selectedNodeId, deleteNode, setSelectedNodeId]);

  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace key
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        // Don't delete if user is typing in an input field
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
        
        e.preventDefault();
        handleNodeDelete(selectedNodeId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, handleNodeDelete]);

  const handleConfigChange = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      // Update both config and name if name changed
      const updates: Partial<WorkflowNode> = { config };
      if (config.name) {
        updates.name = config.name;
      }
      handleNodeUpdate(nodeId, updates);
    },
    [handleNodeUpdate]
  );

  const handleRun = () => {
    // Simulate workflow execution
    const newLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      message: "Workflow started",
      status: "success",
    };
    addLog(newLog);
  };

  const handleSave = () => {
    // Save workflow to localStorage
    if (workflow && !isMockWorkflow) {
      saveWorkflow();
      alert("Workflow saved successfully!");
    } else if (isMockWorkflow) {
      alert("Cannot save mock workflow. Please create a new workflow.");
    } else {
      alert("No workflow to save.");
    }
  };

  const handleExport = () => {
    // Export workflow as JSON
    if (workflow) {
      const dataStr = JSON.stringify(workflow, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${workflow.name || "workflow"}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDelete = () => {
    // Delete workflow from localStorage
    const workflowIdToDelete = systemId || id;
    if (workflowIdToDelete && !isMockWorkflow) {
      if (confirm("Are you sure you want to delete this workflow? This action cannot be undone.")) {
        deleteWorkflowFromStorage(workflowIdToDelete);
        alert("Workflow deleted successfully!");
        // Navigate back to workspace or systems page
        if (workspaceId && systemId) {
          navigate(`/workspaces/${workspaceId}`);
        } else {
          navigate("/workspaces");
        }
      }
    } else if (isMockWorkflow) {
      alert("Cannot delete mock workflow.");
    } else {
      alert("No workflow to delete.");
    }
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;

  return (
    <div className="flex flex-col h-screen bg-white">
        {/* Top Navigation */}
        <WorkflowNav
          workflowName={workflowName}
          workspaceId={workspaceId}
          systemId={systemId}
          onRun={handleRun}
          onSave={handleSave}
          onExport={handleExport}
          onDelete={handleDelete}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Node Library */}
          <NodeBarSection
            selectedNodeType={selectedNodeType}
            onNodeSelect={handleNodeSelect}
          />

          {/* Center - Canvas */}
          <div className="flex-1 flex flex-col">
            <CanvasSection
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onNodeSelect={handleNodeClick}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onNodeAdd={(newNode) => {
                addNode(newNode);
                setSelectedNodeId(newNode.id);
                setSelectedNodeType(newNode.type);
                setShowConfig(true);
              }}
            />

            {/* Bottom - Execution Logs */}
            <LogSection logs={logs} />
          </div>

          {/* Right Sidebar - Node Configuration */}
          {showConfig && selectedNode && (
            <NodeConfigSection
              node={selectedNode}
              onClose={() => {
                setShowConfig(false);
                setSelectedNodeId(null);
              }}
              onConfigChange={handleConfigChange}
            />
          )}
        </div>
    </div>
  );
};

const Workflow = () => {
  const { id, workspaceId, systemId } = useParams<{ 
    id?: string; 
    workspaceId?: string; 
    systemId?: string; 
  }>();
  const { getWorkflow, createWorkflow, saveWorkflow } = useWorkflows();
  const { getSystem } = useSystems();
  const [initialWorkflow, setInitialWorkflow] = useState<Workflow | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine workflow ID - use systemId if available, otherwise use id
  const workflowId = systemId || id;
  const isMockWorkflow = workflowId === mockWorkflowId;

  useEffect(() => {
    const loadWorkflow = async () => {
      setIsLoading(true);
      
      try {
        if (isMockWorkflow) {
          // Load mock workflow (sys-001)
          setInitialWorkflow(mockWorkflow);
        } else if (systemId && workspaceId) {
          // Load from system - get system data and create/load workflow
          const system = getSystem(systemId);
          const savedWorkflow = getWorkflow(systemId);
          
          if (savedWorkflow) {
            setInitialWorkflow(savedWorkflow);
          } else {
            // Create new workflow for this system using system name
            const workflowName = system?.name || `System ${systemId}`;
            createWorkflow({
              id: systemId, // Use system ID as workflow ID
              name: workflowName,
              nodes: [],
              connections: [],
            });
            const created = getWorkflow(systemId);
            setInitialWorkflow(created);
          }
        } else if (workflowId) {
          // Try to load from localStorage
          const savedWorkflow = getWorkflow(workflowId);
          if (savedWorkflow) {
            setInitialWorkflow(savedWorkflow);
          } else {
            // Create new workflow if not found
            const newId = createWorkflow({
              name: workflowId || "New Workflow",
              nodes: [],
              connections: [],
            });
            const created = getWorkflow(newId);
            setInitialWorkflow(created);
          }
        } else {
          // No ID provided, create a new workflow
          const newId = createWorkflow({
            name: "New Workflow",
            nodes: [],
            connections: [],
          });
          const created = getWorkflow(newId);
          setInitialWorkflow(created);
        }
      } catch (error) {
        console.error("Error loading workflow:", error);
        // Create a default workflow on error
        const newId = createWorkflow({
          name: "New Workflow",
          nodes: [],
          connections: [],
        });
        const created = getWorkflow(newId);
        setInitialWorkflow(created);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflow();
  }, [id, workspaceId, systemId, isMockWorkflow, getWorkflow, createWorkflow]);

  // Handle workflow changes (auto-save)
  const handleWorkflowChange = useCallback((workflow: Workflow) => {
    if (workflow && !isMockWorkflow) {
      saveWorkflow(workflow);
    }
  }, [saveWorkflow, isMockWorkflow]);

  if (isLoading || !initialWorkflow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading workflow...</div>
      </div>
    );
  }

  return (
    <WorkflowProvider 
      initialWorkflow={initialWorkflow}
      onWorkflowChange={handleWorkflowChange}
    >
      <WorkflowContent workspaceId={workspaceId} systemId={systemId} />
    </WorkflowProvider>
  );
};

export default Workflow;

