export default function ReadChapterPageSkeleton() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-pulse">
      {/* Top Header Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-gray-200 rounded-lg w-48" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 w-full" />
      </div>

      {/* Reading Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 space-y-6">
          {/* Chapter badge + title */}
          <div className="text-center space-y-3 mb-10">
            <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto" />
            <div className="h-10 bg-gray-200 rounded-xl w-3/4 mx-auto" />
            <div className="h-5 bg-gray-200 rounded-lg w-2/3 mx-auto" />
          </div>

          {/* Content paragraphs */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              {i % 3 === 0 && <div className="h-4 bg-gray-200 rounded w-4/5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-10 bg-gray-200 rounded-full w-36" />
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-10 bg-gray-200 rounded-full w-36" />
        </div>
      </div>
    </div>
  );
}
