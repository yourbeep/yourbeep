import type { StatusPillVariant } from "../../../components/ui/StatusPill";
import type { OrderPlanType, OrderStatus } from "../../../store/slices/orders/ordersTypes";

export const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

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

export const orderStatusVariant: Record<OrderStatus, StatusPillVariant> = {
  pending: "warning",
  active: "success",
  expired: "neutral",
  cancelled: "danger",
  refunded: "info",
};

export const planLabel = (value: OrderPlanType) =>
  value === "six_month" ? "6 Months" : value === "annual" ? "Annual" : value;

export const orderStatusLabel = (value: OrderStatus) =>
  value.charAt(0).toUpperCase() + value.slice(1);
