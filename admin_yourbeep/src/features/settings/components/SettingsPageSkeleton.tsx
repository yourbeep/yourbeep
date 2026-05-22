import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";

function SettingsCardSkeleton({
  lineCount = 4,
  hasPreview = false,
}: {
  lineCount?: number;
  hasPreview?: boolean;
}) {
  return (
    <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <ShimmerBlock className="h-7 w-48" />
          <ShimmerBlock className="h-4 w-[340px] max-w-full" />
        </div>
        <ShimmerBlock className="h-11 w-36" />
      </div>

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: lineCount }, (_, index) => (
            <div
              key={index}
              className={index === lineCount - 1 && lineCount % 2 === 1 ? "md:col-span-2 space-y-2" : "space-y-2"}
            >
              <ShimmerBlock className="h-3 w-24" />
              <ShimmerBlock className="h-11 w-full" />
            </div>
          ))}
        </div>

        {hasPreview ? (
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="space-y-2">
                    <ShimmerBlock className="h-3 w-24" />
                    <ShimmerBlock className="h-11 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <ShimmerBlock className="h-3 w-24" />
                <ShimmerBlock className="h-28 w-full" />
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e7eadf] bg-[#fbfcf8] p-5">
              <ShimmerBlock className="h-4 w-28" />
              <ShimmerBlock className="mt-3 h-4 w-48" />
              <div className="mt-5 rounded-[24px] border border-[#e7eadf] bg-white p-5">
                <ShimmerBlock className="h-4 w-24" />
                <ShimmerBlock className="mt-4 h-8 w-52" />
                <div className="mt-4 space-y-2">
                  <ShimmerBlock className="h-4 w-full" />
                  <ShimmerBlock className="h-4 w-[90%]" />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function SettingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <SettingsCardSkeleton lineCount={6} />
      <SettingsCardSkeleton hasPreview />
      <SettingsCardSkeleton lineCount={5} />
      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-7 w-44" />
            <ShimmerBlock className="h-4 w-[320px] max-w-full" />
          </div>
          <ShimmerBlock className="h-11 w-40" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={index === 4 ? "md:col-span-2 space-y-2" : "space-y-2"}
            >
              <ShimmerBlock className="h-3 w-24" />
              <ShimmerBlock className="h-40 w-full" />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <ShimmerBlock className="h-7 w-36" />
            <ShimmerBlock className="h-4 w-[320px] max-w-full" />
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <div className="rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] p-4">
            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <ShimmerBlock className="h-3 w-20" />
                  <ShimmerBlock className={index === 2 ? "h-32 w-full" : "h-11 w-full"} />
                </div>
              ))}
              <ShimmerBlock className="h-11 w-full" />
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#edf1e7] bg-white p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <ShimmerBlock className="h-7 w-20" />
                      <ShimmerBlock className="h-7 w-24" />
                    </div>
                    <ShimmerBlock className="h-5 w-48" />
                    <ShimmerBlock className="h-4 w-full" />
                    <ShimmerBlock className="h-4 w-[88%]" />
                  </div>
                  <div className="flex gap-2">
                    <ShimmerBlock className="h-10 w-20" />
                    <ShimmerBlock className="h-10 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
