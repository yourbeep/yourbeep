import ShimmerBlock from "@components/ui/ShimmerBlock";

const CourseContentPageSkeleton = () => {
  return (
    <div>
      <ShimmerBlock className="h-[320px] rounded-[32px]" />

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div className="space-y-3">
              <ShimmerBlock className="h-4 w-24 rounded-full" />
              <ShimmerBlock className="h-10 w-64 rounded-2xl" />
            </div>
            <ShimmerBlock className="h-10 w-36 rounded-full" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <ShimmerBlock
                key={index}
                className="h-[136px] rounded-[24px]"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ShimmerBlock className="h-[180px] rounded-[28px]" />
          <ShimmerBlock className="h-[180px] rounded-[28px]" />
        </div>
      </div>
    </div>
  );
};

export default CourseContentPageSkeleton;
