/**
 * Seed the database with default portfolio content
 * Run: npx tsx scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { defaultHero, defaultAbout, defaultSkills, defaultProjects } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const existingHero = await prisma.heroSection.findFirst();
  if (!existingHero) {
    await prisma.heroSection.create({ data: defaultHero });
    console.log("✅ Hero section created");
  } else {
    console.log("⏭️  Hero section already exists");
  }

  const existingAbout = await prisma.aboutSection.findFirst();
  if (!existingAbout) {
    await prisma.aboutSection.create({ data: defaultAbout });
    console.log("✅ About section created");
  } else {
    console.log("⏭️  About section already exists");
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({ data: defaultSkills });
    console.log(`✅ ${defaultSkills.length} skills created`);
  } else {
    console.log(`⏭️  Skills already seeded (${skillCount} found)`);
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({ data: defaultProjects });
    console.log(`✅ ${defaultProjects.length} projects created`);
  } else {
    console.log(`⏭️  Projects already seeded (${projectCount} found)`);
  }

  console.log("\n🎉 Database seeding complete!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
