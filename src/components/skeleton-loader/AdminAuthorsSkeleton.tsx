export default function AdminAuthorsSkeleton() {
    return (
        <div className="space-y-8">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-sm p-5 animate-pulse">
                        <div className="h-3 bg-gray-100 rounded w-16 mb-3" />
                        <div className="h-7 bg-gray-200 rounded w-10" />
                    </div>
                ))}
            </div>
            {/* Author cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-sm p-6 animate-pulse">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="h-3 bg-gray-100 rounded w-full" />
                            <div className="h-3 bg-gray-100 rounded w-4/5" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                            <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
