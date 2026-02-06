import { Elysia } from "elysia";

/**
 * WebSocket proxy endpoint — placeholder.
 *
 * Will forward JSON-RPC messages between IDE clients and VK backend.
 */
export const proxy = new Elysia().ws("/api/proxy/ws", {
  open(ws) {
    console.log("[proxy] client connected");
    ws.send(JSON.stringify({ jsonrpc: "2.0", method: "proxy/ready" }));
  },
  message(ws, message) {
    console.log("[proxy] received:", message);
    // TODO: parse JSON-RPC, route to VK backend
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32601, message: "Not implemented" },
      })
    );
  },
  close() {
    console.log("[proxy] client disconnected");
  },
});
