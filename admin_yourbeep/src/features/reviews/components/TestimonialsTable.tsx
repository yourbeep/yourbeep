import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import { MainButton } from "../../../components/ui/MainButton";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { TestimonialItem } from "../../../store/slices/testimonials";
import { formatDateTime, sourceLabel } from "../services/testimonialFormatters";

type TestimonialsTableProps = {
  items: TestimonialItem[];
  coursesById: Record<string, string>;
  onOpen: (testimonialId: string) => void;
  onEdit: (testimonial: TestimonialItem) => void;
  onHide: (testimonialId: string) => void;
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

export default function TestimonialsTable({
  items,
  coursesById,
  onOpen,
  onEdit,
  onHide,
}: TestimonialsTableProps) {
  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-6 py-14 text-center">
        <p className="text-lg font-semibold text-[#203321]">No testimonials yet</p>
        <p className="mt-2 text-sm text-[#74816f]">
          Approved quotes and pending moderation items will appear here once they exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item._id}
          className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill variant={getStatusVariant(item.status)} dot>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </StatusPill>
                <StatusPill variant="info">{sourceLabel(item.source)}</StatusPill>
                {item.featured ? (
                  <StatusPill variant="primary">Featured</StatusPill>
                ) : null}
                <StatusPill variant="muted">
                  {item.courseId
                    ? coursesById[item.courseId] || item.courseId
                    : "General platform"}
                </StatusPill>
              </div>

              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onOpen(item._id)}
                    className="text-left"
                  >
                    <p className="text-lg font-semibold text-[#203321]">
                      {item.displayName}
                    </p>
                    <p className="mt-1 text-sm text-[#74816f]">
                      {item.roleLabel || "Learner"}
                    </p>
                  </button>
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-[#304132]">
                    {item.quote}
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="flex gap-1">{renderStars(item.rating)}</div>
                  <p className="mt-2 text-xs text-[#74816f]">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <MainButton
                text="View"
                size="sm"
                variant="outline"
                headIcon={<Eye className="h-4 w-4" />}
                onClick={() => onOpen(item._id)}
              />
              <MainButton
                text="Edit"
                size="sm"
                variant="outline"
                headIcon={<Pencil className="h-4 w-4" />}
                onClick={() => onEdit(item)}
              />
              {item.status !== "hidden" ? (
                <MainButton
                  text="Hide"
                  size="sm"
                  variant="danger"
                  headIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => onHide(item._id)}
                />
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
