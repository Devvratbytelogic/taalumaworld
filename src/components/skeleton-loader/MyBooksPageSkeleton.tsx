export default function MyBooksPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-10" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-3xl overflow-hidden animate-pulse">
            <div className="aspect-3/4 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-gray-100 rounded w-24" />
              <div className="h-5 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-10 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
