import type { UploadFile, Form, Webhook, Schedule } from "./trigger";
import type { Function, Split, Merge, Delay } from "./data_transform";
import type { If, Loop, Parralel } from "./control";
import type { Output, HTTPRequest, DatabaseWriter } from "./output";

export type Node =
  | UploadFile
  | Form
  | Webhook
  | Schedule
  | Function
  | Split
  | Merge
  | Delay
  | If
  | Loop
  | Parralel
  | Output
  | HTTPRequest
  | DatabaseWriter;

export interface ConnectionItem {
  targetNode: string;
  /** Input index on target node (0 = input chính) */
  inputIndex: number;
}

export interface Connection {
  main: ConnectionItem[];
}

export interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  connections: { [nodeName: string]: Connection };
}
