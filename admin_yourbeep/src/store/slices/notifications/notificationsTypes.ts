export type NotificationAudienceType =
  | "all_users"
  | "premium_users"
  | "course_purchasers"
  | "specific_users"
  | "region_users";

export type NotificationCampaignStatus = "draft" | "sent" | "cancelled";

export type NotificationCampaignType =
  | "course_ready"
  | "game_added"
  | "game_reminder"
  | "purchase_confirmed"
  | "subscription_expiring"
  | "subscription_expired"
  | "admin_broadcast";

export type NotificationCampaign = {
  _id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  type: NotificationCampaignType;
  audience: {
    type: NotificationAudienceType;
    courseId: string | null;
    userIds: string[];
    regions: string[];
  };
  data: Record<string, string>;
  status: NotificationCampaignStatus;
  targetedUsersCount: number;
  requestedTokens: number;
  successCount: number;
  failureCount: number;
  invalidTokenCount: number;
  sentAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationCampaignList = {
  items: NotificationCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type NotificationSummary = {
  totalCampaigns: number;
  draftCampaigns: number;
  sentCampaigns: number;
  cancelledCampaigns: number;
  premiumAudienceCampaigns: number;
  totalDelivered: number;
  totalFailures: number;
  recentCampaigns: NotificationCampaign[];
};

export type AudiencePreview = {
  audience: {
    type: NotificationAudienceType;
    courseId: string | null;
    userIds: string[];
    regions: string[];
  };
  targetedUsers: number;
  targetedTokens: number;
  sampleUsers: Array<{
    _id: string;
    name: string;
    email: string;
    region: string | null;
    tokenCount: number;
  }>;
};

export type NotificationsFilters = {
  page: number;
  limit: number;
  q: string;
  status?: NotificationCampaignStatus;
  audienceType?: NotificationAudienceType;
};

export type NotificationsState = {
  summary: NotificationSummary | null;
  list: NotificationCampaignList | null;
  selectedCampaign: NotificationCampaign | null;
  audiencePreview: AudiencePreview | null;
  filters: NotificationsFilters;
  loadingSummary: boolean;
  loadingList: boolean;
  loadingDetail: boolean;
  previewLoading: boolean;
  mutating: boolean;
  error: string | null;
};
