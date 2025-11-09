import { useCallback, useMemo, useEffect, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CanvasSectionProps {
  nodes: WorkflowNode[];
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onNodeAdd?: (node: WorkflowNode) => void;
}

const iconMap: Record<string, LucideIcon> = {
  webhook: Zap,
  schedule: Zap,
  manual: Zap,
  hyperclova: Globe,
  "clova-ocr": Globe,
  papago: Globe,
  "custom-model": Globe,
  "json-parser": ArrowLeftRight,
  filter: ArrowLeftRight,
  merge: ArrowLeftRight,
  "if-else": Repeat,
  loop: Repeat,
  switch: Repeat,
  "http-request": FileText,
  database: FileText,
  email: FileText,
};

const nodeTypes = {
  workflowNode: ReactFlowNode,
};

const CanvasSection = ({
  nodes,
  selectedNodeId,
  onNodeSelect,
  onNodeUpdate,
  onNodeAdd,
}: CanvasSectionProps) => {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: "canvas",
  });
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
          isSelected: selectedNodeId === node.id,
          onNodeSelect,
        },
        selected: selectedNodeId === node.id,
      };
    });
  }, [nodes, selectedNodeId, onNodeSelect]);

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
          });
        });
      }
    });
    return edges;
  }, [nodes]);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Update ReactFlow nodes when our nodes change
  useEffect(() => {
    setRfNodes(reactFlowNodes);
  }, [reactFlowNodes, setRfNodes]);

  // Update ReactFlow edges when connections change
  useEffect(() => {
    setRfEdges(reactFlowEdges);
  }, [reactFlowEdges, setRfEdges]);

  // Handle node position changes
  const onNodesChangeHandler: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      // Update node positions in parent state
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = rfNodes.find((n) => n.id === change.id);
          if (node) {
            onNodeUpdate(change.id, {
              position: change.position,
            });
          }
        }
      });
    },
    [onNodesChange, rfNodes, onNodeUpdate]
  );

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        setRfEdges((eds) => addEdge(connection, eds));
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

  // Handle node click to deselect
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

        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          type: nodeDef.type,
          name: nodeDef.label,
          position,
          config: nodeDef.defaultConfig || { name: nodeDef.label },
        };

        if (onNodeAdd) {
          onNodeAdd(newNode);
        }
      } catch (e) {
        console.error("Error parsing node data:", e);
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
      ref={setDroppableRef}
      className="flex-1 bg-gray-50"
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "#6366f1", strokeWidth: 2 },
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

