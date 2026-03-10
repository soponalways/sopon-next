"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/blog/BlogForm";

export default function EditBlogPage() {
    const { slug } = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/blogs/${slug}?preview=true`)
            .then((r) => r.json())
            .then((data) => { setBlog(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
        </div>
    );

    if (!blog) return <div className="text-center py-20">Blog not found</div>;

    return <BlogForm mode="edit" initialData={blog} />;
}