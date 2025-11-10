import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { ExecutionLog } from "../../types/workflow";

interface LogSectionProps {
  logs: ExecutionLog[];
}

const LogSection = ({ logs }: LogSectionProps) => {
  const getStatusIcon = (status: ExecutionLog["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-48 bg-white border-t border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-900">Execution Logs</h2>
      </div>
      <div className="h-[calc(100%-73px)] overflow-y-auto p-4 space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No execution logs yet</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 text-sm py-1 hover:bg-gray-50 rounded px-2 transition"
            >
              <span className="text-gray-500 font-mono text-xs">{log.timestamp}</span>
              {getStatusIcon(log.status)}
              <span className="text-gray-700">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogSection;

