import { ArrowLeft, Play, Save, Trash2, ChevronRight, Variable, RotateCcw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface WorkflowNavProps {
  workflowName: string;
  workspaceId?: string;
  systemId?: string;
  onRun?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onVariablesToggle?: () => void;
  showVariables?: boolean;
  onRevert?: () => void;
  isMockWorkflow?: boolean;
  onLoadMock?: () => void;
  isRunning?: boolean;
}

const WorkflowNav = ({
  workflowName,
  workspaceId,
  systemId,
  onRun,
  onSave,
  onDelete,
  onVariablesToggle,
  showVariables,
  onRevert,
  isMockWorkflow,
  onLoadMock,
  isRunning = false,
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

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-3">
        {onLoadMock && (
          <Button 
            onClick={onLoadMock} 
            variant="outline"
            title="Load mock workflow template"
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
          >
            <Download className="w-4 h-4" />
            Load Mock
          </Button>
        )}
        <Button 
          onClick={onVariablesToggle} 
          variant={showVariables ? "default" : "outline"}
          className={showVariables ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}
          title="Custom Variables"
        >
          <Variable className="w-4 h-4" />
          Variables
        </Button>
        <Button 
          onClick={onRun} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isRunning}
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Running..." : "Run"}
        </Button>
        <Button onClick={onSave} variant="outline">
          <Save className="w-4 h-4" />
          Save
        </Button>
        {isMockWorkflow && onRevert && (
          <Button onClick={onRevert} variant="outline" title="Revert to original mock data">
            <RotateCcw className="w-4 h-4" />
            Revert
          </Button>
        )}
        <Button onClick={onDelete} variant="destructive">
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default WorkflowNav;

