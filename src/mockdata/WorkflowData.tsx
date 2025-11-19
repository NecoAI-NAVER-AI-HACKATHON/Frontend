// WorkflowData.tsx
import type { Workflow, WorkflowNode, ExecutionLog, CustomVariable } from "../types/workflow";

export const mockWorkflowId = "sys-001"; // Matches the system ID in SystemsContext

export const mockWorkflowNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "schedule",
    name: "DailyTrigger",
    position: { x: 100, y: 200 },
    config: {
      name: "DailyTrigger",
      subtype: "schedule",
      parameters: {
        mode: {
          mode: "daily",
          dailyTime: "12:00:00",
        },
        timezone: "Asia/Ho_Chi_Minh",
      },
    },
    connections: {
      output: ["node-2"],
    },
  },
  {
    id: "node-2",
    type: "function",
    name: "ExcelReader",
    position: { x: 300, y: 200 },
    config: {
      name: "ExcelReader",
      subtype: "function",
      parameters: {
        language: "javascript",
        code: "readBatchNewFeedbacks()",
      },
    },
    connections: {
      input: ["node-1"],
      output: ["node-3"],
    },
  },
  {
    id: "node-3",
    type: "split",
    name: "SplitInBatches",
    position: { x: 500, y: 200 },
    config: {
      name: "SplitInBatches",
      subtype: "split",
      parameters: {
        batchSize: 2,
      },
    },
    connections: {
      input: ["node-2"],
      output: ["node-4", "node-5"],
    },
  },
  {
    id: "node-4",
    type: "hyperclova",
    name: "NaverImageAnalyze",
    position: { x: 700, y: 120 },
    config: {
      name: "NaverImageAnalyze",
      subtype: "image-analyze",
      parameters: {
        prompt: "Point out team is responsible for this product type, {{teams_data}}, {{json.image}}. If no team is responsible, return 'Others'.",
        url: "https://naver.ai/image/analyze",
        method: "POST",
        apiKey: "",
      },
    },
    connections: {
      input: ["node-3"],
      output: ["node-6"],
    },
  },
  {
    id: "node-5",
    type: "hyperclova",
    name: "NaverTextAnalyze",
    position: { x: 700, y: 280 },
    config: {
      name: "NaverTextAnalyze",
      subtype: "text-analyze",
      parameters: {
        prompt: "Analyze this user's feedback and return the problem and solution. {{json.comment}}",
        url: "https://naver.ai/chat/analyze",
        method: "POST",
        apiKey: "",
      },
    },
    connections: {
      input: ["node-3"],
      output: ["node-7"],
    },
  },
  {
    id: "node-6",
    type: "if-else",
    name: "CheckTeamCondition",
    position: { x: 900, y: 120 },
    config: {
      name: "CheckTeamCondition",
      subtype: "if",
      parameters: {
        field: "{{json.team}}",
        operator: "==",
        value: "Others",
        trueNodeName: "MergeData",
        falseNodeName: "End Node",
      },
    },
    connections: {
      input: ["node-4"],
      output: ["node-7"],
    },
  },
  {
    id: "node-7",
    type: "merge",
    name: "MergeData",
    position: { x: 1000, y: 200 },
    config: {
      name: "MergeData",
      subtype: "function",
      parameters: {},
    },
    connections: {
      input: ["node-6", "node-5"],
      output: ["node-8", "node-9", "node-10"],
    },
  },
  {
    id: "node-8",
    type: "database",
    name: "SaveToDB",
    position: { x: 1100, y: 200 },
    config: {
      name: "SaveToDB",
      subtype: "database_write",
      parameters: {
        database: "",
        table: "",
        fields: [
          { displayName: "Image", dbName: "image", type: "string" },
          { displayName: "Problem", dbName: "problem", type: "text" },
          { displayName: "Team", dbName: "team", type: "string" },
          { displayName: "Date", dbName: "date", type: "date" },
          { displayName: "Client Email", dbName: "client_email", type: "string" },
        ],
      },
    },
    connections: {
      input: ["node-7"],
    },
  },
  {
    id: "node-9",
    type: "email",
    name: "TeamEmail",
    position: { x: 1300, y: 120 },
    config: {
      name: "TeamEmail",
      subtype: "mail-writer",
      parameters: {
        to: "{{json.team_email}}",
        subject: "User's feedback {{json.item}}",
        body: "",
      },
    },
    connections: {
      input: ["node-7"],
    },
  },
  {
    id: "node-10",
    type: "email",
    name: "ClientEmail",
    position: { x: 1300, y: 280 },
    config: {
      name: "ClientEmail",
      subtype: "mail-writer",
      parameters: {
        to: "{{json.client_email}}",
        subject: "",
        body: "",
      },
    },
    connections: {
      input: ["node-7"],
    },
  },
];

export const mockWorkflowVariables: CustomVariable[] = [
  {
    id: "var-1",
    name: "teams_data",
    value: "",
    description: "Team responsibility data for product types",
  },
];

export const mockWorkflow: Workflow = {
  id: mockWorkflowId,
  name: "Daily Feedback Batch Processor",
  nodes: mockWorkflowNodes,
  connections: [
    { from: "node-1", to: "node-2" },
    { from: "node-2", to: "node-3" },
    { from: "node-3", to: "node-4" },
    { from: "node-3", to: "node-5" },
    { from: "node-4", to: "node-6" },
    { from: "node-6", to: "node-7" },
    { from: "node-5", to: "node-7" },
    { from: "node-7", to: "node-8" },
    { from: "node-7", to: "node-9" },
    { from: "node-7", to: "node-10" },
  ],
  variables: mockWorkflowVariables,
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
    message: "Node 'DailyTrigger' executed successfully",
    status: "success",
    nodeId: "node-1",
  },
  {
    id: "log-3",
    timestamp: "14:32:16",
    message: "Node 'Function' processing...",
    status: "processing",
    nodeId: "node-2",
  },
  {
    id: "log-4",
    timestamp: "14:32:20",
    message: "Node 'Function' completed",
    status: "success",
    nodeId: "node-2",
  },
  {
    id: "log-5",
    timestamp: "14:32:21",
    message: "Node 'Split' executed successfully",
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
