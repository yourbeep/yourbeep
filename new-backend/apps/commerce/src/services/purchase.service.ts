import { AppError, env, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import type Stripe from "stripe";
import { CoursePurchaseModel, type CoursePurchaseRecord, type PlanType } from "../models/course-purchase";
import { PricingModel } from "../models/pricing";
import { RefundModel } from "../models/refund";
import {
  cancelStripeSubscription,
  constructStripeWebhookEvent,
  createStripeCheckoutSession,
  createStripeRefund,
  retrieveStripeCheckoutSession,
  retrieveStripeInvoice,
  retrieveStripeSubscription,
} from "./stripe.service";
import { finalizePromotionRedemption, resolvePromotionPreview } from "./promotion.service";
import type { z } from "zod";
import {
  purchaseConfirmSchema,
  purchaseInitiateSchema,
  purchaseListQuerySchema,
  processSubscriptionNotificationsSchema,
  refundSchema,
  revenueQuerySchema,
} from "../validators";

type PurchaseInitiateInput = z.infer<typeof purchaseInitiateSchema>;
type PurchaseConfirmInput = z.infer<typeof purchaseConfirmSchema>;
type PurchaseListQuery = z.infer<typeof purchaseListQuerySchema>;
type RefundInput = z.infer<typeof refundSchema>;
type RevenueQuery = z.infer<typeof revenueQuerySchema>;
type ProcessSubscriptionNotificationsInput = z.infer<typeof processSubscriptionNotificationsSchema>;
type StripeInvoiceLike = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
  payment_intent?: string | Stripe.PaymentIntent | null;
};

const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const round = (value: number) => Number(value.toFixed(2));

const phoneCountryCodeToRegion = (phoneCountryCode?: string) => {
  const map: Record<string, string> = {
    "+91": "IN",
    "+1": "US",
    "+44": "GB",
  };
  return phoneCountryCode ? map[phoneCountryCode] : undefined;
};

const getPlanMonths = (planType: PlanType) => (planType === "six_month" ? 6 : 12);

const getActiveOrLatestPurchase = async (userId: string, courseId: string) =>
  CoursePurchaseModel.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  }).sort({ createdAt: -1 });

const getPricingForPurchase = async (courseId: string, detectedRegionIp: string, payload: PurchaseInitiateInput) => {
  const regionFromPhone = phoneCountryCodeToRegion(payload.phoneCountryCode);
  const resolvedRegion = regionFromPhone ?? detectedRegionIp;
  const pricing = await PricingModel.findOne({
    courseId: new Types.ObjectId(courseId),
    region: resolvedRegion,
  });

  if (!pricing) {
    throw new AppError("No pricing found for the requested region", 422, "REGION_NOT_SUPPORTED");
  }

  return {
    pricing,
    regionFromPhone,
    resolvedRegion,
  };
};

const getPlanPriceId = (
  pricing: {
    stripePriceId6mo?: string;
    stripePriceId1yr?: string;
  },
  planType: PlanType,
) => {
  const stripePriceId = planType === "six_month" ? pricing.stripePriceId6mo : pricing.stripePriceId1yr;

  if (!stripePriceId) {
    throw new AppError("Stripe price is not configured for this plan", 422, "STRIPE_PRICE_NOT_CONFIGURED");
  }

  return stripePriceId;
};

const getPlanAmount = (
  pricing: {
    amount6mo: number;
    amount1yr: number;
  },
  planType: PlanType,
) => (planType === "six_month" ? pricing.amount6mo : pricing.amount1yr);

const toDateFromUnix = (value?: number | null) => (value ? new Date(value * 1000) : undefined);

const markPurchaseFromSubscription = async (
  purchase: CoursePurchaseRecord,
  subscription: Stripe.Subscription,
  extras?: {
    customerId?: string | null;
    invoiceId?: string | null;
    paymentIntentId?: string | null;
  },
) => {
  const now = new Date();
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
  const expiryDate = toDateFromUnix(currentPeriodEnd) ?? addMonths(now, getPlanMonths(purchase.planType));
  const activeStripeStatuses = new Set<Stripe.Subscription.Status>(["active", "trialing", "past_due"]);
  const hasAccess = activeStripeStatuses.has(subscription.status) && expiryDate > now;

  purchase.status = hasAccess ? "active" : subscription.status === "canceled" ? "cancelled" : expiryDate <= now ? "expired" : "pending";
  purchase.accessGranted = hasAccess;
  purchase.stripeCustomerId = extras?.customerId ?? purchase.stripeCustomerId;
  purchase.stripeSubscriptionId = subscription.id;
  purchase.stripeInvoiceId = extras?.invoiceId ?? purchase.stripeInvoiceId;
  purchase.stripePaymentIntentId = extras?.paymentIntentId ?? purchase.stripePaymentIntentId;
  purchase.startDate = toDateFromUnix(subscription.start_date) ?? purchase.startDate ?? now;
  purchase.purchasedAt = purchase.purchasedAt ?? now;
  purchase.expiryDate = expiryDate;
  await purchase.save();

  return purchase;
};

const syncPurchaseFromSession = async (
  purchase: CoursePurchaseRecord,
  session: Stripe.Checkout.Session,
) => {
  const wasPurchased = Boolean(purchase.purchasedAt);
  purchase.stripeSessionId = session.id;
  purchase.stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer && "id" in session.customer
        ? session.customer.id
        : purchase.stripeCustomerId;
  purchase.stripeInvoiceId =
    typeof session.invoice === "string"
      ? session.invoice
      : session.invoice && "id" in session.invoice
        ? session.invoice.id
        : purchase.stripeInvoiceId;
  purchase.stripePaymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent && "id" in session.payment_intent
        ? session.payment_intent.id
        : purchase.stripePaymentIntentId;

  if (!session.subscription || typeof session.subscription !== "string") {
    await purchase.save();
    return purchase;
  }

  const subscription = await retrieveStripeSubscription(session.subscription);
  let paymentIntentId = purchase.stripePaymentIntentId ?? null;

  if (purchase.stripeInvoiceId) {
    const invoice = (await retrieveStripeInvoice(purchase.stripeInvoiceId)) as unknown as StripeInvoiceLike;
    paymentIntentId =
      typeof invoice.payment_intent === "string"
        ? invoice.payment_intent
        : invoice.payment_intent && "id" in invoice.payment_intent
          ? invoice.payment_intent.id
          : paymentIntentId;
  }

  const syncedPurchase = await markPurchaseFromSubscription(purchase, subscription, {
    customerId: purchase.stripeCustomerId,
    invoiceId: purchase.stripeInvoiceId,
    paymentIntentId,
  });

  if (!wasPurchased && syncedPurchase.purchasedAt) {
    await finalizePromotionRedemption(syncedPurchase);
  }

  return syncedPurchase;
};

const findPurchaseForWebhook = async (eventObject: Record<string, unknown>) => {
  const sessionId = typeof eventObject.id === "string" && eventObject.id.startsWith("cs_") ? eventObject.id : null;
  const subscriptionId = typeof eventObject.subscription === "string" ? eventObject.subscription : null;
  const paymentIntentId =
    typeof eventObject.payment_intent === "string"
      ? eventObject.payment_intent
      : typeof eventObject.id === "string" && eventObject.id.startsWith("pi_")
        ? eventObject.id
        : null;

  if (sessionId) {
    return CoursePurchaseModel.findOne({ stripeSessionId: sessionId }).sort({ createdAt: -1 });
  }

  if (subscriptionId) {
    return CoursePurchaseModel.findOne({ stripeSubscriptionId: subscriptionId }).sort({ createdAt: -1 });
  }

  if (paymentIntentId) {
    return CoursePurchaseModel.findOne({ stripePaymentIntentId: paymentIntentId }).sort({ createdAt: -1 });
  }

  return null;
};

const getMonthWindow = () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { now, currentMonthStart, previousMonthStart };
};

const calculateChange = (current: number, previous: number) => {
  const delta = round(current - previous);
  const percentChange = previous === 0 ? (current === 0 ? 0 : 100) : round((delta / previous) * 100);
  return {
    current: round(current),
    previous: round(previous),
    delta,
    percentChange,
  };
};

const sendNotification = async (
  purchase: CoursePurchaseRecord,
  payload: {
    type:
      | "purchase_confirmed"
      | "subscription_expiring"
      | "subscription_expired";
    title: string;
    body: string;
    data?: Record<string, string | number | boolean>;
  },
) => {
  await httpJson(`${env.IDENTITY_URL}/internal/notifications/send`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
    },
    body: JSON.stringify({
      type: payload.type,
      userId: purchase.userId.toString(),
      courseId: purchase.courseId.toString(),
      title: payload.title,
      body: payload.body,
      data: {
        purchaseId: purchase.id,
        planType: purchase.planType,
        ...(payload.data ?? {}),
      },
    }),
  }).catch(() => null);
};

const sendPurchaseConfirmedNotification = async (purchase: CoursePurchaseRecord) =>
  sendNotification(purchase, {
    type: "purchase_confirmed",
    title: "Purchase confirmed",
    body: "Your course purchase is confirmed and ready to access.",
  });

export const getUserPurchases = async (userId: string) => {
  const purchases = await CoursePurchaseModel.find({
    userId: new Types.ObjectId(userId),
  }).sort({ createdAt: -1 });

  return { purchases };
};

export const getPurchaseAccess = async (userId: string, courseId: string) => {
  const now = new Date();
  const purchase = await CoursePurchaseModel.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  }).sort({ createdAt: -1 });

  if (!purchase) {
    return { hasAccess: false, reason: "not_purchased", canRenew: false };
  }

  if (purchase.status === "active" && purchase.accessGranted && purchase.expiryDate && purchase.expiryDate > now) {
    const daysRemaining = Math.max(0, Math.ceil((purchase.expiryDate.getTime() - now.getTime()) / 86_400_000));
    return {
      hasAccess: true,
      purchase: {
        purchaseId: purchase.id,
        planType: purchase.planType,
        status: purchase.status,
        startDate: purchase.startDate,
        expiryDate: purchase.expiryDate,
        daysRemaining,
      },
    };
  }

  if (purchase.status === "active" && purchase.expiryDate && purchase.expiryDate <= now) {
    purchase.status = "expired";
    purchase.accessGranted = false;
    await purchase.save();
  }

  return {
    hasAccess: false,
    reason: purchase.status === "expired" ? "expired" : purchase.status,
    expiredAt: purchase.expiryDate ?? null,
    canRenew: true,
  };
};

const initiateCheckout = async (
  userId: string,
  userEmail: string,
  courseId: string,
  detectedRegionIp: string,
  payload: PurchaseInitiateInput,
  renewal = false,
) => {
  const existingAccess = await getPurchaseAccess(userId, courseId);
  if (!renewal && existingAccess.hasAccess) {
    throw new AppError("User already has active access to this course", 409, "ALREADY_PURCHASED");
  }

  const latest = await getActiveOrLatestPurchase(userId, courseId);
  if (renewal && !latest) {
    throw new AppError("No previous purchase found to renew", 404, "NOT_FOUND");
  }

  const { pricing, regionFromPhone, resolvedRegion } = await getPricingForPurchase(courseId, detectedRegionIp, payload);
  const stripePriceId = getPlanPriceId(pricing, payload.planType);
  const originalAmount = getPlanAmount(pricing, payload.planType);
  const promotionPreview = await resolvePromotionPreview({
    courseId,
    region: resolvedRegion,
    currency: pricing.currency,
    planType: payload.planType,
    originalAmount,
    userId,
    promotionCode: payload.promotionCode,
  });

  const session = await createStripeCheckoutSession({
    stripePriceId,
    successUrl: payload.successUrl,
    cancelUrl: payload.cancelUrl,
    customerEmail: userEmail,
    discount: promotionPreview.appliedPromotion
      ? payload.promotionCode
        ? { promotionCodeId: promotionPreview.appliedPromotion.stripePromotionCodeId ?? undefined }
        : { couponId: promotionPreview.appliedPromotion.stripeCouponId ?? undefined }
      : undefined,
    metadata: {
      flow: renewal ? "renewal" : "purchase",
      userId,
      courseId,
      planType: payload.planType,
      promotionCode: promotionPreview.appliedPromotion?.code ?? "",
    },
  });

  const purchase = await CoursePurchaseModel.create({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
    planType: payload.planType,
    status: "pending",
    region: resolvedRegion,
    currency: pricing.currency,
    originalAmount,
    discountAmount: promotionPreview.discountAmount,
    amountPaid: promotionPreview.finalAmount,
    promotionId: promotionPreview.appliedPromotion?.id
      ? new Types.ObjectId(promotionPreview.appliedPromotion.id)
      : undefined,
    promotionCode: promotionPreview.appliedPromotion?.code,
    promotionName: promotionPreview.appliedPromotion?.name,
    promotionDiscountType: promotionPreview.appliedPromotion?.discountType,
    promotionDiscountValue: promotionPreview.appliedPromotion?.discountValue,
    stripePriceId,
    stripeSessionId: session.id,
    stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
    detectedRegionIp,
    phoneCountryCode: payload.phoneCountryCode,
    regionMismatch: Boolean(regionFromPhone && regionFromPhone !== detectedRegionIp),
    renewedFromId: renewal && latest ? latest._id : undefined,
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    purchaseId: purchase.id,
    originalAmount,
    discountAmount: promotionPreview.discountAmount,
    finalAmount: promotionPreview.finalAmount,
    appliedPromotion: promotionPreview.appliedPromotion,
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
  };
};

export const initiatePurchase = async (
  userId: string,
  userEmail: string,
  courseId: string,
  detectedRegionIp: string,
  payload: PurchaseInitiateInput,
) => initiateCheckout(userId, userEmail, courseId, detectedRegionIp, payload, false);

export const confirmPurchase = async (userId: string, courseId: string, payload: PurchaseConfirmInput) => {
  const purchase = await CoursePurchaseModel.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
    stripeSessionId: payload.sessionId,
  }).sort({ createdAt: -1 });

  if (!purchase) {
    throw new AppError("Purchase session not found", 404, "NOT_FOUND");
  }

  const session = await retrieveStripeCheckoutSession(payload.sessionId);
  if (session.status !== "complete") {
    throw new AppError("Checkout session is not completed yet", 422, "PAYMENT_NOT_COMPLETED");
  }

  await syncPurchaseFromSession(purchase, session);

  return {
    purchaseId: purchase.id,
    status: purchase.status,
    accessGranted: purchase.accessGranted,
    startDate: purchase.startDate,
    expiryDate: purchase.expiryDate,
  };
};

export const initiateRenewal = async (
  userId: string,
  userEmail: string,
  courseId: string,
  detectedRegionIp: string,
  payload: PurchaseInitiateInput,
) => initiateCheckout(userId, userEmail, courseId, detectedRegionIp, payload, true);

export const confirmRenewal = async (userId: string, courseId: string, payload: PurchaseConfirmInput) => {
  const purchase = await CoursePurchaseModel.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
    stripeSessionId: payload.sessionId,
  }).sort({ createdAt: -1 });

  if (!purchase) {
    throw new AppError("Renewal session not found", 404, "NOT_FOUND");
  }

  const session = await retrieveStripeCheckoutSession(payload.sessionId);
  if (session.status !== "complete") {
    throw new AppError("Checkout session is not completed yet", 422, "PAYMENT_NOT_COMPLETED");
  }

  await syncPurchaseFromSession(purchase, session);

  return {
    purchaseId: purchase.id,
    status: purchase.status,
    accessGranted: purchase.accessGranted,
    startDate: purchase.startDate,
    expiryDate: purchase.expiryDate,
  };
};

export const cancelUserSubscriptions = async (userId: string) => {
  const purchases = await CoursePurchaseModel.find({
    userId: new Types.ObjectId(userId),
    status: { $in: ["pending", "active"] },
  });

  await Promise.all(
    purchases.map(async (purchase) => {
      if (purchase.stripeSubscriptionId) {
        try {
          await cancelStripeSubscription(purchase.stripeSubscriptionId);
        } catch {
          // Keep local revocation resilient even if Stripe already considers it canceled.
        }
      }

      purchase.status = "cancelled";
      purchase.accessGranted = false;
      await purchase.save();
    }),
  );

  return { userId, cancelled: purchases.length };
};

export const getPurchasedUserIdsByCourse = async (courseId: string) => {
  const now = new Date();
  const purchases = await CoursePurchaseModel.find({
    courseId: new Types.ObjectId(courseId),
    status: "active",
    accessGranted: true,
    expiryDate: { $gt: now },
  }).select("userId");

  return {
    userIds: [...new Set(purchases.map((purchase) => purchase.userId.toString()))],
  };
};

export const getPremiumUserIds = async () => {
  const now = new Date();
  const purchases = await CoursePurchaseModel.find({
    status: "active",
    accessGranted: true,
    expiryDate: { $gt: now },
  }).select("userId");

  return {
    userIds: [...new Set(purchases.map((purchase) => purchase.userId.toString()))],
  };
};

export const getAdminRevenueMetrics = async () => {
  const { currentMonthStart, previousMonthStart } = getMonthWindow();

  const purchases = await CoursePurchaseModel.find({
    purchasedAt: { $gte: previousMonthStart },
  });

  const isCompletedPurchase = (purchase: (typeof purchases)[number]) => Boolean(purchase.purchasedAt);
  const currentMonthPurchases = purchases.filter(
    (purchase) => isCompletedPurchase(purchase) && purchase.purchasedAt! >= currentMonthStart,
  );
  const previousMonthPurchases = purchases.filter(
    (purchase) =>
      isCompletedPurchase(purchase) &&
      purchase.purchasedAt! >= previousMonthStart &&
      purchase.purchasedAt! < currentMonthStart,
  );

  const sum = (items: typeof purchases) => items.reduce((total, item) => total + item.amountPaid, 0);
  const averageAmount = (items: typeof purchases) => (items.length ? sum(items) / items.length : 0);

  return {
    monthlyRevenue: calculateChange(sum(currentMonthPurchases), sum(previousMonthPurchases)),
    monthlyRevenueAverage: calculateChange(
      averageAmount(currentMonthPurchases),
      averageAmount(previousMonthPurchases),
    ),
    currentMonthPurchaseCount: currentMonthPurchases.length,
    previousMonthPurchaseCount: previousMonthPurchases.length,
  };
};

export const getAdminDashboardAnalytics = async () => {
  const { now, currentMonthStart, previousMonthStart } = getMonthWindow();
  const purchases = await CoursePurchaseModel.find({
    purchasedAt: { $gte: previousMonthStart },
  }).sort({ purchasedAt: -1, createdAt: -1 });

  const completedPurchases = purchases.filter((purchase) => Boolean(purchase.purchasedAt));
  const currentMonthPurchases = completedPurchases.filter((purchase) => purchase.purchasedAt! >= currentMonthStart);
  const previousMonthPurchases = completedPurchases.filter(
    (purchase) => purchase.purchasedAt! >= previousMonthStart && purchase.purchasedAt! < currentMonthStart,
  );

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthDurationMs = nextMonthStart.getTime() - monthStart.getTime();
  const bucketDurationMs = monthDurationMs / 4;

  const revenueChart = Array.from({ length: 4 }, (_, index) => {
    const bucketStart = new Date(monthStart.getTime() + bucketDurationMs * index);
    const bucketEnd =
      index === 3 ? nextMonthStart : new Date(monthStart.getTime() + bucketDurationMs * (index + 1));
    const amount = currentMonthPurchases
      .filter((purchase) => purchase.purchasedAt! >= bucketStart && purchase.purchasedAt! < bucketEnd)
      .reduce((sum, purchase) => sum + purchase.amountPaid, 0);

    return {
      label: `W${index + 1}`,
      amount: round(amount),
    };
  });

  const recentTransactions = currentMonthPurchases.slice(0, 10).map((purchase) => ({
    id: purchase.id,
    type: purchase.renewedFromId ? "subscription_renewed" : "purchase_completed",
    userId: purchase.userId.toString(),
    courseId: purchase.courseId.toString(),
    amount: round(purchase.amountPaid),
    currency: purchase.currency,
    planType: purchase.planType,
    createdAt: purchase.purchasedAt?.toISOString() ?? purchase.createdAt.toISOString(),
  }));

  const sum = (items: typeof completedPurchases) => items.reduce((total, item) => total + item.amountPaid, 0);
  const averageAmount = (items: typeof completedPurchases) => (items.length ? sum(items) / items.length : 0);

  return {
    monthlyRevenue: calculateChange(sum(currentMonthPurchases), sum(previousMonthPurchases)),
    monthlyRevenueAverage: calculateChange(
      averageAmount(currentMonthPurchases),
      averageAmount(previousMonthPurchases),
    ),
    currentMonthPurchaseCount: currentMonthPurchases.length,
    previousMonthPurchaseCount: previousMonthPurchases.length,
    revenueChart,
    recentTransactions,
  };
};

export const getAdminUserPurchaseSummary = async (userIds: string[]) => {
  if (userIds.length === 0) {
    return { items: [] };
  }

  const purchases = await CoursePurchaseModel.find({
    userId: { $in: userIds.map((id) => new Types.ObjectId(id)) },
  }).sort({ purchasedAt: -1, createdAt: -1 });

  const grouped = new Map<
    string,
    {
      userId: string;
      totalPurchases: number;
      activePurchases: number;
      totalSpent: number;
      lastPurchaseAt: Date | null;
      activeCourseIds: Set<string>;
      planTypes: Set<string>;
    }
  >();

  for (const purchase of purchases) {
    const key = purchase.userId.toString();
    const current =
      grouped.get(key) ??
      {
        userId: key,
        totalPurchases: 0,
        activePurchases: 0,
        totalSpent: 0,
        lastPurchaseAt: null,
        activeCourseIds: new Set<string>(),
        planTypes: new Set<string>(),
      };

    current.totalPurchases += purchase.purchasedAt ? 1 : 0;
    current.totalSpent += purchase.purchasedAt ? purchase.amountPaid : 0;
    if (!current.lastPurchaseAt && purchase.purchasedAt) {
      current.lastPurchaseAt = purchase.purchasedAt;
    }
    if (purchase.status === "active" && purchase.accessGranted) {
      current.activePurchases += 1;
      current.activeCourseIds.add(purchase.courseId.toString());
    }
    current.planTypes.add(purchase.planType);
    grouped.set(key, current);
  }

  return {
    items: [...grouped.values()].map((item) => ({
      userId: item.userId,
      totalPurchases: item.totalPurchases,
      activePurchases: item.activePurchases,
      totalSpent: round(item.totalSpent),
      lastPurchaseAt: item.lastPurchaseAt,
      activeCoursesCount: item.activeCourseIds.size,
      planTypes: [...item.planTypes],
    })),
  };
};

export const getAdminUserPurchases = async (userId: string) => {
  const purchases = await CoursePurchaseModel.find({
    userId: new Types.ObjectId(userId),
  }).sort({ purchasedAt: -1, createdAt: -1 });

  return {
    stats: {
      totalSpent: round(purchases.reduce((sum, purchase) => sum + (purchase.purchasedAt ? purchase.amountPaid : 0), 0)),
      totalOrders: purchases.filter((purchase) => purchase.purchasedAt).length,
      activePurchases: purchases.filter((purchase) => purchase.status === "active" && purchase.accessGranted).length,
      refundedPurchases: purchases.filter((purchase) => purchase.status === "refunded").length,
      lastPurchaseAt:
        purchases.find((purchase) => purchase.purchasedAt)?.purchasedAt?.toISOString() ?? null,
    },
    purchases: purchases.map((purchase) => ({
      _id: purchase.id,
      courseId: purchase.courseId.toString(),
      planType: purchase.planType,
      status: purchase.status,
      region: purchase.region,
      currency: purchase.currency,
      originalAmount: purchase.originalAmount,
      discountAmount: purchase.discountAmount,
      amountPaid: purchase.amountPaid,
      promotionCode: purchase.promotionCode ?? null,
      accessGranted: purchase.accessGranted,
      startDate: purchase.startDate?.toISOString() ?? null,
      expiryDate: purchase.expiryDate?.toISOString() ?? null,
      purchasedAt: purchase.purchasedAt?.toISOString() ?? null,
      renewedFromId: purchase.renewedFromId?.toString() ?? null,
      stripeRefundId: purchase.stripeRefundId ?? null,
    })),
  };
};

export const listAdminPurchases = async (query: PurchaseListQuery) => {
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.region) filter.region = query.region.toUpperCase();
  if (query.courseId) filter.courseId = new Types.ObjectId(query.courseId);

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    CoursePurchaseModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    CoursePurchaseModel.countDocuments(filter),
  ]);

  return { items, pagination: { page: query.page, limit: query.limit, total } };
};

export const getAdminPurchaseById = async (purchaseId: string) => {
  const purchase = await CoursePurchaseModel.findById(purchaseId);
  if (!purchase) {
    throw new AppError("Purchase not found", 404, "NOT_FOUND");
  }
  return purchase;
};

export const refundPurchase = async (purchaseId: string, adminId: string, payload: RefundInput) => {
  const purchase = await getAdminPurchaseById(purchaseId);

  if (!purchase.stripePaymentIntentId) {
    throw new AppError("Stripe payment intent is not available for refund", 422, "REFUND_NOT_AVAILABLE");
  }

  const refund = await createStripeRefund({
    paymentIntentId: purchase.stripePaymentIntentId,
    amount: payload.partialAmount,
    reason: payload.reason === "other" ? undefined : payload.reason,
    metadata: {
      purchaseId: purchase.id,
      adminId,
    },
  });

  if (purchase.stripeSubscriptionId) {
    try {
      await cancelStripeSubscription(purchase.stripeSubscriptionId);
    } catch {
      // Subscription may already be canceled; refund should still complete locally.
    }
  }

  purchase.status = "refunded";
  purchase.accessGranted = false;
  purchase.stripeRefundId = refund.id;
  await purchase.save();

  await RefundModel.create({
    purchaseId: purchase._id,
    stripeRefundId: refund.id,
    amount: refund.amount,
    reason: payload.reason,
    adminId: new Types.ObjectId(adminId),
    notes: payload.notes,
  });

  return {
    purchaseId: purchase.id,
    stripeRefundId: refund.id,
    amountRefunded: refund.amount,
    currency: purchase.currency,
    status: purchase.status,
    accessRevoked: true,
    revokedAt: new Date().toISOString(),
  };
};

export const getRevenueSummary = async (query: RevenueQuery) => {
  const match: Record<string, unknown> = { status: { $in: ["active", "refunded"] } };
  if (query.region) {
    match.region = query.region.toUpperCase();
  }

  const purchases = await CoursePurchaseModel.find(match);
  const grossRevenue = purchases.reduce((sum, item) => sum + item.amountPaid, 0);
  const activeCount = purchases.filter((item) => item.status === "active").length;
  const refundedCount = purchases.filter((item) => item.status === "refunded").length;

  return {
    grossRevenue,
    activeCount,
    refundedCount,
  };
};

export const processSubscriptionNotifications = async (payload: ProcessSubscriptionNotificationsInput) => {
  const now = new Date();
  const expiryThreshold = new Date(now.getTime() + payload.daysBeforeExpiry * 86_400_000);

  const expiringPurchases = await CoursePurchaseModel.find({
    status: "active",
    accessGranted: true,
    expiryDate: { $gt: now, $lte: expiryThreshold },
    expiringNotificationSentAt: { $exists: false },
  });

  let expiringSent = 0;
  for (const purchase of expiringPurchases) {
    const daysRemaining = purchase.expiryDate
      ? Math.max(0, Math.ceil((purchase.expiryDate.getTime() - now.getTime()) / 86_400_000))
      : payload.daysBeforeExpiry;

    await sendNotification(purchase, {
      type: "subscription_expiring",
      title: "Subscription expiring soon",
      body: `Your course access expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}.`,
      data: {
        daysRemaining,
      },
    });

    purchase.expiringNotificationSentAt = new Date();
    await purchase.save();
    expiringSent += 1;
  }

  const expiredPurchases = await CoursePurchaseModel.find({
    status: { $in: ["active", "expired"] },
    expiryDate: { $lte: now },
    expiredNotificationSentAt: { $exists: false },
  });

  let expiredSent = 0;
  for (const purchase of expiredPurchases) {
    purchase.status = "expired";
    purchase.accessGranted = false;
    await sendNotification(purchase, {
      type: "subscription_expired",
      title: "Subscription expired",
      body: "Your course access has expired.",
    });
    purchase.expiredNotificationSentAt = new Date();
    await purchase.save();
    expiredSent += 1;
  }

  return {
    daysBeforeExpiry: payload.daysBeforeExpiry,
    expiringProcessed: expiringSent,
    expiredProcessed: expiredSent,
  };
};

export const handleStripeWebhook = async (rawBody: string, signature: string | undefined) => {
  const event = constructStripeWebhookEvent(rawBody, signature);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const purchase = await CoursePurchaseModel.findOne({ stripeSessionId: session.id }).sort({ createdAt: -1 });

    if (!purchase) {
      return { processed: false, eventType: event.type };
    }

    await syncPurchaseFromSession(purchase, session);
    if (purchase.status === "active" && purchase.accessGranted) {
      await sendPurchaseConfirmedNotification(purchase);
    }
    return { processed: true, eventType: event.type, purchaseId: purchase.id };
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const purchase = await CoursePurchaseModel.findOne({ stripeSessionId: session.id }).sort({ createdAt: -1 });

    if (!purchase) {
      return { processed: false, eventType: event.type };
    }

    purchase.status = "cancelled";
    purchase.accessGranted = false;
    await purchase.save();
    return { processed: true, eventType: event.type, purchaseId: purchase.id };
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const purchase = await CoursePurchaseModel.findOne({ stripeSubscriptionId: subscription.id }).sort({ createdAt: -1 });

    if (!purchase) {
      return { processed: false, eventType: event.type };
    }

    await markPurchaseFromSubscription(purchase, subscription, {
      customerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id,
    });
    return { processed: true, eventType: event.type, purchaseId: purchase.id };
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as StripeInvoiceLike;
    const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
    if (!subscriptionId) {
      return { processed: false, eventType: event.type };
    }

    const purchase = await CoursePurchaseModel.findOne({ stripeSubscriptionId: subscriptionId }).sort({ createdAt: -1 });
    if (!purchase) {
      return { processed: false, eventType: event.type };
    }

    const subscription = await retrieveStripeSubscription(subscriptionId);
    const paymentIntentId =
      typeof invoice.payment_intent === "string"
        ? invoice.payment_intent
        : invoice.payment_intent && "id" in invoice.payment_intent
          ? invoice.payment_intent.id
          : null;

    await markPurchaseFromSubscription(purchase, subscription, {
      customerId: typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id,
      invoiceId: invoice.id,
      paymentIntentId,
    });
    return { processed: true, eventType: event.type, purchaseId: purchase.id };
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as StripeInvoiceLike;
    const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
    if (!subscriptionId) {
      return { processed: false, eventType: event.type };
    }

    const purchase = await CoursePurchaseModel.findOne({ stripeSubscriptionId: subscriptionId }).sort({ createdAt: -1 });
    if (!purchase) {
      return { processed: false, eventType: event.type };
    }

    purchase.stripeInvoiceId = invoice.id;
    const stillActive = Boolean(purchase.expiryDate && purchase.expiryDate > new Date());
    purchase.status = stillActive ? "active" : "cancelled";
    purchase.accessGranted = stillActive;
    if (!stillActive && !purchase.paymentFailedNotificationSentAt) {
      await sendNotification(purchase, {
        type: "subscription_expired",
        title: "Payment failed",
        body: "We could not process your payment and your course access is no longer active.",
      });
      purchase.paymentFailedNotificationSentAt = new Date();
    }
    await purchase.save();
    return { processed: true, eventType: event.type, purchaseId: purchase.id };
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const purchase = await findPurchaseForWebhook({
      payment_intent: typeof charge.payment_intent === "string" ? charge.payment_intent : null,
    });

    if (!purchase) {
      return { processed: false, eventType: event.type };
    }

    purchase.status = "refunded";
    purchase.accessGranted = false;
    await purchase.save();
    return { processed: true, eventType: event.type, purchaseId: purchase.id };
  }

  return { processed: false, eventType: event.type };
};
