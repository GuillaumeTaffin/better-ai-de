import type { ServerMessage, ChatSendMessage } from "./types";

export type ConnectionState = "disconnected" | "connecting" | "connected";

export class WsClient {
  #ws: WebSocket | null = null;

  state = $state<ConnectionState>("disconnected");
  sessionStatus = $state<"idle" | "streaming" | "error">("idle");

  onMessage: ((msg: ServerMessage) => void) | null = null;

  connect() {
    if (this.#ws) return;

    this.state = "connecting";
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    this.#ws = new WebSocket(`${protocol}//${location.host}/api/session/ws`);

    this.#ws.onopen = () => {
      this.state = "connected";
    };

    this.#ws.onmessage = (event) => {
      try {
        const msg: ServerMessage = JSON.parse(event.data);
        if (msg.type === "session/status") {
          this.sessionStatus = msg.status;
        }
        this.onMessage?.(msg);
      } catch {
        // ignore non-JSON
      }
    };

    this.#ws.onclose = () => {
      this.#ws = null;
      this.state = "disconnected";
      this.sessionStatus = "idle";
    };

    this.#ws.onerror = () => {
      this.#ws?.close();
    };
  }

  disconnect() {
    this.#ws?.close();
  }

  send(text: string) {
    if (!this.#ws || this.state !== "connected") return;
    const msg: ChatSendMessage = { type: "chat/send", text };
    this.#ws.send(JSON.stringify(msg));
  }
}
