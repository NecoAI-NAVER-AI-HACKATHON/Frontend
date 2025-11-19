import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WorkflowNav from "../../components/workflow/WorkflowNav";
import NodeBarSection from "../../components/workflow/NodeBarSection";
import NodeConfigSection from "../../components/workflow/NodeConfigSection";
import CanvasSection from "../../components/workflow/CanvasSection";
import LogSection from "../../components/workflow/LogSection";
import VariablesSidebar from "../../components/workflow/VariablesSidebar";
import { WorkflowProvider, useWorkflow } from "../../contexts/WorkflowContext";
import { useWorkflows } from "../../contexts/WorkflowsContext";
import { useSystems } from "../../contexts/SystemsContext";
import type {
  WorkflowNode,
  NodeDefinition,
  ExecutionLog,
  Workflow,
  CustomVariable,
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
  const { workflow } = useWorkflow();
  const { deleteWorkflow: deleteWorkflowFromStorage, saveWorkflow: saveToStorage } = useWorkflows();
  
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
  const [showVariables, setShowVariables] = useState(false);
  const [variables, setVariables] = useState<CustomVariable[]>(
    workflow?.variables || []
  );

  // Track the workflow ID we've initialized for
  const initializedWorkflowId = useRef<string | null>(null);
  const workflowNodesRef = useRef<WorkflowNode[]>([]);

  // Load nodes and variables from workflow only on initial load or when workflow ID changes
  useEffect(() => {
    const currentWorkflowId = workflow?.id || null;
    
    // Only initialize if this is a new workflow (ID changed)
    if (currentWorkflowId !== initializedWorkflowId.current) {
      if (workflow) {
        // Initial load - sync nodes from workflow
        if (workflow.nodes && workflow.nodes.length > 0) {
          setNodes(workflow.nodes);
          workflowNodesRef.current = workflow.nodes;
          // Select first node by default if none selected
          if (workflow.nodes.length > 0) {
            setSelectedNodeId(workflow.nodes[0].id);
            setSelectedNodeType(workflow.nodes[0].type);
          }
        } else {
          // Empty workflow - no nodes yet
          setNodes([]);
          workflowNodesRef.current = [];
          setSelectedNodeId(null);
        }
        // Load variables from workflow
        setVariables(workflow.variables || []);
        initializedWorkflowId.current = currentWorkflowId;
      } else if (isMockWorkflow && currentWorkflowId === mockWorkflowId) {
        // Fallback for mock workflow
        setNodes(mockWorkflowNodes);
        workflowNodesRef.current = mockWorkflowNodes;
        setLogs(mockExecutionLogs);
        setVariables(mockWorkflow.variables || []);
        if (mockWorkflowNodes.length > 0) {
          setSelectedNodeId(mockWorkflowNodes[0].id);
          setSelectedNodeType(mockWorkflowNodes[0].type);
          setShowConfig(true);
        }
        initializedWorkflowId.current = mockWorkflowId;
      } else if (!workflow && !isMockWorkflow) {
        // No workflow loaded yet
        setNodes([]);
        workflowNodesRef.current = [];
        setLogs([]);
        setVariables([]);
        setSelectedNodeId(null);
        setShowConfig(false);
        initializedWorkflowId.current = null;
      }
    }
    // Only depend on workflow ID, not the whole workflow object or selectedNodeId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow?.id, isMockWorkflow]);

  // Update workflow when variables change (but don't auto-save)
  // Variables are stored locally and saved when user clicks Save button

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

  const handleVariablesChange = useCallback((newVariables: CustomVariable[]) => {
    setVariables(newVariables);
    // Variables will be saved when user clicks Save button
  }, []);

  const handleSave = () => {
    // Save workflow to localStorage with variables
    if (workflow && !isMockWorkflow) {
      // Update workflow with current variables before saving
      const workflowToSave: Workflow = {
        ...workflow,
        variables,
      };
      // Save directly to WorkflowsContext with variables included
      saveToStorage(workflowToSave);
      alert("Workflow saved successfully!");
    } else if (isMockWorkflow) {
      alert("Cannot save mock workflow. Please create a new workflow.");
    } else {
      alert("No workflow to save.");
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
          onDelete={handleDelete}
          onVariablesToggle={() => setShowVariables(!showVariables)}
          showVariables={showVariables}
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

          {/* Right Sidebar - Node Configuration or Variables */}
          {showVariables && (
            <VariablesSidebar
              variables={variables}
              onVariablesChange={handleVariablesChange}
              onClose={() => setShowVariables(false)}
            />
          )}
          {showConfig && selectedNode && !showVariables && (
            <NodeConfigSection
              node={selectedNode}
              nodes={nodes}
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

  // Handle workflow changes (only when explicitly saved)
  const handleWorkflowChange = useCallback((workflow: Workflow) => {
    if (workflow && !isMockWorkflow) {
      // This is called only when saveWorkflow is explicitly called
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

