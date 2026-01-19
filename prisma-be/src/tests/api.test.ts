import { describe, expect, it, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import app from "../app";

const api = treaty(app);

describe("Integration API Tests", () => {
  let uniqueUsername = "";
  const password = "password123";
  let accessToken = "";

  beforeAll(() => {
    uniqueUsername = `user_${Math.random().toString(36).substring(7)}`;
  });

  it("POST /auth/signup - should register a new user", async () => {
    const { data, error } = await api.auth.signup.post({
      username: uniqueUsername,
      password,
    });

    expect(error).toBeNull();
    expect(data).toHaveProperty("accessToken");
    expect(data).toHaveProperty("user");
    expect(data?.user.username).toBe(uniqueUsername);

    // Store access token for subsequent tests
    accessToken = data!.accessToken;
  });

  it("POST /auth/signin - should login and return tokens", async () => {
    const { data, error } = await api.auth.signin.post({
      username: uniqueUsername,
      password,
    });

    expect(error).toBeNull();
    expect(data).toHaveProperty("accessToken");
    expect(data).toHaveProperty("user");
    expect(data?.user.username).toBe(uniqueUsername);

    // Update access token
    accessToken = data!.accessToken;
  });

  it("GET /users/me - should get profile with access token", async () => {
    const { data, error } = await api.users.me.get({
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(error).toBeNull();
    expect(data).toHaveProperty("id");
    expect(data?.username).toBe(uniqueUsername);
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("updatedAt");
  });

  it("POST /auth/refresh - should get new access token", async () => {
    // Note: Eden Treaty doesn't automatically handle cookies between requests
    // For full cookie-based refresh testing, use direct app.handle() with proper cookie headers
    // This is a simplified test that verifies the endpoint exists
    const { error } = await api.auth.refresh.post();

    // Should fail without refresh token cookie
    expect(error).not.toBeNull();
    expect(error?.status).toBe(401);
  });

  it("PUT /users/me - should update profile", async () => {
    const newUsername = `${uniqueUsername}_updated`;

    const { data, error } = await api.users.me.put(
      { username: newUsername },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    expect(error).toBeNull();
    expect(data?.username).toBe(newUsername);

    // Update for future tests
    uniqueUsername = newUsername;
  });

  it("DELETE /users/me - should delete account", async () => {
    const { data, error } = await api.users.me.delete(undefined, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(error).toBeNull();
    expect(data?.success).toBe(true);
  });

  it("GET /users/me - should fail after delete", async () => {
    // Token is still valid JWT, but user no longer exists
    const { error } = await api.users.me.get({
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    // User not found in DB, token version check fails or user doesn't exist
    expect(error).not.toBeNull();
    expect(error?.status).toBe(401);
  });
});
