import React from "react";
import { X } from "lucide-react";
import type { WorkflowNode } from "../../types/workflow";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

interface NodeConfigSectionProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onConfigChange: (nodeId: string, config: Record<string, any>) => void;
}

const TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho_Chi_Minh" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
];

const SCHEDULE_MODES = [
  { value: "daily", label: "Daily" },
  { value: "interval", label: "Interval" },
  { value: "cron", label: "Cron" },
  { value: "once", label: "Once" },
];

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
];

const OPERATORS = [
  { value: "==", label: "Equals (==)" },
  { value: "!=", label: "Not Equals (!=)" },
  { value: ">", label: "Greater Than (>)" },
  { value: ">=", label: "Greater Than or Equal (>=)" },
  { value: "<", label: "Less Than (<)" },
  { value: "<=", label: "Less Than or Equal (<=)" },
];

const HTTP_METHODS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
  { value: "PATCH", label: "PATCH" },
];

const NodeConfigSection = ({
  node,
  onClose,
  onConfigChange,
}: NodeConfigSectionProps) => {
  if (!node) return null;

  const handleConfigChange = (key: string, value: any) => {
    onConfigChange(node.id, {
      ...node.config,
      [key]: value,
    });
  };

  const handleNestedConfigChange = (path: string[], value: any) => {
    const newConfig = { ...node.config };
    let current: any = newConfig;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onConfigChange(node.id, newConfig);
  };

  const getNestedValue = (obj: any, path: string[]): any => {
    let current = obj;
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return current;
  };

  const renderParameterField = (
    key: string,
    value: any,
    path: string[] = []
  ): React.ReactElement | null => {
    const fullPath = [...path, key];
    const fieldKey = fullPath.join(".");

    // Handle nested objects
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <div key={fieldKey} className="space-y-3 border-l-2 border-gray-200 pl-4">
          <div className="text-sm font-medium text-gray-700 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </div>
          {Object.entries(value).map(([subKey, subValue]) =>
            renderParameterField(subKey, subValue, fullPath)
          )}
        </div>
      );
    }

    // Determine input type based on field name and context
    let inputElement: React.ReactElement;

    // Handle mode.mode (schedule mode selection) - when path is ["parameters", "mode"] and key is "mode"
    if (key === "mode" && path.length === 2 && path[0] === "parameters" && path[1] === "mode") {
      const modeObj = getNestedValue(node.config?.parameters, ["mode"]) || {};
      inputElement = (
        <Select
          options={SCHEDULE_MODES}
          value={value || "daily"}
          onChange={(e) =>
            handleNestedConfigChange(["parameters", "mode"], {
              ...modeObj,
              mode: e.target.value,
            })
          }
        />
      );
    } else if (key === "dailyTime" && path.includes("mode")) {
      inputElement = (
        <Input
          type="time"
          value={value || ""}
          onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
        />
      );
    } else if (key === "timezone") {
      inputElement = (
        <Select
          options={TIMEZONES}
          value={value || ""}
          onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
        />
      );
    } else if (key === "language") {
      inputElement = (
        <Select
          options={LANGUAGES}
          value={value || "javascript"}
          onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
        />
      );
    } else if (key === "operator") {
      inputElement = (
        <Select
          options={OPERATORS}
          value={value || "=="}
          onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
        />
      );
    } else if (key === "method") {
      inputElement = (
        <Select
          options={HTTP_METHODS}
          value={value || "POST"}
          onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
        />
      );
    } else if (key === "code" || key === "prompt" || key === "body") {
      inputElement = (
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          value={value || ""}
          onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      );
    } else if (typeof value === "number") {
      inputElement = (
        <Input
          type="number"
          value={value || ""}
          onChange={(e) =>
            handleNestedConfigChange(fullPath, parseFloat(e.target.value) || 0)
          }
        />
      );
    } else {
      inputElement = (
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      );
    }

    return (
      <div key={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
          {key.replace(/([A-Z])/g, " $1").trim()}
        </label>
        {inputElement}
      </div>
    );
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

          {/* Render parameters */}
          {node.config?.parameters && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Parameters
              </div>
              {Object.entries(node.config.parameters).map(([key, value]) =>
                renderParameterField(key, value, ["parameters"])
              )}
            </div>
          )}

          {/* Legacy support for old config format */}
          {!node.config?.parameters && node.config?.schedule && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule
              </label>
              <Input
                type="text"
                value={node.config.schedule || ""}
                onChange={(e) => handleConfigChange("schedule", e.target.value)}
                placeholder="Schedule"
              />
            </div>
          )}
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

