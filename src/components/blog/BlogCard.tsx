"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Eye, Calendar, Tag, ArrowRight, Star } from "lucide-react";

interface BlogCardProps {
    blog: {
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        imageUrl?: string | null;
        tags: string[];
        category: string;
        featured: boolean;
        views: number;
        readTime: number;
        publishedAt?: string | null;
        createdAt: string;
    };
    index?: number;
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
    const date = blog.publishedAt || blog.createdAt;

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            className="group bg-base-100 rounded-3xl overflow-hidden border border-base-300/50 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/10 flex flex-col"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex-shrink-0">
                {blog.imageUrl ? (
                    <motion.img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl opacity-20">📝</div>
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-100/60 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span className="badge badge-primary badge-sm shadow-lg">{blog.category}</span>
                    {blog.featured && (
                        <span className="badge badge-warning badge-sm gap-1 shadow-lg">
                            <Star className="w-2.5 h-2.5 fill-current" /> Featured
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-base-content/50 mb-3 font-mono flex-wrap">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views.toLocaleString()}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-base-content/60 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {blog.excerpt}
                </p>

                {/* Tags */}
                {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-lg bg-base-200 text-base-content/60 border border-base-300/50 flex items-center gap-1"
                            >
                                <Tag className="w-2.5 h-2.5" /> {tag}
                            </span>
                        ))}
                        {blog.tags.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded-lg bg-base-200 text-base-content/40">
                                +{blog.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* CTA */}
                <Link
                    href={`/blogs/${blog.slug}`}
                    className="btn btn-sm btn-outline border-primary/30 hover:btn-primary rounded-xl gap-2 group/btn w-full mt-auto"
                >
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
            </div>
        </motion.article>
    );
}