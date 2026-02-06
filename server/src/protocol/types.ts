/**
 * Better AI-DE protocol types (skeleton).
 *
 * These will be fleshed out as the protocol is designed.
 * For now, define the namespace and basic method categories.
 */

/** Method namespaces for the Better AI-DE protocol */
export const Methods = {
  /** Workspace management */
  workspace: {
    list: "workspace/list",
    create: "workspace/create",
    status: "workspace/status",
  },

  /** Agent / execution process interactions */
  agent: {
    start: "agent/start",
    stop: "agent/stop",
    message: "agent/message",
  },

  /** Session stream events (server → client notifications) */
  session: {
    output: "session/output",
    statusChanged: "session/statusChanged",
  },
} as const;
