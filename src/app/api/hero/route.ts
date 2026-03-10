import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(hero);
  } catch {
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    const existing = await prisma.heroSection.findFirst();
    let hero;
    if (existing) {
      hero = await prisma.heroSection.update({ where: { id: existing.id }, data });
    } else {
      hero = await prisma.heroSection.create({ data });
    }
    return NextResponse.json(hero);
  } catch {
    return NextResponse.json({ error: "Failed to save hero" }, { status: 500 });
  }
}
