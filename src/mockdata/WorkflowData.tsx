// WorkflowData.tsx
import type { Workflow, WorkflowNode, ExecutionLog } from "../types/workflow";

export const mockWorkflowId = "wf_001";

export const mockWorkflowNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "webhook",
    name: "Webhook Trigger",
    position: { x: 100, y: 100 },
    config: {
      name: "Webhook Trigger",
      schedule: "",
    },
    connections: {
      output: ["node-2"],
    },
  },
  {
    id: "node-2",
    type: "hyperclova",
    name: "HyperCLOVA",
    position: { x: 400, y: 100 },
    config: {
      name: "HyperCLOVA",
      model: "clova-x",
    },
    connections: {
      input: ["node-1"],
      output: ["node-3"],
    },
  },
  {
    id: "node-3",
    type: "json-parser",
    name: "JSON Parser",
    position: { x: 700, y: 100 },
    config: {
      name: "JSON Parser",
    },
    connections: {
      input: ["node-2"],
      output: ["node-4", "node-5"],
    },
  },
  {
    id: "node-4",
    type: "filter",
    name: "Filter",
    position: { x: 1000, y: 50 },
    config: {
      name: "Filter",
    },
    connections: {
      input: ["node-3"],
      output: ["node-6"],
    },
  },
  {
    id: "node-5",
    type: "if-else",
    name: "If/Else",
    position: { x: 1000, y: 150 },
    config: {
      name: "If/Else",
    },
    connections: {
      input: ["node-3"],
      output: ["node-6"],
    },
  },
  {
    id: "node-6",
    type: "merge",
    name: "Merge",
    position: { x: 1300, y: 100 },
    config: {
      name: "Merge",
    },
    connections: {
      input: ["node-4", "node-5"],
      output: ["node-7"],
    },
  },
  {
    id: "node-7",
    type: "http-request",
    name: "HTTP Request",
    position: { x: 1600, y: 100 },
    config: {
      name: "HTTP Request",
      url: "https://api.example.com/endpoint",
      method: "POST",
    },
    connections: {
      input: ["node-6"],
    },
  },
];

export const mockWorkflow: Workflow = {
  id: mockWorkflowId,
  name: "summary agent",
  nodes: mockWorkflowNodes,
  connections: [
    { from: "node-1", to: "node-2" },
    { from: "node-2", to: "node-3" },
    { from: "node-3", to: "node-4" },
    { from: "node-3", to: "node-5" },
    { from: "node-4", to: "node-6" },
    { from: "node-5", to: "node-6" },
    { from: "node-6", to: "node-7" },
  ],
};

export const mockExecutionLogs: ExecutionLog[] = [
  {
    id: "log-1",
    timestamp: "14:32:15",
    message: "Workflow started",
    status: "success",
  },
  {
    id: "log-2",
    timestamp: "14:32:15",
    message: "Node 'Webhook Trigger' executed successfully",
    status: "success",
    nodeId: "node-1",
  },
  {
    id: "log-3",
    timestamp: "14:32:16",
    message: "Node 'HyperCLOVA' processing...",
    status: "processing",
    nodeId: "node-2",
  },
  {
    id: "log-4",
    timestamp: "14:32:20",
    message: "Node 'HyperCLOVA' completed",
    status: "success",
    nodeId: "node-2",
  },
  {
    id: "log-5",
    timestamp: "14:32:21",
    message: "Node 'JSON Parser' executed successfully",
    status: "success",
    nodeId: "node-3",
  },
  {
    id: "log-6",
    timestamp: "14:32:22",
    message: "Workflow completed in 6.2s",
    status: "success",
  },
];

