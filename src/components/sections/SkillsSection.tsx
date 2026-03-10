"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface Skill { id: string; title: string; iconUrl?: string | null; level: string; category: string; }

const levelColor: Record<string, string> = {
  Advanced: "badge-success",
  Intermediate: "badge-warning",
  Beginner: "badge-info",
};

const categoryGroups = ["Development", "Backend", "Database", "State Management", "DevOps", "Styling", "Backend as a Service", "Markup", "Authentication"];

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const grouped = categoryGroups.reduce((acc, cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    if (catSkills.length > 0) acc[cat] = catSkills;
    // Catch-all for uncategorized
    return acc;
  }, {} as Record<string, Skill[]>);

  // Any skills not in known categories
  const otherSkills = skills.filter((s) => !categoryGroups.includes(s.category));
  if (otherSkills.length > 0) grouped["Other"] = otherSkills;

  return (
    <section id="skills" className="section-padding bg-base-200/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-mono text-sm mb-3">// MY EXPERTISE</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">Skills & Technologies</h2>
          <p className="text-base-content/60 max-w-lg mx-auto">Technologies I've been working with recently</p>
        </motion.div>

        {/* All skills grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.8), duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="group relative bg-base-100 rounded-2xl p-4 border border-base-300/50 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 cursor-pointer card-hover"
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 shimmer transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  {skill.iconUrl ? (
                    <img
                      src={skill.iconUrl}
                      alt={skill.title}
                      className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${skill.title.charAt(0)}&background=6366f1&color=fff&size=40`;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {skill.title.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-center leading-tight">{skill.title}</h3>
                <span className={`badge badge-xs ${levelColor[skill.level] || "badge-ghost"}`}>
                  {skill.level}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category legend */}
        {Object.keys(grouped).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap gap-3 justify-center"
          >
            {Object.keys(grouped).map((cat) => (
              <div key={cat} className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 border border-base-300/50 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-base-content/70">{cat}</span>
                <span className="badge badge-xs badge-primary">{grouped[cat].length}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
