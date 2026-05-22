import ShimmerBlock from "@components/ui/ShimmerBlock";

export default function CoursesPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <ShimmerBlock className="h-11 w-72 rounded-2xl" />
        <ShimmerBlock className="h-5 w-full max-w-[620px] rounded-xl" />
        <ShimmerBlock className="h-5 w-full max-w-[520px] rounded-xl" />
      </div>

      <div className="flex items-center gap-3">
        <ShimmerBlock className="h-12 w-full max-w-[380px] rounded-full" />
        <ShimmerBlock className="h-11 w-11 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`course-card-skeleton-${index}`}
            className="overflow-hidden rounded-[28px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
          >
            <ShimmerBlock className="h-[180px] w-full rounded-none" />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <ShimmerBlock className="h-5 w-40 rounded-xl" />
                <ShimmerBlock className="h-7 w-24 rounded-full" />
              </div>
              <ShimmerBlock className="h-4 w-44 rounded-xl" />
              <ShimmerBlock className="h-4 w-full rounded-xl" />
              <ShimmerBlock className="h-4 w-10/12 rounded-xl" />
              <div className="flex gap-2">
                <ShimmerBlock className="h-12 flex-1 rounded-full" />
                <ShimmerBlock className="h-12 flex-1 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
