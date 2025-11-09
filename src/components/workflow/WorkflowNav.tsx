import { ArrowLeft, Play, Save, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface WorkflowNavProps {
  workflowName: string;
  onRun?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
}

const WorkflowNav = ({
  workflowName,
  onRun,
  onSave,
  onExport,
  onDelete,
}: WorkflowNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between h-14 bg-white border-b border-gray-200 px-6">
      {/* Left side - Back button and workflow name */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="font-medium text-gray-900">{workflowName}</span>
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

