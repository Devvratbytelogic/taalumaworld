export default function ReaderTestimonialsSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm animate-pulse">
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, j) => (
                            <div key={j} className="w-4 h-4 rounded-full bg-gray-200" />
                        ))}
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded-lg w-full" />
                        <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
                        <div className="h-4 bg-gray-200 rounded-lg w-4/6" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded-lg w-24" />
                            <div className="h-3 bg-gray-200 rounded-lg w-32" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
