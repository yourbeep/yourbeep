import PrimaryButton from "@components/common/PrimaryButton";

type PromotionFormProps = {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void | Promise<void>;
  loading: boolean;
};

const PromotionForm = ({
  value,
  onChange,
  onApply,
  loading,
}: PromotionFormProps) => {
  return (
    <div className="rounded-[28px] border border-[#e6dfd2] bg-white p-6">
      <div className="mb-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d8a8f]">
          Promotion code
        </p>
        <h3 className="mt-2 text-[22px] font-bold text-[#1a2e38]">
          Apply an offer
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#617273]">
          If you have a launch code or regional offer, preview it before you go
          to Stripe checkout.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter promotion code"
          className="min-w-0 flex-1 rounded-full border border-[#dde4e7] bg-[#f8fafb] px-5 py-3 text-sm text-[#1a2e38] outline-none transition focus:border-[#1a4a58]"
        />
        <PrimaryButton
          onClick={() => void onApply()}
          disabled={!value.trim() || loading}
          className="whitespace-nowrap px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em]"
        >
          {loading ? "Checking..." : "Apply Code"}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PromotionForm;
