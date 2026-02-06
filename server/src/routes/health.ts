import { Elysia } from "elysia";

export const health = new Elysia().get("/api/health", () => ({
  status: "ok",
  service: "better-ai-de",
}));
