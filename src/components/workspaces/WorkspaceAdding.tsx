import { useState } from "react";
import { X } from "lucide-react";
import { useWorkspaces } from "@/contexts/WorkspacesContext";
import { useNavigate } from "react-router-dom";

interface WorkspaceAddingProps {
  setShowAddingWorkspace: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceAdding = ({ setShowAddingWorkspace }: WorkspaceAddingProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createWorkspace } = useWorkspaces();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter a workspace name");
      return;
    }

    try {
      const newId = createWorkspace({
        name: name.trim(),
        description: description.trim() || "",
        status: "draft",
        user_id: "user-001", // Default user ID
      });

      // Close modal and refresh
      setShowAddingWorkspace(false);
      // Optionally navigate to the new workspace
      // navigate(`/workspaces/${newId}`);
      
      // Reset form
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("Failed to create workspace. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-[400px] relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => setShowAddingWorkspace(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-[#5757F5]">
          Create New Workspace
        </h2>
        {/* Header */}
        <p className="text-sm text-[#627193]">
          Each workspace includes its own storage, access control, and API keys.
        </p>
        <p className="text-sm text-[#627193]">
          You can safely build, test, and deploy your ideas without affecting
          other environments.
        </p>
        <hr className="border-gray-300 my-4" />

        {/* Content Form */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-[#627193] mb-1">
              Workspace Name *
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
              placeholder="Enter your workspace's name..."
              className="w-full border border-[#627193] rounded-md px-3 py-2 text-[#627193] text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-[#5757F5]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#627193] mb-1">
              Workspace Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description for your workspace..."
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
              setShowAddingWorkspace(false);
              setName("");
              setDescription("");
            }}
          >
            Cancel
          </div>
          <div
            className="text-sm text-white px-2 py-1 rounded-md bg-[#5757F5] cursor-pointer"
            onClick={handleCreate}
          >
            Create new workspace
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceAdding;
