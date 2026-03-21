export default function AdminTestimonialsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-28" />
                                <div className="h-3 bg-gray-100 rounded w-20" />
                            </div>
                        </div>
                        <div className="h-5 w-16 bg-gray-100 rounded-full shrink-0" />
                    </div>
                    <div className="flex gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, j) => (
                            <div key={j} className="h-4 w-4 bg-gray-200 rounded" />
                        ))}
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-4/5" />
                        <div className="h-3 bg-gray-200 rounded w-3/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}
