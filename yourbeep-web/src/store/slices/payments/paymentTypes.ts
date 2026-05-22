import type {
  BillingPlanType,
  CheckoutConfirmed,
  CheckoutInitiated,
  CoursePaymentPageData,
  PromotionPreview,
} from "@features/payments/services/paymentTypes";

export type PaymentNotice = {
  type: "success" | "info" | "error";
  message: string;
};

export type PaymentsState = {
  page: CoursePaymentPageData | null;
  selectedPlan: BillingPlanType;
  promotionCode: string;
  preview: PromotionPreview | null;
  latestCheckout: CheckoutInitiated | null;
  latestConfirmation: CheckoutConfirmed | null;
  loading: boolean;
  loaded: boolean;
  previewing: boolean;
  checkingOut: boolean;
  confirming: boolean;
  error: string | null;
  notice: PaymentNotice | null;
};
