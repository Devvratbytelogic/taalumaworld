interface FilterModalSkeletonProps {
  displayMode?: 'chapters' | 'books';
}

export default function FilterModalSkeleton({ displayMode = 'chapters' }: FilterModalSkeletonProps) {
  if (displayMode === 'chapters') {
    return (
      <div className="space-y-4 animate-pulse">
        {/* Section header banner */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg w-36" />
          <div className="h-3 bg-gray-200 rounded-lg w-56" />
        </div>

        {/* 4 progress filter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-4 rounded-2xl border-2 border-border bg-background">
              <div className="h-4 w-4 rounded-md bg-gray-200 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gray-200 shrink-0" />
                  <div className="h-4 bg-gray-200 rounded-lg w-32" />
                </div>
                <div className="h-3 bg-gray-200 rounded-lg w-44" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      {/* Section header banner */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded-lg w-32" />
        <div className="h-3 bg-gray-200 rounded-lg w-52" />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-28" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2 p-3 rounded-xl border border-border">
              <div className="h-4 w-4 rounded-md bg-gray-200 shrink-0" />
              <div className="h-4 bg-gray-200 rounded-lg flex-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full" />

      {/* Authors */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2 p-3 rounded-xl border border-border">
              <div className="h-4 w-4 rounded-md bg-gray-200 shrink-0" />
              <div className="h-4 bg-gray-200 rounded-lg flex-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full" />

      {/* Tags */}
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-32" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 rounded-full"
              style={{ width: `${60 + (i % 4) * 20}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
