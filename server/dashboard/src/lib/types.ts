// ---- Client → Server ----

export interface ChatSendMessage {
  type: "chat/send";
  text: string;
}

// ---- Server → Client ----

export interface SessionStatusMessage {
  type: "session/status";
  status: "idle" | "streaming" | "error";
}

export interface ChatDeltaMessage {
  type: "chat/delta";
  text: string;
}

export interface ChatDoneMessage {
  type: "chat/done";
  sessionId: string;
}

export interface ChatErrorMessage {
  type: "chat/error";
  message: string;
}

export interface WireOutgoingMessage {
  type: "wire/outgoing";
  command: string;
  args: string[];
  timestamp: string;
}

export interface WireIncomingMessage {
  type: "wire/incoming";
  data: unknown;
  timestamp: string;
}

export type ServerMessage =
  | SessionStatusMessage
  | ChatDeltaMessage
  | ChatDoneMessage
  | ChatErrorMessage
  | WireOutgoingMessage
  | WireIncomingMessage;

// ---- Chat UI ----

export interface ChatEntry {
  role: "user" | "assistant";
  text: string;
}
