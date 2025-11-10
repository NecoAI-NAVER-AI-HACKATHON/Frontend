// Webhook Response Node

export interface Output {
  name: string;
  type: "output";
  subtype: "webhook_response";
  position: [number, number];
  parameters: {
    statusCode: number;
    bodyTemplate: {
      success: boolean;
      message: string;
      data: string;
    };
    contentType: string;
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

export interface HTTPRequest {
  name: string;
  type: "outout";
  subtype: "http_request";
  position: [number, number];
  parameters: {
    method: string;
    url: string;
    headers: {
      [key: string]: string;
    };
    bodyTemplate: {
      [key: string]: string;
    };
    timeout: number;
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

// Database Write Node

export interface DatabaseWriter {
  name: string;
  type: "output";
  subtype: "database_write";
  position: [number, number];
  parameters: {
    database: string;
    table: string;
    fields: {
      [key: string]: string;
    };
    credentials: {
      type: string;
      fields: {
        [key: string]: string;
      };
    };
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}

export interface MailWriter {
  name: string;
  type: "output";
  subtype: "mail_write";
  position: [number, number];
  parameters: {
    to: string;
    subject: string;
    body: string;
    credentials: {
      type: string;
      fields: {
        [key: string]: string;
      };
    };
  };
  inputSchema: { [key: string]: string };
  outputSchema: { [key: string]: string };
}
