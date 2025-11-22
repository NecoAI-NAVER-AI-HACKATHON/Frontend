import { CheckCircle2, Clock, XCircle, GripVertical } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { ExecutionLog } from "../../types/workflow";
import { MOCK_EXECUTION_OUTPUT } from "../../mockdata/MockExecutionOutput";

interface LogSectionProps {
  logs: ExecutionLog[];
}

// Format execution output into readable document format
const formatExecutionOutput = (executionData: any[]): string => {
  if (!executionData || executionData.length === 0) {
    return "No execution output available.";
  }

  let document = "";
  
  // Document Header
  document += "═══════════════════════════════════════════════════════════\n";
  document += "  WORKFLOW EXECUTION REPORT\n";
  document += "═══════════════════════════════════════════════════════════\n\n";
  
  // Group execution data by node for better readability
  const groupedByNode = executionData.reduce((acc, item) => {
    if (!acc[item.node_name]) {
      acc[item.node_name] = [];
    }
    acc[item.node_name].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Process each node
  Object.entries(groupedByNode).forEach(([nodeName, items]) => {
    document += `\n${"=".repeat(55)}\n`;
    document += `  NODE: ${nodeName}\n`;
    document += `${"=".repeat(55)}\n\n`;

    (items as any[]).forEach((item: any, itemIndex: number) => {
      // Item Header
      document += `Execution ${itemIndex + 1}:\n`;
      document += `─`.repeat(50) + `\n`;
      
      // Basic Information
      document += `Status: ${item.status.toUpperCase()}\n`;
      if (item.updated_at) {
        const date = new Date(item.updated_at);
        document += `Timestamp: ${date.toLocaleString()}\n`;
      }
      if (item.duration) {
        const duration = parseFloat(item.duration);
        document += `Duration: ${duration < 1 ? (duration * 1000).toFixed(2) + "ms" : duration.toFixed(2) + "s"}\n`;
      }
      if (item.item_id) {
        document += `Item ID: ${item.item_id}\n`;
      }
      if (item.job_id) {
        document += `Job ID: ${item.job_id}\n`;
      }
      document += `\n`;

      if (item.payload) {
        document += `Input Payload:\n`;
        if (item.payload.trigger) {
          document += `  • Trigger: ${item.payload.trigger}\n`;
        }
        if (item.payload.timestamp) {
          document += `  • Timestamp: ${new Date(item.payload.timestamp).toLocaleString()}\n`;
        }
        if (item.payload.mode) {
          document += `  • Schedule Mode: ${item.payload.mode.mode || JSON.stringify(item.payload.mode)}\n`;
          if (item.payload.mode.dailyTime) {
            document += `  • Daily Time: ${item.payload.mode.dailyTime}\n`;
          }
        }
        if (item.payload.timezone) {
          document += `  • Timezone: ${item.payload.timezone}\n`;
        }
        if (item.payload.from_node) {
          document += `  • From Node: ${item.payload.from_node}\n`;
        }
        if (item.payload.prev_result) {
          const prevResult = item.payload.prev_result;
          if (typeof prevResult === "object" && prevResult !== null) {
            document += `  • Previous Result:\n`;
            const prevResultStr = JSON.stringify(prevResult, null, 2);
            prevResultStr.split("\n").forEach(line => {
              document += `    ${line}\n`;
            });
          }
        }
        document += `\n`;
      }

      // Result Information
      if (item.result) {
        document += `Output Result:\n`;
        const result = item.result;
        
        // Format result based on type
        if (typeof result === "object" && result !== null) {
          if (Array.isArray(result)) {
            document += `  • Array with ${result.length} item(s):\n`;
            result.forEach((entry, idx) => {
              document += `\n    Item ${idx + 1}:\n`;
              Object.entries(entry).forEach(([key, value]) => {
                if (key === "image" && typeof value === "string") {
                  document += `    • ${key}: ${value.substring(0, 60)}...\n`;
                } else {
                  document += `    • ${key}: ${JSON.stringify(value)}\n`;
                }
              });
            });
          } else {
            Object.entries(result).forEach(([key, value]) => {
              if (key === "children" && Array.isArray(value)) {
                document += `  • ${key}: Array with ${value.length} item(s)\n`;
              } else if (key === "image" && typeof value === "string") {
                document += `  • ${key}: ${value.substring(0, 60)}...\n`;
              } else if (typeof value === "object" && value !== null) {
                document += `  • ${key}:\n`;
                const valueStr = JSON.stringify(value, null, 2);
                valueStr.split("\n").forEach(line => {
                  document += `    ${line}\n`;
                });
              } else {
                document += `  • ${key}: ${JSON.stringify(value)}\n`;
              }
            });
          }
        } else {
          document += `  ${JSON.stringify(result)}\n`;
        }
        document += `\n`;
      }

      // Add separator between items
      if (itemIndex < (items as any[]).length - 1) {
        document += `\n`;
      }
    });
  });

  // Document Footer
  document += `\n${"=".repeat(55)}\n`;
  document += `  END OF EXECUTION REPORT\n`;
  document += `  Total Nodes Executed: ${Object.keys(groupedByNode).length}\n`;
  document += `  Total Executions: ${executionData.length}\n`;
  document += `${"=".repeat(55)}\n`;

  return document;
};

const LogSection = ({ logs }: LogSectionProps) => {
  const [activeTab, setActiveTab] = useState<"log" | "output">("log");
  const [executionOutput, setExecutionOutput] = useState<any[]>([]);
  const hasCheckedExecutionRef = useRef<Set<string>>(new Set());
  
  // Resizable height state
  const DEFAULT_HEIGHT = 192;
  const MIN_HEIGHT = 96;
  const [maxHeight, setMaxHeight] = useState<number>(window.innerHeight * 0.8);
  
  const [height, setHeight] = useState<number>(() => {
    const saved = localStorage.getItem("logSectionHeight");
    return saved ? parseInt(saved, 10) : DEFAULT_HEIGHT;
  });
  
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef<number>(0);
  const resizeStartHeight = useRef<number>(0);
  
  useEffect(() => {
    const handleResize = () => {
      setMaxHeight(window.innerHeight * 0.8);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check logs for successful execution and show output
  useEffect(() => {
    const successLog = logs.find(log => 
      log.status === "success" && 
      log.message.includes("Workflow execution started successfully") &&
      log.message.includes("Execution ID:")
    );

    if (successLog) {
      // Extract execution ID from log message
      const executionIdMatch = successLog.message.match(/Execution ID: ([a-f0-9-]+)/i);
      
      if (executionIdMatch && executionIdMatch[1]) {
        const executionId = executionIdMatch[1];
        
        // Skip if we've already processed this execution ID
        if (hasCheckedExecutionRef.current.has(executionId)) {
          return;
        }
        hasCheckedExecutionRef.current.add(executionId);

        // Show mock execution output when successful log is found
        if (Array.isArray(MOCK_EXECUTION_OUTPUT) && MOCK_EXECUTION_OUTPUT.length > 0) {
          setExecutionOutput([...MOCK_EXECUTION_OUTPUT]);
        }
      }
    } else {
      // Clear output if no success log found
      if (executionOutput.length > 0) {
        setExecutionOutput([]);
        hasCheckedExecutionRef.current.clear();
      }
    }
  }, [logs, executionOutput.length]);

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

  const safeExecutionOutput = Array.isArray(executionOutput) && executionOutput.length > 0 
    ? executionOutput 
    : [];
  const formattedOutput = safeExecutionOutput.length > 0 ? formatExecutionOutput(safeExecutionOutput) : "";

  useEffect(() => {
    localStorage.setItem("logSectionHeight", height.toString());
  }, [height]);
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartY.current = e.clientY;
    resizeStartHeight.current = height;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, [height]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaY = resizeStartY.current - e.clientY;
    const newHeight = Math.max(
      MIN_HEIGHT,
      Math.min(maxHeight, resizeStartHeight.current + deltaY)
    );
    setHeight(newHeight);
  }, [isResizing, MIN_HEIGHT, maxHeight]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <div 
      className="bg-white border-t border-gray-200 flex flex-col relative"
      style={{ height: `${height}px` }}
    >
      <div
        onMouseDown={handleResizeStart}
        className={`absolute top-0 left-0 right-0 cursor-row-resize z-20 transition-all flex items-center justify-center ${
          isResizing 
            ? "h-2 bg-indigo-400" 
            : "h-2 hover:h-3 hover:bg-indigo-200 bg-gray-300 border-b border-gray-400"
        }`}
        title="Drag up to extend log section"
      >
        <GripVertical className="w-5 h-5 text-gray-600 opacity-60 hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="border-b border-gray-200 mt-2">
        <div className="flex items-center gap-1 p-2">
          <button
            onClick={() => setActiveTab("log")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === "log"
                ? "bg-white border border-b-0 border-gray-200 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Log
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === "output"
                ? "bg-white border border-b-0 border-gray-200 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Output
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "log" ? (
          <div className="h-full overflow-y-auto p-4 space-y-2">
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
        ) : (
          <div className="h-full overflow-y-auto p-4 bg-gray-50" key={`output-${executionOutput.length}`}>
            {safeExecutionOutput.length === 0 ? (
              <p className="text-gray-500 text-sm">No execution output available</p>
            ) : (
              <pre key={`pre-${executionOutput.length}`} className="text-xs font-mono whitespace-pre-wrap text-gray-800 bg-white p-4 rounded border border-gray-200">
                {formattedOutput}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogSection;
