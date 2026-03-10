"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Monitor, Smartphone, Tablet, MapPin, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getDeviceIcon } from "@/lib/device-parser";

interface SessionData {
    id: string;
    createdAt: string;
    expiresAt: string;
    ipAddress?: string;
    device: string;
    browser: string;
    os: string;
    isCurrentSession: boolean;
    user: { id: string; name: string; email: string; image?: string; role: string };
}

const DeviceIcon = ({ device }: { device: string }) => {
    if (device === "mobile") return <Smartphone className="w-4 h-4" />;
    if (device === "tablet") return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
};

export default function SessionsPage() {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/sessions")
            .then((r) => r.json())
            .then((data) => { setSessions(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1">
                    <Shield className="w-7 h-7 text-primary" /> Active Sessions
                </h1>
                <p className="text-base-content/60">All active login sessions across devices</p>
            </motion.div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["mobile", "tablet", "desktop", "unknown"].map((d) => {
                    const count = sessions.filter((s) => s.device === d).length;
                    return (
                        <div key={d} className="bg-base-100 rounded-2xl p-4 border border-base-300/50 flex items-center gap-3">
                            <span className="text-2xl">{getDeviceIcon(d)}</span>
                            <div>
                                <p className="text-2xl font-bold font-display">{count}</p>
                                <p className="text-xs text-base-content/50 capitalize">{d}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-20 text-base-content/40 bg-base-100 rounded-2xl border border-base-300/50">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No active sessions</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session, i) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className={`bg-base-100 rounded-2xl p-5 border transition-all duration-300 ${session.isCurrentSession
                                ? "border-primary/40 bg-primary/5"
                                : "border-base-300/50 hover:border-base-300"
                                }`}
                        >
                            <div className="flex items-start gap-4 flex-wrap">
                                {/* User */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full">
                                            <img
                                                src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=6366f1&color=fff`}
                                                alt={session.user.name}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{session.user.name}</p>
                                        <p className="text-xs text-base-content/50 font-mono">{session.user.email}</p>
                                    </div>
                                </div>

                                {/* Device Info */}
                                <div className="flex flex-wrap gap-3 flex-1">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200 text-sm">
                                        <DeviceIcon device={session.device} />
                                        <span className="capitalize">{session.device}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200 text-sm">
                                        <span className="text-xs text-base-content/60">🌐</span>
                                        <span>{session.browser}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200 text-sm">
                                        <span className="text-xs">⚙️</span>
                                        <span>{session.os}</span>
                                    </div>
                                    {session.ipAddress && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200 text-sm">
                                            <MapPin className="w-3.5 h-3.5 text-base-content/50" />
                                            <span className="font-mono text-xs">{session.ipAddress}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Meta */}
                                <div className="text-right text-xs flex-shrink-0 space-y-1">
                                    <div className="flex items-center gap-1 text-base-content/50 justify-end">
                                        <Clock className="w-3 h-3" />
                                        <span>Logged in {formatDate(session.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-base-content/40 justify-end">
                                        <span>Expires {formatDate(session.expiresAt)}</span>
                                    </div>
                                    {session.isCurrentSession && (
                                        <div className="flex items-center gap-1 text-success justify-end">
                                            <CheckCircle className="w-3 h-3" />
                                            <span className="font-medium">Current Session</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className={`badge badge-xs ${session.user.role === "admin" ? "badge-primary" : "badge-ghost"}`}>
                                            {session.user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}