"use client";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";

export default function NavbarAuth() {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <Link href="/auth/login" className="btn btn-primary btn-sm rounded-xl hidden md:flex gap-2">
                Sign In
            </Link>
        );
    }

    return (
        <div className="dropdown dropdown-end hidden md:block">
            <div tabIndex={0} className="avatar cursor-pointer">
                <div className="w-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    <img
                        src={
                            session.user.image ||
                            `https://ui-avatars.com/api/?name=${session.user.name}&background=6366f1&color=fff`
                        }
                        alt={session.user.name || ""}
                    />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-2xl border border-base-300 shadow-2xl w-52 p-2 mt-3"
            >
                <li className="px-3 py-2 opacity-60 text-xs font-mono">{session.user.email}</li>
                {(session.user as any).role === "admin" && (
                    <li>
                        <Link href="/admin">Admin Dashboard</Link>
                    </li>
                )}
                <li>
                    <button onClick={() => signOut()}>Sign Out</button>
                </li>
            </ul>
        </div>
    );
}