import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  clearSelectedCampaign,
  fetchNotificationCampaignDetail,
} from "../../../store/slices/notifications";
import NotificationCampaignDetailPanel from "../components/NotificationCampaignDetailPanel";

const NotificationCampaignDetailPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { selectedCampaign, loadingDetail, error } = useAppSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    if (campaignId) {
      dispatch(fetchNotificationCampaignDetail(campaignId));
    }
  }, [campaignId, dispatch]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-[28px] font-bold tracking-tight text-gray-900">
          Campaign Detail
        </h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Review the campaign payload, audience targeting, delivery counts, and operational metadata for a single notification campaign.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Campaign data could not be fully refreshed: {error}
        </div>
      ) : null}

      <NotificationCampaignDetailPanel
        campaign={selectedCampaign}
        loading={loadingDetail}
        onClose={() => {
          dispatch(clearSelectedCampaign());
          navigate("/notifications");
        }}
      />
    </div>
  );
};

export default NotificationCampaignDetailPage;
