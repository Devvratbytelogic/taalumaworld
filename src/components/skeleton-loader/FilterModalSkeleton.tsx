export default function FilterModalSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2.5">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-muted/50 px-3.5 py-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-0.5">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="rounded-2xl border border-border/80 overflow-hidden">
          <div className="h-11 bg-gray-100 border-b border-border/70" />
          <div className="divide-y divide-border/60">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5">
                <div className="h-8 w-8 rounded-full bg-gray-200 shrink-0" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-5 w-5 rounded-full bg-gray-200 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 rounded-full"
              style={{ width: `${68 + (i % 4) * 16}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
