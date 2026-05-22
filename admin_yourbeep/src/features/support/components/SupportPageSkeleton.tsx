import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";

export default function SupportPageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <ShimmerBlock className="h-8 w-64" />
        <ShimmerBlock className="mt-3 h-4 w-[60%]" />
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
          >
            <ShimmerBlock className="h-3 w-20" />
            <ShimmerBlock className="mt-4 h-8 w-14" />
          </div>
        ))}
      </div>

      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <ShimmerBlock className="h-4 w-32" />
            <ShimmerBlock className="h-4 w-56" />
          </div>
          <ShimmerBlock className="h-9 w-72" />
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-2">
              <ShimmerBlock className="h-3 w-20" />
              <ShimmerBlock className="h-11 w-full" />
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <ShimmerBlock className="h-7 w-20" />
                  <ShimmerBlock className="h-7 w-24" />
                </div>
                <ShimmerBlock className="h-6 w-48" />
                <ShimmerBlock className="h-4 w-full" />
                <ShimmerBlock className="h-4 w-[86%]" />
              </div>
              <div className="flex gap-2">
                <ShimmerBlock className="h-10 w-28" />
                <ShimmerBlock className="h-10 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
