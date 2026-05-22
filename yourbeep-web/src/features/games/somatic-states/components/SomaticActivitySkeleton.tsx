import ShimmerBlock from "@components/ui/ShimmerBlock";

export function SomaticActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_16px_42px_rgba(36,72,66,0.06)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <ShimmerBlock className="h-6 w-32 rounded-full" />
              <ShimmerBlock className="h-6 w-60 rounded-xl" />
              <ShimmerBlock className="h-4 w-full rounded-xl" />
              <ShimmerBlock className="h-4 w-[82%] rounded-xl" />
            </div>
            <ShimmerBlock className="h-20 w-[180px] rounded-[24px]" />
          </div>
          <div className="mt-5 flex gap-3">
            <ShimmerBlock className="h-11 w-32 rounded-full" />
            <ShimmerBlock className="h-11 w-28 rounded-full" />
            <ShimmerBlock className="h-11 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SomaticActivitySkeleton;
