import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import app from "../app";

const api = treaty(app);

describe("Auth Module", () => {
  it("should return 401 on protected route without token", async () => {
    const { error } = await api.users.me.get();

    expect(error).not.toBeNull();
    expect(error?.status).toBe(401);
  });

  it("should handle signup with valid data", async () => {
    // Randomize username to allow repeated runs
    const username = `test_${Math.random().toString(36).substring(7)}`;

    const { data, error } = await api.auth.signup.post({
      username,
      password: "password123",
    });

    expect(error).toBeNull();
    expect(data).toHaveProperty("accessToken");
    expect(data).toHaveProperty("user");
    expect(data?.user.username).toBe(username);
  });

  it("should return 409 on duplicate signup", async () => {
    const username = `dup_${Math.random().toString(36).substring(7)}`;

    // First signup should succeed
    await api.auth.signup.post({
      username,
      password: "password123",
    });

    // Second signup with same username should fail
    const { error } = await api.auth.signup.post({
      username,
      password: "password123",
    });

    expect(error).not.toBeNull();
    expect(error?.status).toBe(409);
  });

  it("should return 401 on signin with invalid credentials", async () => {
    const { error } = await api.auth.signin.post({
      username: "nonexistent_user",
      password: "wrongpassword",
    });

    expect(error).not.toBeNull();
    expect(error?.status).toBe(401);
  });
});
