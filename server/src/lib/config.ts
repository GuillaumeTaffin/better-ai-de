export const config = {
  port: Number(process.env.PORT ?? 3100),
  host: process.env.HOST ?? "0.0.0.0",

  vk: {
    backendUrl: process.env.VK_BACKEND_URL ?? "http://localhost:3001",
    wsUrl: process.env.VK_WS_URL ?? "ws://localhost:3001",
  },
} as const;
