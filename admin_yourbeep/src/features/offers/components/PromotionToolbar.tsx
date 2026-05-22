import { Filter, Plus, RefreshCcw } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type { AdminCourse } from "../../../store/slices/courses/coursesTypes";
import type { OffersFilters } from "../../../store/slices/offers";

type PromotionToolbarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  status: NonNullable<OffersFilters["status"]> | "";
  setStatus: (value: NonNullable<OffersFilters["status"]> | "") => void;
  courseId: string;
  setCourseId: (value: string) => void;
  courses: AdminCourse[];
  onCreate: () => void;
  onRefresh: () => void;
  loading: boolean;
};

const statusOptions: Array<{
  label: string;
  value: NonNullable<OffersFilters["status"]> | "";
}> = [
  { label: "All statuses", value: "" },
  { label: "Active", value: "active" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Expired", value: "expired" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

export default function PromotionToolbar({
  searchQuery,
  setSearchQuery,
  status,
  setStatus,
  courseId,
  setCourseId,
  courses,
  onCreate,
  onRefresh,
  loading,
}: PromotionToolbarProps) {
  return (
    <section className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <InputField
            label="Search promotions"
            value={searchQuery}
            placeholder="Search by code or name"
            onChange={(event) => setSearchQuery(event.target.value)}
            inputClassName="bg-white"
          />

          <AnimatedDropdown
            name="promotion-status"
            label="Status"
            value={status}
            options={statusOptions}
            placeholder="All statuses"
            onChange={(value) =>
              setStatus((value || "") as NonNullable<OffersFilters["status"]> | "")
            }
          />

          <AnimatedDropdown
            name="promotion-course"
            label="Course"
            value={courseId}
            options={[
              { label: "All courses / global", value: "" },
              ...courses.map((course) => ({
                label: course.title,
                value: course._id,
              })),
            ]}
            placeholder="All courses / global"
            onChange={setCourseId}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <MainButton
            text="Refresh"
            variant="outline"
            isLoading={loading}
            headIcon={<RefreshCcw className="h-4 w-4" />}
            onClick={onRefresh}
          />
          <MainButton
            text="Create Promotion"
            headIcon={<Plus className="h-4 w-4" />}
            onClick={onCreate}
          />
        </div>
      </div>
    </section>
  );
}
