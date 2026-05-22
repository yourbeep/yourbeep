import type { PaymentNotice } from "@store/slices/payments";

type CheckoutBannerProps = {
  notice: PaymentNotice | null;
  onDismiss: () => void;
};

const toneMap = {
  success: "border-[#d7ead8] bg-[#edf8ee] text-[#2f6a39]",
  info: "border-[#dbe5ea] bg-[#eef5f8] text-[#2b5c68]",
  error: "border-[#efd9d9] bg-[#fbefef] text-[#8b4a4a]",
} as const;

const CheckoutBanner = ({ notice, onDismiss }: CheckoutBannerProps) => {
  if (!notice) return null;

  return (
    <div
      className={`mb-6 flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 text-sm ${toneMap[notice.type]}`}
    >
      <p className="leading-6">{notice.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] opacity-75 transition hover:opacity-100"
      >
        Dismiss
      </button>
    </div>
  );
};

export default CheckoutBanner;
