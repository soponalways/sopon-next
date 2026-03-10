"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SortAsc, X, Star, Rss } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";

interface BlogsClientProps {
    initialData: { blogs: any[]; total: number; totalPages: number };
    meta: { categories: string[]; tags: string[] };
}

const sortOptions = [
    { value: "latest", label: "Latest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "readTime", label: "Quick Reads" },
];

export default function BlogsClient({ initialData, meta }: BlogsClientProps) {
    const [blogs, setBlogs] = useState(initialData.blogs);
    const [total, setTotal] = useState(initialData.total);
    const [totalPages, setTotalPages] = useState(initialData.totalPages);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [tag, setTag] = useState("");
    const [sort, setSort] = useState("latest");
    const [featured, setFeatured] = useState(false);

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitial = useRef(true);

    const buildParams = useCallback(
        (p = 1) => {
            const params = new URLSearchParams({ page: String(p), limit: "9", sort });
            if (search) params.set("search", search);
            if (category !== "all") params.set("category", category);
            if (tag) params.set("tag", tag);
            if (featured) params.set("featured", "true");
            return params.toString();
        },
        [search, category, tag, sort, featured]
    );

    const fetchBlogs = useCallback(
        async (p = 1, append = false) => {
            if (!append) setLoading(true);
            else setLoadingMore(true);
            try {
                const res = await fetch(`/api/blogs?${buildParams(p)}`);
                const data = await res.json();
                if (append) {
                    setBlogs((prev) => [...prev, ...data.blogs]);
                } else {
                    setBlogs(data.blogs);
                }
                setTotal(data.total);
                setTotalPages(data.totalPages);
                setPage(p);
            } catch { }
            setLoading(false);
            setLoadingMore(false);
        },
        [buildParams]
    );

    // Search debounce
    useEffect(() => {
        if (isInitial.current) { isInitial.current = false; return; }
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => fetchBlogs(1), 400);
        return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
    }, [search, fetchBlogs]);

    // Immediate filter change
    useEffect(() => {
        if (isInitial.current) return;
        fetchBlogs(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, tag, sort, featured]);

    const clearFilters = () => {
        setSearch(""); setCategory("all"); setTag(""); setSort("latest"); setFeatured(false);
    };

    const hasFilters = search || category !== "all" || tag || sort !== "latest" || featured;

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero */}
            <div className="relative bg-base-200/50 border-b border-base-300/50 overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-2 text-primary font-mono text-sm mb-3">
                            <Rss className="w-4 h-4" />
                            <span>// MY BLOG</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                            Articles &{" "}
                            <span className="gradient-text">Insights</span>
                        </h1>
                        <p className="text-base-content/60 text-lg">
                            Thoughts on Full Stack Development, Next.js, PostgreSQL, DevOps and everything I learn along the way.
                        </p>
                        <div className="flex items-center gap-4 mt-6 text-sm text-base-content/50">
                            <span className="font-mono">{total} articles</span>
                            <span>·</span>
                            <span className="font-mono">{meta.categories.length - 1} categories</span>
                            <span>·</span>
                            <span className="font-mono">{meta.tags.length} topics</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-10">
                {/* Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-base-100 rounded-2xl border border-base-300/50 p-4 mb-8 shadow-sm"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                className="input input-bordered rounded-xl w-full pl-10 text-sm focus:input-primary"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <X className="w-4 h-4 text-base-content/40 hover:text-base-content" />
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            {/* Category */}
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="select select-bordered select-sm rounded-xl min-w-36"
                            >
                                {meta.categories.map((c) => (
                                    <option key={c} value={c.toLowerCase() === "all" ? "all" : c}>
                                        {c}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="select select-bordered select-sm rounded-xl min-w-36"
                            >
                                {sortOptions.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>

                            {/* Featured toggle */}
                            <button
                                onClick={() => setFeatured(!featured)}
                                className={`btn btn-sm rounded-xl gap-1.5 ${featured ? "btn-warning" : "btn-ghost border border-base-300"}`}
                            >
                                <Star className={`w-3.5 h-3.5 ${featured ? "fill-current" : ""}`} />
                                Featured
                            </button>

                            {/* Clear */}
                            {hasFilters && (
                                <button onClick={clearFilters} className="btn btn-sm btn-ghost rounded-xl gap-1.5 text-error border border-error/20">
                                    <X className="w-3.5 h-3.5" /> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tags row */}
                    {meta.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-base-300/50">
                            {meta.tags.slice(0, 15).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTag(tag === t ? "" : t)}
                                    className={`badge badge-sm cursor-pointer transition-all ${tag === t ? "badge-primary" : "badge-outline hover:badge-primary"}`}
                                >
                                    #{t}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Results info */}
                {hasFilters && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-base-content/50 mb-6 font-mono"
                    >
                        Found <span className="text-primary font-semibold">{total}</span> article{total !== 1 ? "s" : ""}
                        {search && <> matching "<span className="text-primary">{search}</span>"</>}
                    </motion.p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
                    </div>
                ) : blogs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-7xl mb-4">📭</div>
                        <h3 className="font-display text-2xl font-bold mb-2">No articles found</h3>
                        <p className="text-base-content/50 mb-6">Try different filters or search terms</p>
                        <button onClick={clearFilters} className="btn btn-primary rounded-xl">Clear filters</button>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {blogs.map((blog, i) => (
                                    <BlogCard key={blog.id} blog={blog} index={i} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Load More */}
                        {page < totalPages && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => fetchBlogs(page + 1, true)}
                                    disabled={loadingMore}
                                    className="btn btn-outline border-primary/30 hover:btn-primary rounded-2xl px-10 gap-2"
                                >
                                    {loadingMore ? (
                                        <><span className="loading loading-spinner loading-sm" /> Loading...</>
                                    ) : (
                                        `Load More (${total - blogs.length} remaining)`
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}