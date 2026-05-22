import ShimmerBlock from "@components/ui/ShimmerBlock";

export default function DashboardPageSkeleton() {
  return (
    <div className="space-y-8">
      <ShimmerBlock className="h-[320px] w-full rounded-[32px]" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ShimmerBlock className="h-[360px] w-full rounded-[28px]" />
        <ShimmerBlock className="h-[360px] w-full rounded-[28px]" />
      </div>

      <div className="space-y-5">
        <ShimmerBlock className="h-8 w-56" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ShimmerBlock
              key={`dashboard-recommendation-skeleton-${index}`}
              className="h-[310px] w-full rounded-[28px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
