export default function AdminBooksSkeleton() {
  return (
    <div className="admin-surface space-y-4 p-5">
      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-slate-200/90 p-4 animate-pulse">
            <div className="h-28 w-20 shrink-0 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded bg-slate-100" />
                <div className="h-5 w-20 rounded bg-slate-100" />
              </div>
              <div className="h-3 w-full rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
