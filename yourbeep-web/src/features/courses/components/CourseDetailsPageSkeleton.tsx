import ShimmerBlock from "@components/ui/ShimmerBlock";

const CourseDetailsPageSkeleton = () => {
  return (
    <div className="space-y-8">
      <ShimmerBlock className="h-[420px] rounded-[36px]" />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <ShimmerBlock className="h-[180px] rounded-[32px]" />
          <ShimmerBlock className="h-[260px] rounded-[32px]" />
          <ShimmerBlock className="h-[280px] rounded-[32px]" />
          <ShimmerBlock className="h-[320px] rounded-[32px]" />
        </div>
        <div className="space-y-6">
          <ShimmerBlock className="h-[220px] rounded-[32px]" />
          <ShimmerBlock className="h-[260px] rounded-[32px]" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPageSkeleton;
