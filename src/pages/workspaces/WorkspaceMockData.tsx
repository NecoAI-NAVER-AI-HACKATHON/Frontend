// WorkspaceMockData.tsx
import type { Workspace } from "../../types/workspaces";

export const WorkspaceMockData: Workspace[] = [
  {
    id: "ws_001",
    name: "AI Research Hub",
    description: "Workspace for AI model experiments and dataset analysis.",
    status: "active",
    created_at: "2025-10-01T10:00:00Z",
    updated_at: "2025-10-25T08:30:00Z",
    system_count: 5,
  },
  {
    id: "ws_002",
    name: "Frontend Development",
    description: "UI/UX design and component development workspace.",
    status: "active",
    created_at: "2025-09-12T14:20:00Z",
    updated_at: "2025-10-18T09:45:00Z",
    system_count: 8,
  },
  {
    id: "ws_003",
    name: "Data Engineering Lab",
    description: "Workspace for data pipelines and ETL testing.",
    status: "inactive",
    created_at: "2025-07-01T08:10:00Z",
    updated_at: "2025-09-21T11:00:00Z",
    system_count: 3,
  },
  {
    id: "ws_004",
    name: "Heritage ESG Connect",
    description: "Blockchain + ESG scoring workspace for heritage funding.",
    status: "draft",
    created_at: "2025-05-10T09:00:00Z",
    updated_at: "2025-08-15T16:00:00Z",
    system_count: 2,
  },
];
