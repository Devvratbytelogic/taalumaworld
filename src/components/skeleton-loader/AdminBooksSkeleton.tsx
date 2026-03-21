export default function AdminBooksSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-4/5" />
                        <div className="flex gap-2 pt-1">
                            <div className="h-7 bg-gray-100 rounded-lg flex-1" />
                            <div className="h-7 bg-gray-100 rounded-lg flex-1" />
                            <div className="h-7 w-7 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
