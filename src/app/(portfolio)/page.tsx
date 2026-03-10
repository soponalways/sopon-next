import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import { Metadata } from "next";

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: "Sopon Islam | Full Stack Developer",
  description: "Full Stack Developer specializing in Next.js, React, Node.js, PostgreSQL. Building beautiful and performant web applications.",
};

async function getPortfolioData() {
  try {
    const [hero, about, skills, projects] = await Promise.all([
      prisma.heroSection.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.aboutSection.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
    ]);
    return { hero, about, skills, projects };
  } catch {
    return { hero: null, about: null, skills: [], projects: [] };
  }
}

export default async function HomePage() {
  const { hero, about, skills, projects } = await getPortfolioData();

  return (
    <main className="min-h-screen">
      <HeroSection data={hero} />
      <AboutSection data={about} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </main>
  );
}
