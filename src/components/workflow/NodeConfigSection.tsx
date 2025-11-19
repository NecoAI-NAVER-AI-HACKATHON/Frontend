import React, { useEffect } from "react";
import { X, Plus, Trash2, Info } from "lucide-react";
import type { WorkflowNode, CustomVariable } from "../../types/workflow";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

interface NodeConfigSectionProps {
  node: WorkflowNode | null;
  nodes?: WorkflowNode[];
  onClose: () => void;
  onConfigChange: (nodeId: string, config: Record<string, any>) => void;
  variables?: CustomVariable[];
  onVariablesChange?: (variables: CustomVariable[]) => void;
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

const SCHEMA_PROPERTY_TYPES = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "integer", label: "Integer" },
  { value: "boolean", label: "Boolean" },
  { value: "array", label: "Array" },
  { value: "object", label: "Object" },
];

const NodeConfigSection = ({
  node,
  nodes = [],
  onClose,
  onConfigChange,
  variables = [],
  onVariablesChange,
}: NodeConfigSectionProps) => {
  if (!node) return null;

  // Check if node should show schemas (AI nodes or Excel reader)
  const shouldShowSchemas = () => {
    const aiNodeTypes = ["hyperclova", "clova-ocr", "clova-studio", "papago", "custom-model"];
    const isAINode = aiNodeTypes.includes(node.type);
    const isExcelReader = node.type === "function" && node.config?.subtype === "excel-read";
    return isAINode || isExcelReader;
  };

  // Ensure parameters object exists
  useEffect(() => {
    if (node && (!node.config || !node.config.parameters)) {
      const currentConfig = node.config || {};
      onConfigChange(node.id, {
        ...currentConfig,
        parameters: currentConfig.parameters || {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]); // Only run when node changes

  // Sync existing outputSchema properties with global variables on mount
  useEffect(() => {
    if (node.config?.outputSchema && onVariablesChange && shouldShowSchemas()) {
      const outputSchema = node.config.outputSchema;
      let properties: Record<string, any> = {};
      
      if (outputSchema?.properties) {
        properties = outputSchema.properties;
      } else if (outputSchema?.items?.properties) {
        properties = outputSchema.items.properties;
      }

      const propertyNames = Object.keys(properties);
      const newVariables: CustomVariable[] = [];
      
      propertyNames.forEach((propName) => {
        const variableName = `json.${propName}`;
        const variableExists = variables.some((v) => v.name === variableName);
        
        if (!variableExists) {
          newVariables.push({
            id: `var-${Date.now()}-${propName}`,
            name: variableName,
            value: "",
            description: `Auto-generated from ${node.name} output schema`,
          });
        }
      });

      if (newVariables.length > 0) {
        onVariablesChange([...variables, ...newVariables]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]); // Only run when node changes

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

    // Skip teams_data if it's inside injected-data (it's defined in global variables)
    if (key === "teams_data" && path.includes("injected-data")) {
      return null;
    }

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
      // Filter out teams_data from injected-data since it's defined in global variables
      const filteredEntries = Object.entries(value).filter(([subKey, _]) => {
        // Skip teams_data if it's inside injected-data
        if (key === "injected-data" && subKey === "teams_data") {
          return false;
        }
        return true;
      });

      // Don't render injected-data section if it's empty after filtering
      if (key === "injected-data" && filteredEntries.length === 0) {
        return null;
      }

      return (
        <div key={fieldKey} className="space-y-3 border-l-2 border-gray-200 pl-4">
          <div className="text-sm font-medium text-gray-700 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </div>
          {filteredEntries.map(([subKey, subValue]) =>
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
      const isFunctionCode = key === "code" && node.type === "function";
      inputElement = (
        <div className="space-y-2">
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={value || ""}
            onChange={(e) => handleNestedConfigChange(fullPath, e.target.value)}
            placeholder={`Enter ${key}`}
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

  // Render schema properties (inputSchema or outputSchema)
  const renderSchemaProperties = (
    schemaType: "inputSchema" | "outputSchema",
    schema: any
  ) => {
    // Extract properties from schema
    let properties: Record<string, any> = {};
    
    if (schema?.properties) {
      properties = schema.properties;
    } else if (schema?.items?.properties) {
      // Handle array items schema
      properties = schema.items.properties;
    }

    const propertiesArray = Object.entries(properties).map(([name, prop]: [string, any]) => ({
      name,
      type: prop.type || "string",
    }));

    const handleAddProperty = () => {
      const newPropertyName = `property_${Date.now()}`;
      const newProperties = {
        ...properties,
        [newPropertyName]: { type: "string" },
      };

      let updatedSchema: any;
      if (schema?.items) {
        // Array schema
        updatedSchema = {
          ...schema,
          items: {
            ...schema.items,
            properties: newProperties,
          },
        };
      } else {
        // Object schema
        updatedSchema = {
          ...schema,
          properties: newProperties,
        };
      }

      handleConfigChange(schemaType, updatedSchema);

      // Auto-add to global variables as json.propertyName (only for outputSchema)
      if (schemaType === "outputSchema" && onVariablesChange) {
        const variableName = `json.${newPropertyName}`;
        const variableExists = variables.some((v) => v.name === variableName);
        
        if (!variableExists) {
          const newVariable: CustomVariable = {
            id: `var-${Date.now()}`,
            name: variableName,
            value: "",
            description: `Auto-generated from ${node.name} output schema`,
          };
          onVariablesChange([...variables, newVariable]);
        }
      }
    };

    const handleRemoveProperty = (propertyName: string) => {
      const newProperties = { ...properties };
      delete newProperties[propertyName];

      let updatedSchema: any;
      if (schema?.items) {
        updatedSchema = {
          ...schema,
          items: {
            ...schema.items,
            properties: newProperties,
          },
        };
      } else {
        updatedSchema = {
          ...schema,
          properties: newProperties,
        };
      }

      handleConfigChange(schemaType, updatedSchema);

      // Remove from global variables if it exists (only for outputSchema)
      if (schemaType === "outputSchema" && onVariablesChange) {
        const variableName = `json.${propertyName}`;
        const updatedVariables = variables.filter((v) => v.name !== variableName);
        if (updatedVariables.length !== variables.length) {
          onVariablesChange(updatedVariables);
        }
      }
    };

    const handlePropertyChange = (oldName: string, newName: string, newType: string) => {
      const newProperties: Record<string, any> = {};
      
      Object.entries(properties).forEach(([name, prop]: [string, any]) => {
        if (name === oldName) {
          newProperties[newName] = { type: newType };
        } else {
          newProperties[name] = prop;
        }
      });

      let updatedSchema: any;
      if (schema?.items) {
        updatedSchema = {
          ...schema,
          items: {
            ...schema.items,
            properties: newProperties,
          },
        };
      } else {
        updatedSchema = {
          ...schema,
          properties: newProperties,
        };
      }

      handleConfigChange(schemaType, updatedSchema);

      // Update global variable name if it exists (only for outputSchema)
      if (schemaType === "outputSchema" && onVariablesChange && oldName !== newName) {
        const oldVariableName = `json.${oldName}`;
        const newVariableName = `json.${newName}`;
        
        const updatedVariables = variables.map((v) => {
          if (v.name === oldVariableName) {
            return {
              ...v,
              name: newVariableName,
            };
          }
          return v;
        });

        // Check if new variable name already exists
        const newVarExists = updatedVariables.some((v) => v.name === newVariableName && v.id !== variables.find((v) => v.name === oldVariableName)?.id);
        
        if (!newVarExists) {
          onVariablesChange(updatedVariables);
        } else {
          // If new name exists, just remove the old one
          onVariablesChange(variables.filter((v) => v.name !== oldVariableName));
        }
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {schemaType === "inputSchema" ? "Input Schema" : "Output Schema"}
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddProperty}
            className="h-7 px-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Property
          </Button>
        </div>

        <div className="space-y-2">
          {propertiesArray.map((property: any, index: number) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-md space-y-2 bg-gray-50"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Property Name (displays as json.name)
                    </label>
                    <Input
                      type="text"
                      value={property.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        handlePropertyChange(property.name, newName, property.type);
                      }}
                      placeholder="property_name"
                      className="h-8 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use as: <code className="bg-gray-100 px-1 rounded">{`{{json.${property.name}}}`}</code>
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Type
                    </label>
                    <Select
                      options={SCHEMA_PROPERTY_TYPES}
                      value={property.type || "string"}
                      onChange={(e) => handlePropertyChange(property.name, property.name, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProperty(property.name)}
                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {propertiesArray.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
              No properties added. Click "Add Property" to add one.
            </div>
          )}
        </div>
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

          {/* Render parameters - always show section */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Parameters
            </div>
            {node.config?.parameters && Object.keys(node.config.parameters).length > 0 ? (
              Object.entries(node.config.parameters).map(([key, value]) =>
                renderParameterField(key, value, ["parameters"])
              )
            ) : (
              <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                No parameters configured. Parameters will appear here as you configure the node.
              </div>
            )}
          </div>

          {/* Render inputSchema - only for AI nodes and Excel reader */}
          {shouldShowSchemas() && (
            <>
              {node.config?.inputSchema ? (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Input Schema
                  </div>
                  {renderSchemaProperties("inputSchema", node.config.inputSchema)}
                </div>
              ) : (
                // Show button to add inputSchema for AI nodes
                (node.type === "hyperclova" || node.type === "clova-ocr" || node.type === "clova-studio" || node.type === "papago" || node.type === "custom-model") && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Input Schema
                    </div>
                    <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                      <p className="text-sm text-gray-500 mb-3">
                        No input schema defined. Add one to define the input structure.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Initialize with empty object schema
                          handleConfigChange("inputSchema", {
                            type: "object",
                            properties: {},
                          });
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Input Schema
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* Render outputSchema - only for AI nodes and Excel reader */}
              {node.config?.outputSchema ? (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Output Schema
                  </div>
                  {renderSchemaProperties("outputSchema", node.config.outputSchema)}
                  <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      Properties added here will automatically be available as global variables in the format <code className="bg-blue-100 px-1 rounded">json.propertyName</code>. You can use them in other nodes as <code className="bg-blue-100 px-1 rounded">{`{{json.propertyName}}`}</code>.
                    </p>
                  </div>
                </div>
              ) : (
                // Show button to add outputSchema for AI nodes and Excel reader
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Output Schema
                  </div>
                  <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-sm text-gray-500 mb-3">
                      No output schema defined. Add one to define the output structure.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Initialize with empty object schema
                        handleConfigChange("outputSchema", {
                          type: "object",
                          properties: {},
                        });
                      }}
                      className="h-8 px-3 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Output Schema
                    </Button>
                  </div>
                </div>
              )}
            </>
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

