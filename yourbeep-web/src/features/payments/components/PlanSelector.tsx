import type { BillingPlanType, PaymentCoursePricing } from "../services/paymentTypes";

type PlanSelectorProps = {
  pricing: PaymentCoursePricing;
  selectedPlan: BillingPlanType;
  onChange: (plan: BillingPlanType) => void;
};

const plans: Array<{
  plan: BillingPlanType;
  title: string;
  caption: string;
}> = [
  {
    plan: "six_month",
    title: "6 Month Access",
    caption: "A shorter guided commitment with full course access.",
  },
  {
    plan: "annual",
    title: "1 Year Access",
    caption: "The best long arc for steady practice and integration.",
  },
];

const PlanSelector = ({
  pricing,
  selectedPlan,
  onChange,
}: PlanSelectorProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((item) => {
        const isActive = selectedPlan === item.plan;
        const price =
          item.plan === "annual"
            ? pricing.displayPrice1yr
            : pricing.displayPrice6mo;

        return (
          <button
            key={item.plan}
            type="button"
            onClick={() => onChange(item.plan)}
            className={`rounded-[28px] border px-6 py-6 text-left transition ${
              isActive
                ? "border-[#1a4a58] bg-[#eef5f7] shadow-sm"
                : "border-[#e6dfd2] bg-white hover:border-[#c8d6db]"
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d8a8f]">
                  {item.title}
                </p>
                <h3 className="mt-2 text-[26px] font-bold text-[#1a2e38]">
                  {price}
                </h3>
              </div>
              {item.plan === "annual" ? (
                <span className="rounded-full bg-[#dbe9d8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436a49]">
                  Best Value
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-6 text-[#617273]">{item.caption}</p>
          </button>
        );
      })}
    </div>
  );
};

export default PlanSelector;
