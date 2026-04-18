/**
 * Seed script: creates the initial admin user using ADMIN_EMAIL / ADMIN_PASSWORD
 * environment variables (or their APP_ prefixed equivalents used in Docker).
 *
 * Usage:
 *   pnpm --filter app db:seed-admin
 *
 * The script is idempotent – it exits without error if the user already exists.
 */
import "dotenv/config";

// Use the same drizzle-orm version that Payload's auto-generated schema uses,
// avoiding type mismatches between the root and app drizzle-orm installations.
import { eq } from "@payloadcms/db-postgres/drizzle";
import { drizzle } from "@payloadcms/db-postgres/drizzle/node-postgres";
import { hashPassword } from "better-auth/crypto";
import { Pool } from "pg";

import { env } from "../src/env.js";
import { user_accounts, user_subscriptions, users } from "../src/server/db/schemas/payload-schema";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle({ client: pool, casing: "camelCase" });

async function main() {
  try {
    // Check if the admin user already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, env.ADMIN_EMAIL))
      .limit(1);

    if (existing.length > 0) {
      console.info(`Admin user already exists (${env.ADMIN_EMAIL}), skipping seed.`);
      return;
    }

    // Hash the password using the same hasher as Better Auth
    const hashedPassword = await hashPassword(env.ADMIN_PASSWORD);

    // Insert the user record
    const [newUser] = await db
      .insert(users)
      .values({
        name: "Admin",
        email: env.ADMIN_EMAIL,
        role: "admin",
        emailVerified: true,
        banned: false,
      })
      .returning({ id: users.id });

    if (!newUser) throw new Error("Failed to insert admin user");

    // Insert the credential account so the user can sign in with email + password
    await db.insert(user_accounts).values({
      userId: newUser.id,
      accountId: env.ADMIN_EMAIL, // Better Auth uses email as accountId for credential provider
      providerId: "credential",
      password: hashedPassword,
    });

    // Insert an active subscription so the admin bypasses the paywall
    const regularProductKey =
      env.POLAR_PRODUCT_KEY_REGULAR ?? "00000000-0000-0000-0000-000000000001";
    const now = new Date().toISOString();
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    await db.insert(user_subscriptions).values({
      id: `seed-admin-sub-${newUser.id}`,
      userId: newUser.id,
      amount: 0,
      currency: "eur",
      recurringInterval: "year",
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: oneYearFromNow,
      startedAt: now,
      customerId: `seed-customer-${newUser.id}`,
      productId: regularProductKey,
      checkoutId: `seed-checkout-${newUser.id}`,
    });

    console.info(`Admin user created with active subscription: ${env.ADMIN_EMAIL}`);
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
