export interface Workspace {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  created_at: string;
  updated_at: string;
  system_count: number;
}
