import { Filter, Plus, RefreshCw, Search } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type { ReviewCourseOption } from "../types";

type TestimonialsToolbarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  featured: string;
  setFeatured: (value: string) => void;
  courseId: string;
  setCourseId: (value: string) => void;
  courses: ReviewCourseOption[];
  onApply: () => void;
  onRefresh: () => void;
  onCreate: () => void;
};

export default function TestimonialsToolbar({
  searchQuery,
  setSearchQuery,
  status,
  setStatus,
  source,
  setSource,
  featured,
  setFeatured,
  courseId,
  setCourseId,
  courses,
  onApply,
  onRefresh,
  onCreate,
}: TestimonialsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#203321]">
            Filter testimonial library
          </p>
          <p className="mt-1 text-sm text-[#72806e]">
            Search, segment, and moderate testimonials without losing sight of featured content.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <MainButton
            text="Apply Filters"
            size="sm"
            headIcon={<Filter className="h-4 w-4" />}
            onClick={onApply}
          />
          <MainButton
            text="Refresh"
            size="sm"
            variant="outline"
            headIcon={<RefreshCw className="h-4 w-4" />}
            onClick={onRefresh}
          />
          <MainButton
            text="Add Testimonial"
            size="sm"
            variant="soft"
            headIcon={<Plus className="h-4 w-4" />}
            onClick={onCreate}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <InputField
          label="Search"
          name="testimonial-search"
          value={searchQuery}
          placeholder="Search by name or quote..."
          onChange={(event) => setSearchQuery(event.target.value)}
          helpText="Find quotes quickly by person or content."
        />

        <AnimatedDropdown
          label="Status"
          name="testimonial-status"
          value={status}
          options={[
            { label: "All statuses", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
            { label: "Hidden", value: "hidden" },
          ]}
          headIcon={<Filter className="h-4 w-4" />}
          className="w-full"
          onChange={setStatus}
        />

        <AnimatedDropdown
          label="Source"
          name="testimonial-source"
          value={source}
          options={[
            { label: "All sources", value: "" },
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
          ]}
          headIcon={<Search className="h-4 w-4" />}
          className="w-full"
          onChange={setSource}
        />

        <AnimatedDropdown
          label="Featured"
          name="testimonial-featured"
          value={featured}
          options={[
            { label: "All featured states", value: "" },
            { label: "Featured", value: "true" },
            { label: "Not featured", value: "false" },
          ]}
          headIcon={<Search className="h-4 w-4" />}
          className="w-full"
          onChange={setFeatured}
        />

        <AnimatedDropdown
          label="Course"
          name="testimonial-course"
          value={courseId}
          options={[
            { label: "All courses", value: "" },
            ...courses.map((course) => ({
              label: course.title,
              value: course._id,
            })),
          ]}
          headIcon={<Search className="h-4 w-4" />}
          className="w-full"
          onChange={setCourseId}
        />
      </div>
    </div>
  );
}
