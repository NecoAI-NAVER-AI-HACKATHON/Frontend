import { FolderOpen } from "lucide-react";
import Systems from "../../components/workspace_systems/Systems";
import Models from "../../components/workspace_models/Models";
import Logs from "../../components/workspace_logs/Logs";
import Chatbot from "../../components/workspace_chatbot/Chatbot";
import TopBar from "../../components/topbar/TopBar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WorkspaceService } from "@/lib/services/workspaceService";
import { useWorkspaces } from "@/contexts/WorkspacesContext";
import type { Workspace } from "@/lib/services/workspaceService";

const WorkspaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [clickedOption, setClickedOption] = useState<string>("Systems");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const { getWorkspace: getWorkspaceFromContext, fetchWorkspaces } = useWorkspaces();

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Always fetch from API to ensure fresh data
        const fetchedWorkspace = await WorkspaceService.getWorkspace(id);
        setWorkspace(fetchedWorkspace);
        
        // Also refresh the workspaces list in context
        await fetchWorkspaces();
      } catch (error) {
        console.error("Error fetching workspace:", error);
        // Fallback to context if API fails
        const contextWorkspace = getWorkspaceFromContext(id);
        if (contextWorkspace) {
          setWorkspace(contextWorkspace);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [id, getWorkspaceFromContext, fetchWorkspaces]);

  const options = [
    {
      title: "Systems",
    },
    {
      title: "Models",
    },
    {
      title: "Logs",
    },
    {
      title: "Chatbot",
    },
  ];

  return (
    <div
      className="min-h-screen w-full
  bg-[radial-gradient(circle_at_40%_35%,rgba(150,120,255,0.35),transparent_25%),radial-gradient(circle_at_60%_65%,rgba(120,255,255,0.30),transparent_30%)]
  bg-white flex flex-col"
    >
      {/* Top Bar */}
      <TopBar />
      <hr className="border-gray-300" />

      {/* Workspace */}
      <div className="flex-1 flex flex-col px-10 overflow-y-auto">
        {/* Headers */}
        <div className="flex flex-col mt-5">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          ) : workspace ? (
            <>
          <div className="flex items-center gap-2">
            <FolderOpen />
                <p className="text-xl font-medium">{workspace.name || "Untitled Workspace"}</p>
          </div>
              <p className="font-medium text-[#627193]">{workspace.description || "No description"}</p>
            </>
          ) : (
            <p className="text-red-500">Workspace not found</p>
          )}
        </div>

        {/* Options bar */}
        <div className="flex flex-item items-center mt-5 border border-gray-300 w-fit rounded-lg p-1">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center px-2 py-1 cursor-pointer ${
                clickedOption === option.title
                  ? "bg-[#EDEDED] text-[#5757F5] rounded-md font-medium"
                  : "text-[#627193]"
              }`}
              onClick={() => setClickedOption(option.title)}
            >
              <p className="text-sm">{option.title}</p>
            </div>
          ))}
        </div>

        {clickedOption === "Systems" && <Systems />}
        {clickedOption === "Models" && <Models />}
        {clickedOption === "Logs" && <Logs />}
        {clickedOption === "Chatbot" && <Chatbot />}
      </div>
    </div>
  );
};

export default WorkspaceDetail;
