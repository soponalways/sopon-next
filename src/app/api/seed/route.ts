import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { defaultHero, defaultAbout, defaultSkills, defaultProjects } from "@/lib/seed-data";

export async function POST() {
  try {
    // Seed hero
    const existingHero = await prisma.heroSection.findFirst();
    if (!existingHero) {
      await prisma.heroSection.create({ data: defaultHero });
    }

    // Seed about
    const existingAbout = await prisma.aboutSection.findFirst();
    if (!existingAbout) {
      await prisma.aboutSection.create({ data: defaultAbout });
    }

    // Seed skills
    const skillCount = await prisma.skill.count();
    if (skillCount === 0) {
      await prisma.skill.createMany({ data: defaultSkills });
    }

    // Seed projects
    const projectCount = await prisma.project.count();
    if (projectCount === 0) {
      await prisma.project.createMany({ data: defaultProjects });
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
