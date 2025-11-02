// WorkspaceMockData.tsx
import type { Workspace } from "../../types/workspace";
import type { System } from "../../types/system";

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

export const SystemMockData: System[] = [
  {
    id: "sys-001",
    workspace_id: "ws-001",
    name: "Customer Support Bot",
    description: "Automated chatbot handling customer FAQs and complaints.",
    status: "active",
    created_at: "2025-10-01T10:00:00Z",
    updated_at: "2025-10-30T12:00:00Z",
    global_config: {},
    metadata: {},
  },
  {
    id: "sys-002",
    workspace_id: "ws-001",
    name: "Data Analysis Pipeline",
    description: "ETL system for aggregating and analyzing business data.",
    status: "inactive",
    created_at: "2025-09-12T09:30:00Z",
    updated_at: "2025-10-20T14:15:00Z",
    global_config: {},
    metadata: {},
  },
  {
    id: "sys-003",
    workspace_id: "ws-001",
    name: "Image Classification Service",
    description:
      "Model for classifying product images using vision transformer.",
    status: "draft",
    created_at: "2025-10-05T11:15:00Z",
    updated_at: "2025-10-25T10:45:00Z",
    global_config: {},
    metadata: {},
  },
  {
    id: "sys-004",
    workspace_id: "ws-001",
    name: "Email Summarizer",
    description:
      "Summarizes long email threads using LLM summarization pipeline.",
    status: "active",
    created_at: "2025-09-22T08:45:00Z",
    updated_at: "2025-10-28T09:20:00Z",
    global_config: {},
    metadata: {},
  },
];
