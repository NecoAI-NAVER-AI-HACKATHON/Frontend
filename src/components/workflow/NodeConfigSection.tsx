import { X } from "lucide-react";
import type { WorkflowNode } from "../../types/workflow";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface NodeConfigSectionProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onConfigChange: (nodeId: string, config: Record<string, any>) => void;
}

const NodeConfigSection = ({
  node,
  onClose,
  onConfigChange,
}: NodeConfigSectionProps) => {
  if (!node) return null;

  const handleConfigChange = (key: string, value: string) => {
    onConfigChange(node.id, {
      ...node.config,
      [key]: value,
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-900">Node Configuration</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Node header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
            {node.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{node.name}</h3>
            <p className="text-xs text-gray-500 capitalize">
              {node.type.replace("-", " ")}
            </p>
          </div>
        </div>

        {/* Configuration fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <Input
              type="text"
              value={node.config?.name || node.name}
              onChange={(e) => handleConfigChange("name", e.target.value)}
              placeholder="Node name"
            />
          </div>

          {/* Dynamic config fields based on node type */}
          {node.type === "webhook" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule
              </label>
              <Input
                type="text"
                value={node.config?.schedule || ""}
                onChange={(e) => handleConfigChange("schedule", e.target.value)}
                placeholder="Schedule"
              />
            </div>
          )}

          {/* Add more dynamic fields based on node type */}
        </div>
      </div>

      {/* Save button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={() => {
            // Configuration is saved automatically on change
            onClose();
          }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default NodeConfigSection;

