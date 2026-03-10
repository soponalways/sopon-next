import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") || "7d";

        const now = new Date();
        let startDate = new Date();
        if (range === "today") {
            startDate.setHours(0, 0, 0, 0);
        } else if (range === "7d") {
            startDate.setDate(now.getDate() - 7);
        } else if (range === "30d") {
            startDate.setDate(now.getDate() - 30);
        } else if (range === "90d") {
            startDate.setDate(now.getDate() - 90);
        }

        const where = { createdAt: { gte: startDate } };

        // Total views in range
        const totalViews = await prisma.pageView.count({ where });

        // Unique sessions (approximate unique visitors)
        const uniqueSessions = await prisma.pageView.findMany({
            where,
            select: { sessionId: true, ip: true },
            distinct: ["ip"],
        });
        const uniqueVisitors = uniqueSessions.length;

        // Daily breakdown (last 30 days max)
        const dailyRaw = await prisma.pageView.groupBy({
            by: ["createdAt"],
            where,
            _count: { id: true },
            orderBy: { createdAt: "asc" },
        });

        // Group by date string
        const dailyMap: Record<string, number> = {};
        dailyRaw.forEach((row) => {
            const dateStr = new Date(row.createdAt).toISOString().split("T")[0];
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + row._count.id;
        });
        const dailyViews = Object.entries(dailyMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Device breakdown
        const deviceRaw = await prisma.pageView.groupBy({
            by: ["device"],
            where,
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
        });
        const deviceStats = deviceRaw.map((r) => ({
            device: r.device,
            count: r._count.id,
            percent: totalViews > 0 ? Math.round((r._count.id / totalViews) * 100) : 0,
        }));

        // Country breakdown (top 10)
        const countryRaw = await prisma.pageView.groupBy({
            by: ["country"],
            where,
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
        });
        const countryStats = countryRaw
            .filter((r) => r.country)
            .map((r) => ({ country: r.country!, count: r._count.id }));

        // Browser breakdown
        const browserRaw = await prisma.pageView.groupBy({
            by: ["browser"],
            where,
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 6,
        });
        const browserStats = browserRaw.map((r) => ({
            browser: r.browser || "Unknown",
            count: r._count.id,
        }));

        // OS breakdown
        const osRaw = await prisma.pageView.groupBy({
            by: ["os"],
            where,
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
        });
        const osStats = osRaw.map((r) => ({ os: r.os || "Unknown", count: r._count.id }));

        // Top pages
        const pageRaw = await prisma.pageView.groupBy({
            by: ["page"],
            where,
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
        });
        const topPages = pageRaw.map((r) => ({ page: r.page, count: r._count.id }));

        // Compare with previous period for trend
        const prevStart = new Date(startDate);
        const periodMs = now.getTime() - startDate.getTime();
        prevStart.setTime(startDate.getTime() - periodMs);
        const prevViews = await prisma.pageView.count({
            where: { createdAt: { gte: prevStart, lt: startDate } },
        });
        const trend = prevViews > 0 ? Math.round(((totalViews - prevViews) / prevViews) * 100) : 0;

        return NextResponse.json({
            totalViews,
            uniqueVisitors,
            trend,
            dailyViews,
            deviceStats,
            countryStats,
            browserStats,
            osStats,
            topPages,
            range,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}