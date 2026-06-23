export default function PdfViewerSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-gray-100 rounded-sm shadow-sm overflow-hidden"
          style={{ aspectRatio: '1 / 1.414' }}
        >
          <div className="p-8 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="mt-8 h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="mt-8 h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
