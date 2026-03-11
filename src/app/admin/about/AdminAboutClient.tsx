"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { motion } from "framer-motion";
import MotionDiv, { MotionForm } from "@/components/MotionDiv";
import { Save, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

export default function AdminAboutClient() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { register, handleSubmit, reset } = useForm<{ title: string; description: string; imageUrl?: string }>();

  useEffect(() => {
    fetch("/api/about").then(r => r.json()).then(data => { if (data) reset(data); setFetching(false); }).catch(() => setFetching(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/about", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast("About section updated! ✨", "success"); }
      else { toast("Failed to update", "error"); }
    } catch { toast("Something went wrong", "error"); }
    setLoading(false);
  };

  if (fetching) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1">
          <BookOpen className="w-7 h-7 text-primary" /> About Section
        </h1>
        <p className="text-base-content/60">Update your about me content</p>
      </MotionDiv>
      <MotionForm
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 rounded-2xl p-8 border border-base-300/50 shadow-sm space-y-6"
      >
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Section Title</span></label>
          <input {...register("title", { required: true })} placeholder="About Me" className="input input-bordered rounded-xl" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Description</span></label>
          <p className="text-xs text-base-content/50 mb-2">Use double newlines (Enter twice) to create paragraphs</p>
          <textarea {...register("description", { required: true })} rows={8} placeholder="Tell us about yourself..." className="textarea textarea-bordered rounded-xl resize-none" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Image URL (Optional)</span></label>
          <input {...register("imageUrl")} placeholder="https://example.com/image.jpg" className="input input-bordered rounded-xl" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-block rounded-xl">
          {loading ? <span className="loading loading-spinner loading-sm" /> : <Save className="w-4 h-4" />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </MotionForm>
    </div>
  );
}