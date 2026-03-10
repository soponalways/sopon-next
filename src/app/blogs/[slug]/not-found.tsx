import Link from "next/link";

export default function BlogNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center animated-gradient">
            <div className="text-center p-8">
                <div className="text-8xl mb-6">📄</div>
                <h1 className="font-display text-4xl font-bold mb-3">Article Not Found</h1>
                <p className="text-base-content/60 mb-8">This article doesn't exist or has been removed.</p>
                <Link href="/blogs" className="btn btn-primary rounded-2xl px-8">
                    ← Back to Blog
                </Link>
            </div>
        </div>
    );
}