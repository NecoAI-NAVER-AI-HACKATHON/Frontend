import { useCallback, useMemo, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnNodesChange,
  type OnConnect,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import type { WorkflowNode } from "../../types/workflow";
import ReactFlowNode from "./ReactFlowNode";
import {
  Zap,
  Globe,
  ArrowLeftRight,
  Repeat,
  FileText,
  Upload,
  FileEdit,
  FileCode,
  Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CanvasSectionProps {
  nodes: WorkflowNode[];
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeAdd?: (node: WorkflowNode) => void;
}

const iconMap: Record<string, LucideIcon> = {
  webhook: Zap,
  schedule: Zap,
  manual: Zap,
  "file-upload": Upload,
  "form-submit": FileEdit,
  hyperclova: Globe,
  "clova-ocr": Globe,
  "clova-studio": Globe,
  papago: Globe,
  "custom-model": Globe,
  function: ArrowLeftRight,
  split: ArrowLeftRight,
  merge: ArrowLeftRight,
  format: FileCode,
  "if-else": Repeat,
  loop: Repeat,
  switch: Repeat,
  "http-request": FileText,
  database: FileText,
  email: Send,
  "webhook-response": FileText,
};

const nodeTypes = {
  workflowNode: ReactFlowNode,
};

const CanvasSection = ({
  nodes,
  selectedNodeId,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeAdd,
}: CanvasSectionProps) => {
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Convert WorkflowNode[] to ReactFlow Node[]
  const reactFlowNodes = useMemo<Node[]>(() => {
    return nodes.map((node) => {
      const Icon = iconMap[node.type] || Zap;
      return {
        id: node.id,
        type: "workflowNode",
        position: node.position,
        data: {
          node,
          icon: Icon,
        },
        selected: false, // Will be updated by separate useEffect
      };
    });
  }, [nodes]);

  // Convert connections to ReactFlow Edge[]
  const reactFlowEdges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];
    nodes.forEach((node) => {
      if (node.connections?.output) {
        node.connections.output.forEach((targetId) => {
          edges.push({
            id: `${node.id}-${targetId}`,
            source: node.id,
            target: targetId,
            type: "smoothstep",
            style: { stroke: "#6366f1", strokeWidth: 2 },
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#6366f1",
            },
          });
        });
      }
    });
    return edges;
  }, [nodes]);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Track if we're currently dragging to prevent node updates during drag
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update ReactFlow nodes when our nodes change (but not during drag)
  useEffect(() => {
    // Don't update nodes if we're currently dragging - ReactFlow manages this
    if (!isDraggingRef.current) {
      setRfNodes(reactFlowNodes);
    }
  }, [reactFlowNodes, setRfNodes]);

  // Update only selection state when selection changes (without replacing nodes)
  // Use a ref to track previous selection to avoid unnecessary updates
  const prevSelectedId = useRef<string | null>(null);
  useEffect(() => {
    // Only update if selection actually changed
    if (prevSelectedId.current === selectedNodeId) return;
    prevSelectedId.current = selectedNodeId;
    
    // Update selection synchronously to prevent flicker
    setRfNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: selectedNodeId === node.id,
      }))
    );
  }, [selectedNodeId, setRfNodes]);

  // Update ReactFlow edges when connections change
  useEffect(() => {
    setRfEdges(reactFlowEdges);
  }, [reactFlowEdges, setRfEdges]);

  // Handle node position changes and deletions
  const onNodesChangeHandler: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      // Track if position is changing (indicates dragging)
      const hasPositionChange = changes.some((change) => change.type === "position");
      if (hasPositionChange) {
        isDraggingRef.current = true;
        // Clear existing timeout
        if (dragTimeoutRef.current) {
          clearTimeout(dragTimeoutRef.current);
        }
        // Reset dragging flag after drag ends (no more position changes)
        dragTimeoutRef.current = setTimeout(() => {
          isDraggingRef.current = false;
        }, 200);
      }
      
      // Handle node deletions
      changes.forEach((change) => {
        if (change.type === "remove") {
          // Remove edges connected to this node
          setRfEdges((eds) =>
            eds.filter(
              (edge) => edge.source !== change.id && edge.target !== change.id
            )
          );
          // Delete the node from parent state
          onNodeDelete(change.id);
        } else if (change.type === "position" && change.position) {
          // Update position after drag ends (debounced)
          const node = rfNodes.find((n) => n.id === change.id);
          if (node) {
            const nodeId = change.id;
            const newPosition = change.position;
            // Clear any existing timeout for this node
            // Update position after drag ends
            setTimeout(() => {
              if (!isDraggingRef.current) {
                onNodeUpdate(nodeId, {
                  position: newPosition,
                });
              }
            }, 250);
          }
        }
      });
    },
    [onNodesChange, rfNodes, onNodeUpdate, onNodeDelete, setRfEdges]
  );

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        setRfEdges((eds) => addEdge({
          ...connection,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#6366f1",
          },
        }, eds));
        // Update node connections in parent state
        const sourceNode = nodes.find((n) => n.id === connection.source);
        if (sourceNode) {
          const currentOutputs = sourceNode.connections?.output || [];
          if (!currentOutputs.includes(connection.target)) {
            onNodeUpdate(connection.source, {
              connections: {
                ...sourceNode.connections,
                output: [...currentOutputs, connection.target],
              },
            });
          }
        }
      }
    },
    [nodes, setRfEdges, onNodeUpdate]
  );

  // Handle node click to select
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Prevent event propagation to avoid conflicts
      _event.stopPropagation();
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  // Handle dropping nodes from library
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowInstance.current) return;

      const nodeData = event.dataTransfer.getData("application/reactflow");
      if (!nodeData) return;

      try {
        const nodeDef = JSON.parse(nodeData);
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const defaultConfig = nodeDef.defaultConfig || { name: nodeDef.label };
        // Ensure parameters object always exists
        if (!defaultConfig.parameters) {
          defaultConfig.parameters = {};
        }

        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          type: nodeDef.type,
          name: nodeDef.label,
          position,
          config: defaultConfig,
        };

        if (onNodeAdd) {
          onNodeAdd(newNode);
        }
      } catch (e) {
        // Error parsing node data
      }
    },
    [onNodeAdd]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  return (
    <div
      id="workflow-canvas"
      className="flex-1 bg-gray-50"
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={["Delete", "Backspace"]}
        multiSelectionKeyCode={["Meta", "Control"]}
        selectNodesOnDrag={false}
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "#6366f1", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#6366f1",
          },
        }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap
          nodeColor="#6366f1"
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{ backgroundColor: "#f9fafb" }}
        />
      </ReactFlow>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none z-10">
          <p className="text-lg">Drag a node from the library to add it to the canvas</p>
        </div>
      )}
    </div>
  );
};

export default CanvasSection;

