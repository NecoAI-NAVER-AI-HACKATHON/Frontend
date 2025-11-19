import React from "react";
import { X, Plus, Info } from "lucide-react";
import type { WorkflowNode, CustomVariable } from "../../../types/workflow";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useEnsureParameters, useSyncSchemaVariables } from "./hooks";
import { shouldShowSchemas } from "./utils";
import { ParameterFieldRenderer } from "./ParameterFieldRenderer";
import { SchemaPropertiesRenderer } from "./SchemaPropertiesRenderer";

interface NodeConfigSectionProps {
  node: WorkflowNode | null;
  nodes?: WorkflowNode[];
  onClose: () => void;
  onConfigChange: (nodeId: string, config: Record<string, any>) => void;
  variables?: CustomVariable[];
  onVariablesChange?: (variables: CustomVariable[]) => void;
}

const NodeConfigSection = ({
  node,
  nodes = [],
  onClose,
  onConfigChange,
  variables = [],
  onVariablesChange,
}: NodeConfigSectionProps) => {
  // Custom hooks - must be called before early returns
  useEnsureParameters(node, onConfigChange);
  useSyncSchemaVariables(node, variables, onVariablesChange);

  if (!node) return null;

  // Get all node names for select dropdowns (excluding the current node)
  const availableNodeNames = nodes
    .filter((n) => n.id !== node.id)
    .map((n) => ({ value: n.name, label: n.name }));

  // Add "End Node" as an option for if-else nodes
  const nodeNameOptions =
    node.type === "if-else"
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

  const handleSchemaChange = (schemaType: "inputSchema" | "outputSchema", schema: any) => {
    handleConfigChange(schemaType, schema);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-900">Node Configuration</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
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
            <p className="text-xs text-gray-500 capitalize">{node.type.replace("-", " ")}</p>
          </div>
        </div>

        {/* Configuration fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              type="text"
              value={node.config?.name || node.name}
              onChange={(e) => handleConfigChange("name", e.target.value)}
              placeholder="Node name"
            />
          </div>

          {/* Render parameters */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Parameters
            </div>
            {node.config?.parameters && Object.keys(node.config.parameters).length > 0 ? (
              Object.entries(node.config.parameters).map(([key, value]) => (
                <ParameterFieldRenderer
                  key={key}
                  node={node}
                  fieldKey={key}
                  value={value}
                  path={["parameters"]}
                  nodeNameOptions={nodeNameOptions}
                  onNestedConfigChange={handleNestedConfigChange}
                />
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                No parameters configured. Parameters will appear here as you configure the node.
              </div>
            )}
          </div>

          {/* Render inputSchema - only for AI nodes and Excel reader */}
          {shouldShowSchemas(node.type, node.config?.subtype) && (
            <>
              {node.config?.inputSchema ? (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Input Schema
                  </div>
                  <SchemaPropertiesRenderer
                    schemaType="inputSchema"
                    schema={node.config.inputSchema}
                    nodeName={node.name}
                    variables={variables}
                    onSchemaChange={handleSchemaChange}
                  />
                </div>
              ) : (
                (node.type === "hyperclova" ||
                  node.type === "clova-ocr" ||
                  node.type === "clova-studio" ||
                  node.type === "papago" ||
                  node.type === "custom-model") && (
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

              {/* Render outputSchema */}
              {node.config?.outputSchema ? (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Output Schema
                  </div>
                  <SchemaPropertiesRenderer
                    schemaType="outputSchema"
                    schema={node.config.outputSchema}
                    nodeName={node.name}
                    variables={variables}
                    onSchemaChange={handleSchemaChange}
                    onVariablesChange={onVariablesChange}
                  />
                  <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      Properties added here will automatically be available as global variables in
                      the format <code className="bg-blue-100 px-1 rounded">json.propertyName</code>.
                      You can use them in other nodes as{" "}
                      <code className="bg-blue-100 px-1 rounded">{`{{json.propertyName}}`}</code>.
                    </p>
                  </div>
                </div>
              ) : (
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
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

