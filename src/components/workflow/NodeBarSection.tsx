import {
  Zap,
  Globe,
  ArrowLeftRight,
  Repeat,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NodeDefinition, NodeCategory } from "../../types/workflow";
import NodeLabel from "./NodeLabel";

interface NodeBarSectionProps {
  selectedNodeType?: string;
  onNodeSelect: (nodeType: NodeDefinition) => void;
}

// Node definitions
const nodeDefinitions: NodeDefinition[] = [
  // Trigger
  { type: "webhook", label: "Webhook", category: "trigger", icon: "Zap" },
  { type: "schedule", label: "Schedule", category: "trigger", icon: "Zap" },
  { type: "manual", label: "Manual", category: "trigger", icon: "Zap" },
  // AI Processing
  {
    type: "hyperclova",
    label: "HyperCLOVA",
    category: "ai",
    icon: "Globe",
  },
  { type: "clova-ocr", label: "CLOVA OCR", category: "ai", icon: "Globe" },
  { type: "papago", label: "Papago", category: "ai", icon: "Globe" },
  {
    type: "custom-model",
    label: "Custom Model",
    category: "ai",
    icon: "Globe",
  },
  // Transform
  {
    type: "json-parser",
    label: "JSON Parser",
    category: "transform",
    icon: "ArrowLeftRight",
  },
  { type: "filter", label: "Filter", category: "transform", icon: "ArrowLeftRight" },
  { type: "merge", label: "Merge", category: "transform", icon: "ArrowLeftRight" },
  // Control
  { type: "if-else", label: "If/Else", category: "control", icon: "Repeat" },
  { type: "loop", label: "Loop", category: "control", icon: "Repeat" },
  { type: "switch", label: "Switch", category: "control", icon: "Repeat" },
  // Output
  {
    type: "http-request",
    label: "HTTP Request",
    category: "output",
    icon: "FileText",
  },
  { type: "database", label: "Database", category: "output", icon: "FileText" },
  { type: "email", label: "Email", category: "output", icon: "FileText" },
];

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Globe,
  ArrowLeftRight,
  Repeat,
  FileText,
};

// Draggable Node Item Component
const DraggableNodeItem = ({
  nodeDef,
  isSelected,
  onNodeSelect,
}: {
  nodeDef: NodeDefinition;
  isSelected: boolean;
  onNodeSelect: (nodeType: NodeDefinition) => void;
}) => {
  const Icon = iconMap[nodeDef.icon];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/reactflow", JSON.stringify(nodeDef));
  };

  return (
    <button
      draggable
      onDragStart={handleDragStart}
      onClick={() => onNodeSelect(nodeDef)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
        isSelected
          ? "bg-indigo-50 border border-indigo-500 text-indigo-700"
          : "bg-white hover:bg-gray-50 border border-gray-200 text-gray-700"
      }`}
    >
      {Icon && (
        <Icon
          className={`w-5 h-5 ${
            isSelected ? "text-indigo-600" : "text-gray-500"
          }`}
        />
      )}
      <span className="text-sm font-medium">{nodeDef.label}</span>
    </button>
  );
};

const NodeBarSection = ({
  selectedNodeType,
  onNodeSelect,
}: NodeBarSectionProps) => {
  const categories: NodeCategory[] = ["trigger", "ai", "transform", "control", "output"];

  const getCategoryLabel = (category: NodeCategory): string => {
    const labels: Record<NodeCategory, string> = {
      trigger: "Trigger",
      ai: "AI Processing",
      transform: "Transform",
      control: "Control",
      output: "Output",
    };
    return labels[category];
  };

  const getNodesByCategory = (category: NodeCategory) => {
    return nodeDefinitions.filter((node) => node.category === category);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-900">Node Library</h2>
      </div>

      <div className="p-4 space-y-6">
        {categories.map((category) => {
          const nodes = getNodesByCategory(category);
          return (
            <div key={category} className="space-y-2">
              <NodeLabel category={getCategoryLabel(category)} />
              <div className="space-y-2">
                {nodes.map((nodeDef) => {
                  const isSelected = selectedNodeType === nodeDef.type;
                  return (
                    <DraggableNodeItem
                      key={nodeDef.type}
                      nodeDef={nodeDef}
                      isSelected={isSelected}
                      onNodeSelect={onNodeSelect}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeBarSection;

