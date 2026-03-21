export default function MyBooksPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-gray-200 rounded-2xl" />
          <div className="h-9 bg-gray-200 rounded-xl w-36" />
        </div>
        <div className="h-5 bg-gray-200 rounded-lg w-40" />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-3xl overflow-hidden"
          >
            {/* Book cover — aspect-3/4 */}
            <div className="aspect-3/4 bg-gray-200" />

            {/* Book Info */}
            <div className="p-5 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded-lg w-4/5" />
              <div className="h-5 bg-gray-200 rounded-lg w-3/5" />
              <div className="h-4 bg-gray-200 rounded-lg w-full" />
              <div className="h-4 bg-gray-200 rounded-lg w-3/4" />

              {/* Progress bar */}
              <div className="h-2 bg-gray-200 rounded-full w-full" />

              {/* Action Button */}
              <div className="h-10 bg-gray-200 rounded-full w-full mt-2" />

              {/* Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
