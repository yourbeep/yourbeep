import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgePercent,
  CalendarClock,
  Save,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import {
  clearSelectedPromotion,
  createPromotion,
  fetchPromotionDetail,
  fetchPromotions,
  fetchPromotionSummary,
  updatePromotion,
  type PromotionItem,
} from "../../../store/slices/offers";
import { showToast } from "../../../utils/showToast";
import {
  buildPromotionPayload,
  getDefaultPromotionForm,
  mapPromotionToForm,
  type PromotionFormState,
} from "../services/promotionAdminApi";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function PromotionEditorPage() {
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditing = Boolean(promotionId);

  const { courses, hasLoadedCourses } = useAppSelector((state) => state.courses);
  const { selectedPromotion, loadingDetail, mutating } = useAppSelector(
    (state) => state.offers,
  );

  const [form, setForm] = useState<PromotionFormState>(getDefaultPromotionForm());

  useEffect(() => {
    if (!hasLoadedCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses]);

  useEffect(() => {
    if (promotionId) {
      dispatch(fetchPromotionDetail(promotionId));
    } else {
      dispatch(clearSelectedPromotion());
      setForm(getDefaultPromotionForm());
    }

    return () => {
      dispatch(clearSelectedPromotion());
    };
  }, [dispatch, promotionId]);

  useEffect(() => {
    if (promotionId && selectedPromotion?._id === promotionId) {
      setForm(mapPromotionToForm(selectedPromotion));
    }
  }, [promotionId, selectedPromotion]);

  const payload = useMemo(() => buildPromotionPayload(form), [form]);

  const courseTitle = useMemo(() => {
    if (!form.courseId) return "Global promotion";
    return courses.find((course) => course._id === form.courseId)?.title || form.courseId;
  }, [courses, form.courseId]);

  const previewDiscount = useMemo(() => {
    if (form.discountType === "percentage") {
      return form.percentageOff ? `${form.percentageOff}% off` : "Percentage off";
    }
    return form.amountOff
      ? `${form.currency || "INR"} ${form.amountOff} off`
      : "Fixed amount off";
  }, [form.amountOff, form.currency, form.discountType, form.percentageOff]);

  const handleSubmit = async () => {
    const loadingId = showToast({
      type: "loading",
      message: isEditing ? "Updating offer..." : "Creating offer...",
      options: {
        description: "Saving the promotion to Commerce.",
      },
    });

    try {
      if (isEditing && promotionId) {
        await dispatch(
          updatePromotion({
            promotionId,
            payload,
          }),
        ).unwrap();
      } else {
        await dispatch(createPromotion(payload)).unwrap();
      }

      await Promise.all([
        dispatch(fetchPromotions({ page: 1, limit: 20 })).unwrap(),
        dispatch(fetchPromotionSummary()).unwrap(),
      ]);

      showToast({
        type: "success",
        message: isEditing ? "Offer updated." : "Offer created.",
        options: {
          id: loadingId,
          description: "The promotion directory has been refreshed.",
        },
      });

      navigate("/coupons");
    } catch (submitError) {
      showToast({
        type: "error",
        message: isEditing ? "Unable to update offer." : "Unable to create offer.",
        options: {
          id: loadingId,
          description:
            typeof submitError === "string"
              ? submitError
              : "Please review the promotion fields and try again.",
          duration: 5000,
        },
      });
    }
  };

  if (isEditing && loadingDetail && !selectedPromotion) {
    return (
      <div className="space-y-6">
        <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <ShimmerBlock className="h-8 w-60" />
            <ShimmerBlock className="h-4 w-[460px] max-w-full" />
          </div>
        </section>
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={index === 2 || index > 4 ? "md:col-span-2 space-y-2" : "space-y-2"}
                >
                  <ShimmerBlock className="h-3 w-24" />
                  <ShimmerBlock
                    className={index === 2 || index > 4 ? "h-24 w-full" : "h-11 w-full"}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-5">
            <ShimmerBlock className="h-[280px] w-full rounded-[28px]" />
            <ShimmerBlock className="h-[220px] w-full rounded-[28px]" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
              {isEditing ? "Edit Promotion" : "Create Promotion"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Manage real Commerce promotion rules with scheduling, redemption limits,
              audience scope, and pricing logic that matches the backend exactly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MainButton
              text="Back to offers"
              variant="outline"
              onClick={() => navigate("/coupons")}
            />
            <MainButton
              text={isEditing ? "Save Offer" : "Create Offer"}
              isLoading={mutating}
              headIcon={<Save className="h-4 w-4" />}
              onClick={() => void handleSubmit()}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Promotion Name"
              value={form.name}
              placeholder="Summer reflection offer"
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              inputClassName="bg-white"
            />
            <InputField
              label="Code"
              value={form.code}
              placeholder="SUMMER25"
              onChange={(event) =>
                setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))
              }
              inputClassName="bg-white uppercase"
            />

            <InputField
              element="textarea"
              label="Description"
              value={form.description}
              rows={4}
              placeholder="A concise internal description of when this offer should be used."
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              className="md:col-span-2"
              inputClassName="min-h-[140px] bg-white"
            />

            <AnimatedDropdown
              label="Course Scope"
              name="promotion-course"
              value={form.courseId}
              options={[
                { label: "Global promotion", value: "" },
                ...courses.map((course) => ({
                  label: course.title,
                  value: course._id,
                })),
              ]}
              className="w-full"
              onChange={(value) =>
                setForm((current) => ({ ...current, courseId: value }))
              }
            />
            <InputField
              label="Regions"
              value={form.regions}
              placeholder="IN, US"
              onChange={(event) =>
                setForm((current) => ({ ...current, regions: event.target.value }))
              }
              inputClassName="bg-white uppercase"
              helpText="Leave blank to apply across all supported regions."
            />

            <AnimatedDropdown
              label="Discount Type"
              name="discount-type"
              value={form.discountType}
              options={[
                { label: "Percentage", value: "percentage" },
                { label: "Fixed Amount", value: "fixed_amount" },
              ]}
              className="w-full"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  discountType: value as PromotionFormState["discountType"],
                }))
              }
            />

            {form.discountType === "percentage" ? (
              <InputField
                label="Percentage Off"
                type="number"
                value={form.percentageOff}
                placeholder="25"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    percentageOff: event.target.value,
                  }))
                }
                inputClassName="bg-white"
              />
            ) : (
              <>
                <InputField
                  label="Amount Off"
                  type="number"
                  value={form.amountOff}
                  placeholder="499"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amountOff: event.target.value,
                    }))
                  }
                  inputClassName="bg-white"
                />
                <InputField
                  label="Currency"
                  value={form.currency}
                  placeholder="INR"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      currency: event.target.value.toUpperCase(),
                    }))
                  }
                  inputClassName="bg-white uppercase"
                />
              </>
            )}

            <div className="md:col-span-2 rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
              <p className="text-sm font-semibold text-[#203321]">Plan types</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  { label: "6 month", value: "six_month" },
                  { label: "Annual", value: "annual" },
                ].map((plan) => (
                  <label
                    key={plan.value}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dfe8d6] bg-white px-4 py-2 text-sm font-medium text-[#314330]"
                  >
                    <input
                      type="checkbox"
                      checked={form.planTypes.includes(plan.value as "six_month" | "annual")}
                      onChange={() =>
                        setForm((current) => {
                          const exists = current.planTypes.includes(
                            plan.value as "six_month" | "annual",
                          );
                          const nextPlanTypes = exists
                            ? current.planTypes.filter((item) => item !== plan.value)
                            : [...current.planTypes, plan.value as "six_month" | "annual"];

                          return {
                            ...current,
                            planTypes: nextPlanTypes.length
                              ? nextPlanTypes
                              : current.planTypes,
                          };
                        })
                      }
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    {plan.label}
                  </label>
                ))}
              </div>
            </div>

            <InputField
              label="Starts At"
              type="date"
              value={form.startsAt}
              onChange={(event) =>
                setForm((current) => ({ ...current, startsAt: event.target.value }))
              }
              inputClassName="bg-white"
            />
            <InputField
              label="Ends At"
              type="date"
              value={form.endsAt}
              onChange={(event) =>
                setForm((current) => ({ ...current, endsAt: event.target.value }))
              }
              inputClassName="bg-white"
            />

            <InputField
              label="Max Redemptions"
              type="number"
              value={form.maxRedemptions}
              placeholder="Optional"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  maxRedemptions: event.target.value,
                }))
              }
              inputClassName="bg-white"
            />
            <InputField
              label="Per User Limit"
              type="number"
              value={form.perUserLimit}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  perUserLimit: event.target.value,
                }))
              }
              inputClassName="bg-white"
            />

            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <label className="flex items-center gap-3 text-sm font-medium text-[#304132]">
                  <input
                    type="checkbox"
                    checked={form.autoApply}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        autoApply: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  Auto apply this offer
                </label>
              </div>
              <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <label className="flex items-center gap-3 text-sm font-medium text-[#304132]">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  Promotion is active
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <motion.div
            layout
            className="overflow-hidden rounded-[28px] border border-[#e7eadf] bg-gradient-to-br from-[#f4f8ef] via-white to-[#eef5ff] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d6e6e]">
                  Live Preview
                </p>
                <p className="mt-1 text-sm text-[#5f6f5d]">
                  Validate how the offer reads before you save it.
                </p>
              </div>
              <StatusPill variant={form.isActive ? "success" : "neutral"} dot>
                {form.isActive ? "Active" : "Inactive"}
              </StatusPill>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/70 bg-white/85 p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="rounded-2xl bg-[#eef5ea] p-3 text-[#3e6f47]">
                  <TicketPercent className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#203321]">
                    {form.name || "Promotion name"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#445342]">
                    {form.description || "A short description of this promotion will appear here."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill variant="primary">{form.code || "CODE"}</StatusPill>
                <StatusPill variant="warning">{previewDiscount}</StatusPill>
                <StatusPill variant="info">{courseTitle}</StatusPill>
                <StatusPill variant="muted">
                  {form.autoApply ? "Auto apply" : "Code based"}
                </StatusPill>
              </div>
            </div>
          </motion.div>

          <div className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[#203321]">
              <Sparkles className="h-4 w-4 text-[#0d6e6e]" />
              <p className="text-base font-bold">Promotion snapshot</p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <div className="flex items-center gap-2 text-[#65745f]">
                  <BadgePercent className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Applies To
                  </p>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#203321]">
                  {courseTitle}
                </p>
              </div>

              <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <div className="flex items-center gap-2 text-[#65745f]">
                  <CalendarClock className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Schedule
                  </p>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#203321]">
                  {form.startsAt || "Now"} → {form.endsAt || "No end date"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-[#e7eadf] bg-white p-4">
              <p className="text-sm font-semibold text-[#203321]">Rules</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.planTypes.map((plan) => (
                  <StatusPill key={plan} variant="muted">
                    {plan === "six_month" ? "6 month" : "Annual"}
                  </StatusPill>
                ))}
                {form.regions
                  .split(",")
                  .map((value) => value.trim().toUpperCase())
                  .filter(Boolean)
                  .map((region) => (
                    <StatusPill key={region} variant="info">
                      {region}
                    </StatusPill>
                  ))}
                {!form.regions.trim() ? (
                  <StatusPill variant="neutral">All regions</StatusPill>
                ) : null}
                <StatusPill variant="warning">
                  Limit {form.perUserLimit || "1"} / user
                </StatusPill>
                {form.maxRedemptions ? (
                  <StatusPill variant="danger">
                    Max {form.maxRedemptions} redemptions
                  </StatusPill>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
