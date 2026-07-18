export default function ActiveReadersSkeleton() {
    return (
        <div className="flex items-center gap-6 pt-2 animate-pulse">
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-background bg-gray-200"
                        />
                    ))}
                </div>
                <div className="h-4 bg-gray-200 rounded-lg w-44" />
            </div>
        </div>
    )
}
