import { Elysia } from "elysia";
import { ClaudeProcess } from "./claude-process";
import { WireObserver } from "./wire-observer";
import type { ClientMessage, ServerMessage } from "./types";

const sessions = new Map<string, ClaudeProcess>();
const wireCleanups = new Map<string, () => void>();

function send(ws: { send: (data: string) => void }, msg: ServerMessage) {
  ws.send(JSON.stringify(msg));
}

export const session = new Elysia().ws("/api/session/ws", {
  open(ws) {
    const wireObserver = new WireObserver();
    const claude = new ClaudeProcess(wireObserver);
    sessions.set(ws.id, claude);

    const unsubscribe = wireObserver.subscribe((event) => {
      if (event.direction === "outgoing") {
        send(ws, {
          type: "wire/outgoing",
          command: event.command,
          args: event.args,
          timestamp: event.timestamp,
        });
      } else {
        send(ws, {
          type: "wire/incoming",
          data: event.data,
          timestamp: event.timestamp,
        });
      }
    });
    wireCleanups.set(ws.id, unsubscribe);

    console.log(`[session] client connected (${ws.id})`);
    send(ws, { type: "session/status", status: "idle" });
  },

  async message(ws, raw) {
    const claude = sessions.get(ws.id);
    if (!claude) return;

    let msg: ClientMessage;
    try {
      msg = typeof raw === "string" ? JSON.parse(raw) : (raw as ClientMessage);
    } catch {
      send(ws, { type: "chat/error", message: "Invalid JSON" });
      return;
    }

    if (msg.type !== "chat/send" || !msg.text) {
      send(ws, { type: "chat/error", message: "Unknown message type" });
      return;
    }

    if (claude.isRunning) {
      send(ws, { type: "chat/error", message: "Already streaming" });
      return;
    }

    send(ws, { type: "session/status", status: "streaming" });

    await claude.send(msg.text, {
      onDelta(text) {
        send(ws, { type: "chat/delta", text });
      },
      onDone(sessionId) {
        send(ws, { type: "chat/done", sessionId });
        send(ws, { type: "session/status", status: "idle" });
      },
      onError(message) {
        send(ws, { type: "chat/error", message });
        send(ws, { type: "session/status", status: "error" });
      },
    });
  },

  close(ws) {
    wireCleanups.get(ws.id)?.();
    wireCleanups.delete(ws.id);

    const claude = sessions.get(ws.id);
    if (claude) {
      claude.kill();
      sessions.delete(ws.id);
    }
    console.log(`[session] client disconnected (${ws.id})`);
  },
});
