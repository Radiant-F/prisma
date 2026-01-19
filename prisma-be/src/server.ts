/**
 * Server bootstrap
 * Starts the HTTP server and listens for connections
 */
import { env } from "./lib/env";
import app from "./app";

app.listen(env.PORT);

console.log(`🦊 Elysia is running at http://localhost:${env.PORT}`);
console.log(
  `📚 API Documentation available at http://localhost:${env.PORT}/docs`,
);
