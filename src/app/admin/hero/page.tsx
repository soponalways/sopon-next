"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Save, User } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const schema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().min(2),
  description: z.string().min(10),
  imageUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch("/api/hero").then(r => r.json()).then(data => {
      if (data) reset(data);
      setFetching(false);
    }).catch(() => setFetching(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast("Hero section updated! ✨", "success"); }
      else { toast("Failed to update", "error"); }
    } catch { toast("Something went wrong", "error"); }
    setLoading(false);
  };

  if (fetching) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1">
          <User className="w-7 h-7 text-primary" /> Hero Section
        </h1>
        <p className="text-base-content/60">Manage your landing page hero content</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 rounded-2xl p-8 border border-base-300/50 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Full Name</span></label>
            <input {...register("name")} className={`input input-bordered rounded-xl ${errors.name ? "input-error" : ""}`} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Title</span></label>
            <input {...register("title")} placeholder="Full Stack Developer" className="input input-bordered rounded-xl" />
          </div>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Subtitle</span></label>
          <input {...register("subtitle")} placeholder="MERN Stack | Next.js" className="input input-bordered rounded-xl" />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Description</span></label>
          <textarea {...register("description")} rows={3} className="textarea textarea-bordered rounded-xl resize-none" />
        </div>

        <div className="divider text-sm opacity-50">Images & Links</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Profile Image URL</span></label>
            <input {...register("imageUrl")} placeholder="https://..." className="input input-bordered rounded-xl" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Resume URL</span></label>
            <input {...register("resumeUrl")} placeholder="https://drive.google.com/..." className="input input-bordered rounded-xl" />
          </div>
        </div>

        <div className="divider text-sm opacity-50">Social Links</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { name: "githubUrl" as const, label: "GitHub URL" },
            { name: "linkedinUrl" as const, label: "LinkedIn URL" },
            { name: "twitterUrl" as const, label: "Twitter/X URL" },
            { name: "facebookUrl" as const, label: "Facebook URL" },
          ].map((field) => (
            <div key={field.name} className="form-control">
              <label className="label"><span className="label-text font-medium">{field.label}</span></label>
              <input {...register(field.name)} placeholder="https://..." className="input input-bordered rounded-xl" />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full rounded-xl gap-2 shadow-lg">
          {loading ? <><span className="loading loading-spinner loading-sm" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </motion.form>
    </div>
  );
}
