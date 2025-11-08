import { ChevronRight, Plus, SplinePointer } from "lucide-react";
import type { System } from "../../types/system";
import SystemAdding from "./SystemAdding";
import { SystemsData } from "../../mockdata/SystemsData";
import dayjs from "dayjs";
import { useState } from "react";

const Systems = () => {
  // Variables for modal
  const [showAddingSystem, setShowAddingSystem] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      {/* System content */}
      <div className="flex flex-col bg-white">
        {/* Header and Add system button */}
        <div className="flex items-center justify-between mt-5">
          {/* Header */}
          <div className="flex flex-col">
            <p className="text-sm font-medium">AI Workflow Systems</p>
            <p className="text-xs">Build and manage your visual AI workflows</p>
          </div>

          {/* Add system button */}
          <div
            className="flex items-center gap-2 cursor-pointer bg-[#5757F5] text-white px-3 py-2 rounded-md"
            onClick={() => setShowAddingSystem(true)}
          >
            <Plus className="w-4 h-4" />
            <p className="text-sm">New System</p>
          </div>
        </div>

        {/* System cards */}
        <div className="grid grid-cols-3 gap-5 mt-5">
          {/* System cards */}
          {SystemsData.map((system: System) => (
            <div
              key={system.id}
              className="bg-white border-2 border-gray-300 rounded-2xl p-5 cursor-pointer 
               transition duration-300 ease-in-out
               hover:bg-[#F9FAFB] hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center rounded-md w-10 h-10 text-[#5757F5] border border-[#5757F5]">
                    <SplinePointer />
                  </div>
                  <div className="text-[#627193]">
                    <ChevronRight />
                  </div>
                </div>

                {/* Workspace name */}
                <p className="text-sm font-medium">{system.name}</p>

                {/* Workspace description */}
                <p className="text-xs">{system.description}</p>

                {/* Workspace created time and status */}
                <div className="flex items-center justify-between mt-3">
                  {/* Created at information */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-[#627193]">
                      Last updated:
                    </p>
                    <p className="text-sm font-medium text-[#627193]">
                      {dayjs(system.created_at).format("YYYY-MMM-DD")}
                    </p>
                  </div>

                  <div className="rounded-md px-2 py-1 text-xs font-medium border border-[#37a14e] text-[#37a14e]">
                    {system.nodes_count} nodes
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Create System */}
        {showAddingSystem && (
          <SystemAdding setShowAddingSystem={setShowAddingSystem} />
        )}
      </div>
    </div>
  );
};

export default Systems;
