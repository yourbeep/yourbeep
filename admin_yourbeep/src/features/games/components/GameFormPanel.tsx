import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Blocks } from "lucide-react";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import type { AdminGame } from "../../../store/slices/games";
import type { GameFormState } from "../hooks/useGameForm";

type GameFormPanelProps = {
  isOpen: boolean;
  form: GameFormState;
  setForm: Dispatch<SetStateAction<GameFormState>>;
  editingGame: AdminGame | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function GameFormPanel({
  isOpen,
  form,
  setForm,
  editingGame,
  loading,
  onClose,
  onSubmit,
}: GameFormPanelProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="rounded-2xl bg-[#eef5ea] p-3 text-[#3e6f47]">
                  <Blocks className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-[#203321]">
                    {editingGame ? "Edit Game" : "Create Game"}
                  </h3>
                  <p className="mt-1 text-sm text-[#74816f]">
                    Manage the reusable game library that courses can attach to.
                  </p>
                </div>
              </div>
              <MainButton
                text="Close"
                variant="outline"
                size="sm"
                onClick={onClose}
              />
            </div>

            <div className="grid gap-4">
              <InputField
                label="Game Title"
                value={form.title}
                placeholder="Awareness States"
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                inputClassName="bg-white"
              />

              <InputField
                label="Game Key"
                value={form.key}
                placeholder="awareness_states"
                disabled={Boolean(editingGame)}
                onChange={(event) =>
                  setForm((current) => ({ ...current, key: event.target.value }))
                }
                inputClassName="bg-white disabled:bg-[#f1f4ec]"
                helpText="Keys are locked after creation because course and gameplay logic depend on them."
              />

              <InputField
                element="textarea"
                label="Description"
                value={form.description}
                rows={4}
                placeholder="Short game description"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                inputClassName="min-h-[140px] bg-white"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <MainButton
                text="Cancel"
                variant="outline"
                onClick={onClose}
              />
              <MainButton
                text={editingGame ? "Save Changes" : "Create Game"}
                isLoading={loading}
                onClick={onSubmit}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
