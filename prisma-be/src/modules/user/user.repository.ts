import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, type User, type NewUser } from "../../db/schema";

export const userRepository = {
  async create(user: NewUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  },

  async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user;
  },

  async findById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  },

  async update(
    id: string,
    data: Partial<Pick<User, "username">>,
  ): Promise<User | undefined> {
    const [result] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result;
  },

  async delete(id: string): Promise<User | undefined> {
    const [result] = await db.delete(users).where(eq(users.id, id)).returning();
    return result;
  },
};
