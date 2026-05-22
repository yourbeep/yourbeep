import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppPagination } from "../../../components/ui/AppPagination";
import { MainButton } from "../../../components/ui/MainButton";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import {
  archivePromotion,
  fetchPromotions,
  fetchPromotionSummary,
  restorePromotion,
} from "../../../store/slices/offers";
import { showToast } from "../../../utils/showToast";
import OffersPageSkeleton from "../components/OffersPageSkeleton";
import PromotionSummaryCards from "../components/PromotionSummaryCards";
import PromotionsTable from "../components/PromotionsTable";
import PromotionToolbar from "../components/PromotionToolbar";

export default function OffersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { courses, hasLoadedCourses } = useAppSelector((state) => state.courses);
  const { summary, list, filters, loadingList, loadingSummary, error } =
    useAppSelector((state) => state.offers);

  const [searchQuery, setSearchQuery] = useState(filters.q);
  const [status, setStatus] = useState(filters.status ?? "");
  const [courseId, setCourseId] = useState(filters.courseId ?? "");

  useEffect(() => {
    if (!hasLoadedCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses]);

  useEffect(() => {
    if (!summary && !loadingSummary) {
      dispatch(fetchPromotionSummary());
    }
    if (!list && !loadingList) {
      dispatch(fetchPromotions({ page: 1, limit: 20 }));
    }
  }, [dispatch, list, loadingList, loadingSummary, summary]);

  const coursesById = useMemo(
    () =>
      courses.reduce<Record<string, string>>((accumulator, course) => {
        accumulator[course._id] = course.title;
        return accumulator;
      }, {}),
    [courses],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      (list?.pagination.total || 0) /
        (list?.pagination.limit || filters.limit || 20),
    ),
  );

  const visibleStart = list?.items.length
    ? (list.pagination.page - 1) * list.pagination.limit + 1
    : 0;
  const visibleEnd =
    ((list?.pagination.page ?? 1) - 1) * (list?.pagination.limit ?? 20) +
    (list?.items.length ?? 0);

  const refresh = async () => {
    const loadingId = showToast({
      type: "loading",
      message: "Refreshing offers...",
      options: {
        description: "Fetching the latest promotion directory and summary data.",
      },
    });

    try {
      await Promise.all([
        dispatch(fetchPromotionSummary()).unwrap(),
        dispatch(
          fetchPromotions({
            page: list?.pagination.page ?? filters.page,
            limit: list?.pagination.limit ?? filters.limit,
            q: searchQuery.trim(),
            status: status || undefined,
            courseId: courseId || undefined,
          }),
        ).unwrap(),
      ]);

      showToast({
        type: "success",
        message: "Offers refreshed.",
        options: {
          id: loadingId,
          description: "Promotion list and summary are now up to date.",
        },
      });
    } catch (refreshError) {
      showToast({
        type: "error",
        message: "Unable to refresh offers.",
        options: {
          id: loadingId,
          description:
            typeof refreshError === "string"
              ? refreshError
              : "Please try again.",
        },
      });
    }
  };

  if ((loadingList && !list) || (loadingSummary && !summary)) {
    return <OffersPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e7d2] bg-[#f4f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b6b47]">
              <Sparkles className="h-3.5 w-3.5" />
              Coupons and Offers
            </div>
            <h1 className="mt-4 text-[28px] font-bold tracking-tight text-gray-900">
              Manage promotion rules across courses and regions
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Keep Commerce promotions clean with full visibility into scope,
              discount logic, schedule windows, redemption limits, and archived codes.
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
              text="Create Promotion"
              headIcon={<Sparkles className="h-4 w-4" />}
              onClick={() => navigate("/coupons/create")}
            />
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Promotion data could not be fully refreshed: {error}
        </div>
      ) : null}

      <PromotionSummaryCards summary={summary} loading={loadingSummary && !summary} />

      <PromotionToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        status={status}
        setStatus={setStatus}
        courseId={courseId}
        setCourseId={setCourseId}
        courses={courses}
        onCreate={() => navigate("/coupons/create")}
        onRefresh={() => void refresh()}
        loading={loadingList || loadingSummary}
      />

      <PromotionsTable
        items={list?.items ?? []}
        coursesById={coursesById}
        loading={loadingList}
        onEdit={(promotion) => navigate(`/coupons/${promotion._id}/edit`)}
        onArchive={(promotionId) => {
          const loadingId = showToast({
            type: "loading",
            message: "Archiving offer...",
            options: { description: "Saving the new promotion status." },
          });

          dispatch(archivePromotion(promotionId))
            .unwrap()
            .then(() => Promise.all([
              dispatch(fetchPromotionSummary()).unwrap(),
              dispatch(
                fetchPromotions({
                  page: list?.pagination.page ?? filters.page,
                  limit: list?.pagination.limit ?? filters.limit,
                  q: searchQuery.trim(),
                  status: status || undefined,
                  courseId: courseId || undefined,
                }),
              ).unwrap(),
            ]))
            .then(() => {
              showToast({
                type: "success",
                message: "Offer archived.",
                options: {
                  id: loadingId,
                  description: "The promotion is now archived successfully.",
                },
              });
            })
            .catch((archiveError: unknown) => {
              showToast({
                type: "error",
                message: "Unable to archive offer.",
                options: {
                  id: loadingId,
                  description:
                    typeof archiveError === "string"
                      ? archiveError
                      : "Please try again.",
                },
              });
            });
        }}
        onRestore={(promotionId) => {
          const loadingId = showToast({
            type: "loading",
            message: "Restoring offer...",
            options: { description: "Reactivating the archived promotion." },
          });

          dispatch(restorePromotion(promotionId))
            .unwrap()
            .then(() => Promise.all([
              dispatch(fetchPromotionSummary()).unwrap(),
              dispatch(
                fetchPromotions({
                  page: list?.pagination.page ?? filters.page,
                  limit: list?.pagination.limit ?? filters.limit,
                  q: searchQuery.trim(),
                  status: status || undefined,
                  courseId: courseId || undefined,
                }),
              ).unwrap(),
            ]))
            .then(() => {
              showToast({
                type: "success",
                message: "Offer restored.",
                options: {
                  id: loadingId,
                  description: "The promotion is active in the directory again.",
                },
              });
            })
            .catch((restoreError: unknown) => {
              showToast({
                type: "error",
                message: "Unable to restore offer.",
                options: {
                  id: loadingId,
                  description:
                    typeof restoreError === "string"
                      ? restoreError
                      : "Please try again.",
                },
              });
            });
        }}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-[#72806e]">
          Showing{" "}
          <span className="font-semibold text-[#203321]">
            {visibleStart}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#203321]">
            {visibleEnd}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#203321]">
            {(list?.pagination.total ?? 0).toLocaleString()}
          </span>{" "}
          promotions
        </p>

        <AppPagination
          currentPage={list?.pagination.page ?? 1}
          totalPages={totalPages}
          onPageChange={(page) =>
            dispatch(
              fetchPromotions({
                page,
                limit: list?.pagination.limit ?? filters.limit,
                q: searchQuery.trim(),
                status: status || undefined,
                courseId: courseId || undefined,
              }),
            )
          }
        />
      </div>
    </div>
  );
}
