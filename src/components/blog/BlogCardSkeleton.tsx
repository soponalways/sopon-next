export default function BlogCardSkeleton() {
    return (
        <div className="bg-base-100 rounded-3xl overflow-hidden border border-base-300/50 flex flex-col animate-pulse">
            <div className="h-48 bg-base-200/80" />
            <div className="p-5 flex flex-col gap-3">
                <div className="flex gap-3">
                    <div className="h-3 bg-base-200 rounded-full w-24" />
                    <div className="h-3 bg-base-200 rounded-full w-16" />
                </div>
                <div className="h-5 bg-base-200 rounded-full w-4/5" />
                <div className="h-5 bg-base-200 rounded-full w-3/5" />
                <div className="space-y-2 mt-1">
                    <div className="h-3 bg-base-200 rounded-full w-full" />
                    <div className="h-3 bg-base-200 rounded-full w-full" />
                    <div className="h-3 bg-base-200 rounded-full w-2/3" />
                </div>
                <div className="flex gap-2 mt-2">
                    <div className="h-5 bg-base-200 rounded-lg w-14" />
                    <div className="h-5 bg-base-200 rounded-lg w-16" />
                </div>
                <div className="h-8 bg-base-200 rounded-xl w-full mt-1" />
            </div>
        </div>
    );
}