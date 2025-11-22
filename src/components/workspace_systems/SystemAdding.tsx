import { useState } from "react";
import { X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSystems } from "@/contexts/SystemsContext";
import { SystemService } from "@/lib/services/systemService";
import { useWorkflows } from "@/contexts/WorkflowsContext";
import { toast } from "sonner";

interface SystemAddingProps {
  setShowAddingSystem: React.Dispatch<React.SetStateAction<boolean>>;
}

const SystemAdding = ({ setShowAddingSystem }: SystemAddingProps) => {
  const { id: workspaceId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateSystem } = useSystems();
  const { createWorkflow } = useWorkflows();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("System name is required", {
        description: "Please enter a system name",
      });
      return;
    }

    if (!workspaceId) {
      toast.error("Workspace ID is missing", {
        description: "Please try again or refresh the page",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Call API service to create system
      const newSystem = await SystemService.createSystem({
        name: name.trim(),
        description: description.trim() || undefined,
        workspace_id: workspaceId,
      });

      // Update context with the new system from API
      updateSystem(newSystem);

      // Create corresponding workflow with the same ID
      createWorkflow({
        id: newSystem.id, // Use system ID as workflow ID
        name: name.trim(),
        nodes: [],
        connections: [],
      });

      toast.success("System created successfully!", {
        description: `${name.trim()} has been created`,
      });

      // Close modal and navigate to the new system's workflow
      setShowAddingSystem(false);
      navigate(`/workspaces/${workspaceId}/systems/${newSystem.id}/workflow`);
      
      // Reset form
      setName("");
      setDescription("");
    } catch (error: any) {
      console.error("Error creating system:", error);
      toast.error("Failed to create system", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-[400px] relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => setShowAddingSystem(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-[#5757F5]">
          Create New System
        </h2>
        {/* Header */}
        <p className="text-sm text-[#627193]">
          Each system operates within its workspace and can be customized
          independently.
        </p>
        <p className="text-sm text-[#627193]">
          Configure your models, workflows, and integrations to build a complete
          AI system.
        </p>
        <hr className="border-gray-300 my-4" />

        {/* Content Form */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-[#627193] mb-1">
              System Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  handleCreate();
                }
              }}
              placeholder="Enter your system's name..."
              className="w-full border border-[#627193] rounded-md px-3 py-2 text-[#627193] text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-[#5757F5]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#627193] mb-1">
              System Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description for your system..."
              rows={3}
              className="w-full border border-[#627193] rounded-md px-3 py-2 text-[#627193] text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-[#5757F5]"
            />
          </div>
        </div>

        <hr className="border-gray-300 my-4" />

        {/* Cancel and Create button */}
        <div className="flex items-center justify-end gap-2">
          <div
            className="text-sm text-[#627193] bg-white px-2 py-1 rounded-md border border-gray-300 cursor-pointer"
            onClick={() => {
              setShowAddingSystem(false);
              setName("");
              setDescription("");
            }}
          >
            Cancel
          </div>
          <div
            className={`text-sm text-white px-2 py-1 rounded-md bg-[#5757F5] cursor-pointer ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleCreate}
          >
            {isSubmitting ? "Creating..." : "Create new system"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdding;
