import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { SCHEMA_PROPERTY_TYPES } from "./constants";
import type { CustomVariable } from "../../../types/workflow";

interface SchemaPropertiesRendererProps {
  schemaType: "inputSchema" | "outputSchema";
  schema: any;
  nodeName: string;
  variables: CustomVariable[];
  onSchemaChange: (schemaType: "inputSchema" | "outputSchema", schema: any) => void;
  onVariablesChange?: (variables: CustomVariable[]) => void;
}

export const SchemaPropertiesRenderer: React.FC<SchemaPropertiesRendererProps> = ({
  schemaType,
  schema,
  nodeName,
  variables,
  onSchemaChange,
  onVariablesChange,
}) => {
  // Extract properties from schema
  let properties: Record<string, any> = {};

  if (schema?.properties) {
    properties = schema.properties;
  } else if (schema?.items?.properties) {
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

    onSchemaChange(schemaType, updatedSchema);

    // Auto-add to global variables as json.propertyName (only for outputSchema)
    if (schemaType === "outputSchema" && onVariablesChange) {
      const variableName = `json.${newPropertyName}`;
      const variableExists = variables.some((v) => v.name === variableName);

      if (!variableExists) {
        const newVariable: CustomVariable = {
          id: `var-${Date.now()}`,
          name: variableName,
          value: "",
          description: `Auto-generated from ${nodeName} output schema`,
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

    onSchemaChange(schemaType, updatedSchema);

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

    onSchemaChange(schemaType, updatedSchema);

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
      const oldVarId = variables.find((v) => v.name === oldVariableName)?.id;
      const newVarExists = updatedVariables.some(
        (v) => v.name === newVariableName && v.id !== oldVarId
      );

      if (!newVarExists) {
        onVariablesChange(updatedVariables);
      } else {
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

