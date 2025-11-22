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
import type { NodeDefinition, NodeCategory } from "../../types/workflow";
import NodeLabel from "./NodeLabel";

interface NodeBarSectionProps {
  selectedNodeType?: string;
  onNodeSelect: (nodeType: NodeDefinition) => void;
}

// Node definitions
const nodeDefinitions: NodeDefinition[] = [
  // Trigger
  { 
    type: "webhook", 
    label: "Webhook", 
    category: "trigger", 
    icon: "Zap",
    defaultConfig: {
      name: "Webhook",
      type: "trigger",
      subtype: "webhook",
      parameters: {},
    },
  },
  { 
    type: "schedule", 
    label: "Schedule", 
    category: "trigger", 
    icon: "Zap",
    defaultConfig: {
      name: "Schedule",
      type: "trigger",
      subtype: "schedule",
      parameters: {
        mode: {
          mode: "daily",
          dailyTime: "12:00:00",
        },
        timezone: "Asia/Ho_Chi_Minh",
      },
    },
  },
  { 
    type: "manual", 
    label: "Manual", 
    category: "trigger", 
    icon: "Zap",
    defaultConfig: {
      name: "Manual",
      type: "trigger",
      subtype: "manual",
      parameters: {},
    },
  },
  { 
    type: "file-upload", 
    label: "File Upload", 
    category: "trigger", 
    icon: "Upload",
    defaultConfig: {
      name: "File Upload",
      type: "trigger",
      subtype: "file-upload",
      parameters: {
        allowedTypes: [],
        maxSize: 10485760, // 10MB in bytes
        uploadPath: "",
      },
    },
  },
  { 
    type: "form-submit", 
    label: "Form Submit", 
    category: "trigger", 
    icon: "FileEdit",
    defaultConfig: {
      name: "Form Submit",
      type: "trigger",
      subtype: "form-submit",
      parameters: {
        formFields: [],
        submitUrl: "",
      },
    },
  },
  // AI Processing
  {
    type: "hyperclova",
    label: "HyperCLOVA",
    category: "ai",
    icon: "Globe",
    defaultConfig: {
      name: "HyperCLOVA",
      type: "ai-processing",
      subtype: "image-analyze",
      parameters: {
        system: "You are an image analysis assistant.",
        prompt: "",
        attachment: "",
        url: "https://clovastudio.stream.ntruss.com/v3/chat-completions/HCX-005",
        method: "POST",
        credentials: {
          API_KEY: "",
        },
      },
      inputSchema: {
        type: "object",
        properties: {},
      },
      outputSchema: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "clova-ocr",
    label: "CLOVA OCR",
    category: "ai",
    icon: "Globe",
    defaultConfig: {
      name: "CLOVA OCR",
      type: "ai-processing",
      parameters: {},
      inputSchema: {
        type: "object",
        properties: {},
      },
      outputSchema: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "clova-studio",
    label: "Clova Studio",
    category: "ai",
    icon: "Globe",
    defaultConfig: {
      name: "Clova Studio",
      type: "ai-processing",
      parameters: {},
      inputSchema: {
        type: "object",
        properties: {},
      },
      outputSchema: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "papago",
    label: "Papago",
    category: "ai",
    icon: "Globe",
    defaultConfig: {
      name: "Papago",
      type: "ai-processing",
      parameters: {},
      inputSchema: {
        type: "object",
        properties: {},
      },
      outputSchema: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "custom-model",
    label: "Custom Model",
    category: "ai",
    icon: "Globe",
    defaultConfig: {
      name: "Custom Model",
      type: "ai-processing",
      parameters: {},
      inputSchema: {
        type: "object",
        properties: {},
      },
      outputSchema: {
        type: "object",
        properties: {},
      },
    },
  },
  // Transform
  {
    type: "function",
    label: "Function",
    category: "transform",
    icon: "ArrowLeftRight",
    defaultConfig: {
      name: "Function",
      type: "data-transform",
      subtype: "excel-read",
      parameters: {
        filePath: "",
      },
      outputSchema: {
        type: "object",
        properties: {},
      },
    },
  },
  { 
    type: "split", 
    label: "Split", 
    category: "transform", 
    icon: "ArrowLeftRight",
    defaultConfig: {
      name: "Split",
      type: "data-transform",
      subtype: "split",
      parameters: {
        batchSize: 1,
      },
    },
  },
  { 
    type: "merge", 
    label: "Merge", 
    category: "transform", 
    icon: "ArrowLeftRight",
    defaultConfig: {
      name: "Merge",
      type: "data-transform",
      subtype: "merge",
      parameters: {},
    },
  },
  { 
    type: "format", 
    label: "Format", 
    category: "transform", 
    icon: "FileCode",
    defaultConfig: {
      name: "Format",
      type: "data-transform",
      subtype: "format",
      parameters: {
        formatType: "json",
        template: "",
      },
    },
  },
  // Control
  { 
    type: "if-else", 
    label: "If/Else", 
    category: "control", 
    icon: "Repeat",
    defaultConfig: {
      name: "If/Else",
      type: "control",
      subtype: "if",
      parameters: {
        field: "",
        operator: "==",
        value: "",
        trueNodeName: "",
        falseNodeName: "",
      },
    },
  },
  { 
    type: "loop", 
    label: "Loop", 
    category: "control", 
    icon: "Repeat",
    defaultConfig: {
      name: "Loop",
      type: "control",
      subtype: "loop",
      parameters: {},
    },
  },
  { 
    type: "switch", 
    label: "Switch", 
    category: "control", 
    icon: "Repeat",
    defaultConfig: {
      name: "Switch",
      type: "control",
      subtype: "switch",
      parameters: {},
    },
  },
  // Output
  {
    type: "http-request",
    label: "HTTP Request",
    category: "output",
    icon: "FileText",
    defaultConfig: {
      name: "HTTP Request",
      type: "output",
      subtype: "http-request",
      parameters: {
        url: "",
        method: "POST",
        headers: {},
        body: "",
      },
    },
  },
  { 
    type: "database", 
    label: "Database Writer", 
    category: "output", 
    icon: "FileText",
    defaultConfig: {
      name: "Database Writer",
      type: "output",
      subtype: "database",
      parameters: {
        connection: "",
        table: "",
        fields: [],
      },
    },
  },
  { 
    type: "email", 
    label: "Email Sender", 
    category: "output", 
    icon: "Send",
    defaultConfig: {
      name: "Email Sender",
      type: "output",
      subtype: "mail-writer",
      parameters: {
        to: "",
        subject: "",
        body: {
          type: "string",
          content: "",
        },
      },
    },
  },
  { 
    type: "webhook-response", 
    label: "Webhook Response", 
    category: "output", 
    icon: "FileText",
    defaultConfig: {
      name: "Webhook Response",
      type: "output",
      subtype: "webhook-response",
      parameters: {
        statusCode: 200,
        headers: {},
        body: "",
      },
    },
  },
];

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Globe,
  ArrowLeftRight,
  Repeat,
  FileText,
  Upload,
  FileEdit,
  FileCode,
  Send,
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

