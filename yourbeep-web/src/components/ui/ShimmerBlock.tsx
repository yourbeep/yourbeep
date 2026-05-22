type ShimmerBlockProps = {
  className?: string;
};

export function ShimmerBlock({ className = "" }: ShimmerBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-[24px] bg-[linear-gradient(90deg,#ebe7dc_0%,#f6f3ea_50%,#ebe7dc_100%)] bg-[length:200%_100%] ${className}`.trim()}
    />
  );
}

export default ShimmerBlock;
