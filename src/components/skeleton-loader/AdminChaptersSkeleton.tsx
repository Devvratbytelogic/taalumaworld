export default function AdminChaptersSkeleton() {
    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden animate-pulse">
            {/* Table header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                {[80, 140, 100, 80, 60, 80].map((w, i) => (
                    <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: w }} />
                ))}
            </div>
            {/* Table rows */}
            <div className="divide-y divide-gray-100">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4">
                        <div className="w-10 h-12 bg-gray-200 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-100 rounded w-1/3" />
                        </div>
                        <div className="h-4 bg-gray-100 rounded w-24 shrink-0" />
                        <div className="h-6 w-20 bg-gray-100 rounded-full shrink-0" />
                        <div className="h-4 w-14 bg-gray-100 rounded shrink-0" />
                        <div className="flex gap-2 shrink-0">
                            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
