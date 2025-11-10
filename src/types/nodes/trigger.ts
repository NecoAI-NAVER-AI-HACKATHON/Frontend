// Upload File Node

export interface UploadFile {
  name: string;
  type: "trigger";
  subtype: "file_upload";
  parameters: {
    acceptedFileType: string; // ["image/png", "image/jpeg", "application/pdf", "text/csv"]
    maxSizeMB: number;
    storageType: string; // ["temp", "permanent"]
  };
  outputSchema: {
    filePath: string;
    fileName: string;
    fileType: string;
  };
}

// Form Node

export interface Form {
  name: string;
  type: "trigger";
  subtype: "form";
  position: [number, number];
  parameters: {
    type: string; // ["text", "textarea"]
    label?: string; // "Your prompt";
    placeholder?: string; // "Write your prompt here";
  };
  outputSchema: string;
}

// Schedule Node

export interface IntervalMode {
  mode: "interval";
  interval: number;
  intervalUnit: string; // "seconds" | "minutes" | "hours";
}

export interface CronMode {
  mode: "cron";
  cronExpression: string;
}

export interface OnceMode {
  mode: "once";
  startTime: string;
}

export interface DailyMode {
  mode: "daily";
  dailyTime: string;
}

export interface ScheduleParameters {
  mode: IntervalMode | CronMode | OnceMode | DailyMode;
  timezone: string;
}

export interface Schedule {
  name: string;
  type: "trigger";
  subtype: "schedule";
  position: [number, number];
  parameters: ScheduleParameters;
  outputSchema: {
    timestamp: string;
    nextRunTime: string;
    runCount: number;
  };
}

// Webhook Node

export interface WebhookOutputSchema {
  headers: {
    content_type: string;
  };
  body: {
    data_url: string;
  };
}

export interface Webhook {
  name: string;
  type: "trigger";
  subtype: "webhook";
  position: [number, number];
  parameters: {
    path: string;
    authType: string;
    timeout: number;
    method: string;
  };
  outputSchema: WebhookOutputSchema;
}
