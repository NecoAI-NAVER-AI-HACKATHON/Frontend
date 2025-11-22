import { ChevronRight, Plus, SplinePointer } from "lucide-react";
import SystemAdding from "./SystemAdding";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SystemService } from "@/lib/services/systemService";
import { useSystems } from "@/contexts/SystemsContext";
import type { System } from "@/lib/services/systemService";
import SystemsSkeleton from "@/components/workspace_systems/SystemsSkeleton";

const Systems = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workspace_id = id as string;
  const { getSystemsByWorkspace, systems: allSystems, isLoading: contextLoading, fetchSystems } = useSystems();

  const [systems, setSystems] = useState<System[]>([]);
  const [totalItems, setTotalItems] = useState<number>();

  const [loading, setLoading] = useState<boolean>(true);

  // Variables for modal
  const [showAddingSystem, setShowAddingSystem] = useState<boolean>(false);

  // Fetch systems from backend when component mounts or workspace_id changes
  useEffect(() => {
    if (!workspace_id) return;

    const loadSystems = async () => {
      setLoading(true);
      try {
        // Always fetch from backend to ensure fresh data
        await fetchSystems(workspace_id);
      } catch (error) {
        console.error("Error loading systems:", error);
        // Fallback to API service if context fetch fails
        try {
          const response = await SystemService.getAllSystems(workspace_id);
          setSystems(response.systems);
          setTotalItems(response.total);
        } catch (apiError) {
          console.error("Error fetching systems from API:", apiError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSystems();
  }, [workspace_id, fetchSystems]);

  // Update local state when context systems change
  useEffect(() => {
    if (!contextLoading && workspace_id) {
      const contextSystems = getSystemsByWorkspace(workspace_id);
      setSystems(contextSystems);
      setTotalItems(contextSystems.length);
    }
  }, [allSystems, contextLoading, workspace_id, getSystemsByWorkspace]);

  return (
    <div className="flex flex-col">
      {/* System content */}
      <div className="flex flex-col">
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

          {/* If loading → only skeleton cards appear */}
          {loading ? (
            <SystemsSkeleton />
          ) : systems.length === 0 ? (
            // EMPTY STATE
            <div className="col-span-3 flex flex-col items-center justify-center mt-10">
              <img
                src="/Empty-pana.svg"
                alt="No systems"
                className="w-40 h-40"
              />
              <p className="text-sm text-[#627193] mt-3">
                No systems found. Create your first AI workflow!
              </p>
            </div>
          ) : (
            // LIST SYSTEM CARDS
            systems.map((system: System) => (
              <div
                key={system.id}
                className="bg-white border-2 border-gray-300 rounded-2xl p-5 cursor-pointer 
         transition duration-300 ease-in-out
         hover:bg-[#F9FAFB] hover:shadow-lg hover:-translate-y-1"
                onClick={() => navigate(`/workspaces/${workspace_id}/systems/${system.id}/workflow`)}
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

                  <p className="text-sm font-medium">{system.name}</p>
                  <p className="text-xs">{system.description}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-[#627193]">
                        Last updated:
                      </p>
                      <p className="text-sm font-medium text-[#627193]">
                        {dayjs(system.created_at).format("YYYY-MMM-DD")}
                      </p>
                    </div>

                    <div className="rounded-md px-2 py-1 text-xs font-medium border border-[#37a14e] text-[#37a14e]">
                      {system.nodes_count}{" "}
                      {system.nodes_count > 1 ? "nodes" : "node"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
