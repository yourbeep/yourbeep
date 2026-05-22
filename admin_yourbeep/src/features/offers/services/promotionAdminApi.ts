import type { PromotionItem } from "../../../store/slices/offers";

export type PromotionFormState = {
  name: string;
  code: string;
  description: string;
  courseId: string;
  regions: string;
  planTypes: Array<"six_month" | "annual">;
  discountType: "percentage" | "fixed_amount";
  percentageOff: string;
  amountOff: string;
  currency: string;
  autoApply: boolean;
  startsAt: string;
  endsAt: string;
  maxRedemptions: string;
  perUserLimit: string;
  isActive: boolean;
};

export const buildPromotionPayload = (form: PromotionFormState) => {
  const payload: Record<string, unknown> = {
    name: form.name.trim(),
    code: form.code.trim().toUpperCase(),
    description: form.description.trim() || undefined,
    courseId: form.courseId || undefined,
    regions: form.regions
      .split(",")
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean),
    planTypes: form.planTypes,
    discountType: form.discountType,
    autoApply: form.autoApply,
    startsAt: form.startsAt || undefined,
    endsAt: form.endsAt || undefined,
    maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : undefined,
    perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : 1,
    isActive: form.isActive,
  };

  if (form.discountType === "percentage") {
    payload.percentageOff = Number(form.percentageOff);
  } else {
    payload.amountOff = Number(form.amountOff);
    payload.currency = form.currency.trim().toUpperCase();
  }

  return payload;
};

export const getDefaultPromotionForm = (): PromotionFormState => ({
  name: "",
  code: "",
  description: "",
  courseId: "",
  regions: "",
  planTypes: ["six_month", "annual"],
  discountType: "percentage",
  percentageOff: "",
  amountOff: "",
  currency: "INR",
  autoApply: false,
  startsAt: "",
  endsAt: "",
  maxRedemptions: "",
  perUserLimit: "1",
  isActive: true,
});

export const mapPromotionToForm = (
  promotion: PromotionItem,
): PromotionFormState => ({
  name: promotion.name ?? "",
  code: promotion.code ?? "",
  description: promotion.description ?? "",
  courseId: promotion.courseId ?? "",
  regions: (promotion.regions ?? []).join(", "),
  planTypes: promotion.planTypes ?? ["six_month", "annual"],
  discountType: promotion.discountType ?? "percentage",
  percentageOff:
    promotion.percentageOff != null ? String(promotion.percentageOff) : "",
  amountOff: promotion.amountOff != null ? String(promotion.amountOff) : "",
  currency: promotion.currency ?? "INR",
  autoApply: Boolean(promotion.autoApply),
  startsAt: promotion.startsAt ? String(promotion.startsAt).slice(0, 10) : "",
  endsAt: promotion.endsAt ? String(promotion.endsAt).slice(0, 10) : "",
  maxRedemptions:
    promotion.maxRedemptions != null ? String(promotion.maxRedemptions) : "",
  perUserLimit:
    promotion.perUserLimit != null ? String(promotion.perUserLimit) : "1",
  isActive: Boolean(promotion.isActive),
});

export const formatPromotionDiscount = (promotion: PromotionItem) => {
  if (promotion.discountType === "percentage") {
    return `${promotion.percentageOff}% off`;
  }

  return `${promotion.currency || ""} ${promotion.amountOff} off`.trim();
};
