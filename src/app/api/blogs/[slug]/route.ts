import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidateBlogCache, revalidateBlogPost } from "@/lib/revalidate";

// GET - Public: single blog by slug (also increments views)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(req.url);
        const preview = searchParams.get("preview"); // admin preview

        const session = await auth.api.getSession({ headers: await headers() });
        const isAdmin = session?.user && (session.user as any).role === "admin";

        const blog = await prisma.blog.findUnique({ where: { slug } });

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Only admins can see drafts
        if (blog.status === "draft" && !isAdmin) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Increment views (fire and forget, don't await for speed)
        if (!preview) {
            prisma.blog.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => { });
        }

        return NextResponse.json(blog, {
            headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}

// PUT - Admin: update blog
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const data = await req.json();
        const existing = await prisma.blog.findUnique({ where: { slug } });
        if (!existing) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const wasPublished = existing.status === "published";
        const nowPublished = data.status === "published";

        const updated = await prisma.blog.update({
            where: { slug },
            data: {
                title: data.title ?? existing.title,
                excerpt: data.excerpt ?? existing.excerpt,
                content: data.content ?? existing.content,
                imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
                tags: Array.isArray(data.tags) ? data.tags : existing.tags,
                category: data.category ?? existing.category,
                status: data.status ?? existing.status,
                featured: data.featured !== undefined ? Boolean(data.featured) : existing.featured,
                readTime: data.content ? Math.max(1, Math.ceil(data.content.trim().split(/\s+/).length / 200)) : existing.readTime,
                authorName: data.authorName ?? existing.authorName,
                authorImage: data.authorImage !== undefined ? data.authorImage : existing.authorImage,
                publishedAt: !wasPublished && nowPublished ? new Date() : existing.publishedAt,
            },
        });

        await revalidateBlogPost(slug);
        await revalidateBlogCache();

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }
}

// DELETE - Admin: delete blog
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        await prisma.blog.delete({ where: { slug } });
        await revalidateBlogPost(slug);
        await revalidateBlogCache();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}