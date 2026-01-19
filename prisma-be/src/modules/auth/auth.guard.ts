import { Elysia } from "elysia";
import { jwtPlugin } from "./jwt.plugin";
import { db } from "../../db";
import { users, type User } from "../../db/schema";
import { eq } from "drizzle-orm";
import { UnauthorizedError } from "../../lib/errors";

/**
 * Auth Guard Plugin
 * Provides authentication via Bearer token with token version validation
 * Routes using this plugin will require authentication
 *
 * The resolve step derives the user and throws UnauthorizedError if not authenticated.
 * The error handler in the app catches this and returns 401.
 */
export const authGuard = new Elysia({ name: "authGuard" })
  .use(jwtPlugin)
  .resolve(
    { as: "scoped" },
    async ({ accessJwt, headers }): Promise<{ user: User }> => {
      const authorization = headers.authorization;
      if (!authorization?.startsWith("Bearer ")) {
        throw new UnauthorizedError("No authorization token provided");
      }

      const token = authorization.slice(7);
      const payload = await accessJwt.verify(token);

      if (!payload) {
        throw new UnauthorizedError("Invalid or expired token");
      }

      // Verify token version matches DB
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.sub as string))
        .limit(1);

      if (!user || user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedError("Token has been revoked");
      }

      return { user };
    },
  );

/**
 * Optional Auth Plugin
 * Derives user from JWT if present, but doesn't require authentication
 */
export const optionalAuth = new Elysia({ name: "optionalAuth" })
  .use(jwtPlugin)
  .resolve(
    { as: "scoped" },
    async ({ accessJwt, headers }): Promise<{ user: User | null }> => {
      const authorization = headers.authorization;
      if (!authorization?.startsWith("Bearer ")) {
        return { user: null };
      }

      const token = authorization.slice(7);
      const payload = await accessJwt.verify(token);

      if (!payload) {
        return { user: null };
      }

      // Verify token version matches DB
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.sub as string))
        .limit(1);

      if (!user || user.tokenVersion !== payload.tokenVersion) {
        return { user: null };
      }

      return { user };
    },
  );
