export default function AdminCategoriesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-100 rounded-2xl">
                                <div className="h-6 w-6 bg-gray-200 rounded" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-28" />
                                <div className="h-3 bg-gray-100 rounded w-20" />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="h-6 bg-gray-100 rounded-full w-16" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
