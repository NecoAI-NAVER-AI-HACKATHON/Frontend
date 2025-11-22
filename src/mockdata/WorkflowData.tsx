// WorkflowData.tsx
import type { Workflow, WorkflowNode, ExecutionLog, CustomVariable } from "../types/workflow";

/**
 * Mock Workflow Configuration
 * 
 * This mock workflow is linked to the "Daily Feedback Batch Processor" system (sys-001).
 * When you navigate to /workspaces/{workspaceId}/systems/sys-001/workflow, 
 * this workflow data will be automatically loaded.
 * 
 * The workflow ID "sys-001" matches the system ID in SystemsContext for 
 * "Daily Feedback Batch Processor" system.
 */
export const mockWorkflowId = "sys-001"; // Matches the system ID in SystemsContext for "Daily Feedback Batch Processor"

export const mockWorkflowNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "schedule",
    name: "DailyTrigger",
    position: { x: 100, y: 200 },
    config: {
      name: "DailyTrigger",
      type: "trigger",
      subtype: "schedule",
      parameters: {
        mode: {
          mode: "daily",
          dailyTime: "12:00:00",
        },
        timezone: "Asia/Ho_Chi_Minh",
      },
      outputSchema: {
        type: "object",
        properties: {
          timestamp: {
            type: "string",
          },
          nextRunTime: {
            type: "string",
          },
          runCount: {
            type: "number",
          },
        },
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
      type: "data-transform",
      subtype: "excel-read",
      parameters: {
        filePath: "Feedbacks.xlsx",
      },
      outputSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            image: {
              type: "string",
            },
            comment: {
              type: "string",
            },
            client_email: {
              type: "string",
            },
            date: {
              type: "string",
            },
          },
          required: ["image", "comment", "client_email", "date"],
        },
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
      type: "data-transform",
      subtype: "split",
      parameters: {
        batchSize: 1,
      },
      inputSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            image: {
              type: "string",
            },
            comment: {
              type: "string",
            },
            client_email: {
              type: "string",
            },
            date: {
              type: "string",
            },
          },
        },
      },
      outputSchema: {
        type: "object",
        properties: {
          image: {
            type: "string",
          },
          comment: {
            type: "string",
          },
          client_email: {
            type: "string",
          },
          date: {
            type: "string",
          },
        },
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
      type: "ai-processing",
      subtype: "image-analyze",
      parameters: {
        system: "You are an image analysis assistant.",
        prompt: "Point out team is responsible for this feedback type, {{teams_data}}. Provide structured output in JSON format: 'feedback_type' (string), 'feedback_name' (string), 'description' (string), 'team' (string), 'team_email' (string). Format: {\"feedback_type\": \"...\", \"feedback_name\": \"...\", \"description\": \"...\", \"team\": \"...\", \"team_email\": \"...\"}. If no team is responsible, return 'Product Management' team.",
        attachment: "json.image",
        url: "https://clovastudio.stream.ntruss.com/v3/chat-completions/HCX-005",
        method: "POST",
        "injected-data": {
          teams_data: [
            {
              team_name: "Customer Support",
              product_type: "Hỗ trợ khách hàng cơ bản (ticket, hotline, chat)",
              team_email: "support.tier1@company.com",
            },
            {
              team_name: "Technical Support",
              product_type: "Giải quyết vấn đề kỹ thuật phức tạp, xử lý escalation",
              team_email: "tech.support@company.com",
            },
            {
              team_name: "Product Management",
              product_type: "Quản lý sản phẩm, phát triển tính năng mới dựa trên phản hồi khách hàng",
              team_email: "product.management@company.com",
            },
          ],
        },
        credentials: {
          API_KEY: "nv-be8e6ef06ab44ae6b42c8a7917669339IlHe",
        },
      },
      inputSchema: {
        type: "object",
        properties: {
          image: {
            type: "string",
          },
        },
      },
      outputSchema: {
        type: "object",
        properties: {
          feedback_type: {
            type: "string",
          },
          feedback_name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          team: {
            type: "string",
          },
          team_email: {
            type: "string",
          },
        },
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
      type: "ai-processing",
      subtype: "text-analyze",
      parameters: {
        system: "You are a customer service AI assistant specializing in analyzing customer feedback and complaints.",
        prompt: "Analyze this customer feedback and return the problem and solution. {{json.comment}}. Provide structured output in JSON format: 'problem' (string), 'solution' (string). Format: {\"problem\": \"...\", \"solution\": \"...\"}.",
        url: "https://clovastudio.stream.ntruss.com/v3/chat-completions/HCX-005",
        method: "POST",
        credentials: {
          API_KEY: "nv-be8e6ef06ab44ae6b42c8a7917669339IlHe",
        },
      },
      inputSchema: {
        type: "object",
        properties: {
          comment: {
            type: "string",
          },
        },
      },
      outputSchema: {
        type: "object",
        properties: {
          problem: {
            type: "string",
          },
          solution: {
            type: "string",
          },
        },
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
      type: "control",
      subtype: "if",
      parameters: {
        field: "{{json.team}}",
        operator: "==",
        value: "Others",
        trueNodeName: "End Node",
        falseNodeName: "MergeData",
      },
      inputSchema: {
        type: "object",
        properties: {
          chosen: {
            type: "string",
          },
          condition_result: {
            type: "boolean",
          },
          passed_result: {
            type: "object",
            properties: {
              feedback_type: {
                type: "string",
              },
              feedback_name: {
                type: "string",
              },
              description: {
                type: "string",
              },
              team: {
                type: "string",
              },
              team_email: {
                type: "string",
              },
            },
          },
        },
      },
      outputSchema: {
        type: "object",
        properties: {
          feedback_type: {
            type: "string",
          },
          feedback_name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          team: {
            type: "string",
          },
          team_email: {
            type: "string",
          },
        },
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
      type: "data-transform",
      subtype: "merge",
      parameters: {},
      inputSchema: {
        type: "object",
        properties: {
          "brand-1": {
            type: "object",
            properties: {
              type: {
                type: "string",
              },
              item: {
                type: "string",
              },
              description: {
                type: "string",
              },
              team: {
                type: "string",
              },
              team_email: {
                type: "string",
              },
            },
          },
          "brand-2": {
            type: "object",
            properties: {
              problem: {
                type: "string",
              },
              solution: {
                type: "string",
              },
            },
          },
          "brand-3": {
            type: "object",
            properties: {
              date: {
                type: "string",
              },
              client_email: {
                type: "string",
              },
            },
          },
        },
      },
      outputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
          },
          item: {
            type: "string",
          },
          description: {
            type: "string",
          },
          team: {
            type: "string",
          },
          team_email: {
            type: "string",
          },
          problem: {
            type: "string",
          },
          solution: {
            type: "string",
          },
          client_email: {
            type: "string",
          },
          date: {
            type: "string",
          },
        },
      },
    },
    connections: {
      input: ["node-6", "node-5"],
      output: ["node-9", "node-10"],
    },
  },
  {
    id: "node-9",
    type: "email",
    name: "TeamEmail",
    position: { x: 1300, y: 200 },
    config: {
      name: "TeamEmail",
      type: "output",
      subtype: "mail-writer",
      parameters: {
        to: "{{json.team_email}}",
        subject: "User's feedback {{json.feedback_name}} requires your attention",
        body: {
          type: "string",
          content: "Dear Team,\n\nYou have received new feedback regarding the item: {{json.feedback_name}}.\n\nProblem: {{json.problem}}\nSolution: {{json.solution}}\nDate: {{json.date}}\n\nPlease take the necessary actions.\n\nBest regards,\nCustomer Service AI Assistant",
        },
      },
      inputSchema: {
        type: "object",
        properties: {
          image: {
            type: "string",
          },
          item: {
            type: "string",
          },
          problem: {
            type: "string",
          },
          solution: {
            type: "string",
          },
          date: {
            type: "string",
          },
          team_email: {
            type: "string",
          },
        },
      },
      outputSchema: {
        status: {
          type: "string",
        },
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
    position: { x: 1300, y: 200 },
    config: {
      name: "ClientEmail",
      type: "output",
      subtype: "mail-writer",
      parameters: {
        to: "{{json.client_email}}",
        subject: "Thank you for your feedback on {{json.feedback_name}}",
        body: {
          type: "string",
          content: "Dear Customer,\n\nThank you for your valuable feedback regarding the item: {{json.feedback_name}}.\n\nWe have identified the following issue: {{json.problem}}\n\nOur proposed solution is: {{json.solution}}\n\nWe appreciate your input and are committed to improving our services.\n\nBest regards,\nCustomer Service Team",
        },
      },
      inputSchema: {
        type: "object",
        properties: {
          feedback_name: {
            type: "string",
          },
          problem: {
            type: "string",
          },
          solution: {
            type: "string",
          },
          date: {
            type: "string",
          },
          client_email: {
            type: "string",
          },
        },
      },
      outputSchema: {
        status: {
          type: "string",
        },
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
    value: JSON.stringify([
      {
        team_name: "Customer Support",
        product_type: "Hỗ trợ khách hàng cơ bản (ticket, hotline, chat)",
        team_email: "support.tier1@company.com",
      },
      {
        team_name: "Technical Support",
        product_type: "Giải quyết vấn đề kỹ thuật phức tạp, xử lý escalation",
        team_email: "tech.support@company.com",
      },
      {
        team_name: "Product Management",
        product_type: "Quản lý sản phẩm, phát triển tính năng mới dựa trên phản hồi khách hàng",
        team_email: "product.management@company.com",
      },
    ]),
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
