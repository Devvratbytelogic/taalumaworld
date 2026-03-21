export default function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="h-9 bg-gray-200 rounded-xl w-52 mb-2" />
          <div className="h-5 bg-gray-200 rounded-lg w-36" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-sm border border-border"
              >
                <div className="flex gap-4">
                  {/* Image placeholder */}
                  <div className="shrink-0 w-24 h-32 bg-gray-200 rounded-2xl" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded-full w-20" />
                        <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                        <div className="h-4 bg-gray-200 rounded-lg w-2/5" />
                      </div>
                      <div className="h-7 bg-gray-200 rounded-full w-16 shrink-0" />
                    </div>
                    <div className="h-9 bg-gray-200 rounded-full w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border">
              <div className="h-7 bg-gray-200 rounded-lg w-36 mb-6" />

              <div className="space-y-3 mb-6 pb-6 border-b">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded-lg w-20" />
                    <div className="h-4 bg-gray-200 rounded-lg w-14" />
                  </div>
                ))}
              </div>

              <div className="flex justify-between mb-6 pb-6 border-b">
                <div className="h-6 bg-gray-200 rounded-lg w-16" />
                <div className="h-8 bg-gray-200 rounded-lg w-24" />
              </div>

              <div className="h-12 bg-gray-200 rounded-full w-full mb-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
