import React from "react";
import { Info } from "lucide-react";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import type { WorkflowNode } from "../../../types/workflow";
import {
  TIMEZONES,
  SCHEDULE_MODES,
  LANGUAGES,
  OPERATORS,
  HTTP_METHODS,
  FORMAT_TYPES,
  STATUS_CODES,
} from "./constants";
import { getNestedValue, capitalize } from "./utils";
import { FormFieldsRenderer } from "./FormFieldsRenderer";
import { DatabaseFieldsRenderer } from "./DatabaseFieldsRenderer";

interface ParameterFieldRendererProps {
  node: WorkflowNode;
  fieldKey: string;
  value: any;
  path: string[];
  nodeNameOptions: Array<{ value: string; label: string }>;
  onNestedConfigChange: (path: string[], value: any) => void;
}

export const ParameterFieldRenderer: React.FC<ParameterFieldRendererProps> = ({
  node,
  fieldKey,
  value,
  path,
  nodeNameOptions,
  onNestedConfigChange,
}) => {
  const fullPath = [...path, fieldKey];
  const displayKey = fullPath.join(".");

  // Skip teams_data if it's inside injected-data (it's defined in global variables)
  if (fieldKey === "teams_data" && path.includes("injected-data")) {
    return null;
  }

  // Special handling for form submit fields
  if (fieldKey === "formFields" && node.type === "form-submit" && path[0] === "parameters") {
    const fieldsArray = Array.isArray(value) ? value : [];

    const handleAddField = () => {
      const newFields = [...fieldsArray, { name: "", label: "", type: "text", required: false }];
      onNestedConfigChange(fullPath, newFields);
    };

    const handleRemoveField = (index: number) => {
      const newFields = fieldsArray.filter((_, i) => i !== index);
      onNestedConfigChange(fullPath, newFields);
    };

    const handleFieldChange = (index: number, fieldKey: string, fieldValue: any) => {
      const newFields = [...fieldsArray];
      newFields[index] = { ...newFields[index], [fieldKey]: fieldValue };
      onNestedConfigChange(fullPath, newFields);
    };

    return (
      <FormFieldsRenderer
        fields={fieldsArray}
        onAdd={handleAddField}
        onRemove={handleRemoveField}
        onChange={handleFieldChange}
        label={fieldKey}
      />
    );
  }

  // Special handling for database fields
  if (fieldKey === "fields" && node.type === "database" && path[0] === "parameters") {
    const fieldsArray = Array.isArray(value)
      ? value
      : value && typeof value === "object"
      ? Object.entries(value).map(([dbName, val]) => ({
          displayName: typeof val === "string" ? val : dbName,
          dbName: dbName,
          type: "string",
        }))
      : [];

    const handleAddField = () => {
      const newFields = [...fieldsArray, { displayName: "", dbName: "", type: "string" }];
      onNestedConfigChange(fullPath, newFields);
    };

    const handleRemoveField = (index: number) => {
      const newFields = fieldsArray.filter((_, i) => i !== index);
      onNestedConfigChange(fullPath, newFields);
    };

    const handleFieldChange = (index: number, fieldKey: string, fieldValue: string) => {
      const newFields = [...fieldsArray];
      newFields[index] = { ...newFields[index], [fieldKey]: fieldValue };
      onNestedConfigChange(fullPath, newFields);
    };

    return (
      <DatabaseFieldsRenderer
        fields={fieldsArray}
        onAdd={handleAddField}
        onRemove={handleRemoveField}
        onChange={handleFieldChange}
        label={fieldKey}
      />
    );
  }

  // Handle nested objects
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const filteredEntries = Object.entries(value).filter(([subKey, _]) => {
      if (fieldKey === "injected-data" && subKey === "teams_data") {
        return false;
      }
      return true;
    });

    if (fieldKey === "injected-data" && filteredEntries.length === 0) {
      return null;
    }

    return (
      <div key={displayKey} className="space-y-3 border-l-2 border-gray-200 pl-4">
        <div className="text-sm font-medium text-gray-700 capitalize">
          {capitalize(fieldKey)}
        </div>
        {filteredEntries.map(([subKey, subValue]) => (
          <ParameterFieldRenderer
            key={subKey}
            node={node}
            fieldKey={subKey}
            value={subValue}
            path={fullPath}
            nodeNameOptions={nodeNameOptions}
            onNestedConfigChange={onNestedConfigChange}
          />
        ))}
      </div>
    );
  }

  // Determine input type based on field name and context
  let inputElement: React.ReactElement;

  // Handle mode.mode (schedule mode selection)
  if (fieldKey === "mode" && path.length === 2 && path[0] === "parameters" && path[1] === "mode") {
    const modeObj = getNestedValue(node.config?.parameters, ["mode"]) || {};
    inputElement = (
      <Select
        options={SCHEDULE_MODES}
        value={value || "daily"}
        onChange={(e) =>
          onNestedConfigChange(["parameters", "mode"], {
            ...modeObj,
            mode: e.target.value,
          })
        }
      />
    );
  } else if (fieldKey === "dailyTime" && path.includes("mode")) {
    inputElement = (
      <Input
        type="time"
        value={value || ""}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
      />
    );
  } else if (fieldKey === "timezone") {
    inputElement = (
      <Select
        options={TIMEZONES}
        value={value || ""}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
      />
    );
  } else if (fieldKey === "language") {
    inputElement = (
      <Select
        options={LANGUAGES}
        value={value || "javascript"}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
      />
    );
  } else if (fieldKey === "operator") {
    inputElement = (
      <Select
        options={OPERATORS}
        value={value || "=="}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
      />
    );
  } else if (fieldKey === "method") {
    inputElement = (
      <Select
        options={HTTP_METHODS}
        value={value || "POST"}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
      />
    );
  } else if (fieldKey === "trueNodeName" || fieldKey === "falseNodeName") {
    inputElement = (
      <Select
        options={nodeNameOptions}
        value={value || ""}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
      />
    );
  } else if (fieldKey === "uploadPath" && node.type === "file-upload" && path[0] === "parameters") {
    inputElement = (
      <Input
        type="text"
        value={value || ""}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
        placeholder="/uploads"
      />
    );
  } else if (fieldKey === "allowedTypes" && node.type === "file-upload" && path[0] === "parameters") {
    const typesArray = Array.isArray(value) ? value : value ? [value] : [];
    const typesString = typesArray.join(", ");
    inputElement = (
      <div className="space-y-2">
        <Input
          type="text"
          value={typesString}
          onChange={(e) => {
            const types = e.target.value.split(",").map((t) => t.trim()).filter((t) => t);
            onNestedConfigChange(fullPath, types);
          }}
          placeholder="image/png, image/jpeg, application/pdf"
        />
        <p className="text-xs text-gray-500">
          Enter comma-separated MIME types (e.g., image/png, application/pdf)
        </p>
      </div>
    );
  } else if (fieldKey === "maxSize" && node.type === "file-upload" && path[0] === "parameters") {
    const sizeInMB = value ? (value / 1048576).toFixed(2) : "";
    inputElement = (
      <div className="space-y-2">
        <Input
          type="number"
          value={sizeInMB}
          onChange={(e) => {
            const mb = parseFloat(e.target.value) || 0;
            onNestedConfigChange(fullPath, Math.round(mb * 1048576));
          }}
          placeholder="10"
          step="0.1"
        />
        <p className="text-xs text-gray-500">Maximum file size in MB</p>
      </div>
    );
  } else if (fieldKey === "formatType" && node.type === "format" && path[0] === "parameters") {
    inputElement = (
      <Select
        options={FORMAT_TYPES}
        value={value || "json"}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
      />
    );
  } else if (fieldKey === "template" && node.type === "format" && path[0] === "parameters") {
    inputElement = (
      <textarea
        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono"
        value={value || ""}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
        placeholder="Enter format template"
      />
    );
  } else if (fieldKey === "statusCode" && node.type === "webhook-response" && path[0] === "parameters") {
    inputElement = (
      <Select
        options={STATUS_CODES}
        value={String(value || 200)}
        onChange={(e) => onNestedConfigChange(fullPath, parseInt(e.target.value))}
      />
    );
  } else if (fieldKey === "code" || fieldKey === "prompt" || fieldKey === "body") {
    const isFunctionCode = fieldKey === "code" && node.type === "function";
    inputElement = (
      <div className="space-y-2">
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          value={value || ""}
          onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
          placeholder={`Enter ${fieldKey}`}
        />
        {isFunctionCode && (
          <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Note: If you define a variable to reuse, add it to the global variables using the Variables button.
            </p>
          </div>
        )}
      </div>
    );
  } else if (typeof value === "number") {
    inputElement = (
      <Input
        type="number"
        value={value || ""}
        onChange={(e) => onNestedConfigChange(fullPath, parseFloat(e.target.value) || 0)}
      />
    );
  } else {
    inputElement = (
      <Input
        type="text"
        value={value || ""}
        onChange={(e) => onNestedConfigChange(fullPath, e.target.value)}
        placeholder={`Enter ${fieldKey}`}
      />
    );
  }

  return (
    <div key={displayKey}>
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
        {capitalize(fieldKey)}
      </label>
      {inputElement}
    </div>
  );
};

