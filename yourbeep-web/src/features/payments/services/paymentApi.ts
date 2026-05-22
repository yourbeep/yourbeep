import api from "@services/api";
import type {
  BillingPlanType,
  CheckoutConfirmed,
  CheckoutInitiated,
  CheckoutMode,
  CoursePaymentPageData,
  PaymentCourseAccess,
  PaymentCoursePricing,
  PaymentCourseSummary,
  PromotionPreview,
} from "./paymentTypes";

type RawCourseDetail = {
  _id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  thumbnail?: string | null;
  durationMinutes?: number | null;
  games?: Array<unknown>;
};

type RawPricing = {
  region?: string;
  currency?: string;
  amount6mo?: number;
  amount1yr?: number;
  displayPrice6mo?: string;
  displayPrice1yr?: string;
  plans?: {
    sixMonth?: {
      amount?: number;
      displayPrice?: string;
      planType?: string;
      stripePriceId?: string | null;
    } | null;
    annual?: {
      amount?: number;
      displayPrice?: string;
      planType?: string;
      stripePriceId?: string | null;
      savings?: string | null;
    } | null;
  } | null;
};

type RawAccess = {
  hasAccess?: boolean;
  reason?: string | null;
  expiredAt?: string | null;
  canRenew?: boolean;
  purchase?: {
    purchaseId?: string;
    planType?: string;
    status?: string;
    startDate?: string | null;
    expiryDate?: string | null;
    daysRemaining?: number | null;
  } | null;
};

const fallbackCourseImage =
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80";

const formatCurrency = (currency: string, amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const mapCourse = (course: RawCourseDetail): PaymentCourseSummary => ({
  id: String(course._id),
  title: course.title || "Course",
  subtitle: course.subtitle || "A guided journey into deeper awareness.",
  description:
    course.description ||
    course.shortDescription ||
    "A structured course designed to help you move from insight into practice.",
  thumbnail: course.thumbnail || fallbackCourseImage,
  gamesCount: Array.isArray(course.games) ? course.games.length : 0,
  durationMinutes: Number(course.durationMinutes ?? 0),
});

const mapPricing = (pricing: RawPricing): PaymentCoursePricing => {
  const currency = String(pricing.currency || "INR");
  const amount6mo = Number(pricing.plans?.sixMonth?.amount ?? pricing.amount6mo ?? 0);
  const amount1yr = Number(pricing.plans?.annual?.amount ?? pricing.amount1yr ?? 0);

  return {
    region: String(pricing.region || "IN"),
    currency,
    amount6mo,
    amount1yr,
    displayPrice6mo:
      pricing.plans?.sixMonth?.displayPrice ||
      pricing.displayPrice6mo ||
      formatCurrency(currency, amount6mo),
    displayPrice1yr:
      pricing.plans?.annual?.displayPrice ||
      pricing.displayPrice1yr ||
      formatCurrency(currency, amount1yr),
  };
};

const mapAccess = (access: RawAccess | null): PaymentCourseAccess => ({
  hasAccess: Boolean(access?.hasAccess),
  reason: access?.reason ?? null,
  expiredAt: access?.expiredAt ?? null,
  canRenew: Boolean(access?.canRenew),
  purchase: access?.purchase
    ? {
        purchaseId: String(access.purchase.purchaseId || ""),
        planType: String(access.purchase.planType || ""),
        status: String(access.purchase.status || ""),
        startDate: access.purchase.startDate ?? null,
        expiryDate: access.purchase.expiryDate ?? null,
        daysRemaining:
          typeof access.purchase.daysRemaining === "number"
            ? access.purchase.daysRemaining
            : null,
      }
    : null,
});

const normalizePromotion = (promotion: unknown) => {
  if (!promotion || typeof promotion !== "object") {
    return null;
  }

  const record = promotion as Record<string, unknown>;

  return {
    id: typeof record.id === "string" ? record.id : undefined,
    name: typeof record.name === "string" ? record.name : undefined,
    code: typeof record.code === "string" ? record.code : undefined,
    discountType:
      typeof record.discountType === "string" ? record.discountType : undefined,
    discountValue:
      typeof record.discountValue === "number" ? record.discountValue : undefined,
  };
};

export const paymentApi = {
  async getCoursePaymentPage(courseId: string): Promise<CoursePaymentPageData> {
    const [courseResponse, pricingResponse, accessResponse] = await Promise.all([
      api.get(`/courses/${courseId}`),
      api.get(`/courses/${courseId}/price`),
      api.get(`/commerce/courses/${courseId}/access`).catch(() => null),
    ]);

    return {
      course: mapCourse(courseResponse.data?.data as RawCourseDetail),
      pricing: mapPricing(pricingResponse.data?.data as RawPricing),
      access: mapAccess((accessResponse?.data?.data ?? null) as RawAccess | null),
    };
  },

  async previewPromotion(input: {
    courseId: string;
    planType: BillingPlanType;
    promotionCode?: string;
  }): Promise<PromotionPreview> {
    const response = await api.post(
      `/commerce/courses/${input.courseId}/promotion/preview`,
      {
        planType: input.planType,
        promotionCode: input.promotionCode?.trim() || undefined,
      },
    );

    const data = response.data?.data ?? {};

    return {
      originalAmount: Number(data.originalAmount ?? 0),
      discountAmount: Number(data.discountAmount ?? 0),
      finalAmount: Number(data.finalAmount ?? 0),
      appliedPromotion: normalizePromotion(data.appliedPromotion),
    };
  },

  async initiateCheckout(input: {
    courseId: string;
    planType: BillingPlanType;
    promotionCode?: string;
    successUrl: string;
    cancelUrl: string;
    mode: CheckoutMode;
  }): Promise<CheckoutInitiated> {
    const endpoint =
      input.mode === "renew" ? "renew/initiate" : "purchase/initiate";
    const response = await api.post(
      `/commerce/courses/${input.courseId}/${endpoint}`,
      {
        planType: input.planType,
        promotionCode: input.promotionCode?.trim() || undefined,
        phoneCountryCode: "+91",
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
      },
    );

    const data = response.data?.data ?? {};

    return {
      checkoutUrl: String(data.checkoutUrl || ""),
      sessionId: String(data.sessionId || ""),
      purchaseId: String(data.purchaseId || ""),
      originalAmount: Number(data.originalAmount ?? 0),
      discountAmount: Number(data.discountAmount ?? 0),
      finalAmount: Number(data.finalAmount ?? 0),
      appliedPromotion: normalizePromotion(data.appliedPromotion),
      expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : null,
    };
  },

  async confirmCheckout(input: {
    courseId: string;
    sessionId: string;
    mode: CheckoutMode;
  }): Promise<CheckoutConfirmed> {
    const endpoint =
      input.mode === "renew" ? "renew/confirm" : "purchase/confirm";
    const response = await api.post(
      `/commerce/courses/${input.courseId}/${endpoint}`,
      {
        sessionId: input.sessionId,
      },
    );

    const data = response.data?.data ?? {};

    return {
      purchaseId: String(data.purchaseId || ""),
      status: String(data.status || ""),
      accessGranted: Boolean(data.accessGranted),
      startDate: typeof data.startDate === "string" ? data.startDate : null,
      expiryDate: typeof data.expiryDate === "string" ? data.expiryDate : null,
    };
  },
};
