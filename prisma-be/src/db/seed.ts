import { db } from "./index";
import { users } from "./schema";

async function seed(): Promise<void> {
  console.log("🌱 Seeding database...");

  const adminUsername = process.env.SEED_ADMIN_USERNAME;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.log(
      "⚠️  SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD not set, skipping admin seed",
    );
    console.log("✅ Seeding complete (no data seeded)");
    process.exit(0);
  }

  try {
    const passwordHash = await Bun.password.hash(adminPassword);

    await db
      .insert(users)
      .values({
        username: adminUsername,
        passwordHash,
      })
      .onConflictDoNothing();

    console.log(`✅ Admin user "${adminUsername}" seeded successfully!`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
