import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiLayers,
  FiPlayCircle,
  FiZap,
} from "react-icons/fi";
import { MainButton } from "../../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../../components/ui/StatusPill";
import type { CourseFormState } from "../../hooks/useCourseBuilder";

type PricingItem = {
  region?: string;
  currency?: string;
  amount6mo?: number;
  amount1yr?: number;
};

type ContentItem = {
  _id?: string;
  title?: string;
  type?: string;
  order?: number;
  isFree?: boolean;
};

type VideoItem = {
  refId: string;
  title: string;
  order: number;
  videoStatus?: string | null;
};

type PublishStepProps = {
  activeCourseId: string | null;
  courseForm: CourseFormState;
  selectedGamesTotal: number;
  pricingItems: PricingItem[];
  contentItems: ContentItem[];
  videoItems: VideoItem[];
  onPublish: () => Promise<void> | void;
  onBack: () => void;
  loading: boolean;
};

type ReadyCheck = {
  label: string;
  passed: boolean;
  hint: string;
};

function PublishSummaryCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-[24px] border border-[#e7eadf] bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-[#eef7f5] p-3 text-[#0d6e6e]">
          {icon}
        </div>
        <StatusPill variant="info" size="sm">
          Review
        </StatusPill>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#72806e]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#203321]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#72806e]">{helper}</p>
    </motion.div>
  );
}

function PublishStepSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
        <ShimmerBlock className="h-8 w-56 rounded-xl" />
        <ShimmerBlock className="mt-3 h-4 w-full max-w-[540px] rounded-full" />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`publish-skeleton-card-${index}`}
              className="rounded-[24px] border border-[#e7eadf] bg-white p-4"
            >
              <ShimmerBlock className="h-12 w-12 rounded-2xl" />
              <ShimmerBlock className="mt-4 h-3 w-24 rounded-full" />
              <ShimmerBlock className="mt-3 h-7 w-16 rounded-full" />
              <ShimmerBlock className="mt-3 h-4 w-full rounded-full" />
              <ShimmerBlock className="mt-2 h-4 w-5/6 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
          <ShimmerBlock className="h-6 w-40 rounded-full" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ShimmerBlock
                key={`publish-skeleton-row-${index}`}
                className="h-[68px] w-full rounded-[20px]"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
            <ShimmerBlock className="h-6 w-36 rounded-full" />
            <ShimmerBlock className="mt-4 h-4 w-full rounded-full" />
            <ShimmerBlock className="mt-3 h-4 w-5/6 rounded-full" />
            <ShimmerBlock className="mt-6 h-12 w-full rounded-2xl" />
          </div>
          <div className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
            <ShimmerBlock className="h-6 w-32 rounded-full" />
            <ShimmerBlock className="mt-4 h-16 w-full rounded-[20px]" />
            <ShimmerBlock className="mt-3 h-16 w-full rounded-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublishStep({
  activeCourseId,
  courseForm,
  selectedGamesTotal,
  pricingItems,
  contentItems,
  videoItems,
  onPublish,
  onBack,
  loading,
}: PublishStepProps) {
  const readyChecks: ReadyCheck[] = [
    {
      label: "Game weights sum to 100%",
      passed: selectedGamesTotal === 100,
      hint: "Learners should receive the full intended game balance before launch.",
    },
    {
      label: "At least one pricing row exists",
      passed: pricingItems.length > 0,
      hint: "A published course needs a valid price row before checkout can work.",
    },
    {
      label: "At least one video exists",
      passed: videoItems.length > 0,
      hint: "The learning experience should include at least one playable lesson.",
    },
    {
      label: "Content order has been built",
      passed: contentItems.length > 0,
      hint: "The course flow should be arranged before learners enter the journey.",
    },
  ];

  const passedCount = readyChecks.filter((check) => check.passed).length;
  const readinessPercent = Math.round((passedCount / readyChecks.length) * 100);
  const firstPricing = pricingItems[0];
  const isPublished = courseForm.isPublished;
  const primaryActionLabel = loading
    ? isPublished
      ? "Updating..."
      : "Publishing..."
    : isPublished
      ? "Update Course"
      : "Publish Course";

  if (loading && !activeCourseId) {
    return <PublishStepSkeleton />;
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#203321]">Publish review</h2>
            <p className="mt-1 text-sm text-[#74816f]">
              Review the real backend state one last time before making the
              course visible to learners.
            </p>
          </div>
          <StatusPill
            variant={
              passedCount === readyChecks.length
                ? isPublished
                  ? "primary"
                  : "success"
                : "warning"
            }
            size="md"
            dot
            pulse={passedCount !== readyChecks.length}
          >
            {passedCount === readyChecks.length
              ? isPublished
                ? "Ready to update"
                : "Ready to publish"
              : `${passedCount}/${readyChecks.length} checks passed`}
          </StatusPill>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PublishSummaryCard
            icon={<FiBookOpen className="text-xl" />}
            label="Course Identity"
            value={courseForm.title || "Untitled"}
            helper={
              activeCourseId
                ? `Draft ID ${activeCourseId.slice(0, 8)}... is connected to the publish flow.`
                : "Create the draft first so the publish action has a real course target."
            }
          />
          <PublishSummaryCard
            icon={<FiDollarSign className="text-xl" />}
            label="Pricing"
            value={pricingItems.length}
            helper={
              firstPricing
                ? `${firstPricing.region || "—"} · ${firstPricing.currency || "—"} pricing is already saved.`
                : "No pricing rows are saved yet."
            }
          />
          <PublishSummaryCard
            icon={<FiPlayCircle className="text-xl" />}
            label="Lesson Videos"
            value={videoItems.length}
            helper="Uploaded lesson videos are the backbone of the course experience."
          />
          <PublishSummaryCard
            icon={<FiLayers className="text-xl" />}
            label="Content Flow"
            value={contentItems.length}
            helper="This includes visible lessons and interactive activities in the learner journey."
          />
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#203321]">
                Readiness checklist
              </h3>
              <p className="mt-1 text-sm text-[#74816f]">
                Anything marked as needing attention should be fixed before
                launch.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e7eadf] bg-[#f7faf2] px-3 py-2 text-xs font-medium text-[#61705d]">
              {readinessPercent}% complete
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {readyChecks.map((check) => (
              <motion.div
                key={check.label}
                whileHover={{ y: -1 }}
                className={`rounded-[22px] border p-4 ${
                  check.passed
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-amber-200 bg-amber-50/70"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-2xl p-2 ${
                        check.passed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {check.passed ? <FiCheckCircle /> : <FiClock />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#203321]">
                        {check.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#72806e]">
                        {check.hint}
                      </p>
                    </div>
                  </div>

                  <StatusPill
                    variant={check.passed ? "success" : "warning"}
                    size="sm"
                    dot
                  >
                    {check.passed ? "Ready" : "Needs attention"}
                  </StatusPill>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[#203321]">Course summary</h3>
            <div className="mt-5 space-y-3 text-sm text-[#314330]">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8faf6] px-4 py-3">
                <span className="text-[#72806e]">Course ID</span>
                <span className="font-semibold text-[#203321]">
                  {activeCourseId || "Not created yet"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8faf6] px-4 py-3">
                <span className="text-[#72806e]">Instructor</span>
                <span className="font-semibold text-[#203321]">
                  {courseForm.instructor.name || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8faf6] px-4 py-3">
                <span className="text-[#72806e]">Duration</span>
                <span className="font-semibold text-[#203321]">
                  {courseForm.durationMinutes || "—"} min
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8faf6] px-4 py-3">
                <span className="text-[#72806e]">Assigned games</span>
                <span className="font-semibold text-[#203321]">
                  {courseForm.games.length}
                </span>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[#203321]">Launch notes</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-[20px] border border-[#e7eadf] bg-[#f8faf6] p-4">
                <p className="text-sm font-semibold text-[#203321]">
                  Pricing should be final
                </p>
                <p className="mt-1 text-sm leading-6 text-[#72806e]">
                  Learners will rely on the checkout configuration already saved
                  in the pricing step.
                </p>
              </div>
              <div className="rounded-[20px] border border-[#e7eadf] bg-[#f8faf6] p-4">
                <p className="text-sm font-semibold text-[#203321]">
                  Lesson flow should be intentional
                </p>
                <p className="mt-1 text-sm leading-6 text-[#72806e]">
                  The published order should match the emotional and educational
                  arc you want learners to experience.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      <div className="flex justify-between">
        <MainButton text="Back" variant="outline" size="lg" onClick={onBack} />
        <MainButton
          text={primaryActionLabel}
          isLoading={loading}
          disabled={!activeCourseId}
          onClick={() => void onPublish()}
          size="lg"
        />
      </div>
    </div>
  );
}
