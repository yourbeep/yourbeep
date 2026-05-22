type ShimmerBlockProps = {
  className?: string;
};

export function ShimmerBlock({ className = "" }: ShimmerBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#eef3ea] via-[#f7faf4] to-[#eef3ea] bg-[length:200%_100%] ${className}`.trim()}
    />
  );
}
