import ShimmerBlock from "@components/ui/ShimmerBlock";

const GameExperienceSkeleton = () => {
  return (
    <div className="space-y-8">
      <ShimmerBlock className="h-[220px] rounded-[32px]" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ShimmerBlock className="h-[560px] rounded-[32px]" />
          <ShimmerBlock className="h-[280px] rounded-[32px]" />
        </div>
        <div className="lg:col-span-1">
          <ShimmerBlock className="h-[460px] rounded-[32px]" />
        </div>
      </div>
    </div>
  );
};

export default GameExperienceSkeleton;
