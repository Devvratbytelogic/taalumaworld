export default function AdminOrdersSkeleton() {
    return (
        <div className="admin-surface overflow-hidden animate-pulse">
            {/* Table header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                {[120, 100, 140, 160, 80, 70, 100].map((w, i) => (
                    <div key={i} className="h-3 bg-slate-200 rounded" style={{ width: w }} />
                ))}
            </div>
            {/* Table rows */}
            <div className="divide-y divide-gray-100">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded w-28 shrink-0" />
                        <div className="h-4 bg-slate-200 rounded w-24 shrink-0" />
                        <div className="h-4 bg-slate-100 rounded w-36 shrink-0" />
                        <div className="h-4 bg-slate-100 rounded w-40 shrink-0" />
                        <div className="h-4 bg-slate-100 rounded w-16 shrink-0" />
                        <div className="h-6 w-20 bg-slate-100 rounded-full shrink-0" />
                        <div className="h-4 bg-slate-100 rounded w-24 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
