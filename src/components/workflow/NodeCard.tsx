import type { LucideIcon } from "lucide-react";
import type { WorkflowNode } from "../../types/workflow";

interface NodeCardProps {
  node: WorkflowNode;
  icon: LucideIcon;
  isSelected?: boolean;
  onClick?: () => void;
  onConnectionPointClick?: (pointType: "input" | "output") => void;
}

const NodeCard = ({
  node,
  icon: Icon,
  isSelected = false,
  onClick,
  onConnectionPointClick,
}: NodeCardProps) => {
  return (
    <div
      className={`relative bg-white border-2 rounded-lg p-4 min-w-[180px] transition shadow-sm ${
        isSelected
          ? "border-indigo-500 shadow-lg shadow-indigo-200"
          : "border-gray-300 hover:border-indigo-300"
      }`}
      onClick={onClick}
    >
      {/* Input connection point */}
      <div
        className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-300 border-2 border-white cursor-pointer hover:bg-indigo-400 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onConnectionPointClick?.("input");
        }}
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

      {/* Output connection point */}
      <div
        className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white cursor-pointer hover:bg-indigo-700 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onConnectionPointClick?.("output");
        }}
      />
    </div>
  );
};

export default NodeCard;

