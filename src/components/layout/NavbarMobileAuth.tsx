"use client";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";

export default function NavbarMobileAuth({ onClose }: { onClose: () => void }) {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <Link
                href="/auth/login"
                onClick={onClose}
                className="btn btn-primary btn-sm rounded-xl"
            >
                Sign In
            </Link>
        );
    }

    return (
        <>
            {(session.user as any).role === "admin" && (
                <Link
                    href="/admin"
                    onClick={onClose}
                    className="btn btn-outline btn-sm rounded-xl"
                >
                    Admin Dashboard
                </Link>
            )}
            <button onClick={() => signOut()} className="btn btn-ghost btn-sm rounded-xl">
                Sign Out
            </button>
        </>
    );
}