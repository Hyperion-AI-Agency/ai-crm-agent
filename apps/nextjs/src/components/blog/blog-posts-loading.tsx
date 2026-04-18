export function BlogPostsLoading() {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex flex-col">
          {/* Image skeleton */}
          <div className="bg-muted mb-4 aspect-[3/2] w-full animate-pulse rounded-2xl" />

          {/* Category skeleton */}
          <div className="bg-muted mb-2 h-4 w-20 animate-pulse rounded" />

          {/* Title skeleton */}
          <div className="bg-muted mb-2 h-6 w-4/5 animate-pulse rounded" />

          {/* Excerpt skeleton */}
          <div className="space-y-2">
            <div className="bg-muted h-4 w-full animate-pulse rounded" />
            <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
            <div className="bg-muted h-4 w-3/5 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
