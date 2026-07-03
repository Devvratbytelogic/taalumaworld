export default function AdminCategoriesSkeleton() {
  return (
    <div className="admin-surface overflow-hidden animate-pulse">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="h-4 w-32 rounded bg-slate-200" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0">
          <div className="h-4 w-6 rounded bg-slate-100" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-100" />
            <div className="h-6 w-16 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
