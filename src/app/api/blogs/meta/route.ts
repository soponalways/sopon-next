import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            where: { status: "published" },
            select: { category: true, tags: true },
        });

        const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category))).sort()];
        const tags = Array.from(new Set(blogs.flatMap((b) => b.tags))).sort();

        return NextResponse.json({ categories, tags });
    } catch {
        return NextResponse.json({ categories: ["All"], tags: [] });
    }
}