"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaFacebook, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Download, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string | null;
  resumeUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export default function HeroSection({ data }: { data: any | null }) {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: i * 0.2,
      }))
    );
  }, []);

  const hero = data || {
    name: "Sopon Islam",
    title: "Full Stack Developer",
    subtitle: "MERN Stack | Next.js | PostgreSQL",
    description: "Passionate about creating beautiful, functional web applications.",
    imageUrl: null,
    resumeUrl: "https://drive.google.com/file/d/1SLb3Nnu5ED48lIZB3m3eMNPo5WZxe82k/view",
    facebookUrl: "https://www.facebook.com/soponalways",
    twitterUrl: "https://x.com/soponalways",
    linkedinUrl: "https://www.linkedin.com/in/sopon-islam1",
    githubUrl: "https://github.com/soponalways",
  };

  const socials = [
    { icon: <FaGithub />, href: hero.githubUrl, label: "GitHub" },
    { icon: <FaLinkedin />, href: hero.linkedinUrl, label: "LinkedIn" },
    { icon: <FaXTwitter />, href: hero.twitterUrl, label: "Twitter" },
    { icon: <FaFacebook />, href: hero.facebookUrl, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden animated-gradient">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/30"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -40, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + p.delay, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-28">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Available for freelance work
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight"
            >
              Hi 👋, I'm{" "}
              <span className="gradient-text">{hero.name}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl sm:text-3xl font-bold text-base-content/80 mb-6 min-h-[2.5rem]"
            >
              <TypeAnimation
                sequence={[
                  "MERN Stack Developer", 1500,
                  "Frontend Developer", 1500,
                  "Full Stack Developer", 1500,
                  "Next.js Specialist", 1500,
                ]}
                speed={50}
                repeat={Infinity}
                wrapper="span"
                className="text-primary"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base-content/60 text-lg leading-relaxed mb-8 max-w-lg"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link href={hero.resumeUrl || "#"} target="_blank"
                className="btn btn-primary rounded-2xl px-8 gap-2 shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download CV
              </Link>
              <Link href="#contact"
                className="btn btn-outline rounded-2xl px-8 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                Let's Talk
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-3"
            >
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 rounded-2xl bg-base-100/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-xl text-white/70 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right - Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              {/* Rotating rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin" style={{ animationDuration: "20s", margin: "-20px" }} />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-secondary/20 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse", margin: "-40px" }} />

              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl scale-110" />

              {/* Image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden ring-4 ring-primary/50 ring-offset-4 ring-offset-transparent shadow-2xl">
                <img
                  src={hero.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(hero.name)}&size=400&background=6366f1&color=fff&bold=true&font-size=0.35`}
                  alt={hero.name}
                  className="w-full h-full object-cover hover-3d hover:scale-150 absolute hover:-top-5 z-auto transition-transform ease-in-out duration-700 hover:animate-float "
                />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-base-100/80 backdrop-blur-md border border-base-300/50 px-4 py-2 rounded-2xl shadow-xl"
              >
                <p className="text-xs text-base-content/60 font-mono">Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-semibold">Open to work</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 -right-4 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-2xl shadow-xl"
              >
                <p className="text-xs text-primary/70 font-mono">Experience</p>
                <p className="text-sm font-bold text-primary">2+ Years</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-base-content/40"
      >
        <span className="text-xs font-mono">Scroll down</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}
