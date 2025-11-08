import type { Log } from "../types/log";

export const LogsData: Log[] = [
  {
    id: "log-001",
    workspace_id: "ws-001",
    system_id: "sys-001",
    duration: "2.3s",
    status: "Success",
    timestamp: "2025-11-06T10:15:00Z",
  },
  {
    id: "log-002",
    workspace_id: "ws-001",
    system_id: "sys-002",
    duration: "4.1s",
    status: "Failed",
    timestamp: "2025-11-06T11:45:00Z",
  },
  {
    id: "log-003",
    workspace_id: "ws-001",
    system_id: "sys-003",
    duration: "3.2s",
    status: "Success",
    timestamp: "2025-11-06T13:10:00Z",
  },
  {
    id: "log-004",
    workspace_id: "ws-002",
    system_id: "sys-004",
    duration: "1.8s",
    status: "Warning",
    timestamp: "2025-11-06T14:22:00Z",
  },
  {
    id: "log-005",
    workspace_id: "ws-003",
    system_id: "sys-005",
    duration: "5.0s",
    status: "Success",
    timestamp: "2025-11-06T15:05:00Z",
  },
];
