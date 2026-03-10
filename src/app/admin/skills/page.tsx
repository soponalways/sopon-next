"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

interface Skill { id: string; title: string; iconUrl?: string; level: string; category: string; order: number; }

const levels = ["Advanced", "Intermediate", "Beginner"];
const categories = ["Development", "Backend", "Database", "State Management", "DevOps", "Styling", "Backend as a Service", "Markup", "Authentication", "Other"];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<Omit<Skill, "id">>();

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const onAdd = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, order: skills.length + 1 }) });
      if (res.ok) { toast("Skill added! ✨", "success"); reset(); setShowAdd(false); fetchSkills(); }
      else { toast("Failed to add skill", "error"); }
    } catch { toast("Something went wrong", "error"); }
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) { toast("Skill deleted", "success"); fetchSkills(); }
    else { toast("Failed to delete", "error"); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1"><Wrench className="w-7 h-7 text-primary" /> Skills</h1>
          <p className="text-base-content/60">Manage your technical skills & technologies</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary rounded-xl gap-2">
          {showAdd ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Skill</>}
        </button>
      </motion.div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onAdd)}
            className="bg-base-100 rounded-2xl p-6 border border-primary/20 shadow-sm overflow-hidden"
          >
            <h3 className="font-bold mb-4">Add New Skill</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Skill Name *</span></label>
                <input {...register("title", { required: true })} placeholder="React.js" className="input input-bordered input-sm rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Icon URL</span></label>
                <input {...register("iconUrl")} placeholder="https://..." className="input input-bordered input-sm rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Level *</span></label>
                <select {...register("level", { required: true })} className="select select-bordered select-sm rounded-xl">
                  {levels.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-control sm:col-span-2">
                <label className="label"><span className="label-text text-sm">Category *</span></label>
                <select {...register("category", { required: true })} className="select select-bordered select-sm rounded-xl">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary btn-sm rounded-xl gap-2">
              {saving ? <span className="loading loading-spinner loading-xs" /> : <Save className="w-4 h-4" />}
              Add Skill
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-base-100 rounded-2xl p-4 border border-base-300/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                {skill.iconUrl ? (
                  <img src={skill.iconUrl} alt={skill.title} className="w-10 h-10 object-contain rounded-xl"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${skill.title.charAt(0)}&background=6366f1&color=fff&size=40`; }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{skill.title.charAt(0)}</div>
                )}
                <div>
                  <p className="font-semibold text-sm">{skill.title}</p>
                  <p className="text-xs text-base-content/50">{skill.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`badge badge-xs ${skill.level === "Advanced" ? "badge-success" : skill.level === "Intermediate" ? "badge-warning" : "badge-info"}`}>
                  {skill.level}
                </span>
                <button onClick={() => onDelete(skill.id)} className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
