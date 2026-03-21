export default function AdminFAQsSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="flex items-center justify-between gap-3">
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 w-4 bg-gray-100 rounded shrink-0" />
                    </div>
                </div>
            ))}
        </div>
    );
}
