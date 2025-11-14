import { Clock, CircleCheckBig, CircleX, CircleAlert } from "lucide-react";
import type { Log } from "../../types/log";
import { LogsData } from "../../mockdata/LogsData";
import dayjs from "dayjs";

const Logs = () => {
  return (
    <div className="flex flex-col">
      {/* Logs content */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mt-5">
          {/* Header */}
          <div className="flex flex-col">
            <p className="text-sm font-medium">Execution Logs</p>
            <p className="text-xs">
              View system run history and performance metrics
            </p>
          </div>
        </div>

        {/* Empty state */}
        {LogsData.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-xl py-10">
            <p className="text-sm font-medium">No logs yet</p>
            <p className="text-xs text-[#627193]">
              Start running your systems to generate execution logs
            </p>
          </div>
        )}

        {/* Logs Table */}
        {LogsData.length > 0 && (
          <div className="mt-3 border border-gray-300 rounded-xl overflow-hidden">
            <table className="min-w-full text-sm text-left">
              <thead className="text-[#5757F5] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium">#</th>
                  <th className="px-4 py-2 font-medium">Log ID</th>
                  <th className="px-4 py-2 font-medium">System ID</th>
                  <th className="px-4 py-2 font-medium">Duration</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {LogsData.map((log: Log, index) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-200 hover:bg-[#F9FAFB] transition"
                  >
                    <td className="px-4 py-2 text-[#627193]">{index + 1}</td>
                    <td className="px-4 py-2 text-[#627193]">{log.id}</td>
                    <td className="px-4 py-2 text-[#627193]">
                      {log.system_id}
                    </td>
                    <td className="px-4 py-2 text-[#627193] flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {log.duration}
                    </td>
                    <td className="px-4 py-2">
                      <div
                        className={`flex items-center text-xs px-2 py-1 font-medium rounded-md gap-2 w-fit ${
                          log.status === "Success"
                            ? "text-green-600 border border-green-600 bg-green-100"
                            : log.status === "Failed"
                            ? "text-red-500 border border-red-500 bg-red-100"
                            : "text-yellow-500 border border-yellow-300 bg-yellow-100"
                        }`}
                      >
                        {log.status === "Success" && (
                          <CircleCheckBig className="w-4 h-4" />
                        )}
                        {log.status === "Failed" && (
                          <CircleX className="w-4 h-4" />
                        )}
                        {log.status === "Warning" && (
                          <CircleAlert className="w-4 h-4" />
                        )}
                        {log.status}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-[#627193]">
                      {dayjs(log.timestamp).format("YYYY-MM-DD HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
