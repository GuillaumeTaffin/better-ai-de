import { existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";
import { Elysia } from "elysia";
import { health } from "./routes/health";
import { session } from "./session";

export function createApp() {
  const app = new Elysia().use(health).use(session);

  const distDir = resolve("dashboard/dist");

  if (existsSync(distDir)) {
    // Serve static assets and SPA fallback using Bun.file()
    app.get("/*", ({ path }) => {
      const filePath = join(distDir, path);

      // If the path has a file extension, try serving the file directly
      if (extname(path)) {
        const file = Bun.file(filePath);
        return file.exists().then((exists) =>
          exists ? file : Bun.file(join(distDir, "index.html"))
        );
      }

      // SPA fallback: serve index.html for all other routes
      return Bun.file(join(distDir, "index.html"));
    });
  }

  return app;
}
