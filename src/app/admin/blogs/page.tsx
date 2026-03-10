"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Rss, Plus, Edit, Trash2, Eye, Star, ExternalLink, Search } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ status: "all", limit: "50" });
            if (search) params.set("search", search);
            const res = await fetch(`/api/blogs?${params}`);
            const data = await res.json();
            setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchBlogs(); }, [search]);

    const onDelete = async (slug: string) => {
        if (!confirm("Delete this blog post? This cannot be undone.")) return;
        const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
        if (res.ok) { toast("Blog deleted", "success"); fetchBlogs(); }
        else { toast("Failed to delete", "error"); }
    };

    const togglePublish = async (blog: any) => {
        const newStatus = blog.status === "published" ? "draft" : "published";
        const res = await fetch(`/api/blogs/${blog.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) { toast(`Blog ${newStatus}`, "success"); fetchBlogs(); }
        else { toast("Failed to update status", "error"); }
    };

    const filtered = statusFilter === "all" ? blogs : blogs.filter((b) => b.status === statusFilter);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1">
                        <Rss className="w-7 h-7 text-primary" /> Blog Posts
                    </h1>
                    <p className="text-base-content/60">Create and manage your blog articles</p>
                </div>
                <Link href="/admin/blogs/create" className="btn btn-primary rounded-xl gap-2">
                    <Plus className="w-4 h-4" /> New Post
                </Link>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
                        className="input input-bordered rounded-xl w-full pl-10 text-sm" />
                </div>
                <div className="flex gap-2">
                    {["all", "published", "draft"].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`btn btn-sm rounded-xl capitalize ${statusFilter === s ? "btn-primary" : "btn-ghost border border-base-300"}`}>
                            {s}
                            <span className="badge badge-xs ml-1">
                                {s === "all" ? blogs.length : blogs.filter((b) => b.status === s).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-base-content/40 bg-base-100 rounded-2xl border border-base-300/50">
                    <Rss className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="mb-4">No blog posts yet</p>
                    <Link href="/admin/blogs/create" className="btn btn-primary btn-sm rounded-xl">Write your first post</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((blog, i) => (
                        <motion.div key={blog.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className="bg-base-100 rounded-2xl p-5 border border-base-300/50 hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                {blog.imageUrl && (
                                    <img src={blog.imageUrl} alt={blog.title}
                                        className="w-20 h-14 object-cover rounded-xl flex-shrink-0 hidden sm:block" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="font-semibold truncate">{blog.title}</h3>
                                        {blog.featured && <Star className="w-4 h-4 text-warning fill-warning flex-shrink-0" />}
                                        <span className={`badge badge-xs ${blog.status === "published" ? "badge-success" : "badge-ghost"}`}>
                                            {blog.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-base-content/60 line-clamp-1 mb-2">{blog.excerpt}</p>
                                    <div className="flex items-center gap-3 text-xs text-base-content/40 font-mono flex-wrap">
                                        <span className="badge badge-outline badge-xs">{blog.category}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}m</span>
                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                                        {blog.tags?.slice(0, 2).map((t: string) => <span key={t}>#{t}</span>)}
                                    </div>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0 flex-col sm:flex-row">
                                    <button
                                        onClick={() => togglePublish(blog)}
                                        className={`btn btn-xs rounded-lg ${blog.status === "published" ? "btn-ghost text-warning" : "btn-success btn-outline"}`}
                                        title={blog.status === "published" ? "Unpublish" : "Publish"}
                                    >
                                        {blog.status === "published" ? "Unpublish" : "Publish"}
                                    </button>
                                    {blog.status === "published" && (
                                        <Link href={`/blogs/${blog.slug}`} target="_blank" className="btn btn-ghost btn-xs">
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    )}
                                    <Link href={`/admin/blogs/edit/${blog.slug}`} className="btn btn-ghost btn-xs text-primary">
                                        <Edit className="w-3 h-3" />
                                    </Link>
                                    <button onClick={() => onDelete(blog.slug)} className="btn btn-ghost btn-xs text-error">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Missing import
import { Clock } from "lucide-react";