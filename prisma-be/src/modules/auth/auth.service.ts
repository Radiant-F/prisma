import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, type User } from "../../db/schema";
import { ConflictError, UnauthorizedError } from "../../lib/errors";
import type { SignupBody, SigninBody } from "./auth.schema";

export const authService = {
  /**
   * Register a new user
   */
  async signup(
    data: SignupBody,
  ): Promise<{ user: Pick<User, "id" | "username" | "tokenVersion"> }> {
    // Check if username already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (existing) {
      throw new ConflictError("Username already exists");
    }

    const passwordHash = await Bun.password.hash(data.password);

    const [user] = await db
      .insert(users)
      .values({
        username: data.username,
        passwordHash,
      })
      .returning({
        id: users.id,
        username: users.username,
        tokenVersion: users.tokenVersion,
      });

    return { user };
  },

  /**
   * Validate user credentials
   */
  async validateUser(
    data: SigninBody,
  ): Promise<Pick<User, "id" | "username" | "tokenVersion"> | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (!user) {
      return null;
    }

    const isValid = await Bun.password.verify(data.password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      tokenVersion: user.tokenVersion,
    };
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  },

  /**
   * Increment token version to invalidate all existing tokens
   */
  async incrementTokenVersion(userId: string): Promise<number> {
    const [user] = await db
      .select({ tokenVersion: users.tokenVersion })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const newVersion = user.tokenVersion + 1;

    await db
      .update(users)
      .set({ tokenVersion: newVersion })
      .where(eq(users.id, userId));

    return newVersion;
  },
};
