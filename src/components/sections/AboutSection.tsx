"use client";
import { motion } from "framer-motion";
import { Code2, Coffee, BookOpen, Zap } from "lucide-react";

interface AboutData { title: string; description: string; imageUrl?: string | null; }

const stats = [
  { icon: <Code2 />, value: "2+", label: "Years Experience" },
  { icon: <Zap />, value: "10+", label: "Projects Done" },
  { icon: <Coffee />, value: "∞", label: "Cups of Coffee" },
  { icon: <BookOpen />, value: "Always", label: "Learning" },
];

export default function AboutSection({ data }: { data: AboutData | null }) {
  const about = data || {
    title: "About Me",
    description: "Hello! I'm Sopon Islam, a passionate web developer with a love for turning ideas into interactive, user-friendly experiences.",
  };

  const paragraphs = about.description.split("\n\n").filter(Boolean);

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-mono text-sm mb-3">// WHO AM I</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">{about.title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Coder card side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-base-200/50 rounded-3xl p-6 border border-base-300/50 shadow-xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="ml-2 text-xs text-base-content/40 font-mono">~/about-me.js</span>
              </div>
              <div className="font-mono text-sm space-y-1">
                <p><span className="text-secondary">const</span> <span className="text-primary">developer</span> = {'{'}</p>
                <p className="pl-4"><span className="text-accent">name</span>: <span className="text-success">"Sopon Islam"</span>,</p>
                <p className="pl-4"><span className="text-accent">role</span>: <span className="text-success">"Full Stack Developer"</span>,</p>
                <p className="pl-4"><span className="text-accent">location</span>: <span className="text-success">"Bangladesh 🇧🇩"</span>,</p>
                <p className="pl-4"><span className="text-accent">stack</span>: [</p>
                <p className="pl-8"><span className="text-success">"Next.js"</span>, <span className="text-success">"TypeScript"</span>,</p>
                <p className="pl-8"><span className="text-success">"PostgreSQL"</span>, <span className="text-success">"Prisma"</span></p>
                <p className="pl-4">],</p>
                <p className="pl-4"><span className="text-accent">status</span>: <span className="text-success">"Available"</span>,</p>
                <p className="pl-4"><span className="text-accent">coffee</span>: <span className="text-warning">true</span></p>
                <p>{'}'}</p>
                <motion.p
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-primary mt-2"
                >▋</motion.p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i + 0.4 }}
                  className="bg-base-200/50 rounded-2xl p-4 border border-base-300/50 flex items-center gap-3 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="text-primary text-xl">{stat.icon}</div>
                  <div>
                    <p className="font-bold text-xl font-display">{stat.value}</p>
                    <p className="text-xs text-base-content/50">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i + 0.4 }}
                className="text-base-content/70 leading-relaxed text-lg"
              >
                {para}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-4 flex flex-wrap gap-3"
            >
              {["Problem Solver", "Team Player", "Fast Learner", "Open Source Enthusiast"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
