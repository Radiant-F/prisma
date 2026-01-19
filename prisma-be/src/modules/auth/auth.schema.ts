import { t } from "elysia";

// Request schemas
export const signupBody = t.Object({
  username: t.String({
    minLength: 3,
    maxLength: 32,
    examples: ["john_doe"],
  }),
  password: t.String({
    minLength: 8,
    maxLength: 128,
    examples: ["secureP@ssw0rd!"],
  }),
});

export const signinBody = t.Object({
  username: t.String({ examples: ["john_doe"] }),
  password: t.String({ examples: ["secureP@ssw0rd!"] }),
});

// Response schemas
export const userResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  username: t.String({ examples: ["john_doe"] }),
});

export const authResponse = t.Object({
  accessToken: t.String({
    examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
  }),
  user: userResponse,
});

export const tokenResponse = t.Object({
  accessToken: t.String({
    examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
  }),
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
export type SignupBody = typeof signupBody.static;
export type SigninBody = typeof signinBody.static;
export type AuthResponse = typeof authResponse.static;
export type UserResponse = typeof userResponse.static;
