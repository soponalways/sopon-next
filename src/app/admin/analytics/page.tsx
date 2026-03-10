"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";
import {
    TrendingUp, TrendingDown, Users, Eye, Globe, Monitor, Smartphone, Tablet,
} from "lucide-react";
import { getDeviceIcon } from "@/lib/device-parser";

type Range = "today" | "7d" | "30d" | "90d";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

const FLAG_MAP: Record<string, string> = {
    "Bangladesh": "🇧🇩", "United States": "🇺🇸", "India": "🇮🇳", "United Kingdom": "🇬🇧",
    "Canada": "🇨🇦", "Australia": "🇦🇺", "Germany": "🇩🇪", "France": "🇫🇷",
    "Japan": "🇯🇵", "Brazil": "🇧🇷", "Pakistan": "🇵🇰", "Indonesia": "🇮🇩",
    "Local": "🏠",
};

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<Range>("7d");

    useEffect(() => {
        setLoading(true);
        fetch(`/api/analytics/stats?range=${range}`)
            .then((r) => r.json())
            .then((data) => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [range]);

    const ranges: { value: Range; label: string }[] = [
        { value: "today", label: "Today" },
        { value: "7d", label: "7 Days" },
        { value: "30d", label: "30 Days" },
        { value: "90d", label: "90 Days" },
    ];

    const deviceIcons: Record<string, React.ReactNode> = {
        mobile: <Smartphone className="w-5 h-5" />,
        tablet: <Tablet className="w-5 h-5" />,
        desktop: <Monitor className="w-5 h-5" />,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-start justify-between gap-4"
            >
                <div>
                    <h1 className="font-display text-3xl font-bold flex items-center gap-3 mb-1">
                        <TrendingUp className="w-7 h-7 text-primary" /> Analytics
                    </h1>
                    <p className="text-base-content/60">Track your portfolio visitors & engagement</p>
                </div>

                {/* Range Selector */}
                <div className="flex gap-2 bg-base-200 p-1 rounded-xl">
                    {ranges.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setRange(r.value)}
                            className={`btn btn-sm rounded-lg transition-all ${range === r.value ? "btn-primary shadow-md" : "btn-ghost"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        icon: <Eye className="w-6 h-6" />, label: "Total Views",
                        value: stats?.totalViews ?? 0, color: "text-primary", bg: "bg-primary/10",
                        trend: stats?.trend,
                    },
                    {
                        icon: <Users className="w-6 h-6" />, label: "Unique Visitors",
                        value: stats?.uniqueVisitors ?? 0, color: "text-secondary", bg: "bg-secondary/10",
                    },
                    {
                        icon: <Globe className="w-6 h-6" />, label: "Countries",
                        value: stats?.countryStats?.length ?? 0, color: "text-accent", bg: "bg-accent/10",
                    },
                    {
                        icon: <Monitor className="w-6 h-6" />, label: "Devices",
                        value: stats?.deviceStats?.length ?? 0, color: "text-success", bg: "bg-success/10",
                    },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-base-100 rounded-2xl p-5 border border-base-300/50 shadow-sm"
                    >
                        <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                            {card.icon}
                        </div>
                        <p className="text-3xl font-bold font-display">{card.value.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-base-content/60">{card.label}</p>
                            {card.trend !== undefined && (
                                <span className={`flex items-center text-xs font-medium ${card.trend >= 0 ? "text-success" : "text-error"}`}>
                                    {card.trend >= 0
                                        ? <TrendingUp className="w-3 h-3 mr-0.5" />
                                        : <TrendingDown className="w-3 h-3 mr-0.5" />
                                    }
                                    {Math.abs(card.trend)}%
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Views Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-base-100 rounded-2xl p-6 border border-base-300/50 shadow-sm"
            >
                <h2 className="font-display font-bold text-lg mb-6">Daily Page Views</h2>
                {stats?.dailyViews?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={stats.dailyViews} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
                                tickFormatter={(v: Date) => {
                                    const d = new Date(v);
                                    return `${d.getMonth() + 1}/${d.getDate()}`;
                                }}
                            />
                            <YAxis tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} />
                            <Tooltip
                                contentStyle={{ background: "hsl(var(--b1))", border: "1px solid hsl(var(--b3))", borderRadius: "12px" }}
                                cursor={{ fill: "rgba(99,102,241,0.1)" }}
                            />
                            <Bar dataKey="count" name="Views" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-48 flex items-center justify-center text-base-content/30">
                        <p>No data for this period</p>
                    </div>
                )}
            </motion.div>

            {/* Device + Country Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bg-base-100 rounded-2xl p-6 border border-base-300/50 shadow-sm"
                >
                    <h2 className="font-display font-bold text-lg mb-6">Device Types</h2>
                    {stats?.deviceStats?.length > 0 ? (
                        <div className="flex items-center gap-6">
                            <ResponsiveContainer width={160} height={160}>
                                <PieChart>
                                    <Pie
                                        data={stats.deviceStats}
                                        cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={75}
                                        dataKey="count"
                                        paddingAngle={3}
                                    >
                                        {stats.deviceStats.map((_: any, i: number) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: "hsl(var(--b1))", border: "1px solid hsl(var(--b3))", borderRadius: "12px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-3">
                                {stats.deviceStats.map((d: any, i: number) => (
                                    <div key={d.device} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getDeviceIcon(d.device)}</span>
                                            <span className="text-sm capitalize font-medium">{d.device}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 rounded-full bg-base-200 overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${d.percent}%`, background: COLORS[i % COLORS.length] }} />
                                            </div>
                                            <span className="text-xs text-base-content/60 w-8 text-right">{d.percent}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-base-content/30">No data</div>
                    )}
                </motion.div>

                {/* Country Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bg-base-100 rounded-2xl p-6 border border-base-300/50 shadow-sm"
                >
                    <h2 className="font-display font-bold text-lg mb-4">Top Countries</h2>
                    {stats?.countryStats?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.countryStats.slice(0, 8).map((c: any, i: number) => (
                                <div key={c.country} className="flex items-center gap-3">
                                    <span className="text-xl w-7 flex-shrink-0">
                                        {FLAG_MAP[c.country] || "🌍"}
                                    </span>
                                    <span className="text-sm flex-1 truncate">{c.country}</span>
                                    <div className="w-28 h-2 rounded-full bg-base-200 overflow-hidden flex-shrink-0">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{
                                                width: `${Math.round((c.count / (stats.countryStats[0]?.count || 1)) * 100)}%`,
                                                opacity: 1 - i * 0.08,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-base-content/60 w-8 text-right flex-shrink-0">
                                        {c.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-base-content/30">No data</div>
                    )}
                </motion.div>
            </div>

            {/* Browser + OS + Top Pages Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Browser */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-base-100 rounded-2xl p-6 border border-base-300/50 shadow-sm"
                >
                    <h2 className="font-display font-bold text-base mb-4">Browsers</h2>
                    <div className="space-y-2">
                        {stats?.browserStats?.map((b: any, i: number) => (
                            <div key={b.browser} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                    <span>{b.browser}</span>
                                </div>
                                <span className="font-mono text-xs text-base-content/60">{b.count}</span>
                            </div>
                        ))}
                        {!stats?.browserStats?.length && <p className="text-base-content/30 text-sm">No data</p>}
                    </div>
                </motion.div>

                {/* OS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="bg-base-100 rounded-2xl p-6 border border-base-300/50 shadow-sm"
                >
                    <h2 className="font-display font-bold text-base mb-4">Operating Systems</h2>
                    <div className="space-y-2">
                        {stats?.osStats?.map((o: any, i: number) => (
                            <div key={o.os} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                    <span>{o.os}</span>
                                </div>
                                <span className="font-mono text-xs text-base-content/60">{o.count}</span>
                            </div>
                        ))}
                        {!stats?.osStats?.length && <p className="text-base-content/30 text-sm">No data</p>}
                    </div>
                </motion.div>

                {/* Top Pages */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-base-100 rounded-2xl p-6 border border-base-300/50 shadow-sm"
                >
                    <h2 className="font-display font-bold text-base mb-4">Top Pages</h2>
                    <div className="space-y-2">
                        {stats?.topPages?.map((p: any, i: number) => (
                            <div key={p.page} className="flex items-center justify-between text-sm">
                                <span className="font-mono text-xs text-base-content/70 truncate flex-1">{p.page || "/"}</span>
                                <span className="font-mono text-xs text-base-content/60 flex-shrink-0 ml-2">{p.count}</span>
                            </div>
                        ))}
                        {!stats?.topPages?.length && <p className="text-base-content/30 text-sm">No data</p>}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}