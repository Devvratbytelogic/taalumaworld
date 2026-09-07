export default function MyBooksPageSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
      <div className="grid grid-cols-1 divide-y divide-gray-200/70 bg-gray-50/60 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4 sm:px-6">
            <div className="h-9 w-9 shrink-0 rounded-md bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-8 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 sm:flex-row">
            <div className="aspect-16/10 w-full bg-gray-200 sm:w-40 sm:min-h-42" />
            <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
              <div className="h-3 w-32 rounded bg-gray-100" />
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
              <div className="h-1.5 w-full rounded-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
