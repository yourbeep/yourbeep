import { useEffect, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { FieldLabel } from "../../../components/ui/FieldLabel";
import { MainButton } from "../../../components/ui/MainButton";
import { StatusPill } from "../../../components/ui/StatusPill";
import SettingsSectionCard from "./SettingsSectionCard";

const inputClassName =
  "w-full rounded-2xl border border-[#dfe8d6] bg-[#fbfcf8] px-4 py-3 text-sm text-[#203321] outline-none transition focus:border-[#0d6e6e] focus:bg-white";

type FaqItem = {
  _id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
};

type FaqForm = {
  category: string;
  question: string;
  answer: string;
  order: string;
  isPublished: boolean;
};

type FaqManagerProps = {
  faqItems: FaqItem[];
  faqForm: FaqForm;
  setFaqForm: React.Dispatch<React.SetStateAction<FaqForm>>;
  editingFaqId: string | null;
  onStartCreate: () => void;
  onStartEdit: (faq: FaqItem) => void;
  onSubmit: () => void;
  onDelete: (faqId: string) => void;
  onReorder: (faqItems: FaqItem[]) => Promise<void> | void;
  loading: boolean;
};

function sortFaqItems(faqItems: FaqItem[]) {
  return faqItems.slice().sort((left, right) => left.order - right.order);
}

function hasPendingOrderChanges(current: FaqItem[], baseline: FaqItem[]) {
  if (current.length !== baseline.length) {
    return true;
  }

  return current.some((faq, index) => {
    const baselineFaq = baseline[index];
    return (
      !baselineFaq || baselineFaq._id !== faq._id || faq.order !== index + 1
    );
  });
}

export default function FaqManager({
  faqItems,
  faqForm,
  setFaqForm,
  editingFaqId,
  onStartCreate,
  onStartEdit,
  onSubmit,
  onDelete,
  onReorder,
  loading,
}: FaqManagerProps) {
  const sortedFaqItems = useMemo(() => sortFaqItems(faqItems), [faqItems]);
  const [orderedFaqs, setOrderedFaqs] = useState<FaqItem[]>(sortedFaqItems);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    setOrderedFaqs(sortedFaqItems);
  }, [sortedFaqItems]);

  const hasOrderChanges = useMemo(
    () => hasPendingOrderChanges(orderedFaqs, sortedFaqItems),
    [orderedFaqs, sortedFaqItems],
  );

  const handleSaveOrder = async () => {
    if (!hasOrderChanges) {
      return;
    }

    const reordered = orderedFaqs.map((faq, index) => ({
      ...faq,
      order: index + 1,
    }));

    setSavingOrder(true);

    try {
      await onReorder(reordered);
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <SettingsSectionCard
      title="FAQ Manager"
      subtitle="Create, edit, publish, and reorder FAQ entries through the backend FAQ routes."
    >
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#203321]">
                {editingFaqId ? "Edit FAQ" : "Create FAQ"}
              </h3>
              <p className="mt-1 text-sm text-[#72806e]">
                Keep entries clean, concise, and ordered for the public help
                section.
              </p>
            </div>
            <MainButton
              text="New Draft"
              size="sm"
              variant="outline"
              headIcon={<Plus className="h-4 w-4" />}
              onClick={onStartCreate}
            />
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2">
                <FieldLabel>Category</FieldLabel>
              </div>
              <input
                value={faqForm.category}
                onChange={(event) =>
                  setFaqForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="Getting started"
              />
            </div>

            <div>
              <div className="mb-2">
                <FieldLabel>Question</FieldLabel>
              </div>
              <input
                value={faqForm.question}
                onChange={(event) =>
                  setFaqForm((current) => ({
                    ...current,
                    question: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="How does the platform work?"
              />
            </div>

            <div>
              <div className="mb-2">
                <FieldLabel>Answer</FieldLabel>
              </div>
              <textarea
                value={faqForm.answer}
                onChange={(event) =>
                  setFaqForm((current) => ({
                    ...current,
                    answer: event.target.value,
                  }))
                }
                className={`${inputClassName} min-h-[130px] resize-y`}
                placeholder="Write the public-facing answer here..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2">
                  <FieldLabel>Order</FieldLabel>
                </div>
                <input
                  type="number"
                  min="1"
                  value={faqForm.order}
                  onChange={(event) =>
                    setFaqForm((current) => ({
                      ...current,
                      order: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="mb-2">
                  <FieldLabel>Visibility</FieldLabel>
                </div>
                <label className="flex h-[50px] items-center gap-3 rounded-2xl border border-[#dfe8d6] bg-white px-4 text-sm font-medium text-[#314330]">
                  <input
                    type="checkbox"
                    checked={faqForm.isPublished}
                    onChange={(event) =>
                      setFaqForm((current) => ({
                        ...current,
                        isPublished: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  Published entry
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <MainButton
                text={editingFaqId ? "Update FAQ" : "Create FAQ"}
                type="button"
                isLoading={loading}
                headIcon={<Save className="h-4 w-4" />}
                onClick={onSubmit}
                className="flex-1 min-w-[180px]"
              />
              <MainButton
                text="Reset Form"
                type="button"
                variant="outline"
                onClick={onStartCreate}
                className="flex-1 min-w-[160px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {orderedFaqs.length ? (
            <>
              <div className="flex flex-col gap-3 rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#203321]">
                    Drag to reorder FAQs
                  </p>
                  <p className="mt-1 text-sm text-[#72806e]">
                    Update the display sequence, then save the new order.
                  </p>
                </div>
                <MainButton
                  text="Save Order"
                  size="sm"
                  variant={hasOrderChanges ? "primary" : "outline"}
                  isLoading={savingOrder}
                  disabled={!hasOrderChanges || loading}
                  headIcon={<Save className="h-4 w-4" />}
                  onClick={handleSaveOrder}
                />
              </div>

              <Reorder.Group
                axis="y"
                values={orderedFaqs}
                onReorder={setOrderedFaqs}
                className="space-y-3"
              >
                {orderedFaqs.map((faq, index) => (
                  <Reorder.Item
                    key={faq._id}
                    value={faq}
                    className="rounded-2xl border border-[#edf1e7] bg-white p-4 shadow-sm"
                    whileDrag={{
                      scale: 1.01,
                      boxShadow: "0 16px 36px rgba(32, 51, 33, 0.12)",
                    }}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] text-[#6a7867]">
                          <GripVertical className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusPill variant="muted" size="md">
                              {faq.category}
                            </StatusPill>
                            <StatusPill variant="info" size="md">
                              Order {index + 1}
                            </StatusPill>
                            <StatusPill
                              variant={faq.isPublished ? "success" : "warning"}
                              size="md"
                              dot
                            >
                              {faq.isPublished ? "Published" : "Draft"}
                            </StatusPill>
                          </div>

                          <p className="mt-3 text-sm font-semibold text-[#203321]">
                            {faq.question}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#5f6f5d]">
                            {faq.answer}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MainButton
                          text="Edit"
                          size="sm"
                          variant="outline"
                          headIcon={<Pencil className="h-4 w-4" />}
                          onClick={() => onStartEdit(faq)}
                        />
                        <MainButton
                          text="Delete"
                          size="sm"
                          variant="danger"
                          headIcon={<Trash2 className="h-4 w-4" />}
                          onClick={() => onDelete(faq._id)}
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </>
          ) : (
            <div className="rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] px-6 py-12 text-center">
              <p className="text-base font-semibold text-[#203321]">
                No FAQ items yet
              </p>
              <p className="mt-2 text-sm text-[#72806e]">
                Add the first FAQ entry for the public help section.
              </p>
              <div className="mt-5 flex justify-center">
                <MainButton
                  text="Create First FAQ"
                  size="sm"
                  headIcon={<Plus className="h-4 w-4" />}
                  onClick={onStartCreate}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </SettingsSectionCard>
  );
}
