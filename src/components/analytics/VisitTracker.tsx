"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
    const pathname = usePathname();
    const sessionIdRef = useRef<string>("");

    useEffect(() => {
        // Generate or retrieve session ID (browser tab session)
        let sid = sessionStorage.getItem("_vsid");
        if (!sid) {
            sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
            sessionStorage.setItem("_vsid", sid);
        }
        sessionIdRef.current = sid;
    }, []);

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;

        const sessionId = sessionIdRef.current;

        const track = () => {
            fetch("/api/analytics/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page: pathname,
                    referrer: document.referrer || null,
                    sessionId,
                }),
            }).catch(() => { });
        };

        // Small delay to avoid tracking bounces
        const timer = setTimeout(track, 2000);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}