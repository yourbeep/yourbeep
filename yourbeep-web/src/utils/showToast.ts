import { toast } from "sonner";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export type ToastOptions = {
  description?: string;
  duration?: number;
  id?: string | number;
};

export type ShowToastArgs = {
  type: ToastType;
  message: string;
  options?: ToastOptions;
};

export function showToast({ type, message, options }: ShowToastArgs) {
  const { description, duration = 3000, id } = options || {};
  const config = { description, duration, id };

  switch (type) {
    case "success":
      return toast.success(message, config);
    case "error":
      return toast.error(message, config);
    case "warning":
      return toast.warning(message, config);
    case "loading":
      return toast.loading(message, config);
    default:
      return toast(message, config);
  }
}

export default showToast;
