"use client";
import { motion } from "framer-motion";
import { FaFacebook, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Code2, Heart } from "lucide-react";
import Link from "next/link";

const socials = [
  { icon: <FaGithub />, href: "https://github.com/soponalways", label: "GitHub" },
  { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/sopon-islam1", label: "LinkedIn" },
  { icon: <FaXTwitter />, href: "https://x.com/soponalways", label: "Twitter" },
  { icon: <FaFacebook />, href: "https://www.facebook.com/soponalways", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300/50 bg-base-200/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="gradient-text">Sopon</span>.dev
              </span>
            </div>
            <p className="text-base-content/60 text-sm leading-relaxed">
              Full Stack Developer passionate about creating beautiful, performant web applications.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-base-content/80">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {["Home", "About", "Skills", "Projects", "Contact"].map((link) => (
                <Link key={link} href={`#${link.toLowerCase()}`} className="text-sm text-base-content/60 hover:text-primary transition-colors w-fit">
                  {link}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-base-content/80">Connect</h3>
            <div className="flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/60 hover:text-primary hover:border-primary/50 transition-all duration-300"
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-base-300/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-base-content/50 flex items-center gap-1">
            © {new Date().getFullYear()} Sopon Islam. Made with <Heart className="w-4 h-4 text-error fill-error" /> in Bangladesh
          </p>
          <p className="text-xs text-base-content/40 font-mono">v2.0.0 — Next.js + PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}
