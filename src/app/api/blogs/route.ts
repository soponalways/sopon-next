import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidateBlogCache } from "@/lib/revalidate";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

function calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// GET - Public: list published blogs
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "9");
        const category = searchParams.get("category");
        const tag = searchParams.get("tag");
        const search = searchParams.get("search");
        const featured = searchParams.get("featured");
        const sort = searchParams.get("sort") || "latest"; // latest | oldest | popular | readTime
        const status = searchParams.get("status"); // for admin: all | draft | published

        const session = await auth.api.getSession({ headers: await headers() });
        const isAdmin = session?.user && (session.user as any).role === "admin";

        // Build where clause
        const where: any = {};

        // Non-admins only see published
        if (!isAdmin || !status) {
            where.status = "published";
        } else if (status !== "all") {
            where.status = status;
        }

        if (category && category !== "all") where.category = category;
        if (featured === "true") where.featured = true;
        if (tag) where.tags = { has: tag };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
                { tags: { has: search } },
                { category: { contains: search, mode: "insensitive" } },
            ];
        }

        // Sort order
        const orderBy: any =
            sort === "oldest" ? { publishedAt: "asc" } :
                sort === "popular" ? { views: "desc" } :
                    sort === "readTime" ? { readTime: "asc" } :
                        { publishedAt: "desc" };

        const [blogs, total] = await Promise.all([
            prisma.blog.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    imageUrl: true,
                    tags: true,
                    category: true,
                    status: true,
                    featured: true,
                    views: true,
                    readTime: true,
                    authorName: true,
                    publishedAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.blog.count({ where }),
        ]);

        return NextResponse.json(
            { blogs, total, page, limit, totalPages: Math.ceil(total / limit) },
            {
                headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
            }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

// POST - Admin: create blog
export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { title, content, excerpt, imageUrl, tags, category, status, featured, authorName, authorImage } = data;

        if (!title || !content || !excerpt) {
            return NextResponse.json({ error: "Title, content and excerpt are required" }, { status: 400 });
        }

        // Generate unique slug
        let slug = generateSlug(title);
        const existing = await prisma.blog.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const blog = await prisma.blog.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                imageUrl: imageUrl || null,
                tags: Array.isArray(tags) ? tags : [],
                category: category || "General",
                status: status || "draft",
                featured: Boolean(featured),
                readTime: calculateReadTime(content),
                authorName: authorName || "Sopon Islam",
                authorImage: authorImage || null,
                publishedAt: status === "published" ? new Date() : null,
            },
        });

        await revalidateBlogCache();

        return NextResponse.json(blog, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}