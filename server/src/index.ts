import { createApp } from "./app";
import { config } from "./lib/config";

const app = createApp();

app.listen({ port: config.port, hostname: config.host });

console.log(
  `better-ai-de server running at http://${config.host}:${config.port}`
);
