export default function MyBooksPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200/80 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-lg bg-gray-200" />
              <div className="space-y-2">
                <div className="h-6 w-10 rounded bg-gray-200" />
                <div className="h-3 w-24 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-gray-200/80 bg-white">
            <div className="aspect-video bg-gray-200" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="h-5 w-full rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-10 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
