export type OrderStatus = "pending" | "active" | "expired" | "cancelled" | "refunded";
export type OrderPlanType = "six_month" | "annual";

export type OrderItem = {
  _id: string;
  userId: string;
  courseId: string;
  planType: OrderPlanType;
  status: OrderStatus;
  region: string;
  currency: string;
  originalAmount: number;
  discountAmount: number;
  amountPaid: number;
  promotionCode: string | null;
  promotionName: string | null;
  accessGranted: boolean;
  startDate: string | null;
  expiryDate: string | null;
  purchasedAt: string | null;
  stripeSessionId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeInvoiceId: string | null;
  stripePaymentIntentId: string | null;
  stripeRefundId: string | null;
  detectedRegionIp: string;
  phoneCountryCode: string | null;
  regionMismatch: boolean;
  renewedFromId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrdersListPayload = {
  items: OrderItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type RevenueSummary = {
  grossRevenue: number;
  activeCount: number;
  refundedCount: number;
};

export type ProcessSubscriptionsResult = {
  daysBeforeExpiry: number;
  expiringProcessed: number;
  expiredProcessed: number;
};

export type OrdersFilters = {
  page: number;
  limit: number;
  status?: OrderStatus;
  region?: string;
  courseId?: string;
};

export type OrdersState = {
  summary: RevenueSummary | null;
  list: OrdersListPayload | null;
  selectedOrder: OrderItem | null;
  subscriptionProcessingResult: ProcessSubscriptionsResult | null;
  filters: OrdersFilters;
  loadingSummary: boolean;
  loadingList: boolean;
  loadingDetail: boolean;
  mutating: boolean;
  error: string | null;
};
