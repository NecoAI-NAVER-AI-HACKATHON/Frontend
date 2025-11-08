import type { System } from "../types/system";

export const SystemsData: System[] = [
  {
    id: "sys-001",
    workspace_id: "ws-001",
    name: "Customer Support Bot",
    description: "Automated chatbot handling customer FAQs and complaints.",
    status: "active",
    created_at: "2025-10-01T10:00:00Z",
    updated_at: "2025-10-30T12:00:00Z",
    nodes_count: 10,
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
    nodes_count: 10,
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
    nodes_count: 10,
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
    nodes_count: 10,
    global_config: {},
    metadata: {},
  },
];
