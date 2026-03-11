"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, MessageSquare, Wrench, Users, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, skills: 0, users: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, messagesRes, skillsRes, usersRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/messages"),
          fetch("/api/skills"),
          fetch("/api/admin/users"),
        ]);
        const [projects, messages, skills, users] = await Promise.all([
          projectsRes.json(), messagesRes.json(), skillsRes.json(), usersRes.json(),
        ]);
        const projArr = Array.isArray(projects) ? projects : [];
        const msgArr = Array.isArray(messages) ? messages : [];
        const skillArr = Array.isArray(skills) ? skills : [];
        const userArr = Array.isArray(users) ? users : [];
        setStats({
          projects: projArr.length,
          messages: msgArr.length,
          skills: skillArr.length,
          users: userArr.length,
          unread: msgArr.filter((m: any) => !m.read).length,
        });
        setRecentMessages(msgArr.slice(0, 5));
      } catch { }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: <FolderOpen className="w-6 h-6" />, label: "Projects", value: stats.projects, href: "/admin/projects", color: "text-primary", bg: "bg-primary/10" },
    { icon: <MessageSquare className="w-6 h-6" />, label: "Messages", value: stats.messages, badge: stats.unread > 0 ? stats.unread : null, href: "/admin/messages", color: "text-secondary", bg: "bg-secondary/10" },
    { icon: <Wrench className="w-6 h-6" />, label: "Skills", value: stats.skills, href: "/admin/skills", color: "text-accent", bg: "bg-accent/10" },
    { icon: <Users className="w-6 h-6" />, label: "Users", value: stats.users, href: "/admin/users", color: "text-success", bg: "bg-success/10" },
  ];

  const quickLinks = [
    { href: "/admin/hero", label: "Edit Hero Section", desc: "Update banner & intro" },
    { href: "/admin/about", label: "Edit About Section", desc: "Update your bio" },
    { href: "/admin/skills", label: "Manage Skills", desc: "Add/remove technologies" },
    { href: "/admin/projects", label: "Manage Projects", desc: "Showcase your work" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-base-content/60">Welcome back! Here's an overview of your portfolio.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href} className="block bg-base-100 rounded-2xl p-5 border border-base-300/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  {card.icon}
                </div>
                {card.badge && (
                  <span className="badge badge-error badge-sm">{card.badge} new</span>
                )}
              </div>
              <p className="text-3xl font-bold font-display mb-1">
                {loading ? <span className="loading loading-dots loading-sm" /> : card.value}
              </p>
              <p className="text-sm text-base-content/60 group-hover:text-primary transition-colors">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base-100 rounded-2xl p-6 border border-base-300/50"
        >
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Quick Actions
          </h2>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200 transition-colors group border border-transparent hover:border-base-300"
              >
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{link.label}</p>
                  <p className="text-xs text-base-content/50">{link.desc}</p>
                </div>
                <span className="text-base-content/30 group-hover:text-primary transition-colors">→</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-base-100 rounded-2xl p-6 border border-base-300/50"
        >
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" /> Recent Messages
          </h2>
          {loading ? (
            <div className="flex justify-center py-8"><span className="loading loading-spinner text-primary" /></div>
          ) : recentMessages.length === 0 ? (
            <div className="text-center py-8 text-base-content/40">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={`p-3 rounded-xl border ${!msg.read ? "border-primary/20 bg-primary/5" : "border-base-300/50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{msg.name}</p>
                      <p className="text-xs text-base-content/50 truncate">{msg.subject}</p>
                    </div>
                    {!msg.read && <span className="badge badge-primary badge-xs flex-shrink-0">new</span>}
                  </div>
                </div>
              ))}
              <Link href="/admin/messages" className="btn btn-ghost btn-sm w-full rounded-xl text-primary">
                View all messages →
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
