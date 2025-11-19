import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { FORM_FIELD_TYPES } from "./constants";

interface FormFieldsRendererProps {
  fields: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, fieldKey: string, fieldValue: any) => void;
  label: string;
}

export const FormFieldsRenderer: React.FC<FormFieldsRendererProps> = ({
  fields,
  onAdd,
  onRemove,
  onChange,
  label,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {label}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="h-7 px-2 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Field
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field: any, index: number) => (
          <div
            key={index}
            className="p-3 border border-gray-200 rounded-md space-y-2 bg-gray-50"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Field Name
                  </label>
                  <Input
                    type="text"
                    value={field.name || ""}
                    onChange={(e) => onChange(index, "name", e.target.value)}
                    placeholder="field_name"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Label
                  </label>
                  <Input
                    type="text"
                    value={field.label || ""}
                    onChange={(e) => onChange(index, "label", e.target.value)}
                    placeholder="Field Label"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Type
                  </label>
                  <Select
                    options={FORM_FIELD_TYPES}
                    value={field.type || "text"}
                    onChange={(e) => onChange(index, "type", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) => onChange(index, "required", e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label className="text-xs text-gray-600">Required</label>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
            No form fields added. Click "Add Field" to add one.
          </div>
        )}
      </div>
    </div>
  );
};

