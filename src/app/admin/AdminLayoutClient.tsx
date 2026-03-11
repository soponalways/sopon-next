"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut } from "@/lib/auth-client";
import {
    LayoutDashboard,
    User,
    Wrench,
    FolderOpen,
    MessageSquare,
    Users,
    LogOut,
    Menu,
    Code2,
    ExternalLink,
    TrendingUp,
    Shield,
    Rss,
} from "lucide-react";

const navItems = [
    { href: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { href: "/admin/hero", icon: <User className="w-5 h-5" />, label: "Hero Section" },
    { href: "/admin/about", icon: <User className="w-5 h-5" />, label: "About Section" },
    { href: "/admin/skills", icon: <Wrench className="w-5 h-5" />, label: "Skills" },
    { href: "/admin/projects", icon: <FolderOpen className="w-5 h-5" />, label: "Projects" },
    { href: "/admin/messages", icon: <MessageSquare className="w-5 h-5" />, label: "Messages" },
    { href: "/admin/users", icon: <Users className="w-5 h-5" />, label: "Users" },
    { href: "/admin/blogs", icon: <Rss className="w-5 h-5" />, label: "Blog Posts" },
    { href: "/admin/analytics", icon: <TrendingUp className="w-5 h-5" />, label: "Analytics" },
    { href: "/admin/sessions", icon: <Shield className="w-5 h-5" />, label: "Sessions" },
];

export default function AdminLayoutClient({
    children,
    session,
}: {
    children: React.ReactNode;
    session: any;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);


    if (!session?.user || (session.user as any).role !== "admin") return null;
    return (
        // <div className="min-h-screen bg-base-200 flex">
        //     {/* Sidebar */}
        //     <aside
        //         className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-300 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        //             }`}
        //     >
        //         <div className="p-6 border-b border-base-300">
        //             <Link href="/" className="flex items-center gap-2">
        //                 <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
        //                     <Code2 className="w-5 h-5 text-white" />
        //                 </div>
        //                 <div>
        //                     <p className="font-bold text-sm">Sopon.dev</p>
        //                     <p className="text-xs text-base-content/50">Admin Panel</p>
        //                 </div>
        //             </Link>
        //         </div>

        //         <nav className="p-4 space-y-1">
        //             {navItems.map((item) => (
        //                 <Link
        //                     key={item.href}
        //                     href={item.href}
        //                     onClick={() => setSidebarOpen(false)}
        //                     className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${pathname === item.href
        //                         ? "bg-primary/10 text-primary"
        //                         : "hover:bg-base-200"
        //                         }`}
        //                 >
        //                     {item.icon}
        //                     {item.label}

        //                     {pathname === item.href && (
        //                         <motion.div
        //                             layoutId="admin-nav"
        //                             className="absolute right-4 w-1 h-6 bg-primary rounded-full"
        //                         />
        //                     )}
        //                 </Link>
        //             ))}
        //         </nav>

        //         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
        //             <div className="flex items-center gap-3 mb-3">
        //                 <img
        //                     className="w-9 h-9 rounded-full"
        //                     src={
        //                         session.user.image ||
        //                         `https://ui-avatars.com/api/?name=${session.user.name}`
        //                     }
        //                 />

        //                 <div className="flex-1 min-w-0">
        //                     <p className="text-sm font-semibold truncate">
        //                         {session.user.name}
        //                     </p>
        //                     <p className="text-xs text-base-content/50">Admin</p>
        //                 </div>
        //             </div>

        //             <div className="flex gap-2">
        //                 <Link
        //                     href="/"
        //                     target="_blank"
        //                     className="btn btn-ghost btn-xs flex-1 gap-1"
        //                 >
        //                     <ExternalLink className="w-3 h-3" />
        //                     View
        //                 </Link>

        //                 <button
        //                     onClick={() => signOut()}
        //                     className="btn btn-error btn-xs gap-1"
        //                 >
        //                     <LogOut className="w-3 h-3" />
        //                     Out
        //                 </button>
        //             </div>
        //         </div>
        //     </aside>

        //     {/* Main */}
        //     <div className="flex-1 flex flex-col">
        //         <header className="bg-base-100 border-b px-6 py-4 flex items-center justify-between lg:justify-end">
        //             <button
        //                 className="btn btn-ghost btn-sm lg:hidden"
        //                 onClick={() => setSidebarOpen(true)}
        //             >
        //                 <Menu className="w-5 h-5" />
        //             </button>
        //         </header>

        //         <main className="flex-1 p-6">{children}</main>
        //     </div>
        // </div>
        <div className="min-h-screen bg-base-200 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-300/50 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 border-b border-base-300/50">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-display font-bold text-sm gradient-text">Sopon.dev</p>
                            <p className="text-xs text-base-content/50 font-mono">Admin Panel</p>
                        </div>
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${pathname === item.href
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                            {pathname === item.href && (
                                <motion.div layoutId="admin-nav" className="absolute right-4 w-1 h-6 bg-primary rounded-full" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300/50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="avatar">
                            <div className="w-9 rounded-full">
                                <img src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=6366f1&color=fff`} alt={session.user.name || ""} />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{session.user.name}</p>
                            <p className="text-xs text-base-content/50 truncate font-mono">Admin</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/" target="_blank" className="btn btn-ghost btn-xs flex-1 gap-1 rounded-lg">
                            <ExternalLink className="w-3 h-3" /> View Site
                        </Link>
                        <button onClick={() => signOut()} className="btn btn-error btn-xs gap-1 rounded-lg">
                            <LogOut className="w-3 h-3" /> Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="bg-base-100 border-b border-base-300/50 px-6 py-4 flex items-center justify-between lg:justify-end sticky top-0 z-30 backdrop-blur-xl">
                    <button className="btn btn-ghost btn-sm btn-circle lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-base-content/60">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="font-mono">System Online</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}