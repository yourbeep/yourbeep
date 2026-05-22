import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";

export default function GamesPageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <ShimmerBlock className="h-8 w-56" />
        <ShimmerBlock className="mt-3 h-4 w-[460px] max-w-full" />
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
          >
            <ShimmerBlock className="h-3 w-20" />
            <ShimmerBlock className="mt-4 h-9 w-16" />
          </div>
        ))}
      </div>

      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <ShimmerBlock className="h-3 w-20" />
            <ShimmerBlock className="h-11 w-full" />
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-[24px] border border-[#e7eadf] bg-white shadow-sm">
        <div className="p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 border-b border-[#edf0e7] py-4 last:border-b-0"
            >
              {Array.from({ length: 5 }).map((__, cellIndex) => (
                <ShimmerBlock
                  key={cellIndex}
                  className={`h-4 ${cellIndex === 2 ? "w-full max-w-[220px]" : "w-full max-w-[120px]"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
