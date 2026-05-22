import Stripe from "stripe";
import { AppError, env } from "@yourbeep/shared";

let stripeClient: Stripe | null = null;

const ensureStripeConfigured = () => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new AppError("Stripe is not configured", 500, "STRIPE_NOT_CONFIGURED");
  }
};

const getStripe = () => {
  ensureStripeConfigured();

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY!);
  }

  return stripeClient;
};

const appendCheckoutSessionPlaceholder = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return url.includes("{CHECKOUT_SESSION_ID}") ? url : `${url}${separator}session_id={CHECKOUT_SESSION_ID}`;
};

export const createStripeCheckoutSession = async (input: {
  stripePriceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  metadata: Record<string, string>;
  discount?: {
    couponId?: string;
    promotionCodeId?: string;
  };
}) => {
  const stripe = getStripe();

  return stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: appendCheckoutSessionPlaceholder(input.successUrl),
    cancel_url: input.cancelUrl,
    customer_email: input.customerEmail,
    line_items: [
      {
        price: input.stripePriceId,
        quantity: 1,
      },
    ],
    metadata: input.metadata,
    discounts: input.discount
      ? [
          input.discount.promotionCodeId
            ? { promotion_code: input.discount.promotionCodeId }
            : { coupon: input.discount.couponId! },
        ]
      : undefined,
    subscription_data: {
      metadata: input.metadata,
    },
  });
};

export const createStripeCouponAndPromotionCode = async (input: {
  code: string;
  name: string;
  discountType: "percentage" | "fixed_amount";
  percentageOff?: number;
  amountOff?: number;
  currency?: string;
  maxRedemptions?: number;
  expiresAt?: Date;
  metadata?: Record<string, string>;
}) => {
  const stripe = getStripe();

  const coupon = await stripe.coupons.create({
    duration: "once",
    name: input.name,
    percent_off: input.discountType === "percentage" ? input.percentageOff : undefined,
    amount_off: input.discountType === "fixed_amount" ? input.amountOff : undefined,
    currency: input.discountType === "fixed_amount" ? input.currency?.toLowerCase() : undefined,
    max_redemptions: input.maxRedemptions,
    redeem_by: input.expiresAt ? Math.floor(input.expiresAt.getTime() / 1000) : undefined,
    metadata: input.metadata,
  });

  const promotionCode = await stripe.promotionCodes.create({
    promotion: {
      type: "coupon",
      coupon: coupon.id,
    },
    code: input.code,
    max_redemptions: input.maxRedemptions,
    expires_at: input.expiresAt ? Math.floor(input.expiresAt.getTime() / 1000) : undefined,
    metadata: input.metadata,
  });

  return {
    couponId: coupon.id,
    promotionCodeId: promotionCode.id,
  };
};

export const deactivateStripePromotionCode = async (promotionCodeId?: string | null) => {
  if (!promotionCodeId) {
    return null;
  }

  const stripe = getStripe();
  return stripe.promotionCodes.update(promotionCodeId, { active: false });
};

export const retrieveStripeCheckoutSession = async (sessionId: string) => {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId);
};

export const retrieveStripeSubscription = async (subscriptionId: string) => {
  const stripe = getStripe();
  return stripe.subscriptions.retrieve(subscriptionId);
};

export const retrieveStripeInvoice = async (invoiceId: string) => {
  const stripe = getStripe();
  return stripe.invoices.retrieve(invoiceId);
};

export const cancelStripeSubscription = async (subscriptionId: string) => {
  const stripe = getStripe();
  return stripe.subscriptions.cancel(subscriptionId);
};

export const createStripeRefund = async (input: {
  paymentIntentId: string;
  amount?: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  metadata?: Record<string, string>;
}) => {
  const stripe = getStripe();

  return stripe.refunds.create({
    payment_intent: input.paymentIntentId,
    amount: input.amount,
    reason: input.reason,
    metadata: input.metadata,
  });
};

export const constructStripeWebhookEvent = (rawBody: string, signature?: string) => {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new AppError("Stripe webhook secret is not configured", 500, "STRIPE_NOT_CONFIGURED");
  }

  if (!signature) {
    throw new AppError("Missing Stripe signature header", 400, "STRIPE_SIGNATURE_MISSING");
  }

  const stripe = getStripe();

  try {
    return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    throw new AppError("Invalid Stripe webhook signature", 400, "STRIPE_SIGNATURE_INVALID");
  }
};
