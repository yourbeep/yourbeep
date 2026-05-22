import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import {
  clearSelectedTestimonial,
  fetchTestimonialDetail,
  fetchTestimonials,
  hideAdminTestimonial,
} from "../../../store/slices/testimonials";
import { showToast } from "../../../utils/showToast";
import TestimonialDetailPanel from "../components/TestimonialDetailPanel";
import TestimonialSummaryCards from "../components/TestimonialSummaryCards";
import TestimonialsTable from "../components/TestimonialsTable";
import TestimonialsToolbar from "../components/TestimonialsToolbar";

export default function ReviewsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { courses, hasLoadedCourses } = useAppSelector(
    (state) => state.courses,
  );
  const {
    list,
    selectedTestimonial,
    filters,
    loadingList,
    loadingDetail,
    error,
  } = useAppSelector((state) => state.testimonials);
  const [searchQuery, setSearchQuery] = useState(filters.q);
  const [status, setStatus] = useState(filters.status ?? "");
  const [source, setSource] = useState(filters.source ?? "");
  const [featured, setFeatured] = useState(
    typeof filters.featured === "boolean" ? String(filters.featured) : "",
  );
  const [courseId, setCourseId] = useState(filters.courseId ?? "");

  useEffect(() => {
    if (!hasLoadedCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses]);

  useEffect(() => {
    if (!list && !loadingList) {
      dispatch(fetchTestimonials({ page: 1, limit: 10 }));
    }
  }, [dispatch, list, loadingList]);

  const refresh = () => {
    dispatch(
      fetchTestimonials({
        page: list?.pagination.page ?? filters.page,
        limit: list?.pagination.limit ?? filters.limit,
        q: searchQuery.trim(),
        status: status || undefined,
        source: source || undefined,
        featured: featured === "" ? undefined : featured === "true",
        courseId: courseId || undefined,
      }),
    );
  };

  const coursesById = useMemo<Record<string, string>>(
    () =>
      courses.reduce<Record<string, string>>((acc, course) => {
        acc[course._id] = course.title;
        return acc;
      }, {}),
    [courses],
  );

  const totalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil(
          (list?.pagination.total || 0) / (list?.pagination.limit || 10),
        ),
      ),
    [list],
  );

  if (loadingList && !list) {
    return (
      <div className="space-y-6">
        <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
          <ShimmerBlock className="h-8 w-52" />
          <ShimmerBlock className="mt-3 h-4 w-[60%]" />
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
            >
              <ShimmerBlock className="h-3 w-28" />
              <ShimmerBlock className="mt-4 h-8 w-16" />
            </div>
          ))}
        </div>

        <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="space-y-2">
                <ShimmerBlock className="h-3 w-16" />
                <ShimmerBlock className="h-11 w-full" />
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <ShimmerBlock className="h-7 w-20" />
                    <ShimmerBlock className="h-7 w-24" />
                    <ShimmerBlock className="h-7 w-28" />
                  </div>
                  <ShimmerBlock className="h-6 w-36" />
                  <ShimmerBlock className="h-4 w-24" />
                  <ShimmerBlock className="h-4 w-full" />
                  <ShimmerBlock className="h-4 w-[88%]" />
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }, (_, buttonIndex) => (
                    <ShimmerBlock key={buttonIndex} className="h-10 w-24" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Testimonial data could not be fully refreshed: {error}
        </div>
      ) : null}

      <TestimonialSummaryCards items={list?.items ?? []} />

      <section className="rounded-[24px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <TestimonialsToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          status={status}
          setStatus={setStatus}
          source={source}
          setSource={setSource}
          featured={featured}
          setFeatured={setFeatured}
          courseId={courseId}
          setCourseId={setCourseId}
          courses={courses}
          onApply={() =>
            dispatch(
              fetchTestimonials({
                page: 1,
                limit: list?.pagination.limit ?? filters.limit,
                q: searchQuery.trim(),
                status: status || undefined,
                source: source || undefined,
                featured: featured === "" ? undefined : featured === "true",
                courseId: courseId || undefined,
              }),
            )
          }
          onRefresh={refresh}
          onCreate={() => navigate("/reviews/create")}
        />
      </section>

      <TestimonialsTable
        items={list?.items ?? []}
        coursesById={coursesById}
        onOpen={(testimonialId) =>
          dispatch(fetchTestimonialDetail(testimonialId))
        }
        onEdit={(testimonial) => navigate(`/reviews/${testimonial._id}/edit`)}
        onHide={(testimonialId) =>
          dispatch(hideAdminTestimonial(testimonialId))
            .unwrap()
            .then(() => {
              showToast({
                type: "success",
                message: "Testimonial hidden.",
                options: {
                  description:
                    "The testimonial was removed from public display.",
                },
              });
              refresh();
            })
            .catch((hideError: unknown) => {
              showToast({
                type: "error",
                message: "Unable to hide testimonial.",
                options: {
                  description:
                    typeof hideError === "string"
                      ? hideError
                      : "Please try again.",
                },
              });
            })
        }
      />

      <Pagination
        currentPage={list?.pagination.page ?? 1}
        totalPages={totalPages}
        onPageChange={(page) =>
          dispatch(
            fetchTestimonials({
              page,
              limit: list?.pagination.limit ?? filters.limit,
              q: searchQuery.trim(),
              status: status || undefined,
              source: source || undefined,
              featured: featured === "" ? undefined : featured === "true",
              courseId: courseId || undefined,
            }),
          )
        }
      />

      <TestimonialDetailPanel
        testimonial={selectedTestimonial}
        loading={loadingDetail}
        courseTitle={
          selectedTestimonial?.courseId
            ? coursesById[selectedTestimonial.courseId] ||
              selectedTestimonial.courseId
            : "General platform testimonial"
        }
        onClose={() => dispatch(clearSelectedTestimonial())}
      />
    </div>
  );
}
