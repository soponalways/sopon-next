import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogDetailClient from "./BlogDetailClient";
import { redis } from "@/lib/redis";

export const revalidate = 300;

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const blog = await prisma.blog.findUnique({
            where: { slug },
            select: { title: true, excerpt: true, imageUrl: true, tags: true, category: true, authorName: true, publishedAt: true },
        });

        if (!blog) return { title: "Blog Not Found" };

        return {
            title: `${blog.title} | Sopon Islam`,
            description: blog.excerpt,
            keywords: [...blog.tags, blog.category, "Sopon Islam", "web development"],
            authors: [{ name: blog.authorName }],
            openGraph: {
                title: blog.title,
                description: blog.excerpt,
                type: "article",
                publishedTime: blog.publishedAt?.toISOString(),
                authors: [blog.authorName],
                tags: blog.tags,
                images: blog.imageUrl ? [{ url: blog.imageUrl, alt: blog.title }] : [],
            },
            twitter: {
                card: "summary_large_image",
                title: blog.title,
                description: blog.excerpt,
                images: blog.imageUrl ? [blog.imageUrl] : [],
            },
        };
    } catch {
        return { title: "Blog | Sopon Islam" };
    }
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const lastSync = await redis.get("views:last-sync");

    const now = Date.now();

    if (!lastSync || now - Number(lastSync) > 60000) {
        await fetch("/api/cron/sync-views");
        await redis.set("views:last-sync", now);
    }
    try {
        const blog = await prisma.blog.findUnique({
            where: { slug },
        } as any);
        console.log({ blog });
        if (!blog || blog.status !== "published") notFound();

        // Get related blogs
        const related = await prisma.blog.findMany({
            where: {
                status: "published",
                slug: { not: slug },
                OR: [
                    { category: blog.category },
                    { tags: { hasSome: blog.tags } },
                ],
            },
            take: 3,
            orderBy: { publishedAt: "desc" },
            select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, tags: true, category: true, featured: true, views: true, readTime: true, publishedAt: true, createdAt: true },
        });

        return <BlogDetailClient blog={blog} related={related} />;
    } catch (err: any) {
        console.log({ errorMessage: err.message, err });
        notFound();
    }
}