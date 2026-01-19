import { Elysia } from "elysia";
import { authGuard } from "../auth/auth.guard";
import { userRepository } from "./user.repository";
import {
  userProfileResponse,
  updateUserBody,
  successResponse,
  errorResponse,
} from "./user.schema";

/**
 * User Routes Plugin
 * Handles user profile endpoints: get, update, delete
 * All routes are protected by authGuard (which throws 401 if not authenticated)
 */
export const userRoutes = new Elysia({ prefix: "/users" })
  .use(authGuard)
  .get(
    "/me",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (ctx: any) => {
      const { user, set } = ctx;
      const profile = await userRepository.findById(user.id);
      if (!profile) {
        set.status = 404;
        return { message: "User not found" };
      }

      return {
        id: profile.id,
        username: profile.username,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    },
    {
      response: {
        200: userProfileResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Get current user profile",
        description: "Returns the profile of the currently authenticated user",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .put(
    "/me",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (ctx: any) => {
      const { user, body, set } = ctx;
      const updated = await userRepository.update(user.id, body);
      if (!updated) {
        set.status = 404;
        return { message: "User not found" };
      }

      return {
        id: updated.id,
        username: updated.username,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    },
    {
      body: updateUserBody,
      response: {
        200: userProfileResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Update current user profile",
        description: "Updates the profile of the currently authenticated user",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/me",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (ctx: any) => {
      const { user, set } = ctx;
      const deleted = await userRepository.delete(user.id);
      if (!deleted) {
        set.status = 404;
        return { message: "User not found" };
      }

      return { success: true, message: "Account deleted successfully" };
    },
    {
      response: {
        200: successResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Delete current user account",
        description:
          "Permanently deletes the currently authenticated user's account",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
