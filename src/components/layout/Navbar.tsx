"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Code2 } from "lucide-react";
import Link from "next/link";
// import { useSession, signOut } from "@/lib/auth-client";
// pathname based active for non-scroll routes
import { usePathname } from "next/navigation";
import NavbarAuth from "./NavbarAuth";
import NavbarMobileAuth from "./NavbarMobileAuth";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  // const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home", "about", "skills", "projects", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (link: { href: string }) => {
    if (link.href.startsWith("/")) {
      return pathname.startsWith(link.href);
    }
    return activeSection === link.href.slice(1);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-base-100/80 backdrop-blur-xl border-b border-base-300/50 shadow-lg"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">
              <span className="gradient-text">Sopon</span>
              <span className="text-base-content/60">.dev</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive(link)
                  ? "text-primary"
                  : "text-base-content/70 hover:text-base-content"
                  }`}
              >
                {isActive(link) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            {/* {session?.user ? (
              <div className="dropdown dropdown-end hidden md:block">
                <div tabIndex={0} className="avatar cursor-pointer">
                  <div className="w-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=6366f1&color=fff`} alt={session.user.name || ""} />
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-2xl border border-base-300 shadow-2xl w-52 p-2 mt-3">
                  <li className="px-3 py-2 opacity-60 text-xs font-mono">{session.user.email}</li>
                  {(session.user as any).role === "admin" && (
                    <li><Link href="/admin">Admin Dashboard</Link></li>
                  )}
                  <li><button onClick={() => signOut()}>Sign Out</button></li>
                </ul>
              </div>
            ) : (
              <Link href="/auth/login" className="btn btn-primary btn-sm rounded-xl hidden md:flex gap-2">
                Sign In
              </Link>
            )} */}
            <NavbarAuth></NavbarAuth>

            {/* Mobile Menu */}
            <button
              className="btn btn-ghost btn-circle btn-sm md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-base-100/95 backdrop-blur-xl border-b border-base-300"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all ${isActive(link)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-base-200"
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {/* {session?.user ? (
                <>
                  {(session.user as any).role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn btn-outline btn-sm rounded-xl">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="btn btn-ghost btn-sm rounded-xl">Sign Out</button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm rounded-xl">
                  Sign In
                </Link>
              )} */}

              <NavbarMobileAuth onClose={() => setMobileOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
