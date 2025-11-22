import React, { useState } from "react";
import { X, Plus, Trash2, Copy, Variable } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export interface CustomVariable {
  id: string;
  name: string;
  value: string;
  description?: string;
}

interface VariablesSidebarProps {
  variables: CustomVariable[];
  onVariablesChange: (variables: CustomVariable[]) => void;
  onClose: () => void;
}

const VariablesSidebar = ({
  variables,
  onVariablesChange,
  onClose,
}: VariablesSidebarProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState<string | null>(null);
  const [newVariable, setNewVariable] = useState<Omit<CustomVariable, "id">>({
    name: "",
    value: "",
    description: "",
  });

  const handleAddVariable = () => {
    if (newVariable.name.trim()) {
      const variable: CustomVariable = {
        id: `var-${Date.now()}`,
        name: newVariable.name.trim(),
        value: newVariable.value,
        description: newVariable.description,
      };
      onVariablesChange([...variables, variable]);
      setNewVariable({ name: "", value: "", description: "" });
    }
  };

  const handleDeleteVariable = (id: string) => {
    setVariableToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteVariable = () => {
    if (variableToDelete) {
      onVariablesChange(variables.filter((v) => v.id !== variableToDelete));
      setShowDeleteDialog(false);
      setVariableToDelete(null);
    }
  };

  const handleUpdateVariable = (id: string, updates: Partial<CustomVariable>) => {
    onVariablesChange(
      variables.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    setEditingId(null);
  };

  const copyVariableTemplate = (name: string) => {
    const template = `{{${name}}}`;
    navigator.clipboard.writeText(template);
    // You could add a toast notification here
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Variable className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-lg text-gray-900">Custom Variables</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Add New Variable Form */}
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Add New Variable</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Variable Name
            </label>
            <Input
              type="text"
              value={newVariable.name}
              onChange={(e) =>
                setNewVariable({ ...newVariable, name: e.target.value })
              }
              placeholder="variable_name"
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddVariable();
                }
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Value
            </label>
            <Input
              type="text"
              value={newVariable.value}
              onChange={(e) =>
                setNewVariable({ ...newVariable, value: e.target.value })
              }
              placeholder="Variable value"
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleAddVariable();
                }
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description (Optional)
            </label>
            <Input
              type="text"
              value={newVariable.description || ""}
              onChange={(e) =>
                setNewVariable({ ...newVariable, description: e.target.value })
              }
              placeholder="What this variable is for"
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddVariable();
                }
              }}
            />
          </div>
          <Button
            onClick={handleAddVariable}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-sm"
            disabled={!newVariable.name.trim()}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Variable
          </Button>
        </div>

        {/* Variables List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Defined Variables</h3>
          {variables.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-300 rounded-md">
              No variables defined. Add one above.
            </div>
          ) : (
            variables.map((variable) => (
              <div
                key={variable.id}
                className="p-3 border border-gray-200 rounded-lg bg-white space-y-2"
              >
                {editingId === variable.id ? (
                  <EditVariableForm
                    variable={variable}
                    onSave={(updates) => handleUpdateVariable(variable.id, updates)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            {`{{${variable.name}}}`}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyVariableTemplate(variable.name)}
                            className="h-6 w-6 text-gray-500 hover:text-indigo-600 flex-shrink-0"
                            title="Copy template"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        {variable.description && (
                          <p className="text-xs text-gray-500 mb-1">
                            {variable.description}
                          </p>
                        )}
                        <div className="max-h-[200px] overflow-y-auto overflow-x-auto rounded border border-gray-200 bg-gray-50">
                          <pre className="text-xs text-gray-600 font-mono px-2 py-1 m-0 whitespace-pre-wrap break-words">
                          {variable.value || "(empty)"}
                          </pre>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(variable.id)}
                          className="h-7 w-7 text-gray-500 hover:text-indigo-600"
                          title="Edit"
                        >
                          <span className="text-xs">✎</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteVariable(variable.id)}
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Variable Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete variable?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this variable? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setVariableToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteVariable}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EditVariableFormProps {
  variable: CustomVariable;
  onSave: (updates: Partial<CustomVariable>) => void;
  onCancel: () => void;
}

const EditVariableForm = ({
  variable,
  onSave,
  onCancel,
}: EditVariableFormProps) => {
  const [name, setName] = useState(variable.name);
  const [value, setValue] = useState(variable.value);
  const [description, setDescription] = useState(variable.description || "");

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), value, description });
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Variable Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Value
        </label>
        {variable.name === "teams_data" || (value && (value.trim().startsWith("[") || value.trim().startsWith("{"))) ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full min-h-[120px] max-h-[300px] rounded-md border border-input bg-transparent px-3 py-2 text-xs font-mono shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y overflow-y-auto"
            placeholder="Enter JSON value"
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
          />
        ) : (
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-8 text-sm"
        />
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Description
        </label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-8 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-7 text-xs"
          disabled={!name.trim()}
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-7 text-xs"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default VariablesSidebar;

