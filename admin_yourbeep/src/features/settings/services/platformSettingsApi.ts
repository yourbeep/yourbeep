export const createDefaultFaqForm = () => ({
  category: "",
  question: "",
  answer: "",
  order: "1",
  isPublished: true,
});

export const createGeneralForm = (data) => ({
  platformName: data?.platformName ?? "",
  supportEmail: data?.supportEmail ?? "",
  supportPhone: data?.supportPhone ?? "",
  supportWhatsapp: data?.supportWhatsapp ?? "",
  contactAddress: data?.contactAddress ?? "",
  instagram: data?.socialLinks?.instagram ?? "",
  youtube: data?.socialLinks?.youtube ?? "",
  linkedin: data?.socialLinks?.linkedin ?? "",
  x: data?.socialLinks?.x ?? "",
  iosAppUrl: data?.appLinks?.iosAppUrl ?? "",
  androidAppUrl: data?.appLinks?.androidAppUrl ?? "",
  webAppUrl: data?.appLinks?.webAppUrl ?? "",
});

export const createBannerForm = (data) => ({
  eyebrow: data?.homeBanner?.eyebrow ?? "",
  title: data?.homeBanner?.title ?? "",
  subtitle: data?.homeBanner?.subtitle ?? "",
  announcementText: data?.homeBanner?.announcementText ?? "",
  primaryCtaLabel: data?.homeBanner?.primaryCtaLabel ?? "",
  primaryCtaUrl: data?.homeBanner?.primaryCtaUrl ?? "",
  secondaryCtaLabel: data?.homeBanner?.secondaryCtaLabel ?? "",
  secondaryCtaUrl: data?.homeBanner?.secondaryCtaUrl ?? "",
  desktopImageUrl: data?.homeBanner?.desktopImageUrl ?? "",
  mobileImageUrl: data?.homeBanner?.mobileImageUrl ?? "",
  backgroundVariant: data?.homeBanner?.backgroundVariant ?? "warm",
  trustBadgeText: data?.homeBanner?.trustBadgeText ?? "",
});

export const createFooterForm = (data) => ({
  tagline: data?.footer?.tagline ?? "",
  copyrightText: data?.footer?.copyrightText ?? "",
  links:
    data?.footer?.links?.length
      ? data.footer.links
      : [{ label: "", url: "" }],
});

export const createSeoForm = (data) => ({
  defaultTitle: data?.seo?.defaultTitle ?? "",
  defaultDescription: data?.seo?.defaultDescription ?? "",
});

export const createLegalForm = (data) => ({
  termsOfService: data?.legal?.termsOfService ?? "",
  privacyPolicy: data?.legal?.privacyPolicy ?? "",
  refundPolicy: data?.legal?.refundPolicy ?? "",
  cookiePolicy: data?.legal?.cookiePolicy ?? "",
  communityGuidelines: data?.legal?.communityGuidelines ?? "",
});
