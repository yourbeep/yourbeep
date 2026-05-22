type PricingFeatureListProps = {
  gamesCount: number;
  durationMinutes: number;
};

const features = [
  "Full access to the paid course curriculum",
  "Interactive games and guided reflective practice",
  "Progress tracking tied to your account",
  "Post-checkout access activation through Stripe",
];

const PricingFeatureList = ({
  gamesCount,
  durationMinutes,
}: PricingFeatureListProps) => {
  return (
    <div className="rounded-[28px] border border-[#e6dfd2] bg-white p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d8a8f]">
        What&apos;s included
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="rounded-full bg-[#eef5f7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#305c66]">
          {gamesCount} guided games
        </span>
        {durationMinutes > 0 ? (
          <span className="rounded-full bg-[#eef5f7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#305c66]">
            {durationMinutes} minutes of content
          </span>
        ) : null}
      </div>

      <ul className="mt-5 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm leading-6 text-[#526566]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a8a90]" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingFeatureList;
