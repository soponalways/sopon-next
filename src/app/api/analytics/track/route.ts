import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseUserAgent } from "@/lib/device-parser";
import { getGeoFromIP } from "@/lib/geo";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const { page, referrer, sessionId } = await req.json();
        const headersList = await headers();

        const ip =
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headersList.get("x-real-ip") ||
            "unknown";

        const userAgentStr = headersList.get("user-agent") || "";
        const { device, browser, os } = parseUserAgent(userAgentStr);

        const geo = await getGeoFromIP(ip);

        await prisma.pageView.create({
            data: {
                page: page || "/",
                referrer: referrer || null,
                userAgent: userAgentStr,
                device,
                browser,
                os,
                country: geo?.country || null,
                city: geo?.city || null,
                ip,
                sessionId: sessionId || null,
            },
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false });
    }
}