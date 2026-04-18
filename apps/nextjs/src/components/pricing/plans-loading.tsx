export function PlansLoading() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
      {[1, 2].map(i => (
        <div
          key={i}
          className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6"
        >
          <div className="mb-1 h-7 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="mb-3 h-10 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-10 w-full animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="h-4 w-full animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
