import { Elysia } from "elysia";
import { jwtPlugin } from "./jwt.plugin";
import { authGuard } from "./auth.guard";
import { authService } from "./auth.service";
import {
  signupBody,
  signinBody,
  authResponse,
  tokenResponse,
  successResponse,
  errorResponse,
} from "./auth.schema";

/**
 * Auth Routes Plugin
 * Handles authentication endpoints: signup, signin, refresh, logout
 */
export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
  .post(
    "/signup",
    async ({ body, accessJwt, refreshJwt, cookie: { refreshToken } }) => {
      const result = await authService.signup(body);

      const accessTokenValue = await accessJwt.sign({
        sub: result.user.id,
        tokenVersion: result.user.tokenVersion,
      });

      const refreshTokenValue = await refreshJwt.sign({
        sub: result.user.id,
        tokenVersion: result.user.tokenVersion,
      });

      refreshToken.set({
        value: refreshTokenValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return {
        accessToken: accessTokenValue,
        user: {
          id: result.user.id,
          username: result.user.username,
        },
      };
    },
    {
      body: signupBody,
      response: {
        200: authResponse,
        400: errorResponse,
        409: errorResponse,
      },
      detail: {
        summary: "Register a new user",
        description:
          "Creates a new user account and returns access token with user info",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/signin",
    async ({ body, accessJwt, refreshJwt, cookie: { refreshToken }, set }) => {
      const user = await authService.validateUser(body);

      if (!user) {
        set.status = 401;
        return { message: "Invalid credentials" };
      }

      const accessTokenValue = await accessJwt.sign({
        sub: user.id,
        tokenVersion: user.tokenVersion,
      });

      const refreshTokenValue = await refreshJwt.sign({
        sub: user.id,
        tokenVersion: user.tokenVersion,
      });

      refreshToken.set({
        value: refreshTokenValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return {
        accessToken: accessTokenValue,
        user: {
          id: user.id,
          username: user.username,
        },
      };
    },
    {
      body: signinBody,
      response: {
        200: authResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Sign in to get access token",
        description:
          "Authenticates user and returns access token with refresh token in cookie",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/refresh",
    async ({ refreshJwt, accessJwt, cookie: { refreshToken }, set }) => {
      if (!refreshToken.value) {
        set.status = 401;
        return { message: "No refresh token provided" };
      }

      const payload = await refreshJwt.verify(refreshToken.value as string);
      if (!payload) {
        set.status = 401;
        return { message: "Invalid or expired refresh token" };
      }

      // Get current user to validate token version
      const user = await authService.getUserById(payload.sub as string);
      if (!user || user.tokenVersion !== payload.tokenVersion) {
        set.status = 401;
        return { message: "Token has been revoked" };
      }

      const accessTokenValue = await accessJwt.sign({
        sub: user.id,
        tokenVersion: user.tokenVersion,
      });

      return { accessToken: accessTokenValue };
    },
    {
      response: {
        200: tokenResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Refresh access token",
        description: "Get a new access token using the refresh token cookie",
        tags: ["Auth"],
      },
    },
  )
  .use(authGuard)
  .post(
    "/logout",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (ctx: any) => {
      const { user, cookie } = ctx;
      // Increment token version to invalidate all existing tokens
      await authService.incrementTokenVersion(user!.id);

      // Clear refresh token cookie
      cookie.refreshToken.remove();

      return { success: true, message: "Logged out successfully" };
    },
    {
      isAuth: true,
      response: {
        200: successResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Logout user",
        description:
          "Invalidates all tokens for the user and clears refresh token cookie",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
