import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { DATABASE_FIELD_TYPES } from "./constants";

interface DatabaseFieldsRendererProps {
  fields: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, fieldKey: string, fieldValue: string) => void;
  label: string;
}

export const DatabaseFieldsRenderer: React.FC<DatabaseFieldsRendererProps> = ({
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
                    Display Name
                  </label>
                  <Input
                    type="text"
                    value={field.displayName || ""}
                    onChange={(e) => onChange(index, "displayName", e.target.value)}
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
                    onChange={(e) => onChange(index, "dbName", e.target.value)}
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
                    onChange={(e) => onChange(index, "type", e.target.value)}
                    className="h-8 text-sm"
                  />
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
            No fields added. Click "Add Field" to add one.
          </div>
        )}
      </div>
    </div>
  );
};

