import { useEffect, useMemo, useState } from "react";
import { ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppPagination } from "../../../components/ui/AppPagination";
import { MainButton } from "../../../components/ui/MainButton";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import {
  fetchOrders,
  fetchRevenueSummary,
  processSubscriptionNotifications,
} from "../../../store/slices/orders";
import { showToast } from "../../../utils/showToast";
import OrdersPageSkeleton from "../components/OrdersPageSkeleton";
import OrdersSummaryCards from "../components/OrdersSummaryCards";
import OrdersTable from "../components/OrdersTable";
import OrdersToolbar from "../components/OrdersToolbar";
import SubscriptionProcessorCard from "../components/SubscriptionProcessorCard";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { courses, hasLoadedCourses } = useAppSelector((state) => state.courses);
  const {
    summary,
    list,
    subscriptionProcessingResult,
    filters,
    loadingSummary,
    loadingList,
    mutating,
    error,
  } = useAppSelector((state) => state.orders);

  const [status, setStatus] = useState(filters.status ?? "");
  const [region, setRegion] = useState(filters.region ?? "");
  const [courseId, setCourseId] = useState(filters.courseId ?? "");
  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState("3");

  useEffect(() => {
    if (!hasLoadedCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses]);

  useEffect(() => {
    if (!summary && !loadingSummary) {
      dispatch(fetchRevenueSummary());
    }
    if (!list && !loadingList) {
      dispatch(fetchOrders({ page: 1, limit: 10 }));
    }
  }, [dispatch, list, loadingList, loadingSummary, summary]);

  const refresh = async () => {
    const loadingId = showToast({
      type: "loading",
      message: "Refreshing orders...",
      options: {
        description: "Fetching the latest revenue and purchase data.",
      },
    });

    try {
      await Promise.all([
        dispatch(
          fetchRevenueSummary({ region: region.trim() || undefined }),
        ).unwrap(),
        dispatch(
          fetchOrders({
            page: list?.pagination.page ?? filters.page,
            limit: list?.pagination.limit ?? filters.limit,
            status: status || undefined,
            region: region.trim() || undefined,
            courseId: courseId || undefined,
          }),
        ).unwrap(),
      ]);

      showToast({
        type: "success",
        message: "Orders refreshed.",
        options: {
          id: loadingId,
          description: "Revenue and transaction tables are up to date.",
        },
      });
    } catch (refreshError) {
      showToast({
        type: "error",
        message: "Unable to refresh orders.",
        options: {
          id: loadingId,
          description:
            typeof refreshError === "string"
              ? refreshError
              : "Please try again in a moment.",
        },
      });
    }
  };

  const coursesById = useMemo(
    () =>
      courses.reduce<Record<string, string>>((accumulator, course) => {
        accumulator[course._id] = course.title;
        return accumulator;
      }, {}),
    [courses],
  );

  const totalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil((list?.pagination.total || 0) / (list?.pagination.limit || 10)),
      ),
    [list],
  );

  if ((loadingList && !list) || (loadingSummary && !summary)) {
    return <OrdersPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e7d2] bg-[#f4f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b6b47]">
              <ReceiptText className="h-3.5 w-3.5" />
              Orders and Transactions
            </div>
            <h1 className="mt-4 text-[28px] font-bold tracking-tight text-gray-900">
              Review payments, access lifecycle, and refunds
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Keep the transaction queue clean with real Commerce data, inspect
              purchase states, and jump into dedicated purchase detail pages for
              refund and Stripe audit work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MainButton
              text="Refresh"
              variant="outline"
              isLoading={loadingList || loadingSummary}
              onClick={() => void refresh()}
            />
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Order data could not be fully refreshed: {error}
        </div>
      ) : null}

      <OrdersSummaryCards summary={summary} loading={loadingSummary && !summary} />

      <SubscriptionProcessorCard
        daysBeforeExpiry={daysBeforeExpiry}
        setDaysBeforeExpiry={setDaysBeforeExpiry}
        result={subscriptionProcessingResult}
        loading={mutating}
        onRun={() => {
          const loadingId = showToast({
            type: "loading",
            message: "Processing subscription notifications...",
            options: {
              description: "Running the backend expiry automation now.",
            },
          });

          dispatch(
            processSubscriptionNotifications({
              daysBeforeExpiry: Number(daysBeforeExpiry || 3),
            }),
          )
            .unwrap()
            .then(() => {
              showToast({
                type: "success",
                message: "Subscription processing complete.",
                options: {
                  id: loadingId,
                  description: "Reminder and expiry jobs completed successfully.",
                },
              });
            })
            .catch((processError: unknown) => {
              showToast({
                type: "error",
                message: "Unable to process subscriptions.",
                options: {
                  id: loadingId,
                  description:
                    typeof processError === "string"
                      ? processError
                      : "Please try again.",
                },
              });
            });
        }}
      />

      <section className="space-y-6">
        <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
          <OrdersToolbar
            status={status}
            setStatus={setStatus}
            region={region}
            setRegion={setRegion}
            courseId={courseId}
            setCourseId={setCourseId}
            courses={courses}
            onApply={() => {
              dispatch(fetchRevenueSummary({ region: region.trim() || undefined }));
              dispatch(
                fetchOrders({
                  page: 1,
                  limit: list?.pagination.limit ?? filters.limit,
                  status: status || undefined,
                  region: region.trim() || undefined,
                  courseId: courseId || undefined,
                }),
              );
            }}
            onRefresh={() => void refresh()}
            loading={loadingList || loadingSummary}
          />
        </section>

        <OrdersTable
          items={list?.items ?? []}
          coursesById={coursesById}
          loading={loadingList}
          onOpen={(purchaseId) => navigate(`/orders/${purchaseId}`)}
        />

        <AppPagination
          currentPage={list?.pagination.page ?? 1}
          totalPages={totalPages}
          onPageChange={(page) =>
            dispatch(
              fetchOrders({
                page,
                limit: list?.pagination.limit ?? filters.limit,
                status: status || undefined,
                region: region.trim() || undefined,
                courseId: courseId || undefined,
              }),
            )
          }
        />
      </section>
    </div>
  );
}
