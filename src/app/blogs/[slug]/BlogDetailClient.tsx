"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Calendar, Tag, User, Share2, Twitter, Linkedin, Link2 } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { toast } from "@/components/ui/Toaster";

export default function BlogDetailClient({ blog, related }: { blog: any; related: any[] }) {
    const handleShare = async (platform: string) => {
        const url = window.location.href;
        const text = `Check out: ${blog.title}`;

        if (platform === "twitter") {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        } else if (platform === "linkedin") {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        } else {
            await navigator.clipboard.writeText(url);
            toast("Link copied to clipboard!", "success");
        }
    };

    const date = blog.publishedAt || blog.createdAt;

    return (
        <article className="min-h-screen bg-base-100">
            {/* Back */}
            <div className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-xl border-b border-base-300/50">
                <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <Link href="/blogs" className="btn btn-ghost btn-sm rounded-xl gap-2 text-base-content/60 hover:text-base-content">
                        <ArrowLeft className="w-4 h-4" /> Back to Blogs
                    </Link>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleShare("twitter")} className="btn btn-ghost btn-xs btn-circle" title="Share on Twitter">
                            <Twitter className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleShare("linkedin")} className="btn btn-ghost btn-xs btn-circle" title="Share on LinkedIn">
                            <Linkedin className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleShare("copy")} className="btn btn-ghost btn-xs btn-circle" title="Copy link">
                            <Link2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="relative">
                {blog.imageUrl && (
                    <div className="relative h-64 md:h-96 overflow-hidden">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/30 to-transparent" />
                    </div>
                )}

                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={blog.imageUrl ? "-mt-20 relative z-10" : "pt-12"}
                    >
                        {/* Category & tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="badge badge-primary">{blog.category}</span>
                            {blog.tags.map((tag: string) => (
                                <Link key={tag} href={`/blogs?tag=${tag}`} className="badge badge-outline hover:badge-primary transition-colors">
                                    <Tag className="w-2.5 h-2.5 mr-1" />{tag}
                                </Link>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-base-300/50 mb-8">
                            <div className="flex items-center gap-2">
                                <img
                                    src={blog.authorImage || `https://ui-avatars.com/api/?name=${blog.authorName}&background=6366f1&color=fff&size=32`}
                                    alt={blog.authorName}
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-sm font-medium">{blog.authorName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-base-content/50">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-base-content/50">
                                <Clock className="w-3.5 h-3.5" />
                                {blog.readTime} min read
                            </div>
                            <div className="flex items-center gap-1 text-sm text-base-content/50">
                                <Eye className="w-3.5 h-3.5" />
                                {blog.views.toLocaleString()} views
                            </div>
                        </div>

                        {/* Excerpt */}
                        <p className="text-lg text-base-content/70 leading-relaxed mb-8 italic border-l-4 border-primary/30 pl-4">
                            {blog.excerpt}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 max-w-3xl pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-code:text-primary prose-pre:bg-base-200 prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br/>") }}
                />

                {/* Share section */}
                <div className="mt-12 pt-8 border-t border-base-300/50">
                    <p className="text-sm font-medium text-base-content/60 mb-4">Share this article</p>
                    <div className="flex gap-3">
                        <button onClick={() => handleShare("twitter")} className="btn btn-outline btn-sm rounded-xl gap-2 hover:btn-primary">
                            <Twitter className="w-4 h-4" /> Twitter
                        </button>
                        <button onClick={() => handleShare("linkedin")} className="btn btn-outline btn-sm rounded-xl gap-2 hover:btn-primary">
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </button>
                        <button onClick={() => handleShare("copy")} className="btn btn-outline btn-sm rounded-xl gap-2 hover:btn-primary">
                            <Link2 className="w-4 h-4" /> Copy Link
                        </button>
                    </div>
                </div>

                {/* Author card */}
                <div className="mt-10 bg-base-200/50 rounded-3xl p-6 border border-base-300/50 flex gap-4 items-center">
                    <img
                        src={blog.authorImage || `https://ui-avatars.com/api/?name=${blog.authorName}&background=6366f1&color=fff&size=80`}
                        alt={blog.authorName}
                        className="w-16 h-16 rounded-2xl flex-shrink-0"
                    />
                    <div>
                        <p className="font-semibold">{blog.authorName}</p>
                        <p className="text-sm text-base-content/60">Full Stack Developer · Next.js · PostgreSQL</p>
                        <Link href="/#contact" className="text-sm text-primary hover:underline mt-1 inline-block">Get in touch →</Link>
                    </div>
                </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
                <div className="bg-base-200/30 border-t border-base-300/50 py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="font-display text-2xl font-bold mb-8">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {related.map((b, i) => <BlogCard key={b.id} blog={b} index={i} />)}
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}