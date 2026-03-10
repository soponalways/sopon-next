import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { parseUserAgent } from "@/lib/device-parser";

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessions = await prisma.session.findMany({
            where: { expiresAt: { gte: new Date() } }, // only active sessions
            include: { user: { select: { id: true, name: true, email: true, image: true, role: true } } },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        const enriched = sessions.map((s) => {
            const deviceInfo = s.userAgent ? parseUserAgent(s.userAgent) : null;
            return {
                id: s.id,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                expiresAt: s.expiresAt,
                ipAddress: s.ipAddress,
                userAgent: s.userAgent,
                device: deviceInfo?.device || "unknown",
                browser: deviceInfo?.browser || "Unknown",
                os: deviceInfo?.os || "Unknown",
                isCurrentSession: s.token === session.session.token,
                user: s.user,
            };
        });

        return NextResponse.json(enriched);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}