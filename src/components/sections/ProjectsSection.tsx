"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import { useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  liveLink?: string | null;
  githubLink?: string | null;
  techStack: string[];
  featured: boolean;
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/5 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block text-primary font-mono text-sm mb-3">// MY WORK</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">Featured Projects</h2>
          <p className="text-base-content/60 max-w-lg mx-auto mb-8">Some things I've built that I'm proud of</p>

          <div className="flex justify-center gap-3">
            {["all", "featured"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "all" | "featured")}
                className={`btn btn-sm rounded-xl capitalize ${filter === f ? "btn-primary" : "btn-ghost border border-base-300"}`}
              >
                {f === "featured" && <Star className="w-3 h-3" />}
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.1 }}
                onHoverStart={() => setHovered(project.id)}
                onHoverEnd={() => setHovered(null)}
                className="group relative bg-base-100 rounded-3xl overflow-hidden border border-base-300/50 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={project.imageUrl || `https://placehold.co/600x400/6366f1/ffffff?text=${encodeURIComponent(project.name)}`}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    animate={{ scale: hovered === project.id ? 1.1 : 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/20 to-transparent" />

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 badge badge-primary gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="text-base-content/60 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-mono">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-base-200 text-base-content/50">
                        +{project.techStack.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                        className="btn btn-primary btn-sm flex-1 rounded-xl gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm border border-base-300 hover:border-primary/50 rounded-xl gap-2"
                      >
                        <Github className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-base-content/40">
            <p className="text-6xl mb-4">🚀</p>
            <p className="text-lg">Projects coming soon...</p>
          </div>
        )}
      </div>
    </section>
  );
}
