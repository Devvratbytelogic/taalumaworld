export default function AdminSettingsSkeleton() {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 animate-pulse space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-5 w-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-100 rounded-lg" />
                    </div>
                ))}
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-32" />
                <div className="h-24 bg-gray-100 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-100 rounded-lg" />
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-2">
                <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>
        </div>
    );
}
