import { z } from "zod";

export const authSyncSchema = z.object({
  timezone: z.string().min(1).default("UTC").optional(),
  region: z.string().length(2).optional(),
  fcmToken: z.string().min(1).optional(),
  deviceType: z.enum(["web", "ios", "android"]).optional(),
});

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(80).optional(),
    avatar: z.string().url().optional(),
    timezone: z.string().min(1).optional(),
    phoneCountryCode: z.string().regex(/^\+[1-9]\d{0,3}$/).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
  region: z.string().length(2).transform((value) => value.toUpperCase()).optional(),
  planType: z.enum(["six_month", "annual"]).optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export const adminDashboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  period: z.enum(["7d", "30d", "90d", "custom"]).default("30d"),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  region: z.string().length(2).transform((value) => value.toUpperCase()).optional(),
  planType: z.enum(["six_month", "annual"]).optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
}).superRefine((value, ctx) => {
  if (value.period === "custom" && (!value.from || !value.to)) {
    if (!value.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "from is required when using a custom period",
      });
    }
    if (!value.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "to is required when using a custom period",
      });
    }
  }
});

export const activityLogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  gameKey: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const registerFcmSchema = z.object({
  fcmToken: z.string().min(1),
  deviceType: z.enum(["web", "ios", "android"]).optional(),
});

export const removeFcmSchema = z.object({
  fcmToken: z.string().min(1),
});

const notificationTypeSchema = z.enum([
  "course_ready",
  "game_added",
  "game_reminder",
  "purchase_confirmed",
  "subscription_expiring",
  "subscription_expired",
  "admin_broadcast",
]);

const notificationDataSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional();

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const notificationAudienceSchema = z
  .object({
    type: z.enum(["all_users", "premium_users", "course_purchasers", "specific_users", "region_users"]),
    courseId: objectId.optional(),
    userIds: z.array(objectId).max(1000).default([]),
    regions: z
      .array(z.string().length(2).transform((value) => value.toUpperCase()))
      .max(50)
      .default([]),
  })
  .superRefine((value, ctx) => {
    if (value.type === "course_purchasers" && !value.courseId) {
      ctx.addIssue({
        code: "custom",
        path: ["courseId"],
        message: "courseId is required for course_purchasers",
      });
    }

    if (value.type === "specific_users" && value.userIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["userIds"],
        message: "userIds are required for specific_users",
      });
    }

    if (value.type === "region_users" && value.regions.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["regions"],
        message: "regions are required for region_users",
      });
    }
  });

export const adminBroadcastSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(500),
  imageUrl: z.string().url().optional(),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  data: notificationDataSchema,
});

export const internalNotificationSchema = z
  .object({
    type: notificationTypeSchema,
    title: z.string().min(1).max(120),
    body: z.string().min(1).max(500),
    imageUrl: z.string().url().optional(),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    data: notificationDataSchema,
  })
  .refine((value) => Boolean(value.userId || value.courseId), {
    message: "Either userId or courseId is required",
    path: ["userId"],
  });

export const updateRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

export const notificationCampaignCreateSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(500),
  imageUrl: z.string().url().optional(),
  type: notificationTypeSchema.default("admin_broadcast"),
  audience: notificationAudienceSchema,
  data: notificationDataSchema,
  sendNow: z.boolean().default(false),
});

export const notificationCampaignUpdateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  body: z.string().min(1).max(500).optional(),
  imageUrl: z.string().url().optional(),
  type: notificationTypeSchema.optional(),
  audience: notificationAudienceSchema.optional(),
  data: notificationDataSchema,
});

export const notificationCampaignListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  status: z.enum(["draft", "sent", "cancelled"]).optional(),
  audienceType: z
    .enum(["all_users", "premium_users", "course_purchasers", "specific_users", "region_users"])
    .optional(),
});

export const notificationAudiencePreviewSchema = z.object({
  audience: notificationAudienceSchema,
});

const ticketTypeSchema = z.enum([
  "refund_related",
  "account_access",
  "course_access",
  "video_access",
  "payment_issue",
  "game_issue",
  "technical_issue",
  "general_support",
]);

const ticketStatusSchema = z.enum(["open", "in_progress", "waiting_on_user", "resolved", "closed"]);
const ticketPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);

const ticketAttachmentsSchema = z.array(z.string().url()).max(10).default([]);

export const createSupportTicketSchema = z.object({
  type: ticketTypeSchema,
  subject: z.string().min(5).max(160),
  description: z.string().min(10).max(5000),
  priority: ticketPrioritySchema.optional(),
  courseId: objectId.optional(),
  purchaseId: z.string().min(1).max(100).optional(),
  videoId: objectId.optional(),
  gameId: objectId.optional(),
  attachments: ticketAttachmentsSchema.optional(),
});

export const supportTicketReplySchema = z.object({
  body: z.string().min(1).max(5000),
  attachments: ticketAttachmentsSchema.optional(),
});

export const supportTicketListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  type: ticketTypeSchema.optional(),
  status: ticketStatusSchema.optional(),
});

export const adminSupportTicketListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  type: ticketTypeSchema.optional(),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  assignedAdminId: objectId.optional(),
  userId: objectId.optional(),
});

export const adminSupportTicketUpdateSchema = z.object({
  type: ticketTypeSchema.optional(),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  assignedAdminId: objectId.nullish(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
});

const contactTopicSchema = z.enum([
  "refund_related",
  "account_access",
  "course_access",
  "video_access",
  "payment_issue",
  "game_issue",
  "technical_issue",
  "general_support",
  "partnership",
  "feedback",
]);

export const createContactRequestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  topic: contactTopicSchema,
  subject: z.string().min(5).max(160),
  message: z.string().min(10).max(5000),
  phoneCountryCode: z.string().regex(/^\+[1-9]\d{0,3}$/).optional(),
  userId: z.string().max(100).optional(),
});

export const contactRequestListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  topic: contactTopicSchema.optional(),
  status: z.enum(["new", "reviewed", "replied", "closed"]).optional(),
});

export const updateContactRequestSchema = z.object({
  status: z.enum(["new", "reviewed", "replied", "closed"]).optional(),
  notes: z.string().max(3000).optional(),
});

const optionalUrl = z.string().url().optional();

export const updatePlatformSettingsSchema = z.object({
  platformName: z.string().min(2).max(120).optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().max(40).optional(),
  supportWhatsapp: z.string().max(40).optional(),
  contactAddress: z.string().max(300).optional(),
  socialLinks: z
    .object({
      instagram: optionalUrl,
      youtube: optionalUrl,
      linkedin: optionalUrl,
      x: optionalUrl,
    })
    .optional(),
  homeBanner: z
    .object({
      eyebrow: z.string().max(120).optional(),
      title: z.string().min(2).max(200).optional(),
      subtitle: z.string().max(500).optional(),
      announcementText: z.string().max(300).optional(),
      primaryCtaLabel: z.string().max(80).optional(),
      primaryCtaUrl: optionalUrl,
      secondaryCtaLabel: z.string().max(80).optional(),
      secondaryCtaUrl: optionalUrl,
      desktopImageUrl: optionalUrl,
      mobileImageUrl: optionalUrl,
      backgroundVariant: z.enum(["light", "warm", "earth", "contrast"]).optional(),
      trustBadgeText: z.string().max(160).optional(),
    })
    .optional(),
  footer: z
    .object({
      tagline: z.string().max(200).optional(),
      copyrightText: z.string().max(200).optional(),
      links: z
        .array(
          z.object({
            label: z.string().min(1).max(80),
            url: z.string().url(),
          }),
        )
        .max(20)
        .optional(),
    })
    .optional(),
  legal: z
    .object({
      termsOfService: z.string().max(100_000).optional(),
      privacyPolicy: z.string().max(100_000).optional(),
      refundPolicy: z.string().max(100_000).optional(),
      cookiePolicy: z.string().max(100_000).optional(),
      communityGuidelines: z.string().max(100_000).optional(),
    })
    .optional(),
  seo: z
    .object({
      defaultTitle: z.string().max(120).optional(),
      defaultDescription: z.string().max(300).optional(),
    })
    .optional(),
  appLinks: z
    .object({
      iosAppUrl: optionalUrl,
      androidAppUrl: optionalUrl,
      webAppUrl: optionalUrl,
    })
    .optional(),
});

export const createPlatformFaqSchema = z.object({
  category: z.string().min(2).max(80),
  question: z.string().min(5).max(300),
  answer: z.string().min(10).max(5000),
  order: z.number().int().min(1),
  isPublished: z.boolean().optional(),
});

export const updatePlatformFaqSchema = z.object({
  category: z.string().min(2).max(80).optional(),
  question: z.string().min(5).max(300).optional(),
  answer: z.string().min(10).max(5000).optional(),
  order: z.number().int().min(1).optional(),
  isPublished: z.boolean().optional(),
});

const testimonialStatusSchema = z.enum(["pending", "approved", "rejected", "hidden"]);
const testimonialSourceSchema = z.enum(["user", "admin"]);

export const createTestimonialSchema = z.object({
  courseId: objectId.optional(),
  roleLabel: z.string().min(2).max(120).optional(),
  headline: z.string().min(3).max(160).optional(),
  quote: z.string().min(20).max(3000),
  rating: z.number().int().min(1).max(5),
});

export const publicTestimonialListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(12),
  courseId: objectId.optional(),
  featuredOnly: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export const adminTestimonialListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  status: testimonialStatusSchema.optional(),
  source: testimonialSourceSchema.optional(),
  featured: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  courseId: objectId.optional(),
});

export const adminCreateTestimonialSchema = z.object({
  userId: objectId.optional(),
  courseId: objectId.optional(),
  status: testimonialStatusSchema.optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().int().min(0).optional(),
  displayName: z.string().min(2).max(120),
  avatar: z.string().url().optional(),
  roleLabel: z.string().min(2).max(120).optional(),
  headline: z.string().min(3).max(160).optional(),
  quote: z.string().min(20).max(3000),
  rating: z.number().int().min(1).max(5),
  adminNotes: z.string().max(2000).optional(),
});

export const adminUpdateTestimonialSchema = z.object({
  courseId: objectId.nullish(),
  status: testimonialStatusSchema.optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().int().min(0).optional(),
  displayName: z.string().min(2).max(120).optional(),
  avatar: z.string().url().nullish(),
  roleLabel: z.string().min(2).max(120).nullish(),
  headline: z.string().min(3).max(160).nullish(),
  quote: z.string().min(20).max(3000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  adminNotes: z.string().max(2000).nullish(),
  rejectionReason: z.string().max(1000).nullish(),
});
