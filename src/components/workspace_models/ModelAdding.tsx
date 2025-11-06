import { X } from "lucide-react";

interface ModelAddingProps {
  setShowAddingModel: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModelAdding = ({ setShowAddingModel }: ModelAddingProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-[400px] relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => setShowAddingModel(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-[#5757F5]">
          Upload AI Model
        </h2>
        <p className="text-sm text-[#627193]">
          Add your AI models to this workspace and manage them independently
          from other systems.
        </p>
        <p className="text-sm text-[#627193]">
          Customize model settings, connect workflows, and integrate with other
          AI services seamlessly.
        </p>
        <hr className="border-gray-300 my-4" />

        {/* Content Form */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-[#627193] mb-1">
              Model Name
            </label>
            <input
              type="text"
              placeholder="Enter your model's name..."
              className="w-full border border-[#627193] rounded-md px-3 py-2 text-[#627193] text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-[#5757F5]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#627193] mb-1">
              Model Type
            </label>
            <input
              type="text"
              placeholder="Enter your model's type..."
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
              // Login when click cteate
              setShowAddingModel(false);
            }}
          >
            Cancel
          </div>
          <div
            className="text-sm text-white px-2 py-1 rounded-md bg-[#5757F5] cursor-pointer"
            onClick={() => {
              // Login when click cteate
              setShowAddingModel(false);
            }}
          >
            Upload model
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelAdding;
