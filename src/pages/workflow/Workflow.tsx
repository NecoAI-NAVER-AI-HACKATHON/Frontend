import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import WorkflowNav from "../../components/workflow/WorkflowNav";
import NodeBarSection from "../../components/workflow/NodeBarSection";
import NodeConfigSection from "../../components/workflow/NodeConfigSection";
import CanvasSection from "../../components/workflow/CanvasSection";
import LogSection from "../../components/workflow/LogSection";
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

const Workflow = () => {
  const { id } = useParams<{ id?: string }>();
  const isMockWorkflow = id === mockWorkflowId;
  const workflowName = isMockWorkflow
    ? mockWorkflow.name
    : id || "summary agent";

  // State management
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string | undefined>(
    undefined
  );
  const [showConfig, setShowConfig] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);

  // DnD Kit sensors - no delay for immediate dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    })
  );

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
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setShowConfig(true);
  }, [nodes.length]);

  const handleNodeClick = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    setShowConfig(nodeId !== null);
  }, []);

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        )
      );
    },
    []
  );

  // Handle drag end - for both adding new nodes and moving existing ones
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dragging a node definition from the library
    if (active.data.current?.type === "node-definition" && over.id === "canvas") {
      const nodeDef = active.data.current.nodeDef as NodeDefinition;
      
      // Get canvas element to calculate position
      const canvasElement = document.getElementById("workflow-canvas");
      if (canvasElement) {
        const canvasRect = canvasElement.getBoundingClientRect();
        const activatorEvent = event.activatorEvent as MouseEvent;
        
        if (activatorEvent) {
          // Calculate position relative to canvas
          const x = activatorEvent.clientX - canvasRect.left - 90; // Center the node
          const y = activatorEvent.clientY - canvasRect.top - 20;

          const newNode: WorkflowNode = {
            id: `node-${Date.now()}`,
            type: nodeDef.type,
            name: nodeDef.label,
            position: {
              x: Math.max(0, x),
              y: Math.max(0, y),
            },
            config: nodeDef.defaultConfig || { name: nodeDef.label },
          };
          setNodes((prev) => [...prev, newNode]);
          setSelectedNodeId(newNode.id);
          setSelectedNodeType(newNode.type);
          setShowConfig(true);
        }
      }
    }
    // Note: ReactFlow handles node dragging internally, so we don't need to handle canvas-node drags here
  }, [nodes, handleNodeUpdate]);

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
    const newLogs: ExecutionLog[] = [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        message: "Workflow started",
        status: "success",
      },
    ];
    setLogs((prev) => [...newLogs, ...prev]);
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
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
              onNodeAdd={(newNode) => {
                setNodes((prev) => [...prev, newNode]);
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
    </DndContext>
  );
};

export default Workflow;

