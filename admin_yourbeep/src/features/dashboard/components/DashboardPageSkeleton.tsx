import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";

export default function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen space-y-6 bg-bg-cream p-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`stat-skeleton-${index}`}
            className="rounded-[24px] border border-[#dfe8da] bg-white p-5 shadow-sm"
          >
            <ShimmerBlock className="mb-4 h-3 w-24" />
            <ShimmerBlock className="mb-3 h-8 w-28" />
            <ShimmerBlock className="h-3 w-20" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`chart-skeleton-${index}`}
            className="rounded-[28px] border border-[#dfe8da] bg-white p-6 shadow-sm"
          >
            <ShimmerBlock className="mb-3 h-5 w-40" />
            <ShimmerBlock className="mb-6 h-3 w-56" />
            <ShimmerBlock className="h-56 w-full rounded-[24px]" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`analytics-skeleton-${index}`}
            className="rounded-[28px] border border-[#dfe8da] bg-white p-6 shadow-sm"
          >
            <ShimmerBlock className="mb-3 h-5 w-36" />
            <ShimmerBlock className="mb-6 h-3 w-40" />
            <ShimmerBlock className="h-56 w-full rounded-[24px]" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[#dfe8da] bg-white p-6 shadow-sm">
          <ShimmerBlock className="mb-5 h-5 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`activity-skeleton-${index}`} className="flex gap-3">
                <ShimmerBlock className="h-11 w-11 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <ShimmerBlock className="h-4 w-10/12" />
                  <ShimmerBlock className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-[#dfe8da] bg-white p-6 shadow-sm">
            <ShimmerBlock className="mb-4 h-5 w-36" />
            <div className="grid grid-cols-1 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <ShimmerBlock
                  key={`overview-skeleton-${index}`}
                  className="h-24 w-full rounded-[20px]"
                />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#dfe8da] bg-white p-6 shadow-sm">
            <ShimmerBlock className="mb-4 h-5 w-44" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`student-skeleton-${index}`} className="space-y-2">
                  <ShimmerBlock className="h-4 w-8/12" />
                  <ShimmerBlock className="h-3 w-6/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
