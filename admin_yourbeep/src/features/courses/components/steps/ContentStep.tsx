import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, GripVertical, Layers3, Lock, Save, Sparkles, Trash2 } from "lucide-react";
import { AnimatedDropdown } from "../../../../components/ui/AnimatedDropdown";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { InputField } from "../../../../components/ui/InputField";
import { MainButton } from "../../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../../components/ui/ShimmerBlock";
import { SortableStack } from "../../../../components/ui/SortableStack";

type ContentFormState = {
  refId: string;
  sectionKey: string;
  order: number | string;
  title: string;
  description: string;
  durationMinutes: number | string;
  isFree: boolean;
};

type CourseSectionItem = {
  key: string;
  title: string;
  description?: string | null;
  order: number;
};

type GameItem = {
  _id: string;
  key?: string;
  title: string;
  description?: string;
};

type ContentItem = {
  _id: string;
  type: "video" | "game";
  refId: string;
  order: number;
  title: string;
  description?: string | null;
  durationMinutes?: number | null;
  isFree: boolean;
  videoStatus?: "ready" | "processing" | null;
  sectionKey?: string | null;
};

type ContentStepProps = {
  contentForm: ContentFormState;
  setContentForm: Dispatch<SetStateAction<ContentFormState>>;
  courseSections: CourseSectionItem[];
  gameItems: GameItem[];
  contentItems: ContentItem[];
  onAddGameContent: () => void;
  onReorderContentItems: (items: ContentItem[]) => Promise<void> | void;
  onRemoveContentItem: (itemId: string) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
};

const cardClassName =
  "rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-[0_18px_50px_rgba(34,52,28,0.06)]";

const sectionMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function sortContentItems(items: ContentItem[]) {
  return items.slice().sort((left, right) => left.order - right.order);
}

function hasPendingOrderChanges(current: ContentItem[], baseline: ContentItem[]) {
  if (current.length !== baseline.length) {
    return true;
  }

  return current.some((item, index) => {
    const baselineItem = baseline[index];
    return !baselineItem || baselineItem._id !== item._id || item.order !== index + 1;
  });
}

export default function ContentStep({
  contentForm,
  setContentForm,
  courseSections,
  gameItems,
  contentItems,
  onAddGameContent,
  onReorderContentItems,
  onRemoveContentItem,
  onBack,
  onNext,
  loading,
}: ContentStepProps) {
  const sortedContentItems = useMemo(() => sortContentItems(contentItems), [contentItems]);
  const [orderedItems, setOrderedItems] = useState<ContentItem[]>(sortedContentItems);
  const [savingOrder, setSavingOrder] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<ContentItem | null>(
    null,
  );

  useEffect(() => {
    setOrderedItems(sortedContentItems);
  }, [sortedContentItems]);

  const hasOrderChanges = useMemo(
    () => hasPendingOrderChanges(orderedItems, sortedContentItems),
    [orderedItems, sortedContentItems],
  );

  const gameOptions = useMemo(
    () => [
      { label: "Select a course game", value: "" },
      ...gameItems.map((game) => ({
        label: game.title,
        value: game._id,
      })),
    ],
    [gameItems],
  );
  const sectionOptions = useMemo(
    () => [
      { label: "Select a section", value: "" },
      ...courseSections
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((section) => ({
          label: `${section.order}. ${section.title}`,
          value: section.key,
        })),
    ],
    [courseSections],
  );
  const sectionTitleByKey = useMemo(
    () => new Map(courseSections.map((section) => [section.key, section.title])),
    [courseSections],
  );

  const handleSaveOrder = async () => {
    if (!hasOrderChanges) {
      return;
    }

    const reordered = orderedItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setSavingOrder(true);
    try {
      await onReorderContentItems(reordered);
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="space-y-6"
    >
      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7d3] bg-[#f4f8ef] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5f6f5d]">
                <Sparkles className="h-3.5 w-3.5" />
                Content Flow
              </div>
              <h3 className="mt-3 text-[24px] font-bold tracking-[-0.02em] text-[#203321]">
                Add standalone game activities
              </h3>
              <p className="mt-2 max-w-[640px] text-sm leading-6 text-[#72806e]">
                Lesson videos already create their own flow rows. Use this step for extra game
                activities, preview unlocks, and final sequencing across the course experience.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#203321]">Game</p>
                <AnimatedDropdown
                  name="content-game"
                  value={contentForm.refId}
                  options={gameOptions}
                  placeholder="Select a course game"
                  onChange={(value) =>
                    setContentForm((current) => ({
                      ...current,
                      refId: value,
                    }))
                  }
                />
              </div>
              <InputField
                label="Order"
                name="content-order"
                type="number"
                value={String(contentForm.order)}
                onChange={(event) =>
                  setContentForm((current) => ({
                    ...current,
                    order: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Display title"
                name="content-title"
                value={contentForm.title}
                placeholder="Reflection checkpoint"
                onChange={(event) =>
                  setContentForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
              <InputField
                label="Duration in minutes"
                name="content-duration"
                type="number"
                value={String(contentForm.durationMinutes)}
                placeholder="10"
                onChange={(event) =>
                  setContentForm((current) => ({
                    ...current,
                    durationMinutes: event.target.value,
                  }))
                }
              />
            </div>

            <InputField
              label="Description"
              name="content-description"
              element="textarea"
              rows={4}
              value={contentForm.description}
              placeholder="Explain what the learner should do, notice, or complete during this activity."
              onChange={(event) =>
                setContentForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#203321]">Section</p>
              <AnimatedDropdown
                name="content-section"
                value={contentForm.sectionKey}
                options={sectionOptions}
                placeholder="Select a section"
                onChange={(value) =>
                  setContentForm((current) => ({
                    ...current,
                    sectionKey: value,
                    order:
                      contentItems.filter((item) => item.sectionKey === value).length + 1,
                  }))
                }
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[#dfe8d6] bg-[#fbfcf8] px-4 py-3 text-sm font-medium text-[#314330]">
              <input
                type="checkbox"
                checked={contentForm.isFree}
                onChange={(event) =>
                  setContentForm((current) => ({
                    ...current,
                    isFree: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Allow this content item as a free preview
            </label>

            <div className="flex justify-end">
              <MainButton
                text={loading ? "Saving..." : "Add Content Item"}
                size="lg"
                headIcon={<Save className="h-4 w-4" />}
                onClick={onAddGameContent}
                isLoading={loading}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e6ebdf] bg-[#f9fbf6] p-5">
            <div className="rounded-[24px] border border-[#dfe8d6] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#74816f]">
                Flow Preview
              </p>
              <h4 className="mt-3 text-[22px] font-bold tracking-[-0.02em] text-[#203321]">
                {contentForm.title || "Standalone activity"}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#72806e]">
                {contentForm.description || "Your activity summary will appear here."}
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                    Access
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#203321]">
                    <Lock className="h-4 w-4 text-[#74816f]" />
                    {contentForm.isFree ? "Free preview unlocked" : "Available after purchase"}
                  </div>
                </div>
                <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                    Position
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#203321]">
                    Order {contentForm.order || "—"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#72806e]">
                    Duration {contentForm.durationMinutes || 0} minutes
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                    Structure
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#203321]">
                    {sectionTitleByKey.get(contentForm.sectionKey) || "General section"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#203321]">Drag to reorder course flow</p>
            <p className="mt-1 text-sm text-[#72806e]">
              Videos and standalone activities are all part of the same learner journey.
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

        {loading && !contentItems.length ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-[#edf1e7] bg-white p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <ShimmerBlock className="h-10 w-10 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <ShimmerBlock className="h-4 w-40" />
                    <ShimmerBlock className="h-3 w-full" />
                    <ShimmerBlock className="h-3 w-2/3" />
                  </div>
                  <ShimmerBlock className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : orderedItems.length ? (
          <SortableStack
            items={orderedItems}
            onReorder={setOrderedItems}
            getKey={(item) => item._id}
            renderItem={(item, index) => (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] text-[#6a7867]">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#dfe8d6] bg-[#fbfcf8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                        Order {index + 1}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                          item.type === "video"
                            ? "bg-[#eef4ff] text-[#0b57d0]"
                            : "bg-[#f4f8ef] text-[#55724d]"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          item.isFree
                            ? "bg-[#e6f6ed] text-[#1d8f57]"
                            : "bg-[#fff4e6] text-[#b5701f]"
                        }`}
                      >
                        {item.isFree ? "Free preview" : "Paid access"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#203321]">{item.title}</p>
                    {item.sectionKey ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#edf6ea] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#55724d]">
                          {sectionTitleByKey.get(item.sectionKey) || item.sectionKey}
                        </span>
                      </div>
                    ) : null}
                    <p className="mt-2 text-sm leading-6 text-[#5f6f5d]">
                      {item.description || "No description added yet."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#74816f]">
                      <span>Ref {item.refId}</span>
                      <span>
                        {item.durationMinutes ? `${item.durationMinutes} min` : "No duration"}
                      </span>
                      {item.type === "video" ? (
                        <span>{item.videoStatus === "ready" ? "Video ready" : "Video processing"}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MainButton
                    text="Delete"
                    size="sm"
                    variant="danger"
                    headIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => setPendingDeleteItem(item)}
                  />
                </div>
              </div>
            )}
          />
        ) : (
          <div className="rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#203321]">No course flow items yet</p>
            <p className="mt-2 text-sm text-[#72806e]">
              Uploaded videos and standalone activities will appear here once they are created.
            </p>
          </div>
        )}
      </motion.section>

      <motion.div
        variants={sectionMotion}
        className="sticky bottom-4 z-10 flex flex-wrap justify-between gap-3 rounded-[24px] border border-[#e7eadf] bg-white/92 px-4 py-4 shadow-[0_20px_50px_rgba(32,51,33,0.08)] backdrop-blur"
      >
        <MainButton
          text="Back"
          variant="outline"
          size="lg"
          headIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={onBack}
        />
        <MainButton
          text="Continue to Cues"
          size="lg"
          headIcon={<Layers3 className="h-4 w-4" />}
          onClick={onNext}
        />
      </motion.div>

      <ConfirmDialog
        open={Boolean(pendingDeleteItem)}
        title="Delete content item?"
        description={`This will remove "${pendingDeleteItem?.title || "this item"}" from the course flow and compact the remaining order.`}
        confirmText="Delete item"
        onCancel={() => setPendingDeleteItem(null)}
        onConfirm={() => {
          if (!pendingDeleteItem) {
            return;
          }
          onRemoveContentItem(pendingDeleteItem._id);
          setPendingDeleteItem(null);
        }}
      />
    </motion.div>
  );
}
