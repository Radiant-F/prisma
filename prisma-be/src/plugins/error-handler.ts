import { Elysia } from "elysia";
import { AppError } from "../lib/errors";

/**
 * Global error handler plugin
 * Provides centralized error handling for the application
 */
export const errorHandler = new Elysia({ name: "errorHandler" }).onError(
  { as: "global" },
  ({ error, set }) => {
    // Handle custom AppError
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        message: error.message,
        code: error.code,
      };
    }

    const errorData = error as { name?: string; code?: string; type?: string };

    // Handle Elysia validation error objects (code/type)
    if (errorData?.code === "VALIDATION" || errorData?.type === "validation") {
      set.status = 422;
      return {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
      };
    }

    // Handle Elysia validation errors and other Error types
    if (error instanceof Error) {
      if (
        error.name === "ValidationError" ||
        errorData?.code === "VALIDATION" ||
        errorData?.type === "validation"
      ) {
        set.status = 422;
        return {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
        };
      }

      // Handle unknown errors
      console.error("Unhandled error:", error);
      set.status = 500;
      return {
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
      };
    }

    // Fallback for non-Error types
    set.status = 500;
    return {
      message: "Internal Server Error",
      code: "INTERNAL_ERROR",
    };
  },
);
