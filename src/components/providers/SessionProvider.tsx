"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

interface SessionUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
}

interface SessionContextType {
    user: SessionUser | null;
    isPending: boolean;
    refetch: () => void;
}

const SessionContext = createContext<SessionContextType>({
    user: null,
    isPending: true,
    refetch: () => { },
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [isPending, setIsPending] = useState(true);

    const fetchSession = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/get-session", {
                // cache: no-store বাদ দিন — browser cache ব্যবহার করুক
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data?.user ?? null);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsPending(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
        // ✅ কোনো interval নেই — শুধু একবার fetch
    }, [fetchSession]);

    return (
        <SessionContext.Provider value={{ user, isPending, refetch: fetchSession }}>
            {children}
        </SessionContext.Provider>
    );
}

// ✅ এই hook টা use করুন — useSession() এর বদলে
export function useAppSession() {
    return useContext(SessionContext);
}