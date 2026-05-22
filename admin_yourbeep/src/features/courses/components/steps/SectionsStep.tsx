import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, GripVertical, Layers3, PlusCircle, Save, Trash2 } from "lucide-react";
import { InputField } from "../../../../components/ui/InputField";
import { MainButton } from "../../../../components/ui/MainButton";
import { SortableStack } from "../../../../components/ui/SortableStack";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import type { CourseSectionForm, CourseFormState } from "../../hooks/useCourseBuilder";

type SectionsStepProps = {
  courseForm: CourseFormState;
  setCourseForm: Dispatch<SetStateAction<CourseFormState>>;
  onSave: () => void;
  onBack: () => void;
  loading: boolean;
};

const cardClassName =
  "rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-[0_18px_50px_rgba(34,52,28,0.06)]";

const sectionMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const makeSectionKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);

export default function SectionsStep({
  courseForm,
  setCourseForm,
  onSave,
  onBack,
  loading,
}: SectionsStepProps) {
  const [draft, setDraft] = useState({ title: "", description: "" });
  const [pendingDelete, setPendingDelete] = useState<CourseSectionForm | null>(null);

  const orderedSections = useMemo(
    () => [...courseForm.sections].sort((left, right) => left.order - right.order),
    [courseForm.sections],
  );

  const addSection = () => {
    const title = draft.title.trim();
    if (!title) {
      return;
    }

    const key = makeSectionKey(title);
    setCourseForm((current) => {
      if (current.sections.some((section) => section.key === key)) {
        return current;
      }

      return {
        ...current,
        sections: [
          ...current.sections,
          {
            key,
            title,
            description: draft.description.trim(),
            order: current.sections.length + 1,
          },
        ],
      };
    });
    setDraft({ title: "", description: "" });
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
                <Layers3 className="h-3.5 w-3.5" />
                Course Sections
              </div>
              <h3 className="mt-3 text-[24px] font-bold tracking-[-0.02em] text-[#203321]">
                Create the course sections
              </h3>
              <p className="mt-2 max-w-[640px] text-sm leading-6 text-[#72806e]">
                Sections now drive content organization. Videos and game activities will be added
                into these sections, and content order is scoped inside each section.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Section title"
                name="section-title"
                value={draft.title}
                placeholder="Module 1 - Foundations"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
              />
              <div className="flex items-end">
                <MainButton
                  text="Add Section"
                  headIcon={<PlusCircle className="h-4 w-4" />}
                  onClick={addSection}
                  className="w-full"
                />
              </div>
            </div>

            <InputField
              label="Section description"
              name="section-description"
              element="textarea"
              rows={4}
              value={draft.description}
              placeholder="Describe what the learner will focus on in this section."
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>

          <div className="rounded-[28px] border border-[#e6ebdf] bg-[#f9fbf6] p-5">
            <div className="rounded-[24px] border border-[#dfe8d6] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#74816f]">
                Preview
              </p>
              <h4 className="mt-3 text-[22px] font-bold tracking-[-0.02em] text-[#203321]">
                {draft.title || "New course section"}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[#72806e]">
                {draft.description || "Your section summary will appear here."}
              </p>
              <div className="mt-5 rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                  Position
                </p>
                <p className="mt-2 text-sm font-semibold text-[#203321]">
                  Section {orderedSections.length + 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6 rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] px-4 py-4">
          <p className="text-sm font-semibold text-[#203321]">Drag to reorder sections</p>
          <p className="mt-1 text-sm text-[#72806e]">
            Section order controls the course-level flow. Video and activity order will then live
            inside each section.
          </p>
        </div>

        {orderedSections.length ? (
          <SortableStack
            items={orderedSections}
            onReorder={(items) =>
              setCourseForm((current) => ({
                ...current,
                sections: items.map((item, index) => ({ ...item, order: index + 1 })),
              }))
            }
            getKey={(item) => item.key}
            renderItem={(item, index) => (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] text-[#6a7867]">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#dfe8d6] bg-[#fbfcf8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#74816f]">
                        Section {index + 1}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#203321]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f6f5d]">
                      {item.description || "No description added yet."}
                    </p>
                    <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#74816f]">
                      <span>{item.key}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MainButton
                    text="Delete"
                    size="sm"
                    variant="danger"
                    headIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => setPendingDelete(item)}
                  />
                </div>
              </div>
            )}
          />
        ) : (
          <div className="rounded-2xl border border-[#edf1e7] bg-[#fbfcf8] px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#203321]">No sections yet</p>
            <p className="mt-2 text-sm text-[#72806e]">
              Add at least one section before moving on to videos and content.
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
          text={loading ? "Saving..." : "Continue to Videos"}
          size="lg"
          headIcon={<Save className="h-4 w-4" />}
          onClick={onSave}
          isLoading={loading}
        />
      </motion.div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete section?"
        description={`This will remove "${pendingDelete?.title || "this section"}" from the course structure.`}
        confirmText="Delete section"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }
          setCourseForm((current) => ({
            ...current,
            sections: current.sections
              .filter((section) => section.key !== pendingDelete.key)
              .map((section, index) => ({ ...section, order: index + 1 })),
          }));
          setPendingDelete(null);
        }}
      />
    </motion.div>
  );
}
