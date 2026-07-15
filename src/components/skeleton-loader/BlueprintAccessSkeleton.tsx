export default function BlueprintAccessSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="h-3 bg-blue-200/70 rounded w-full max-w-2xl" />
                <div className="h-3 bg-blue-200/70 rounded w-2/3 max-w-xl mt-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Institution list */}
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-32" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-full px-4 py-3 rounded-xl border border-gray-200 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-2/3" />
                            <div className="h-3 bg-slate-100 rounded w-1/3" />
                        </div>
                    ))}
                </div>

                {/* Blueprint selector */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-40" />
                            <div className="h-3 bg-slate-100 rounded w-32" />
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="h-3 bg-slate-100 rounded w-16" />
                            <div className="h-8 bg-slate-200 rounded-full w-20" />
                        </div>
                    </div>

                    {/* Search input */}
                    <div className="h-10 bg-slate-100 rounded-lg w-full" />

                    {/* Blueprint rows */}
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200"
                            >
                                <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                                </div>
                                <div className="h-3 bg-slate-100 rounded w-14 shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
