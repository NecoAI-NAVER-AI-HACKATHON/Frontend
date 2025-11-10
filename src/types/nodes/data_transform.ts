// Function node

export interface Function {
  name: string;
  type: "data-transform";
  subtype: "function";
  position: [number, number];
  parameters: {
    code: string;
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

// Split Node

export interface Split {
  name: string;
  type: "data-transform";
  subtype: "split";
  position: [number, number];
  parameters: {
    batchSize: number;
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

// Merge Node

export interface Merge {
  name: string;
  type: "data-transform";
  subtype: "merge";
  position: [number, number];
  parameters: {};
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

// Delay Node

export interface Delay {
  name: string;
  type: "data-transform";
  subtype: "delay";
  position: [number, number];
  parameters: {
    delay: number;
    delayUnit: string; // "seconds" | "minutes" | "hours";
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}
