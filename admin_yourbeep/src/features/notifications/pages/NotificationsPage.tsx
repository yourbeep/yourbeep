import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BellRing, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppPagination } from "../../../components/ui/AppPagination";
import { MainButton } from "../../../components/ui/MainButton";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  cancelNotificationCampaign,
  fetchNotificationCampaigns,
  fetchNotificationSummary,
  sendNotificationCampaign,
} from "../../../store/slices/notifications";
import { showToast } from "../../../utils/showToast";
import NotificationCampaignsTable from "../components/NotificationCampaignsTable";
import NotificationsPageSkeleton from "../components/NotificationsPageSkeleton";
import NotificationSummaryCards from "../components/NotificationSummaryCards";
import NotificationToolbar from "../components/NotificationToolbar";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    summary,
    list,
    filters,
    loadingSummary,
    loadingList,
    mutating,
    error,
  } = useAppSelector((state) => state.notifications);

  const [searchQuery, setSearchQuery] = useState(filters.q);
  const [status, setStatus] = useState(filters.status ?? "");
  const [audienceType, setAudienceType] = useState(filters.audienceType ?? "");

  useEffect(() => {
    if (!summary && !loadingSummary) {
      dispatch(fetchNotificationSummary());
    }
    if (!list && !loadingList) {
      dispatch(fetchNotificationCampaigns({ page: 1, limit: 10 }));
    }
  }, [dispatch, list, loadingList, loadingSummary, summary]);

  const refresh = async () => {
    const loadingId = showToast({
      type: "loading",
      message: "Refreshing campaigns...",
      options: {
        description: "Pulling the latest delivery and draft data.",
      },
    });

    try {
      await Promise.all([
        dispatch(fetchNotificationSummary()).unwrap(),
        dispatch(
          fetchNotificationCampaigns({
            page: list?.pagination.page ?? filters.page,
            limit: list?.pagination.limit ?? filters.limit,
            q: searchQuery.trim(),
            status: status || undefined,
            audienceType: audienceType || undefined,
          }),
        ).unwrap(),
      ]);

      showToast({
        type: "success",
        message: "Notification center refreshed.",
        options: {
          id: loadingId,
          description: "Campaign, audience, and delivery metrics are up to date.",
        },
      });
    } catch (refreshError) {
      showToast({
        type: "error",
        message: "Unable to refresh notification center.",
        options: {
          id: loadingId,
          description:
            typeof refreshError === "string"
              ? refreshError
              : "Please try again in a moment.",
          duration: 4500,
        },
      });
    }
  };

  const totalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil((list?.pagination.total || 0) / (list?.pagination.limit || 10)),
      ),
    [list],
  );

  if ((loadingList && !list) || (loadingSummary && !summary)) {
    return <NotificationsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e7d2] bg-[#f4f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b6b47]">
              <BellRing className="h-3.5 w-3.5" />
              Notification Center
            </div>
            <h1 className="mt-4 text-[28px] font-bold tracking-tight text-gray-900">
              Manage campaigns, drafts, and delivery health
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Create backend-aligned push campaigns, preview the audience before send,
              and keep a clean view of what has delivered, failed, or stayed in draft.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <MainButton
              text="Refresh"
              variant="outline"
              isLoading={loadingList || loadingSummary}
              onClick={() => void refresh()}
            />
            <MainButton
              text="Create Campaign"
              headIcon={<Sparkles className="h-4 w-4" />}
              onClick={() => navigate("/notifications/create")}
            />
          </div>
        </div>
      </motion.section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Notification data could not be fully refreshed: {error}
        </div>
      ) : null}

      <NotificationSummaryCards
        summary={summary}
        loading={loadingSummary && !summary}
      />

      <section className="space-y-6">
        <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
          <NotificationToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            status={status}
            setStatus={setStatus}
            audienceType={audienceType}
            setAudienceType={setAudienceType}
            onApply={() =>
              dispatch(
                fetchNotificationCampaigns({
                  page: 1,
                  limit: list?.pagination.limit ?? filters.limit,
                  q: searchQuery.trim(),
                  status: status || undefined,
                  audienceType: audienceType || undefined,
                }),
              )
            }
            onRefresh={() => void refresh()}
            onCreate={() => navigate("/notifications/create")}
            loading={loadingList || loadingSummary}
          />
        </section>

        <NotificationCampaignsTable
          items={list?.items ?? []}
          loading={loadingList}
          onOpen={(campaignId) => navigate(`/notifications/campaigns/${campaignId}`)}
          onEdit={(campaign) =>
            navigate(`/notifications/${campaign._id}/edit`)
          }
          onSend={(campaignId) => {
            const loadingId = showToast({
              type: "loading",
              message: "Sending campaign...",
              options: {
                description: "Dispatching notifications to the selected audience.",
              },
            });

            dispatch(sendNotificationCampaign(campaignId))
              .unwrap()
              .then(() => {
                void refresh();
                showToast({
                  type: "success",
                  message: "Campaign sent.",
                  options: {
                    id: loadingId,
                    description: "The notification campaign was sent successfully.",
                  },
                });
              })
              .catch((sendError: unknown) => {
                showToast({
                  type: "error",
                  message: "Unable to send campaign.",
                  options: {
                    id: loadingId,
                    description:
                      typeof sendError === "string"
                        ? sendError
                        : "Please try again.",
                  },
                });
              });
          }}
          onCancel={(campaignId) => {
            const loadingId = showToast({
              type: "loading",
              message: "Cancelling campaign...",
              options: {
                description: "Removing the draft from the active notification queue.",
              },
            });

            dispatch(cancelNotificationCampaign(campaignId))
              .unwrap()
              .then(() => {
                void refresh();
                showToast({
                  type: "success",
                  message: "Campaign cancelled.",
                  options: {
                    id: loadingId,
                    description: "The draft campaign was cancelled successfully.",
                  },
                });
              })
              .catch((cancelError: unknown) => {
                showToast({
                  type: "error",
                  message: "Unable to cancel campaign.",
                  options: {
                    id: loadingId,
                    description:
                      typeof cancelError === "string"
                        ? cancelError
                        : "Please try again.",
                  },
                });
              });
          }}
        />

        <AppPagination
          currentPage={list?.pagination.page ?? 1}
          totalPages={totalPages}
          onPageChange={(page) =>
            dispatch(
              fetchNotificationCampaigns({
                page,
                limit: list?.pagination.limit ?? filters.limit,
                q: searchQuery.trim(),
                status: status || undefined,
                audienceType: audienceType || undefined,
              }),
            )
          }
        />
      </section>
    </div>
  );
}
