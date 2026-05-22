import { z } from "zod";

const objectId = () => z.string().regex(/^[0-9a-fA-F]{24}$/);

export const planTypeSchema = z.enum(["six_month", "annual"]);

export const purchaseInitiateSchema = z.object({
  planType: planTypeSchema,
  phoneCountryCode: z
    .string()
    .regex(/^\+[1-9]\d{0,3}$/)
    .optional(),
  promotionCode: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/)
    .transform((value) => value.toUpperCase())
    .optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const purchaseConfirmSchema = z.object({
  sessionId: z.string().min(1),
});

export const pricingUpsertSchema = z.object({
  region: z.string().length(2).transform((value) => value.toUpperCase()),
  currency: z.string().length(3).transform((value) => value.toUpperCase()),
  amount6mo: z.number().int().positive(),
  amount1yr: z.number().int().positive(),
  stripeProductId6mo: z.string().optional(),
  stripeProductId1yr: z.string().optional(),
  stripePriceId6mo: z.string().optional(),
  stripePriceId1yr: z.string().optional(),
});

export const refundSchema = z.object({
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer", "other"]),
  notes: z.string().max(500).optional(),
  partialAmount: z.number().int().positive().optional(),
});

export const purchaseListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["pending", "active", "expired", "cancelled", "refunded"]).optional(),
  region: z.string().length(2).optional(),
  courseId: objectId().optional(),
});

export const revenueQuerySchema = z.object({
  region: z.string().length(2).optional(),
});

export const processSubscriptionNotificationsSchema = z.object({
  daysBeforeExpiry: z.coerce.number().int().min(1).max(30).default(3),
});

const promotionBaseSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    code: z
      .string()
      .trim()
      .min(3)
      .max(40)
      .regex(/^[A-Za-z0-9_-]+$/)
      .transform((value) => value.toUpperCase()),
    description: z.string().trim().max(500).optional(),
    courseId: objectId().optional(),
    regions: z
      .array(z.string().length(2).transform((value) => value.toUpperCase()))
      .max(50)
      .default([]),
    planTypes: z.array(planTypeSchema).min(1).default(["six_month", "annual"]),
    discountType: z.enum(["percentage", "fixed_amount"]),
    percentageOff: z.number().min(1).max(100).optional(),
    amountOff: z.number().int().positive().optional(),
    currency: z.string().length(3).transform((value) => value.toUpperCase()).optional(),
    autoApply: z.boolean().default(false),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    maxRedemptions: z.number().int().positive().optional(),
    perUserLimit: z.number().int().positive().default(1),
    isActive: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    if (value.discountType === "percentage" && value.percentageOff === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["percentageOff"],
        message: "percentageOff is required for percentage promotions",
      });
    }

    if (value.discountType === "fixed_amount") {
      if (value.amountOff === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["amountOff"],
          message: "amountOff is required for fixed amount promotions",
        });
      }

      if (!value.currency) {
        ctx.addIssue({
          code: "custom",
          path: ["currency"],
          message: "currency is required for fixed amount promotions",
        });
      }
    }

    if (value.startsAt && value.endsAt && value.endsAt <= value.startsAt) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "endsAt must be after startsAt",
      });
    }
  });

export const promotionCreateSchema = promotionBaseSchema;
export const promotionUpdateSchema = promotionBaseSchema;

export const promotionListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(100).optional(),
  status: z.enum(["active", "scheduled", "expired", "inactive", "archived"]).optional(),
  courseId: objectId().optional(),
});

export const promotionPreviewSchema = z.object({
  planType: planTypeSchema,
  promotionCode: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/)
    .transform((value) => value.toUpperCase())
    .optional(),
});
