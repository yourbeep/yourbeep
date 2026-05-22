import { Schema, model, models, type Types } from "mongoose";

export interface PlatformFaqItem {
  _id: Types.ObjectId;
  category: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

export interface PlatformSettingsDocument {
  platformName: string;
  supportEmail?: string;
  supportPhone?: string;
  supportWhatsapp?: string;
  contactAddress?: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    x?: string;
  };
  homeBanner: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    announcementText?: string;
    primaryCtaLabel?: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
    desktopImageUrl?: string;
    mobileImageUrl?: string;
    backgroundVariant?: "light" | "warm" | "earth" | "contrast";
    trustBadgeText?: string;
  };
  footer: {
    tagline?: string;
    copyrightText?: string;
    links: Array<{
      label: string;
      url: string;
    }>;
  };
  legal: {
    termsOfService?: string;
    privacyPolicy?: string;
    refundPolicy?: string;
    cookiePolicy?: string;
    communityGuidelines?: string;
  };
  faqItems: PlatformFaqItem[];
  seo: {
    defaultTitle?: string;
    defaultDescription?: string;
  };
  appLinks: {
    iosAppUrl?: string;
    androidAppUrl?: string;
    webAppUrl?: string;
  };
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const faqItemSchema = new Schema<PlatformFaqItem>(
  {
    category: { type: String, required: true, maxlength: 80 },
    question: { type: String, required: true, maxlength: 300 },
    answer: { type: String, required: true, maxlength: 5000 },
    order: { type: Number, required: true, min: 1 },
    isPublished: { type: Boolean, default: true },
  },
  { _id: true },
);

const platformSettingsSchema = new Schema<PlatformSettingsDocument>(
  {
    platformName: { type: String, required: true, default: "YourBeep" },
    supportEmail: { type: String },
    supportPhone: { type: String },
    supportWhatsapp: { type: String },
    contactAddress: { type: String },
    socialLinks: {
      instagram: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
      x: { type: String },
    },
    homeBanner: {
      eyebrow: { type: String },
      title: { type: String, required: true, default: "Begin your self-reflection journey" },
      subtitle: { type: String },
      announcementText: { type: String },
      primaryCtaLabel: { type: String },
      primaryCtaUrl: { type: String },
      secondaryCtaLabel: { type: String },
      secondaryCtaUrl: { type: String },
      desktopImageUrl: { type: String },
      mobileImageUrl: { type: String },
      backgroundVariant: {
        type: String,
        enum: ["light", "warm", "earth", "contrast"],
        default: "warm",
      },
      trustBadgeText: { type: String },
    },
    footer: {
      tagline: { type: String },
      copyrightText: { type: String },
      links: {
        type: [
          new Schema(
            {
              label: { type: String, required: true, maxlength: 80 },
              url: { type: String, required: true },
            },
            { _id: false },
          ),
        ],
        default: [],
      },
    },
    legal: {
      termsOfService: { type: String },
      privacyPolicy: { type: String },
      refundPolicy: { type: String },
      cookiePolicy: { type: String },
      communityGuidelines: { type: String },
    },
    faqItems: { type: [faqItemSchema], default: [] },
    seo: {
      defaultTitle: { type: String },
      defaultDescription: { type: String },
    },
    appLinks: {
      iosAppUrl: { type: String },
      androidAppUrl: { type: String },
      webAppUrl: { type: String },
    },
    updatedBy: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

export const PlatformSettingsModel =
  models.PlatformSettings || model<PlatformSettingsDocument>("PlatformSettings", platformSettingsSchema);

