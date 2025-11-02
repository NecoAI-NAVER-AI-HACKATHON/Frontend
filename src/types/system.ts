import type { Json } from "./common";

export interface System {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  created_at: string;
  updated_at: string;
  global_config: Json;
  metadata: Json;
}
