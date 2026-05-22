import type {
  TestimonialSource,
  TestimonialStatus,
} from "../../../store/slices/testimonials";

export const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const statusTone: Record<TestimonialStatus, string> = {
  pending: "bg-[#fff8ea] text-[#9a7a19]",
  approved: "bg-[#eef7ee] text-[#2f6e3e]",
  rejected: "bg-[#fff1ef] text-[#c44536]",
  hidden: "bg-[#f4f5ef] text-[#5d6d57]",
};

export const sourceLabel = (value: TestimonialSource) =>
  value === "admin" ? "Admin Added" : "User Submitted";
