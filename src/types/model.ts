import type { Json } from "./common";

export interface Model {
  id: string;
  workspace_id: string;
  name: string;
  type: string;
  api_url: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  metadata: Json;
}
