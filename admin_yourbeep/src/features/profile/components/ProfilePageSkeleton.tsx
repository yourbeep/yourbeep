import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";

export default function ProfilePageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <ShimmerBlock className="h-20 w-20 rounded-[24px]" />
            <div className="space-y-3">
              <ShimmerBlock className="h-7 w-52" />
              <ShimmerBlock className="h-4 w-40" />
              <div className="flex gap-2">
                <ShimmerBlock className="h-7 w-28 rounded-full" />
                <ShimmerBlock className="h-7 w-32 rounded-full" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ShimmerBlock
                key={`profile-hero-skeleton-${index}`}
                className="h-24 w-28 rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
            <ShimmerBlock className="mb-3 h-6 w-44" />
            <ShimmerBlock className="mb-5 h-4 w-80" />
            <ShimmerBlock className="mb-5 h-64 w-full rounded-[24px]" />
            <div className="grid gap-4 md:grid-cols-2">
              <ShimmerBlock className="h-14 w-full rounded-2xl md:col-span-2" />
              <ShimmerBlock className="h-14 w-full rounded-2xl" />
              <ShimmerBlock className="h-14 w-full rounded-2xl" />
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
            <ShimmerBlock className="mb-3 h-6 w-40" />
            <ShimmerBlock className="mb-5 h-4 w-72" />
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ShimmerBlock key={index} className="h-28 w-full rounded-2xl" />
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ShimmerBlock key={index} className="h-24 w-full rounded-2xl" />
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
          <ShimmerBlock className="mb-3 h-6 w-44" />
          <ShimmerBlock className="mb-5 h-4 w-72" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <ShimmerBlock
                key={`profile-snapshot-skeleton-${index}`}
                className="h-24 w-full rounded-2xl"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
