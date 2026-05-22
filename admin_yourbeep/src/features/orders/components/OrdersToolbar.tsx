import { Filter, RefreshCcw } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type { AdminCourse } from "../../../store/slices/courses/coursesTypes";
import type { OrderStatus } from "../../../store/slices/orders/ordersTypes";
import { orderStatusLabel } from "../services/orderFormatters";

type OrdersToolbarProps = {
  status: OrderStatus | "";
  setStatus: (value: OrderStatus | "") => void;
  region: string;
  setRegion: (value: string) => void;
  courseId: string;
  setCourseId: (value: string) => void;
  courses: AdminCourse[];
  onApply: () => void;
  onRefresh: () => void;
  loading: boolean;
};

const statusOptions: Array<{ label: string; value: OrderStatus | "" }> = [
  { label: "All statuses", value: "" },
  { label: orderStatusLabel("pending"), value: "pending" },
  { label: orderStatusLabel("active"), value: "active" },
  { label: orderStatusLabel("expired"), value: "expired" },
  { label: orderStatusLabel("cancelled"), value: "cancelled" },
  { label: orderStatusLabel("refunded"), value: "refunded" },
];

export default function OrdersToolbar({
  status,
  setStatus,
  region,
  setRegion,
  courseId,
  setCourseId,
  courses,
  onApply,
  onRefresh,
  loading,
}: OrdersToolbarProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
        <AnimatedDropdown
          name="order-status"
          label="Status"
          value={status}
          options={statusOptions}
          placeholder="All statuses"
          onChange={(value) => setStatus((value || "") as OrderStatus | "")}
        />

        <InputField
          label="Region"
          value={region}
          placeholder="IN"
          onChange={(event) => setRegion(event.target.value.toUpperCase())}
          inputClassName="bg-white uppercase"
          helpText="Use a 2-letter region code."
        />

        <AnimatedDropdown
          name="order-course"
          label="Course"
          value={courseId}
          options={[
            { label: "All courses", value: "" },
            ...courses.map((course) => ({
              label: course.title,
              value: course._id,
            })),
          ]}
          placeholder="All courses"
          onChange={(value) => setCourseId(value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <MainButton
          text="Apply Filters"
          headIcon={<Filter className="h-4 w-4" />}
          onClick={onApply}
        />
        <MainButton
          text="Refresh"
          variant="outline"
          isLoading={loading}
          headIcon={<RefreshCcw className="h-4 w-4" />}
          onClick={onRefresh}
        />
      </div>
    </div>
  );
}
