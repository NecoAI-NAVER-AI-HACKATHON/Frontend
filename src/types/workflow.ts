export type NodeCategory = "trigger" | "ai" | "transform" | "control" | "output";

export type NodeType =
  // Trigger
  | "webhook"
  | "schedule"
  | "manual"
  | "file-upload"
  | "form-submit"
  // AI Processing
  | "hyperclova"
  | "clova-ocr"
  | "clova-studio"
  | "papago"
  | "custom-model"
  // Transform
  | "function"
  | "split"
  | "merge"
  | "format"
  // Control
  | "if-else"
  | "loop"
  | "switch"
  // Output
  | "http-request"
  | "database"
  | "email"
  | "webhook-response";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  config?: Record<string, any>;
  connections?: {
    input?: string[];
    output?: string[];
  };
}

export interface NodeDefinition {
  type: NodeType;
  label: string;
  category: NodeCategory;
  icon: string; // lucide-react icon name
  description?: string;
  defaultConfig?: Record<string, any>;
}

export interface CustomVariable {
  id: string;
  name: string;
  value: string;
  description?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: Array<{
    from: string;
    to: string;
  }>;
  variables?: CustomVariable[];
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  message: string;
  status: "success" | "processing" | "error";
  nodeId?: string;
}

