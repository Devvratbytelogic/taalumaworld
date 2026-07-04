export default function UserDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="h-9 bg-gray-200 rounded-xl w-72 mb-3" />
        <div className="h-5 bg-gray-200 rounded-lg w-80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-2xl" />
            </div>
            <div className="h-6 bg-gray-200 rounded-lg w-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded-lg w-24 mb-3" />
            <div className="h-4 bg-gray-200 rounded-lg w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
