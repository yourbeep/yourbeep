import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";

export default function UsersPageSkeleton() {
  return (
    <div className="min-h-screen space-y-6 bg-bg-cream p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`user-summary-skeleton-${index}`}
            className="rounded-[24px] border border-[#dfe8d6] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <ShimmerBlock className="h-3 w-24 rounded-full" />
                <ShimmerBlock className="h-8 w-20 rounded-full" />
              </div>
              <ShimmerBlock className="h-11 w-11 rounded-2xl" />
            </div>
            <div className="mt-6 flex items-center gap-2">
              <ShimmerBlock className="h-6 w-16 rounded-full" />
              <ShimmerBlock className="h-3 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-[#dfe8d6] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-8 w-52 rounded-full" />
            <ShimmerBlock className="h-4 w-[420px] max-w-full rounded-full" />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShimmerBlock className="h-12 w-[280px] rounded-2xl" />
            <ShimmerBlock className="h-12 w-[180px] rounded-2xl" />
            <ShimmerBlock className="h-12 w-[150px] rounded-2xl" />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e6edde]">
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`student-table-skeleton-${index}`}
                className="grid grid-cols-[280px_220px_170px_180px_140px_140px_160px] gap-4 border-b border-[#edf1e7] px-5 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <ShimmerBlock className="h-11 w-11 rounded-2xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <ShimmerBlock className="h-4 w-28 rounded-full" />
                    <ShimmerBlock className="h-3 w-40 rounded-full" />
                    <ShimmerBlock className="h-3 w-24 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-24 rounded-full" />
                  <ShimmerBlock className="h-3 w-28 rounded-full" />
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-6 w-20 rounded-full" />
                  <ShimmerBlock className="h-6 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-24 rounded-full" />
                  <ShimmerBlock className="h-3 w-28 rounded-full" />
                  <ShimmerBlock className="h-3 w-24 rounded-full" />
                </div>
                <ShimmerBlock className="h-4 w-20 rounded-full" />
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-20 rounded-full" />
                  <ShimmerBlock className="h-3 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                  <ShimmerBlock className="h-4 w-24 rounded-full" />
                  <ShimmerBlock className="h-3 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <ShimmerBlock className="h-4 w-60 rounded-full" />
          <div className="flex items-center gap-2">
            <ShimmerBlock className="h-9 w-16 rounded-lg" />
            <ShimmerBlock className="h-9 w-9 rounded-lg" />
            <ShimmerBlock className="h-9 w-9 rounded-lg" />
            <ShimmerBlock className="h-9 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
