import PrimaryButton from "@components/common/PrimaryButton";
import type {
  PaymentCourseAccess,
  PaymentCoursePricing,
  PromotionPreview,
} from "../services/paymentTypes";

type PurchaseSummaryCardProps = {
  pricing: PaymentCoursePricing;
  selectedPlanLabel: string;
  displaySelectedPlanPrice: string;
  preview: PromotionPreview | null;
  access: PaymentCourseAccess;
  checkoutMode: "purchase" | "renew";
  checkingOut: boolean;
  onCheckout: () => void | Promise<void>;
};

const formatDate = (value?: string | null) => {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const PurchaseSummaryCard = ({
  pricing,
  selectedPlanLabel,
  displaySelectedPlanPrice,
  preview,
  access,
  checkoutMode,
  checkingOut,
  onCheckout,
}: PurchaseSummaryCardProps) => {
  const expiryLabel = formatDate(access.purchase?.expiryDate);
  const finalAmountLabel =
    preview?.finalAmount && preview.finalAmount > 0
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: pricing.currency,
          maximumFractionDigits: 0,
        }).format(preview.finalAmount)
      : displaySelectedPlanPrice;

  return (
    <div className="rounded-[32px] bg-[#1a3a44] p-7 text-white shadow-[0_24px_80px_rgba(26,58,68,0.18)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
        Checkout summary
      </p>
      <h3 className="mt-3 text-[28px] font-bold leading-tight">
        {checkoutMode === "renew" ? "Renew your access" : "Unlock this course"}
      </h3>

      <div className="mt-6 rounded-[24px] bg-white/8 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{selectedPlanLabel}</p>
            <p className="mt-1 text-sm text-white/60">
              Region {pricing.region} · Currency {pricing.currency}
            </p>
          </div>
          <p className="text-[24px] font-bold text-white">{finalAmountLabel}</p>
        </div>

        {preview ? (
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex items-center justify-between text-white/70">
              <span>Original</span>
              <span>
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: pricing.currency,
                  maximumFractionDigits: 0,
                }).format(preview.originalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#c7ebd5]">
              <span>Discount</span>
              <span>
                -
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: pricing.currency,
                  maximumFractionDigits: 0,
                }).format(preview.discountAmount)}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {access.hasAccess && expiryLabel ? (
        <div className="mt-5 rounded-2xl border border-[#7bc39b]/20 bg-[#7bc39b]/10 px-4 py-4 text-sm text-[#dff6e6]">
          Your current access is active until {expiryLabel}.
        </div>
      ) : null}

      <PrimaryButton
        onClick={() => void onCheckout()}
        disabled={checkingOut || access.hasAccess}
        fullWidth
        className="mt-6 rounded-full py-4 text-[12px] font-semibold uppercase tracking-[0.18em]"
      >
        {access.hasAccess
          ? "Already Active"
          : checkingOut
            ? "Redirecting..."
            : checkoutMode === "renew"
              ? "Renew with Stripe"
              : "Continue to Stripe"}
      </PrimaryButton>

      <p className="mt-4 text-center text-xs leading-6 text-white/55">
        Stripe handles the payment securely. You will return here automatically
        after payment to confirm your access.
      </p>
    </div>
  );
};

export default PurchaseSummaryCard;
