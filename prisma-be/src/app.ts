import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { errorHandler } from "./plugins/error-handler";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";

/**
 * Main application composition
 * Combines all plugins and routes
 */
const app = new Elysia()
  .use(errorHandler)
  .use(
    openapi({
      path: "/docs",
      documentation: {
        info: {
          title: "Prisma Backend API",
          version: "1.0.0",
          description: "Production-ready ElysiaJS API with JWT authentication",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Users", description: "User management endpoints" },
          { name: "Todos", description: "Todo management endpoints" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "JWT access token",
            },
          },
        },
      },
    }),
  )
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || true,
      credentials: true,
    }),
  )
  .get("/", () => ({
    message: "Prisma Backend API",
    docs: "/docs",
    version: "1.0.0",
  }))
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(authRoutes)
  .use(userRoutes)
  .use(todoRoutes);

export type App = typeof app;
export default app;
