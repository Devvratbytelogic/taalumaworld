export default function CartPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 h-8 w-44 rounded-xl bg-gray-200 sm:h-9 sm:w-52" />
          <div className="h-4 w-32 rounded-lg bg-gray-200 sm:h-5 sm:w-36" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* Image placeholder */}
                  <div className="mx-auto w-full shrink-0 rounded-xl bg-gray-200 sm:mx-0 sm:h-32 sm:w-24 sm:rounded-2xl" />

                  {/* Info */}
                  <div className="min-w-0 w-full flex-1">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded-full w-20" />
                        <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                        <div className="h-4 bg-gray-200 rounded-lg w-2/5" />
                      </div>
                      <div className="h-7 bg-gray-200 rounded-full w-16 shrink-0" />
                    </div>
                    <div className="h-9 w-full rounded-full bg-gray-200 sm:w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 lg:min-w-0">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
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
