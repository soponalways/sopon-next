import { Suspense } from "react";
import { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const revalidate = 300; // 1 hour ISR

export const metadata: Metadata = {
    title: "Blog | Sopon Islam",
    description:
        "Articles and tutorials on Full Stack Development, Next.js, React, PostgreSQL, DevOps and more by Sopon Islam.",
    keywords: ["blog", "web development", "Next.js", "React", "Full Stack", "Sopon Islam"],
    openGraph: {
        title: "Blog | Sopon Islam",
        description: "Articles on Full Stack Development, Next.js, React and more.",
        type: "website",
        url: "/blogs",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | Sopon Islam",
        description: "Articles on Full Stack Development, Next.js, React and more.",
    },
};

async function getInitialBlogs() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const [blogsRes, metaRes] = await Promise.all([
            fetch(`${baseUrl}/api/blogs?limit=9`, { next: { tags: ["blogs"], revalidate: 300 } }),
            fetch(`${baseUrl}/api/blogs/meta`, { next: { tags: ["blogs"], revalidate: 300 } }),
        ]);
        const [blogsData, metaData] = await Promise.all([blogsRes.json(), metaRes.json()]);
        return { blogsData, metaData };
    } catch {
        return {
            blogsData: { blogs: [], total: 0, totalPages: 0 },
            metaData: { categories: ["All"], tags: [] },
        };
    }
}

export default async function BlogsPage() {
    const { blogsData, metaData } = await getInitialBlogs();
    return <BlogsClient initialData={blogsData} meta={metaData} />;
}