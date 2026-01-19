import { t } from "elysia";

// Response schemas
export const userProfileResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  username: t.String({ examples: ["john_doe"] }),
  createdAt: t.Date({ examples: ["2024-01-19T12:00:00.000Z"] }),
  updatedAt: t.Date({ examples: ["2024-01-19T12:00:00.000Z"] }),
});

// Request schemas
export const updateUserBody = t.Object({
  username: t.Optional(
    t.String({
      minLength: 3,
      maxLength: 32,
      examples: ["new_username"],
    }),
  ),
});

export const successResponse = t.Object({
  success: t.Boolean({ examples: [true] }),
  message: t.Optional(t.String()),
});

export const errorResponse = t.Object({
  message: t.String({ examples: ["An error occurred"] }),
  code: t.Optional(t.String({ examples: ["ERROR_CODE"] })),
});

// Type exports
export type UserProfileResponse = typeof userProfileResponse.static;
export type UpdateUserBody = typeof updateUserBody.static;
