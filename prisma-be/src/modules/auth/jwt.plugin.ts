import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "../../lib/env";

/**
 * JWT Plugin Configuration
 * Provides access and refresh JWT handlers
 */
export const jwtPlugin = new Elysia({ name: "jwt" })
  .use(
    jwt({
      name: "accessJwt",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.ACCESS_TOKEN_EXPIRES_IN,
    }),
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: env.JWT_REFRESH_SECRET,
      exp: env.REFRESH_TOKEN_EXPIRES_IN,
    }),
  );
