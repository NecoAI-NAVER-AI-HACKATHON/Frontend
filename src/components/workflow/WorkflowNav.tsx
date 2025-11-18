import { ArrowLeft, Play, Save, Download, Trash2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface WorkflowNavProps {
  workflowName: string;
  workspaceId?: string;
  systemId?: string;
  onRun?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
}

const WorkflowNav = ({
  workflowName,
  workspaceId,
  systemId,
  onRun,
  onSave,
  onExport,
  onDelete,
}: WorkflowNavProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (workspaceId && systemId) {
      // Navigate back to workspace detail page
      navigate(`/workspaces/${workspaceId}`);
    } else {
      // Navigate back in history
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between h-14 bg-white border-b border-gray-200 px-6">
      {/* Left side - Back button, breadcrumbs, and workflow name */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        {/* Breadcrumbs */}
        {workspaceId && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate(`/workspaces/${workspaceId}`)}
              className="hover:text-gray-900 transition"
            >
              Workspace
            </button>
            {systemId && (
              <>
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => navigate(`/workspaces/${workspaceId}/systems/${systemId}/workflow`)}
                  className="hover:text-gray-900 transition"
                >
                  System
                </button>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{workflowName}</span>
          </div>
        )}
        
        {!workspaceId && (
          <span className="font-medium text-gray-900">{workflowName}</span>
        )}
      </div>

      {/* Right side - Action buttons and user info */}
      <div className="flex items-center gap-3">
        {/* Action buttons */}
        <Button onClick={onRun} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Play className="w-4 h-4" />
          Run
        </Button>
        <Button onClick={onSave} variant="outline">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button onClick={onExport} variant="outline">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button onClick={onDelete} variant="destructive">
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>

        {/* User info */}
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
          <span className="text-sm text-gray-600">user@gmail.com</span>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
            U
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowNav;

