import { toast } from "sonner";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastOptions {
  description?: string;
  duration?: number;
  id?: string | number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ShowToastArgs {
  type: ToastType;
  message: string;
  options?: ToastOptions;
}

export const showToast = ({ type, message, options }: ShowToastArgs) => {
  const { description, duration = 3000, id, action } = options || {};
  const config = { description, duration, id, action };

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
};
