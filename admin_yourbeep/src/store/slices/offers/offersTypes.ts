export type PromotionSummary = {
  total: number;
  active: number;
  scheduled: number;
  expired: number;
  inactive: number;
  archived: number;
  autoApply: number;
  totalRedemptions: number;
  currentMonthRedemptions: number;
  currentMonthDiscountGiven: number;
};

export type PromotionItem = {
  _id: string;
  name: string;
  code: string;
  description: string | null;
  courseId: string | null;
  regions: string[];
  planTypes: Array<"six_month" | "annual">;
  discountType: "percentage" | "fixed_amount";
  percentageOff: number | null;
  amountOff: number | null;
  currency: string | null;
  autoApply: boolean;
  startsAt: string | null;
  endsAt: string | null;
  maxRedemptions: number | null;
  redemptionCount: number;
  perUserLimit: number;
  isActive: boolean;
  isArchived: boolean;
  status: "active" | "scheduled" | "expired" | "inactive" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type OffersFilters = {
  page?: number;
  limit?: number;
  q?: string;
  status?: "active" | "scheduled" | "expired" | "inactive" | "archived";
  courseId?: string;
};

export type OffersPayload = {
  items: PromotionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type OffersState = {
  summary: PromotionSummary | null;
  list: OffersPayload | null;
  selectedPromotion: PromotionItem | null;
  filters: {
    page: number;
    limit: number;
    q: string;
    status?: "active" | "scheduled" | "expired" | "inactive" | "archived";
    courseId?: string;
  };
  loadingSummary: boolean;
  loadingList: boolean;
  loadingDetail: boolean;
  mutating: boolean;
  error: string | null;
};
