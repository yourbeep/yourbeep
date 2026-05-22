export type BillingPlanType = "six_month" | "annual";

export type CheckoutMode = "purchase" | "renew";

export type PaymentCourseSummary = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  gamesCount: number;
  durationMinutes: number;
};

export type PaymentCoursePricing = {
  region: string;
  currency: string;
  amount6mo: number;
  amount1yr: number;
  displayPrice6mo: string;
  displayPrice1yr: string;
};

export type PaymentCourseAccess = {
  hasAccess: boolean;
  reason?: string | null;
  expiredAt?: string | null;
  canRenew?: boolean;
  purchase?: {
    purchaseId: string;
    planType: string;
    status: string;
    startDate?: string | null;
    expiryDate?: string | null;
    daysRemaining?: number | null;
  } | null;
};

export type PromotionPreview = {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  appliedPromotion: {
    id?: string;
    name?: string;
    code?: string;
    discountType?: string;
    discountValue?: number;
  } | null;
};

export type CheckoutInitiated = PromotionPreview & {
  checkoutUrl: string;
  sessionId: string;
  purchaseId: string;
  expiresAt?: string | null;
};

export type CheckoutConfirmed = {
  purchaseId: string;
  status: string;
  accessGranted: boolean;
  startDate?: string | null;
  expiryDate?: string | null;
};

export type CoursePaymentPageData = {
  course: PaymentCourseSummary;
  pricing: PaymentCoursePricing;
  access: PaymentCourseAccess;
};
