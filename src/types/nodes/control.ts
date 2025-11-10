// If Node

export interface If {
  name: string;
  type: "control";
  subtype: "if";
  position: [number, number];
  parameters: {
    field: string | number;
    operator: string; // "==" | "!=" | ">" | ">=" | "<" | "<=";
    value: string | number | boolean | null;
    trueNodeName: string;
    falseNodeName: string;
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

// Loop Node

export interface Loop {
  name: string;
  type: "control";
  subtype: "loop";
  position: [number, number];
  parameters: {
    maxIterations: number;
    iteratorField: string;
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

// Parralel Node
export interface Branch {
  nodeId: string;
}
export interface Parralel {
  name: string;
  type: "control";
  subtype: "parralel";
  position: [number, number];
  parameters: {
    nodes: Branch[];
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}
