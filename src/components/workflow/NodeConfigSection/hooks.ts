import { useEffect } from "react";
import type { WorkflowNode, CustomVariable } from "../../../types/workflow";
import { shouldShowSchemas } from "./utils";

/**
 * Ensure parameters object exists in node config
 */
export const useEnsureParameters = (
  node: WorkflowNode | null,
  onConfigChange: (nodeId: string, config: Record<string, any>) => void
) => {
  useEffect(() => {
    if (node && (!node.config || !node.config.parameters)) {
      const currentConfig = node.config || {};
      onConfigChange(node.id, {
        ...currentConfig,
        parameters: currentConfig.parameters || {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.id]);
};

/**
 * Sync outputSchema properties with global variables
 */
export const useSyncSchemaVariables = (
  node: WorkflowNode | null,
  variables: CustomVariable[],
  onVariablesChange?: (variables: CustomVariable[]) => void
) => {
  useEffect(() => {
    if (node?.config?.outputSchema && onVariablesChange && shouldShowSchemas(node.type, node.config?.subtype)) {
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
  }, [node?.id]);
};

