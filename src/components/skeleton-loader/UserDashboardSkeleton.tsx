export default function UserDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 bg-gray-200 rounded-2xl w-full" />
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Welcome header card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="h-9 bg-gray-200 rounded-xl w-72 mb-3" />
              <div className="h-5 bg-gray-200 rounded-lg w-80" />
            </div>

            {/* Quick Access Cards */}
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

            {/* Content area placeholder */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="h-7 bg-gray-200 rounded-lg w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-3xl overflow-hidden">
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-5 bg-gray-200 rounded-lg w-full" />
                      <div className="h-2 bg-gray-200 rounded-full w-full" />
                      <div className="h-9 bg-gray-200 rounded-full w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
