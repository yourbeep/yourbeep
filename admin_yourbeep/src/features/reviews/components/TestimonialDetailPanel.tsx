import { ImageIcon, Quote, Star } from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { TestimonialItem } from "../../../store/slices/testimonials";
import { formatDateTime, sourceLabel } from "../services/testimonialFormatters";

type TestimonialDetailPanelProps = {
  testimonial: TestimonialItem | null;
  loading: boolean;
  courseTitle: string;
  onClose: () => void;
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < rating
          ? "fill-[#d8a036] text-[#d8a036]"
          : "fill-transparent text-[#d9ded4]"
      }`}
    />
  ));
}

function getStatusVariant(status: TestimonialItem["status"]) {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "hidden":
      return "muted";
    default:
      return "warning";
  }
}

export default function TestimonialDetailPanel({
  testimonial,
  loading,
  courseTitle,
  onClose,
}: TestimonialDetailPanelProps) {
  if (!testimonial && !loading) return null;

  return (
    <section className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
            Testimonial Detail
          </p>
          <h3 className="mt-2 text-2xl font-bold text-[#203321]">
            {testimonial?.displayName || "Loading testimonial..."}
          </h3>
          <p className="mt-1 text-sm text-[#74816f]">
            {testimonial?.headline || courseTitle}
          </p>
        </div>
        <MainButton text="Close" variant="outline" size="sm" onClick={onClose} />
      </div>

      {loading || !testimonial ? (
        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[24px] border border-[#edf0e7] bg-[#fbfcf8] p-5">
              <div className="flex items-start gap-4">
                <ShimmerBlock className="h-16 w-16 shrink-0" />
                <div className="flex-1 space-y-3">
                  <ShimmerBlock className="h-6 w-40" />
                  <ShimmerBlock className="h-4 w-24" />
                  <div className="flex gap-2">
                    <ShimmerBlock className="h-7 w-20" />
                    <ShimmerBlock className="h-7 w-24" />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <ShimmerBlock key={index} className="h-4 w-4 rounded-md" />
                ))}
              </div>
              <div className="mt-5 rounded-[22px] border border-[#e7eadf] bg-white p-4">
                <ShimmerBlock className="h-4 w-28" />
                <div className="mt-3 space-y-2">
                  <ShimmerBlock className="h-4 w-full" />
                  <ShimmerBlock className="h-4 w-[92%]" />
                  <ShimmerBlock className="h-4 w-[80%]" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4"
                  >
                    <ShimmerBlock className="h-3 w-20" />
                    <ShimmerBlock className="mt-3 h-5 w-28" />
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#edf0e7] p-4"
                  >
                    <ShimmerBlock className="h-4 w-32" />
                    <div className="mt-3 space-y-2">
                      <ShimmerBlock className="h-4 w-full" />
                      <ShimmerBlock className="h-4 w-[85%]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[24px] border border-[#edf0e7] bg-[#fbfcf8] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#dfe8d6] bg-white">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-[#7b8b76]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-[#203321]">
                    {testimonial.displayName}
                  </p>
                  <p className="mt-1 text-sm text-[#74816f]">
                    {testimonial.roleLabel || "Learner"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusPill
                      variant={getStatusVariant(testimonial.status)}
                      size="md"
                      dot
                    >
                      {testimonial.status.charAt(0).toUpperCase() +
                        testimonial.status.slice(1)}
                    </StatusPill>
                    <StatusPill variant="info" size="md">
                      {sourceLabel(testimonial.source)}
                    </StatusPill>
                    {testimonial.featured ? (
                      <StatusPill variant="primary" size="md">
                        Featured
                      </StatusPill>
                    ) : null}
                  </div>
                  <div className="mt-4 flex gap-1">{renderStars(testimonial.rating)}</div>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-[#e7eadf] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
                  <Quote className="h-4 w-4 text-[#0d6e6e]" />
                  Quote
                </div>
                <p className="mt-3 text-sm leading-7 text-[#445342]">
                  {testimonial.quote}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Course
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#203321]">
                    {courseTitle}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Featured Order
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#203321]">
                    {testimonial.featuredOrder ?? "Not set"}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Created
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#203321]">
                    {formatDateTime(testimonial.createdAt)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Approved At
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#203321]">
                    {formatDateTime(testimonial.approvedAt)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#edf0e7] p-4">
                  <p className="text-sm font-semibold text-[#203321]">
                    Moderation Notes
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#445342]">
                    {testimonial.adminNotes || "No admin notes added yet."}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#edf0e7] p-4">
                  <p className="text-sm font-semibold text-[#203321]">
                    Rejection Reason
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#445342]">
                    {testimonial.rejectionReason || "No rejection reason provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
