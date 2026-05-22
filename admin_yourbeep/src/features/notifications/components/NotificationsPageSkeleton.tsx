import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";

export default function NotificationsPageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <ShimmerBlock className="h-8 w-64" />
        <ShimmerBlock className="mt-3 h-4 w-[520px] max-w-full" />
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
          >
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="mt-4 h-9 w-20" />
          </div>
        ))}
      </div>

      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="space-y-2">
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <ShimmerBlock className="h-3 w-16" />
            <ShimmerBlock className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <ShimmerBlock className="h-3 w-20" />
            <ShimmerBlock className="h-11 w-full" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <ShimmerBlock className="h-11 w-32" />
          <ShimmerBlock className="h-11 w-28" />
          <ShimmerBlock className="h-11 w-36" />
        </div>
      </section>

      <div className="overflow-hidden rounded-[24px] border border-[#e7eadf] bg-white shadow-sm">
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 border-b border-[#edf0e7] py-4 last:border-b-0"
            >
              {Array.from({ length: 6 }).map((__, cellIndex) => (
                <ShimmerBlock
                  key={cellIndex}
                  className={`h-4 ${cellIndex === 0 ? "w-full max-w-[220px]" : "w-full max-w-[110px]"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
