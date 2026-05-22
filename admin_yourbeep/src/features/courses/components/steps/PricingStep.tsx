import { useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PencilLine,
  PlusCircle,
  ReceiptText,
  Trash2,
} from "lucide-react";
import { AnimatedDropdown } from "../../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../../components/ui/InputField";
import { MainButton } from "../../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../../components/ui/ShimmerBlock";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import type { PricingFormState } from "../../hooks/useCourseBuilder";
import { IconButton } from "../../../../components/ui/IconButton";

type PricingItem = {
  courseId: string;
  region: string;
  currency: string;
  amount6mo: number;
  amount1yr: number;
  stripeProductId6mo?: string;
  stripeProductId1yr?: string;
  stripePriceId6mo?: string;
  stripePriceId1yr?: string;
  updatedAt?: string;
};

type PricingStepProps = {
  pricingForm: PricingFormState;
  setPricingForm: Dispatch<SetStateAction<PricingFormState>>;
  pricingItems: PricingItem[];
  deletingPricingRegion: string | null;
  onSelectPricing: (pricing: PricingItem) => void;
  onDeletePricing: (region: string) => void;
  onSave: () => void;
  onBack: () => void;
  loading: boolean;
};

const cardClassName =
  "rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-[0_18px_50px_rgba(34,52,28,0.06)]";

const sectionMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const currencyOptions = [
  { label: "$ U.S. Dollar", value: "USD" },
  { label: "€ Euro", value: "EUR" },
  { label: "£ British Pound", value: "GBP" },
  { label: "C$ Canadian Dollars", value: "CAD" },
  { label: "A$ Australian Dollars", value: "AUD" },
  { label: "INR Indian Rupees", value: "INR" },
];

const priceFormatter = (currency: string, amount?: number | string) => {
  if (!amount) {
    return `${currency} 0`;
  }

  return `${currency} ${Number(amount).toLocaleString("en-IN")}`;
};

export default function PricingStep({
  pricingForm,
  setPricingForm,
  pricingItems,
  deletingPricingRegion,
  onSelectPricing,
  onDeletePricing,
  onSave,
  onBack,
  loading,
}: PricingStepProps) {
  const hasRows = pricingItems.length > 0;
  const [pendingDeleteRegion, setPendingDeleteRegion] = useState<string | null>(
    null,
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="space-y-6"
    >
      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7d3] bg-[#f4f8ef] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5f6f5d]">
                  <ReceiptText className="h-3.5 w-3.5" />
                  Pricing
                </div>
                <h3 className="mt-3 text-[24px] font-bold tracking-[-0.02em] text-[#203321]">
                  Set course pricing by region
                </h3>
                <p className="mt-2 max-w-[640px] text-sm leading-6 text-[#72806e]">
                  Save one region at a time. The most recently updated row stays
                  at the top so you can jump back in and edit it quickly later.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Region"
              name="pricing-region"
              value={pricingForm.region}
                placeholder="IN"
                helpText="Use a two-letter country code."
                onChange={(event) =>
                  setPricingForm((current) => ({
                    ...current,
                    region: event.target.value.toUpperCase(),
                }))
              }
            />
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#475467]">
                Currency
              </p>
              <AnimatedDropdown
                name="pricing-currency"
                value={pricingForm.currency}
                options={currencyOptions}
                placeholder="Select currency"
                onChange={(value) =>
                  setPricingForm((current) => ({
                    ...current,
                    currency: value,
                  }))
                }
              />
              <p className="text-xs leading-5 text-[#72806e]">
                Saves the ISO currency code required by pricing and Stripe.
              </p>
            </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="6 month amount"
                name="pricing-amount-6"
                type="number"
                value={pricingForm.amount6mo}
                placeholder="199"
                onChange={(event) =>
                  setPricingForm((current) => ({
                    ...current,
                    amount6mo: event.target.value,
                  }))
                }
              />
              <InputField
                label="Annual amount"
                name="pricing-amount-12"
                type="number"
                value={pricingForm.amount1yr}
                placeholder="499"
                onChange={(event) =>
                  setPricingForm((current) => ({
                    ...current,
                    amount1yr: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Stripe product ID (6 mo)"
                name="pricing-product-6"
                value={pricingForm.stripeProductId6mo}
                placeholder="prod_..."
                onChange={(event) =>
                  setPricingForm((current) => ({
                    ...current,
                    stripeProductId6mo: event.target.value,
                  }))
                }
              />
              <InputField
                label="Stripe product ID (1 yr)"
                name="pricing-product-12"
                value={pricingForm.stripeProductId1yr}
                placeholder="prod_..."
                onChange={(event) =>
                  setPricingForm((current) => ({
                    ...current,
                    stripeProductId1yr: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Stripe price ID (6 mo)"
                name="pricing-price-6"
                value={pricingForm.stripePriceId6mo}
                placeholder="price_..."
                onChange={(event) =>
                  setPricingForm((current) => ({
                    ...current,
                    stripePriceId6mo: event.target.value,
                  }))
                }
              />
              <InputField
                label="Stripe price ID (1 yr)"
                name="pricing-price-12"
                value={pricingForm.stripePriceId1yr}
                placeholder="price_..."
                onChange={(event) =>
                  setPricingForm((current) => ({
                    ...current,
                    stripePriceId1yr: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e6ebdf] bg-[#f9fbf6] p-5">
            <div className="rounded-[24px] border border-[#e1ead8] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#74816f]">
                Live pricing snapshot
              </p>
              <h4 className="mt-3 text-[22px] font-bold tracking-[-0.02em] text-[#203321]">
                {pricingForm.region || "Region"} ·{" "}
                {pricingForm.currency || "Currency"}
              </h4>
              <div className="mt-5 grid gap-3">
                <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                    Six months
                  </p>
                  <p className="mt-2 text-xl font-bold text-[#203321]">
                    {priceFormatter(
                      pricingForm.currency || "INR",
                      pricingForm.amount6mo,
                    )}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#72806e]">
                    Stripe price:{" "}
                    {pricingForm.stripePriceId6mo || "Not added yet"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                    Annual
                  </p>
                  <p className="mt-2 text-xl font-bold text-[#203321]">
                    {priceFormatter(
                      pricingForm.currency || "INR",
                      pricingForm.amount1yr,
                    )}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#72806e]">
                    Stripe price:{" "}
                    {pricingForm.stripePriceId1yr || "Not added yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#203321]">
              Saved pricing rows
            </h3>
            <p className="mt-1 text-sm text-[#74816f]">
              Click a row to load it into the form, update it, or remove it
              entirely.
            </p>
          </div>
        </div>

        {!hasRows && loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-[24px] border border-[#edf1e7] bg-[#fbfcf8] px-4 py-4 md:grid-cols-[0.8fr_0.7fr_0.9fr_0.9fr_1.1fr_160px]"
              >
                <ShimmerBlock className="h-4 w-16" />
                <ShimmerBlock className="h-4 w-16" />
                <ShimmerBlock className="h-4 w-24" />
                <ShimmerBlock className="h-4 w-24" />
                <ShimmerBlock className="h-4 w-full" />
                <div className="flex gap-2">
                  <ShimmerBlock className="h-10 flex-1 rounded-xl" />
                  <ShimmerBlock className="h-10 flex-1 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : hasRows ? (
          <div className="overflow-hidden rounded-[24px] border border-[#edf1e7]">
            <div className="hidden grid-cols-[0.8fr_0.7fr_0.9fr_0.9fr_1.1fr_160px] gap-4 bg-[#f8faf5] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#74816f] md:grid">
              <p>Region</p>
              <p>Currency</p>
              <p>6 Months</p>
              <p>1 Year</p>
              <p>Stripe IDs</p>
              <p className="text-right">Actions</p>
            </div>

            <div className="divide-y divide-[#edf1e7]">
              {pricingItems.map((item, index) => (
                <motion.div
                  key={`${item.courseId}-${item.region}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="grid gap-4 bg-white px-4 py-4 md:grid-cols-[0.8fr_0.7fr_0.9fr_0.9fr_1.1fr_160px] md:items-center"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74816f] md:hidden">
                      Region
                    </p>
                    <p className="text-sm font-semibold text-[#203321]">
                      {item.region}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74816f] md:hidden">
                      Currency
                    </p>
                    <p className="text-sm text-[#203321]">{item.currency}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74816f] md:hidden">
                      6 Months
                    </p>
                    <p className="text-sm text-[#314330]">
                      {priceFormatter(item.currency, item.amount6mo)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74816f] md:hidden">
                      1 Year
                    </p>
                    <p className="text-sm text-[#314330]">
                      {priceFormatter(item.currency, item.amount1yr)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74816f] md:hidden">
                      Stripe IDs
                    </p>
                    <p className="text-xs leading-5 text-[#74816f]">
                      {item.stripePriceId6mo || "—"} /{" "}
                      {item.stripePriceId1yr || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <IconButton
                      ariaLabel="Edit"
                      icon={<PencilLine className="h-4 w-4" />}
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectPricing(item)}
                    />
                    <MainButton
                      text={
                        deletingPricingRegion === item.region
                          ? "Deleting..."
                          : "Delete"
                      }
                      size="sm"
                      variant="soft"
                      headIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => setPendingDeleteRegion(item.region)}
                      isLoading={deletingPricingRegion === item.region}
                      disabled={Boolean(deletingPricingRegion)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-5 py-8 text-sm text-[#74816f]">
            No pricing rows exist yet. Save one region to create the first
            purchasable plan for this course.
          </div>
        )}
      </motion.section>

      <motion.div
        variants={sectionMotion}
        className="sticky bottom-4 z-10 flex flex-wrap justify-between gap-3 rounded-[24px] border border-[#e7eadf] bg-white/92 px-4 py-4 shadow-[0_20px_50px_rgba(32,51,33,0.08)] backdrop-blur"
      >
        <MainButton
          text="Back"
          variant="outline"
          size="lg"
          headIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={onBack}
        />
        <div className="flex flex-wrap gap-3">
          <MainButton
            text="New Region"
            variant="soft"
            size="lg"
            headIcon={<PlusCircle className="h-4 w-4" />}
            onClick={() =>
              setPricingForm({
                region: "IN",
                currency: "INR",
                amount6mo: "",
                amount1yr: "",
                stripeProductId6mo: "",
                stripeProductId1yr: "",
                stripePriceId6mo: "",
                stripePriceId1yr: "",
              })
            }
          />
          <MainButton
            text={loading ? "Saving..." : "Save Pricing & Continue"}
            size="lg"
            onClick={onSave}
            isLoading={loading}
          />
        </div>
      </motion.div>

      <ConfirmDialog
        open={Boolean(pendingDeleteRegion)}
        title="Delete pricing row?"
        description={`This will remove the ${pendingDeleteRegion || ""} pricing setup for this course.`}
        confirmText="Delete pricing"
        loading={Boolean(
          pendingDeleteRegion &&
            deletingPricingRegion === pendingDeleteRegion,
        )}
        onCancel={() => setPendingDeleteRegion(null)}
        onConfirm={() => {
          if (!pendingDeleteRegion) {
            return;
          }
          void onDeletePricing(pendingDeleteRegion);
          setPendingDeleteRegion(null);
        }}
      />
    </motion.div>
  );
}
