export default function FAQSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-border rounded-3xl overflow-hidden bg-white animate-pulse">
                    <div className="w-full flex items-center justify-between p-5">
                        <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                        <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
                    </div>
                </div>
            ))}
        </>
    )
}
