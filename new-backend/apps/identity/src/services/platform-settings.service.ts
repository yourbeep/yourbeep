import { AppError } from "@yourbeep/shared";
import type { z } from "zod";
import { PlatformSettingsModel, type PlatformFaqItem, type PlatformSettingsDocument } from "../models/platform-settings";
import { createPlatformFaqSchema, updatePlatformFaqSchema, updatePlatformSettingsSchema } from "../validators";

type UpdatePlatformSettingsInput = z.infer<typeof updatePlatformSettingsSchema>;
type CreatePlatformFaqInput = z.infer<typeof createPlatformFaqSchema>;
type UpdatePlatformFaqInput = z.infer<typeof updatePlatformFaqSchema>;

const defaultPlatformSettings = () => ({
  platformName: "YourBeep",
  supportEmail: "support@yourbeep.com",
  homeBanner: {
    eyebrow: "Behavioural Signal Intelligence",
    title: "Begin your self-reflection journey",
    subtitle: "Learn through guided videos, reflective activities, and nervous-system aware practices.",
    announcementText: "New master course available for all registered users.",
    primaryCtaLabel: "Explore Courses",
    primaryCtaUrl: "/courses",
    secondaryCtaLabel: "Watch Master Course",
    secondaryCtaUrl: "/master-course",
    backgroundVariant: "warm" as const,
    trustBadgeText: "Trusted by reflective learners worldwide",
  },
  footer: {
    tagline: "Clarity, presence, and sustainable inner work.",
    copyrightText: "YourBeep. All rights reserved.",
    links: [],
  },
  legal: {
    termsOfService: "",
    privacyPolicy: "",
    refundPolicy: "",
    cookiePolicy: "",
    communityGuidelines: "",
  },
  faqItems: [],
  socialLinks: {},
  seo: {
    defaultTitle: "YourBeep",
    defaultDescription: "Behavioural signal intelligence courses and guided practices.",
  },
  appLinks: {},
});

const getOrCreatePlatformSettings = async () => {
  let settings = await PlatformSettingsModel.findOne();
  if (!settings) {
    settings = await PlatformSettingsModel.create(defaultPlatformSettings());
  }
  return settings;
};

const sortFaqItems = (items: PlatformFaqItem[]) => [...items].sort((left, right) => left.order - right.order);

const mapFaqItem = (item: PlatformFaqItem) => ({
  _id: item._id.toString(),
  category: item.category,
  question: item.question,
  answer: item.answer,
  order: item.order,
  isPublished: item.isPublished,
});

const toPublicSettings = (settings: PlatformSettingsDocument & { _id: unknown; updatedAt: Date }) => ({
  platformName: settings.platformName,
  supportEmail: settings.supportEmail ?? null,
  supportPhone: settings.supportPhone ?? null,
  supportWhatsapp: settings.supportWhatsapp ?? null,
  contactAddress: settings.contactAddress ?? null,
  socialLinks: settings.socialLinks ?? {},
  homeBanner: settings.homeBanner,
  footer: settings.footer,
  legal: settings.legal,
  faqItems: sortFaqItems(settings.faqItems).filter((item) => item.isPublished).map(mapFaqItem),
  seo: settings.seo,
  appLinks: settings.appLinks,
  updatedAt: settings.updatedAt,
});

const toAdminSettings = (settings: PlatformSettingsDocument & { _id: unknown; updatedAt: Date }) => ({
  ...toPublicSettings(settings),
  faqItems: sortFaqItems(settings.faqItems).map(mapFaqItem),
  updatedBy: settings.updatedBy?.toString() ?? null,
});

export const getPublicPlatformSettings = async () => {
  const settings = await getOrCreatePlatformSettings();
  return toPublicSettings(settings);
};

export const getPlatformLegalDocument = async (
  key: "termsOfService" | "privacyPolicy" | "refundPolicy" | "cookiePolicy" | "communityGuidelines",
) => {
  const settings = await getOrCreatePlatformSettings();

  const documentMap = {
    termsOfService: {
      key: "terms_of_service",
      title: "Terms & Conditions",
      content: settings.legal?.termsOfService ?? "",
    },
    privacyPolicy: {
      key: "privacy_policy",
      title: "Privacy Policy",
      content: settings.legal?.privacyPolicy ?? "",
    },
    refundPolicy: {
      key: "refund_policy",
      title: "Refund Policy",
      content: settings.legal?.refundPolicy ?? "",
    },
    cookiePolicy: {
      key: "cookie_policy",
      title: "Cookie Policy",
      content: settings.legal?.cookiePolicy ?? "",
    },
    communityGuidelines: {
      key: "community_guidelines",
      title: "Community Guidelines",
      content: settings.legal?.communityGuidelines ?? "",
    },
  } as const;

  return {
    ...documentMap[key],
    updatedAt: settings.updatedAt,
  };
};

export const getAdminPlatformSettings = async () => {
  const settings = await getOrCreatePlatformSettings();
  return toAdminSettings(settings);
};

export const updatePlatformSettings = async (adminId: string, payload: UpdatePlatformSettingsInput) => {
  const settings = await getOrCreatePlatformSettings();

  if (payload.platformName !== undefined) settings.platformName = payload.platformName;
  if (payload.supportEmail !== undefined) settings.supportEmail = payload.supportEmail;
  if (payload.supportPhone !== undefined) settings.supportPhone = payload.supportPhone;
  if (payload.supportWhatsapp !== undefined) settings.supportWhatsapp = payload.supportWhatsapp;
  if (payload.contactAddress !== undefined) settings.contactAddress = payload.contactAddress;
  if (payload.socialLinks) settings.socialLinks = { ...settings.socialLinks, ...payload.socialLinks };
  if (payload.homeBanner) settings.homeBanner = { ...settings.homeBanner, ...payload.homeBanner };
  if (payload.footer) {
    settings.footer = {
      ...settings.footer,
      ...payload.footer,
      ...(payload.footer.links ? { links: payload.footer.links } : {}),
    };
  }
  if (payload.legal) settings.legal = { ...settings.legal, ...payload.legal };
  if (payload.seo) settings.seo = { ...settings.seo, ...payload.seo };
  if (payload.appLinks) settings.appLinks = { ...settings.appLinks, ...payload.appLinks };

  settings.set("updatedBy", adminId);
  await settings.save();

  return toAdminSettings(settings);
};

export const createPlatformFaq = async (adminId: string, payload: CreatePlatformFaqInput) => {
  const settings = await getOrCreatePlatformSettings();
  settings.faqItems.push({
    category: payload.category,
    question: payload.question,
    answer: payload.answer,
    order: payload.order,
    isPublished: payload.isPublished ?? true,
  } as never);
  settings.set("updatedBy", adminId);
  await settings.save();
  return toAdminSettings(settings);
};

export const updatePlatformFaq = async (adminId: string, faqId: string, payload: UpdatePlatformFaqInput) => {
  const settings = await getOrCreatePlatformSettings();
  const faqItem = settings.faqItems.id(faqId);
  if (!faqItem) {
    throw new AppError("FAQ item not found", 404, "NOT_FOUND");
  }

  if (payload.category !== undefined) faqItem.category = payload.category;
  if (payload.question !== undefined) faqItem.question = payload.question;
  if (payload.answer !== undefined) faqItem.answer = payload.answer;
  if (payload.order !== undefined) faqItem.order = payload.order;
  if (payload.isPublished !== undefined) faqItem.isPublished = payload.isPublished;

  settings.set("updatedBy", adminId);
  await settings.save();
  return toAdminSettings(settings);
};

export const deletePlatformFaq = async (adminId: string, faqId: string) => {
  const settings = await getOrCreatePlatformSettings();
  const faqItem = settings.faqItems.id(faqId);
  if (!faqItem) {
    throw new AppError("FAQ item not found", 404, "NOT_FOUND");
  }

  faqItem.deleteOne();
  settings.set("updatedBy", adminId);
  await settings.save();
  return toAdminSettings(settings);
};
