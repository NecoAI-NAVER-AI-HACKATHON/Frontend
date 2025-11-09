import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkflowNav from "../../components/workflow/WorkflowNav";
import NodeBarSection from "../../components/workflow/NodeBarSection";
import NodeConfigSection from "../../components/workflow/NodeConfigSection";
import CanvasSection from "../../components/workflow/CanvasSection";
import LogSection from "../../components/workflow/LogSection";
import { WorkflowProvider, useWorkflow } from "../../contexts/WorkflowContext";
import type {
  WorkflowNode,
  NodeDefinition,
  ExecutionLog,
} from "../../types/workflow";
import {
  mockWorkflowId,
  mockWorkflow,
  mockWorkflowNodes,
  mockExecutionLogs,
} from "../../mockdata/WorkflowData";

const WorkflowContent = () => {
  const { id } = useParams<{ id?: string }>();
  const isMockWorkflow = id === mockWorkflowId;
  const workflowName = isMockWorkflow
    ? mockWorkflow.name
    : id || "summary agent";

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

  // Load mock data if ID matches
  useEffect(() => {
    if (isMockWorkflow) {
      setNodes(mockWorkflowNodes);
      setLogs(mockExecutionLogs);
      // Select first node by default
      if (mockWorkflowNodes.length > 0) {
        setSelectedNodeId(mockWorkflowNodes[0].id);
        setSelectedNodeType(mockWorkflowNodes[0].type);
        setShowConfig(true);
      }
    } else {
      // Default empty state for new workflows
      setNodes([]);
      setLogs([]);
      setSelectedNodeId(null);
      setShowConfig(false);
    }
  }, [id, isMockWorkflow]);

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
    // Save workflow logic
    console.log("Saving workflow:", { nodes, workflowName });
  };

  const handleExport = () => {
    // Export workflow logic
    console.log("Exporting workflow:", { nodes, workflowName });
  };

  const handleDelete = () => {
    // Delete workflow logic
    if (confirm("Are you sure you want to delete this workflow?")) {
      console.log("Deleting workflow:", workflowName);
    }
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;

  return (
    <div className="flex flex-col h-screen bg-white">
        {/* Top Navigation */}
        <WorkflowNav
          workflowName={workflowName}
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
  const { id } = useParams<{ id?: string }>();
  const isMockWorkflow = id === mockWorkflowId;
  const initialWorkflow = isMockWorkflow ? mockWorkflow : {
    id: id || "new-workflow",
    name: id || "summary agent",
    nodes: [],
    connections: [],
  };

  return (
    <WorkflowProvider initialWorkflow={initialWorkflow}>
      <WorkflowContent />
    </WorkflowProvider>
  );
};

export default Workflow;

