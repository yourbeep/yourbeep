import api from "../../../services/api";
import type {
  NotificationAudienceType,
  NotificationCampaignStatus,
  NotificationCampaignType,
} from "../../../store/slices/notifications";

type ListCampaignParams = {
  page: number;
  limit: number;
  q?: string;
  status?: NotificationCampaignStatus;
  audienceType?: NotificationAudienceType;
};

type PreviewAudiencePayload = {
  audience: {
    type: NotificationAudienceType;
    courseId?: string;
    userIds?: string[];
    regions?: string[];
  };
};

type CampaignPayload = {
  title: string;
  body: string;
  imageUrl?: string;
  type: NotificationCampaignType;
  audience: {
    type: NotificationAudienceType;
    courseId?: string;
    userIds: string[];
    regions: string[];
  };
  data?: Record<string, string>;
  sendNow?: boolean;
};

export const notificationsApi = {
  getSummary: () => api.get("/admin/notifications/summary"),
  listCampaigns: (params: ListCampaignParams) =>
    api.get("/admin/notifications/campaigns", { params }),
  getCampaign: (campaignId: string) =>
    api.get(`/admin/notifications/campaigns/${campaignId}`),
  createCampaign: (payload: CampaignPayload) =>
    api.post("/admin/notifications/campaigns", payload),
  updateCampaign: (campaignId: string, payload: CampaignPayload) =>
    api.patch(`/admin/notifications/campaigns/${campaignId}`, payload),
  sendCampaign: (campaignId: string) =>
    api.post(`/admin/notifications/campaigns/${campaignId}/send`),
  cancelCampaign: (campaignId: string) =>
    api.delete(`/admin/notifications/campaigns/${campaignId}`),
  previewAudience: (payload: PreviewAudiencePayload) =>
    api.post("/admin/notifications/audience-preview", payload),
};
