import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { MainButton } from "./MainButton";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-[0_28px_80px_rgba(32,51,33,0.18)]"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-[#fff4e6] p-3 text-[#b5701f]">
                <FiAlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#203321]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#72806e]">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <MainButton
                text={cancelText}
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={loading}
              />
              <MainButton
                text={confirmText}
                variant="danger"
                size="md"
                onClick={onConfirm}
                isLoading={loading}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
