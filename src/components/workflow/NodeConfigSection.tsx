import React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { WorkflowNode } from "../../types/workflow";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

interface NodeConfigSectionProps {
  node: WorkflowNode | null;
  nodes?: WorkflowNode[];
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

const DATABASE_FIELD_TYPES = [
  { value: "string", label: "String" },
  { value: "integer", label: "Integer" },
  { value: "float", label: "Float" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "DateTime" },
  { value: "text", label: "Text" },
  { value: "json", label: "JSON" },
];

const NodeConfigSection = ({
  node,
  nodes = [],
  onClose,
  onConfigChange,
}: NodeConfigSectionProps) => {
  if (!node) return null;

  // Get all node names for select dropdowns (excluding the current node)
  const availableNodeNames = nodes
    .filter((n) => n.id !== node.id)
    .map((n) => ({ value: n.name, label: n.name }));
  
  // Add "End Node" as an option for if-else nodes (it's a special value, not an actual node)
  const nodeNameOptions = node.type === "if-else" 
    ? [...availableNodeNames, { value: "End Node", label: "End Node" }]
    : availableNodeNames;

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

    // Special handling for database fields
    if (key === "fields" && node.type === "database" && path[0] === "parameters") {
      const fieldsArray = Array.isArray(value) 
        ? value 
        : (value && typeof value === "object" 
            ? Object.entries(value).map(([dbName, val]) => ({
                displayName: typeof val === "string" && val ? val : dbName,
                dbName: dbName,
                type: "string",
              }))
            : []);

      const handleAddField = () => {
        const newFields = [...fieldsArray, { displayName: "", dbName: "", type: "string" }];
        handleNestedConfigChange(fullPath, newFields);
      };

      const handleRemoveField = (index: number) => {
        const newFields = fieldsArray.filter((_, i) => i !== index);
        handleNestedConfigChange(fullPath, newFields);
      };

      const handleFieldChange = (index: number, fieldKey: string, fieldValue: string) => {
        const newFields = [...fieldsArray];
        newFields[index] = { ...newFields[index], [fieldKey]: fieldValue };
        handleNestedConfigChange(fullPath, newFields);
      };

      return (
        <div key={fieldKey} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddField}
              className="h-7 px-2 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Field
            </Button>
          </div>
          
          <div className="space-y-2">
            {fieldsArray.map((field: any, index: number) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-md space-y-2 bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Display Name
                      </label>
                      <Input
                        type="text"
                        value={field.displayName || ""}
                        onChange={(e) => handleFieldChange(index, "displayName", e.target.value)}
                        placeholder="Display name"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Database Name
                      </label>
                      <Input
                        type="text"
                        value={field.dbName || ""}
                        onChange={(e) => handleFieldChange(index, "dbName", e.target.value)}
                        placeholder="name_in_database"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <Select
                        options={DATABASE_FIELD_TYPES}
                        value={field.type || "string"}
                        onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveField(index)}
                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {fieldsArray.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                No fields added. Click "Add Field" to add one.
              </div>
            )}
          </div>
        </div>
      );
    }

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
    } else if (key === "trueNodeName" || key === "falseNodeName") {
      inputElement = (
        <Select
          options={nodeNameOptions}
          value={value || ""}
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

