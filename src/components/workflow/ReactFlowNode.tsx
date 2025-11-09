import { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import type { LucideIcon } from "lucide-react";
import {
  Zap,
  Globe,
  ArrowLeftRight,
  Repeat,
  FileText,
} from "lucide-react";
import type { WorkflowNode } from "../../types/workflow";

interface ReactFlowNodeData {
  node: WorkflowNode;
  icon: LucideIcon;
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

const ReactFlowNode = ({ data, selected }: NodeProps<ReactFlowNodeData>) => {
  const { node, icon: Icon } = data;
  const isSelected = selected;

  return (
    <div
      className={`relative bg-white border-2 rounded-lg p-4 min-w-[180px] transition shadow-sm ${
        isSelected
          ? "border-indigo-500 shadow-lg shadow-indigo-200"
          : "border-gray-300 hover:border-indigo-300"
      }`}
    >
      {/* Input connection handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-indigo-300 !border-2 !border-white !w-4 !h-4 hover:!bg-indigo-400"
        style={{ left: -8 }}
      />

      {/* Node content */}
      <div className="flex items-start gap-3">
        <div className="text-indigo-600 mt-1">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{node.name}</div>
          <div className="text-xs text-gray-500 mt-1 capitalize">
            {node.type.replace("-", " ")}
          </div>
        </div>
      </div>

      {/* Output connection handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-600 !border-2 !border-white !w-4 !h-4 hover:!bg-indigo-700"
        style={{ right: -8 }}
      />
    </div>
  );
};

export default memo(ReactFlowNode);

