import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  MapPin,
  Receipt,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { OrderItem } from "../../../store/slices/orders/ordersTypes";
import {
  formatCurrency,
  formatDateTime,
  orderStatusLabel,
  orderStatusVariant,
  planLabel,
} from "../services/orderFormatters";

const refundReasons = [
  "duplicate",
  "fraudulent",
  "requested_by_customer",
  "other",
] as const;

type RefundFormState = {
  reason: string;
  partialAmount: string;
  notes: string;
};

type OrderDetailPanelProps = {
  order: OrderItem | null;
  loading: boolean;
  mutating: boolean;
  refundForm: RefundFormState;
  setRefundForm: React.Dispatch<React.SetStateAction<RefundFormState>>;
  courseTitle: string;
  onClose: () => void;
  onRefund: () => void;
};

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <ShimmerBlock className="h-3 w-28" />
          <ShimmerBlock className="h-8 w-56" />
          <ShimmerBlock className="h-4 w-72 max-w-full" />
        </div>
        <ShimmerBlock className="h-11 w-28" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
            <ShimmerBlock className="h-3 w-20" />
            <ShimmerBlock className="mt-4 h-5 w-24" />
            <ShimmerBlock className="mt-2 h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <ShimmerBlock className="h-[360px] w-full rounded-[28px]" />
        <div className="space-y-6">
          <ShimmerBlock className="h-[210px] w-full rounded-[28px]" />
          <ShimmerBlock className="h-[260px] w-full rounded-[28px]" />
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPanel({
  order,
  loading,
  mutating,
  refundForm,
  setRefundForm,
  courseTitle,
  onClose,
  onRefund,
}: OrderDetailPanelProps) {
  if (!order && !loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm"
    >
      {loading || !order ? (
        <DetailSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Purchase Detail
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h3 className="text-[28px] font-bold tracking-tight text-[#203321]">
                  {order._id}
                </h3>
                <StatusPill variant={orderStatusVariant[order.status]} size="md" dot>
                  {orderStatusLabel(order.status)}
                </StatusPill>
              </div>
              <p className="mt-2 text-sm text-[#74816f]">{courseTitle}</p>
            </div>

            <MainButton
              text="Back to orders"
              variant="outline"
              headIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={onClose}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Amount Paid
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {formatCurrency(order.amountPaid, order.currency)}
              </p>
            </div>
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Plan
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {planLabel(order.planType)}
              </p>
            </div>
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Access
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {order.accessGranted ? "Granted" : "Revoked"}
              </p>
            </div>
            <div className="rounded-[22px] border border-[#edf0e7] bg-[#fbfcf8] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                Promotion
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203321]">
                {order.promotionCode || "None"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <section className="space-y-6">
              <div className="rounded-[28px] border border-[#e7eadf] bg-[#fbfcf8] p-5">
                <div className="flex items-center gap-2 text-[#203321]">
                  <Receipt className="h-4 w-4 text-[#65745f]" />
                  <h4 className="text-base font-bold">Purchase metadata</h4>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <p className="text-sm text-[#445342]">
                    Course id: <span className="font-semibold">{order.courseId}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    User id: <span className="font-semibold">{order.userId}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Region: <span className="font-semibold">{order.region}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Detected IP region: <span className="font-semibold">{order.detectedRegionIp}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Purchased at: <span className="font-semibold">{formatDateTime(order.purchasedAt)}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Expiry: <span className="font-semibold">{formatDateTime(order.expiryDate)}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Discount: <span className="font-semibold">{formatCurrency(order.discountAmount, order.currency)}</span>
                  </p>
                  <p className="text-sm text-[#445342]">
                    Region mismatch: <span className="font-semibold">{order.regionMismatch ? "Yes" : "No"}</span>
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {order.renewedFromId ? (
                    <StatusPill variant="info">Renewed from {order.renewedFromId}</StatusPill>
                  ) : null}
                  {order.phoneCountryCode ? (
                    <StatusPill variant="muted">{order.phoneCountryCode}</StatusPill>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#203321]">
                  <CreditCard className="h-4 w-4 text-[#65745f]" />
                  <h4 className="text-base font-bold">Stripe references</h4>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#445342]">
                  <p>Session: <span className="break-all font-semibold">{order.stripeSessionId || "N/A"}</span></p>
                  <p>Customer: <span className="break-all font-semibold">{order.stripeCustomerId || "N/A"}</span></p>
                  <p>Subscription: <span className="break-all font-semibold">{order.stripeSubscriptionId || "N/A"}</span></p>
                  <p>Invoice: <span className="break-all font-semibold">{order.stripeInvoiceId || "N/A"}</span></p>
                  <p>Payment intent: <span className="break-all font-semibold">{order.stripePaymentIntentId || "N/A"}</span></p>
                  <p>Refund: <span className="break-all font-semibold">{order.stripeRefundId || "N/A"}</span></p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#203321]">
                  <CalendarClock className="h-4 w-4 text-[#65745f]" />
                  <h4 className="text-base font-bold">Lifecycle</h4>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#445342]">
                  <p>Created: <span className="font-semibold">{formatDateTime(order.createdAt)}</span></p>
                  <p>Updated: <span className="font-semibold">{formatDateTime(order.updatedAt)}</span></p>
                  <p>Start date: <span className="font-semibold">{formatDateTime(order.startDate)}</span></p>
                  <p>Expiry date: <span className="font-semibold">{formatDateTime(order.expiryDate)}</span></p>
                </div>
              </div>

              {order.status !== "refunded" ? (
                <div className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-[#203321]">
                    <RotateCcw className="h-4 w-4 text-[#9e4738]" />
                    <h4 className="text-base font-bold">Refund purchase</h4>
                  </div>

                  <div className="mt-4 grid gap-4">
                    <AnimatedDropdown
                      name="refund-reason"
                      label="Refund reason"
                      value={refundForm.reason}
                      options={refundReasons.map((reason) => ({
                        label: reason.replace(/_/g, " "),
                        value: reason,
                      }))}
                      onChange={(value) =>
                        setRefundForm((current) => ({ ...current, reason: value }))
                      }
                    />
                    <InputField
                      label="Partial Amount"
                      type="number"
                      value={refundForm.partialAmount}
                      placeholder="Optional integer amount"
                      onChange={(event) =>
                        setRefundForm((current) => ({
                          ...current,
                          partialAmount: event.target.value,
                        }))
                      }
                      inputClassName="bg-white"
                    />
                    <InputField
                      element="textarea"
                      label="Internal Notes"
                      value={refundForm.notes}
                      rows={4}
                      placeholder="Add a note explaining the refund context"
                      onChange={(event) =>
                        setRefundForm((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      inputClassName="min-h-[140px] bg-white"
                    />
                  </div>

                  <div className="mt-5">
                    <MainButton
                      text="Refund Purchase"
                      variant="danger"
                      isLoading={mutating}
                      headIcon={<ShieldCheck className="h-4 w-4" />}
                      onClick={onRefund}
                    />
                  </div>
                </div>
              ) : null}

              {order.status === "refunded" ? (
                <div className="rounded-[28px] border border-[#e7eadf] bg-[#f7f8f3] p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-[#203321]">
                    <MapPin className="h-4 w-4 text-[#65745f]" />
                    <h4 className="text-base font-bold">Refund already applied</h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#445342]">
                    This purchase has already been refunded. Review the Stripe refund
                    reference above for audit trail details.
                  </p>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      )}
    </motion.div>
  );
}
