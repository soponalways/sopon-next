"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Plus, Trash2, Edit, Save, X, ExternalLink, Star } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

interface Project { id: string; name: string; description: string; imageUrl?: string; liveLink?: string; githubLink?: string; techStack: string[]; featured: boolean; order: number; }

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techList, setTechList] = useState<string[]>([]);

  const { register, handleSubmit, reset, setValue } = useForm<any>();

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const startAdd = () => { reset(); setTechList([]); setEditingId(null); setShowAdd(true); };
  const startEdit = (p: Project) => {
    reset({ name: p.name, description: p.description, imageUrl: p.imageUrl, liveLink: p.liveLink, githubLink: p.githubLink, featured: p.featured, challenges: (p as any).challenges, improvements: (p as any).improvements });
    setTechList(p.techStack || []);
    setEditingId(p.id);
    setShowAdd(true);
  };

  const onSave = async (data: any) => {
    setSaving(true);
    try {
      const payload = { ...data, techStack: techList, featured: !!data.featured, order: editingId ? undefined : projects.length + 1 };
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast(editingId ? "Project updated! ✨" : "Project added! ✨", "success");
        reset(); setTechList([]); setShowAdd(false); setEditingId(null); fetchProjects();
      } else { toast("Failed to save project", "error"); }
    } catch { toast("Something went wrong", "error"); }
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) { toast("Project deleted", "success"); fetchProjects(); }
    else { toast("Failed to delete", "error"); }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !techList.includes(t)) { setTechList([...techList, t]); setTechInput(""); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1"><FolderOpen className="w-7 h-7 text-primary" /> Projects</h1>
          <p className="text-base-content/60">Manage your portfolio projects</p>
        </div>
        <button onClick={showAdd ? () => { setShowAdd(false); setEditingId(null); } : startAdd} className={`btn rounded-xl gap-2 ${showAdd ? "btn-ghost border border-base-300" : "btn-primary"}`}>
          {showAdd ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Project</>}
        </button>
      </motion.div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSave)}
            className="bg-base-100 rounded-2xl p-6 border border-primary/20 shadow-sm overflow-hidden"
          >
            <h3 className="font-bold mb-4">{editingId ? "Edit Project" : "Add New Project"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Project Name *</span></label>
                <input {...register("name", { required: true })} className="input input-bordered input-sm rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Image URL</span></label>
                <input {...register("imageUrl")} placeholder="https://..." className="input input-bordered input-sm rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Live Link</span></label>
                <input {...register("liveLink")} placeholder="https://..." className="input input-bordered input-sm rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">GitHub Link</span></label>
                <input {...register("githubLink")} placeholder="https://github.com/..." className="input input-bordered input-sm rounded-xl" />
              </div>
            </div>
            <div className="form-control mb-4">
              <label className="label"><span className="label-text text-sm">Description *</span></label>
              <textarea {...register("description", { required: true })} rows={3} className="textarea textarea-bordered rounded-xl resize-none text-sm" />
            </div>
            <div className="form-control mb-4">
              <label className="label"><span className="label-text text-sm">Tech Stack</span></label>
              <div className="flex gap-2">
                <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                  placeholder="React, Node.js..." className="input input-bordered input-sm rounded-xl flex-1" />
                <button type="button" onClick={addTech} className="btn btn-sm btn-outline rounded-xl"><Plus className="w-3 h-3" /></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {techList.map(t => (
                  <span key={t} className="badge badge-primary gap-1 cursor-pointer" onClick={() => setTechList(techList.filter(x => x !== t))}>
                    {t} <X className="w-2 h-2" />
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="label cursor-pointer gap-3">
                <span className="label-text text-sm">Featured Project</span>
                <input type="checkbox" {...register("featured")} className="checkbox checkbox-primary checkbox-sm" />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Challenges</span></label>
                <textarea {...register("challenges")} rows={2} className="textarea textarea-bordered rounded-xl resize-none text-sm" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Improvements</span></label>
                <textarea {...register("improvements")} rows={2} className="textarea textarea-bordered rounded-xl resize-none text-sm" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary btn-sm rounded-xl gap-2">
              {saving ? <span className="loading loading-spinner loading-xs" /> : <Save className="w-4 h-4" />}
              {editingId ? "Update Project" : "Add Project"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-base-100 rounded-2xl p-5 border border-base-300/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt={project.name} className="w-20 h-14 object-cover rounded-xl flex-shrink-0 hidden sm:block" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{project.name}</h3>
                      {project.featured && <Star className="w-4 h-4 text-warning fill-warning flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-base-content/60 line-clamp-2 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack?.slice(0, 4).map(t => (
                        <span key={t} className="badge badge-xs badge-outline">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" className="btn btn-ghost btn-xs"><ExternalLink className="w-3 h-3" /></a>
                  )}
                  <button onClick={() => startEdit(project)} className="btn btn-ghost btn-xs text-primary"><Edit className="w-3 h-3" /></button>
                  <button onClick={() => onDelete(project.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-20 text-base-content/40">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No projects yet. Add your first project!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
