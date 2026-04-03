export default function LibraryContentSectionSkeleton() {
  return (
    <section className="container mx-auto sm:px-4 animate-pulse">
      {/* Filter row */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 bg-gray-200 rounded-full w-44" />
        <div className="h-10 bg-gray-200 rounded-full w-28" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl overflow-hidden border border-border flex flex-col h-full"
          >
            {/* Cover image — matches aspect-2/1 */}
            <div className="aspect-2/1 bg-gray-200 shrink-0" />

            <div className="px-4 py-3 space-y-2 flex flex-col flex-1">
              {/* Badges row */}
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-24" />
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </div>

              {/* Title */}
              <div className="h-6 bg-gray-200 rounded-lg w-4/5" />
              <div className="h-6 bg-gray-200 rounded-lg w-3/5" />

              {/* Description */}
              <div className="h-4 bg-gray-200 rounded-lg w-full" />
              <div className="h-4 bg-gray-200 rounded-lg w-3/4" />

              {/* Author */}
              <div className="h-4 bg-gray-200 rounded-lg w-1/2" />

              <div className="flex-1" />

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="h-4 bg-gray-200 rounded-lg w-16" />
                <div className="h-4 bg-gray-200 rounded-lg w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
