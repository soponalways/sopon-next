"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Save, Eye, X, Plus } from "lucide-react";
import { toast } from "@/components/ui/Toaster";
import ImageUploader from "./ImageUploader";

const schema = z.object({
    title: z.string().min(5, "Title must be at least 5 chars"),
    excerpt: z.string().min(20, "Excerpt must be at least 20 chars").max(300, "Max 300 chars"),
    content: z.string().min(50, "Content must be at least 50 chars"),
    category: z.string().min(1, "Category required"),
    status: z.enum(["draft", "published"]),
    featured: z.boolean().optional(),
    authorName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const CATEGORIES = ["General", "Tutorial", "React", "Next.js", "Node.js", "Database", "DevOps", "TypeScript", "Career", "Open Source"];

interface BlogFormProps {
    initialData?: any;
    mode: "create" | "edit";
}

export default function BlogForm({ initialData, mode }: BlogFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [preview, setPreview] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialData?.title || "",
            excerpt: initialData?.excerpt || "",
            content: initialData?.content || "",
            category: initialData?.category || "General",
            status: initialData?.status || "draft",
            featured: initialData?.featured || false,
            authorName: initialData?.authorName || "Sopon Islam",
        },
    });

    const content = watch("content");
    const title = watch("title");

    const addTag = () => {
        const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
        if (t && !tags.includes(t) && tags.length < 8) {
            setTags([...tags, t]);
            setTagInput("");
        }
    };

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            const payload = { ...data, imageUrl: imageUrl || null, tags };
            let res: Response;

            if (mode === "create") {
                res = await fetch("/api/blogs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            } else {
                res = await fetch(`/api/blogs/${initialData.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            }

            if (res.ok) {
                toast(mode === "create" ? "Blog created! 🎉" : "Blog updated! ✨", "success");
                router.push("/admin/blogs");
            } else {
                const err = await res.json();
                toast(err.error || "Failed to save", "error");
            }
        } catch { toast("Something went wrong", "error"); }
        setSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-1">
                        {mode === "create" ? "Write New Post" : "Edit Post"}
                    </h1>
                    <p className="text-base-content/60 text-sm">
                        {mode === "create" ? "Share your knowledge with the world" : "Update your article"}
                    </p>
                </div>
                <button type="button" onClick={() => setPreview(!preview)}
                    className={`btn btn-sm rounded-xl gap-2 ${preview ? "btn-primary" : "btn-ghost border border-base-300"}`}>
                    <Eye className="w-4 h-4" />
                    {preview ? "Edit Mode" : "Preview"}
                </button>
            </motion.div>

            {preview ? (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-base-100 rounded-3xl p-8 border border-base-300/50 prose prose-lg max-w-none dark:prose-invert"
                >
                    {imageUrl && <img src={imageUrl} alt={title} className="w-full h-64 object-cover rounded-2xl mb-6" />}
                    <h1 className="font-display">{title || "Your Title"}</h1>
                    <div dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, "<br/>") || "" }} />
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main content - 2/3 */}
                        <div className="lg:col-span-2 space-y-5 bg-base-100 rounded-2xl p-6 border border-base-300/50">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Title *</span></label>
                                <input {...register("title")} placeholder="An amazing title that grabs attention..."
                                    className={`input input-bordered rounded-xl text-lg font-display ${errors.title ? "input-error" : ""}`} />
                                {errors.title && <span className="label-text-alt text-error mt-1">{errors.title.message}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Excerpt *</span>
                                    <span className="label-text-alt text-base-content/40">{watch("excerpt")?.length || 0}/300</span>
                                </label>
                                <textarea {...register("excerpt")} rows={2} placeholder="A brief summary shown in blog cards..."
                                    className={`textarea textarea-bordered rounded-xl resize-none ${errors.excerpt ? "textarea-error" : ""}`} />
                                {errors.excerpt && <span className="label-text-alt text-error mt-1">{errors.excerpt.message}</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Content *</span>
                                    <span className="label-text-alt text-base-content/40 font-mono">{content ? Math.max(1, Math.ceil(content.split(/\s+/).length / 200)) : 0} min read</span>
                                </label>
                                <p className="text-xs text-base-content/40 mb-2">Supports basic HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;code&gt;, &lt;pre&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;a&gt;, &lt;blockquote&gt;</p>
                                <textarea {...register("content")} rows={20}
                                    placeholder={`Start writing your article...\n\nYou can use HTML tags:\n<h2>Section Title</h2>\n<p>Your paragraph...</p>\n<code>inline code</code>\n<pre>code block</pre>`}
                                    className={`textarea textarea-bordered rounded-xl resize-y font-mono text-sm ${errors.content ? "textarea-error" : ""}`} />
                                {errors.content && <span className="label-text-alt text-error mt-1">{errors.content.message}</span>}
                            </div>
                        </div>

                        {/* Sidebar - 1/3 */}
                        <div className="space-y-5">
                            {/* Publish settings */}
                            <div className="bg-base-100 rounded-2xl p-5 border border-base-300/50 space-y-4">
                                <h3 className="font-semibold text-sm">Publish Settings</h3>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-sm">Status</span></label>
                                    <select {...register("status")} className="select select-bordered select-sm rounded-xl">
                                        <option value="draft">📝 Draft</option>
                                        <option value="published">🌍 Published</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-sm">Category *</span></label>
                                    <select {...register("category")} className="select select-bordered select-sm rounded-xl">
                                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text text-sm">Author Name</span></label>
                                    <input {...register("authorName")} className="input input-bordered input-sm rounded-xl" />
                                </div>
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" {...register("featured")} className="checkbox checkbox-warning checkbox-sm" />
                                    <span className="label-text text-sm">⭐ Mark as Featured</span>
                                </label>
                            </div>

                            {/* Cover image */}
                            <div className="bg-base-100 rounded-2xl p-5 border border-base-300/50">
                                <h3 className="font-semibold text-sm mb-3">Cover Image (Optional)</h3>
                                <ImageUploader
                                    value={imageUrl}
                                    onChange={(url) => setImageUrl(url)}
                                    onClear={() => setImageUrl("")}
                                />
                            </div>

                            {/* Tags */}
                            <div className="bg-base-100 rounded-2xl p-5 border border-base-300/50">
                                <h3 className="font-semibold text-sm mb-3">Tags <span className="text-base-content/40 font-normal">({tags.length}/8)</span></h3>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                                        placeholder="nextjs, react..."
                                        className="input input-bordered input-xs rounded-xl flex-1"
                                    />
                                    <button type="button" onClick={addTag} className="btn btn-primary btn-xs rounded-xl">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {tags.map((tag) => (
                                        <span key={tag} onClick={() => setTags(tags.filter((t) => t !== tag))}
                                            className="badge badge-primary badge-sm cursor-pointer hover:badge-error transition-colors gap-1">
                                            {tag} <X className="w-2.5 h-2.5" />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Save buttons */}
                            <div className="flex flex-col gap-3">
                                <button type="submit" disabled={saving} className="btn btn-primary rounded-xl gap-2 shadow-lg hover:shadow-primary/30">
                                    {saving ? <><span className="loading loading-spinner loading-sm" /> Saving...</> : <><Save className="w-4 h-4" /> {mode === "create" ? "Create Post" : "Update Post"}</>}
                                </button>
                                <button type="button" onClick={() => router.push("/admin/blogs")} className="btn btn-ghost border border-base-300 rounded-xl">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}