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
  updatedAt: string;
  updatedBy?: string | null;
};

export type SettingsState = {
  data: PlatformSettingsData | null;
  loading: boolean;
  mutating: boolean;
  error: string | null;
};
