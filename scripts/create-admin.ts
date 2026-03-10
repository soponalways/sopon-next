/**
 * Script to create the first admin user
 * Run: npx tsx scripts/create-admin.ts
 */
import { PrismaClient } from "@prisma/client";
import { createAuthClient } from "better-auth/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@sopon.dev";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";
  const name = "Sopon Islam";

  // Check if admin exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Update role to admin
    await prisma.user.update({ where: { email }, data: { role: "admin" } });
    console.log(`✅ User ${email} updated to admin role`);
    return;
  }

  // Create account via Prisma directly
  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  const hashedPassword = hashPassword(password);

  await prisma.user.create({
    data: {
      id: userId,
      name,
      email,
      emailVerified: true,
      role: "admin",
    },
  });

  await prisma.account.create({
    data: {
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
    },
  });

  console.log(`✅ Admin user created:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Please change the password after first login!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
