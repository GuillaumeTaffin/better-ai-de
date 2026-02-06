/**
 * Cherry-picked types from vibe-kanban/shared/types.ts
 *
 * These form the stable boundary between Better AI-DE and VK.
 * Only include types we actively use in the proxy layer.
 * See vibe-kanban/shared/types.ts for the full set.
 */

export type TaskStatus = "todo" | "inprogress" | "inreview" | "done" | "cancelled";

export type ExecutionProcessStatus =
  | "created"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "stopped";

export interface Workspace {
  id: string;
  name: string;
  project_id: string;
  archived: boolean;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  workspace_id: string;
  execution_process_id: string | null;
  created_at: string;
}

export interface ExecutionProcess {
  id: string;
  workspace_id: string;
  session_id: string;
  status: ExecutionProcessStatus;
  created_at: string;
  completed_at: string | null;
}

export interface NormalizedEntry {
  timestamp: string | null;
  entry_type: NormalizedEntryType;
  content: string;
}

export type NormalizedEntryType =
  | { type: "user_message" }
  | { type: "assistant_message" }
  | { type: "tool_use"; tool_name: string }
  | { type: "system_message" }
  | { type: "error_message" }
  | { type: "thinking" };

export type PatchType =
  | { type: "NORMALIZED_ENTRY"; content: NormalizedEntry }
  | { type: "STDOUT"; content: string }
  | { type: "STDERR"; content: string };
