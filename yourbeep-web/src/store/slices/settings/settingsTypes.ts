export type PlatformFaqItem = {
  _id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
};

export type PlatformSettingsData = {
  platformName: string;
  supportEmail: string | null;
  supportPhone: string | null;
  supportWhatsapp: string | null;
  contactAddress: string | null;
  socialLinks: Record<string, string>;
  homeBanner: {
    eyebrow?: string;
    title?: string;
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
  updatedAt: string;
};

export type LegalDocumentSlug = "terms" | "privacy" | "refund" | "cookies" | "community-guidelines";

export type LegalDocumentData = {
  key: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type ContactTopic =
  | "refund_related"
  | "account_access"
  | "course_access"
  | "video_access"
  | "payment_issue"
  | "game_issue"
  | "technical_issue"
  | "general_support"
  | "partnership"
  | "feedback";

export type ContactRequestPayload = {
  name: string;
  email: string;
  topic: ContactTopic;
  subject: string;
  message: string;
  phoneCountryCode?: string;
  userId?: string;
};

export type SettingsState = {
  data: PlatformSettingsData | null;
  legalDocs: Record<LegalDocumentSlug, LegalDocumentData | null>;
  loading: boolean;
  legalLoading: boolean;
  submittingContact: boolean;
  loaded: boolean;
  error: string | null;
  contactSuccessMessage: string | null;
};
