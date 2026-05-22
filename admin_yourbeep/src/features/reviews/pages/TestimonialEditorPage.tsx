import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Quote, Save, ShieldCheck, Star, Undo2 } from "lucide-react";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { ImagePickerField } from "../../../components/ui/ImagePickerField";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import {
  clearSelectedTestimonial,
  createAdminTestimonial,
  fetchTestimonialDetail,
  fetchTestimonials,
  updateAdminTestimonial,
} from "../../../store/slices/testimonials";
import type { TestimonialItem } from "../../../store/slices/testimonials";
import { uploadCloudinaryImage } from "../../../services/media/cloudinaryUpload";
import { showToast } from "../../../utils/showToast";
import {
  buildTestimonialPayload,
  createEmptyTestimonialForm,
  createTestimonialFormFromItem,
} from "../types";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < rating
          ? "fill-[#d8a036] text-[#d8a036]"
          : "fill-transparent text-[#d9ded4]"
      }`}
    />
  ));
}

export default function TestimonialEditorPage() {
  const { testimonialId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditing = Boolean(testimonialId);

  const { courses, hasLoadedCourses } = useAppSelector((state) => state.courses);
  const { selectedTestimonial, loadingDetail, mutating } = useAppSelector(
    (state) => state.testimonials,
  );

  const [form, setForm] = useState(createEmptyTestimonialForm());

  useEffect(() => {
    if (!hasLoadedCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses]);

  useEffect(() => {
    if (testimonialId) {
      dispatch(fetchTestimonialDetail(testimonialId));
    } else {
      dispatch(clearSelectedTestimonial());
      setForm(createEmptyTestimonialForm());
    }

    return () => {
      dispatch(clearSelectedTestimonial());
    };
  }, [dispatch, testimonialId]);

  useEffect(() => {
    if (testimonialId && selectedTestimonial?._id === testimonialId) {
      setForm(createTestimonialFormFromItem(selectedTestimonial));
    }
  }, [selectedTestimonial, testimonialId]);

  const payload = useMemo(() => buildTestimonialPayload(form), [form]);

  const courseTitle = useMemo(() => {
    if (!form.courseId) return "General platform testimonial";
    return courses.find((course) => course._id === form.courseId)?.title || form.courseId;
  }, [courses, form.courseId]);

  const uploadAvatar = async (file: File) => {
    const uploaded = await uploadCloudinaryImage(file, {
      folder: "yourbeep/testimonials",
      tags: ["admin", "testimonial"],
    });

    return uploaded.secureUrl;
  };

  const handleSubmit = async () => {
    const loadingId = showToast({
      type: "loading",
      message: isEditing ? "Updating testimonial..." : "Creating testimonial...",
      options: {
        description: "Please wait while the moderation record is saved.",
      },
    });

    try {
      const action = isEditing && testimonialId
        ? updateAdminTestimonial({ testimonialId, payload })
        : createAdminTestimonial(payload);

      await dispatch(action).unwrap();
      await dispatch(fetchTestimonials({ page: 1, limit: 10 })).unwrap();

      showToast({
        type: "success",
        message: isEditing ? "Testimonial updated." : "Testimonial created.",
        options: {
          id: loadingId,
          description: "The testimonial library has been refreshed.",
        },
      });

      navigate("/reviews");
    } catch (error) {
      showToast({
        type: "error",
        message: isEditing
          ? "Unable to update testimonial."
          : "Unable to create testimonial.",
        options: {
          id: loadingId,
          description:
            typeof error === "string" ? error : "Please review the form and try again.",
          duration: 5000,
        },
      });
    }
  };

  if (isEditing && loadingDetail && !selectedTestimonial) {
    return (
      <div className="space-y-6">
        <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <ShimmerBlock className="h-8 w-56" />
              <ShimmerBlock className="h-4 w-[420px] max-w-full" />
            </div>
            <div className="flex gap-3">
              <ShimmerBlock className="h-11 w-32" />
              <ShimmerBlock className="h-11 w-40" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className={index === 2 || index > 5 ? "md:col-span-2 space-y-2" : "space-y-2"}
                >
                  <ShimmerBlock className="h-3 w-24" />
                  <ShimmerBlock
                    className={
                      index === 2 || index > 5 ? "h-36 w-full" : "h-11 w-full"
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="overflow-hidden rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
              <div className="space-y-3">
                <ShimmerBlock className="h-3 w-24" />
                <ShimmerBlock className="h-4 w-44" />
              </div>
              <div className="mt-5 rounded-[24px] border border-[#e7eadf] bg-[#fbfcf8] p-5">
                <div className="flex items-start gap-4">
                  <ShimmerBlock className="h-16 w-16 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <ShimmerBlock className="h-5 w-32" />
                    <ShimmerBlock className="h-4 w-24" />
                    <div className="flex gap-2">
                      <ShimmerBlock className="h-7 w-24" />
                      <ShimmerBlock className="h-7 w-20" />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <ShimmerBlock key={index} className="h-4 w-4 rounded-md" />
                  ))}
                </div>
                <div className="mt-5 space-y-2">
                  <ShimmerBlock className="h-4 w-28" />
                  <ShimmerBlock className="h-4 w-full" />
                  <ShimmerBlock className="h-4 w-[88%]" />
                  <ShimmerBlock className="h-4 w-[74%]" />
                </div>
              </div>
            </div>
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
              {isEditing ? "Edit Testimonial" : "Create Testimonial"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Build a polished testimonial with avatar, quote, moderation status, and featured order before it goes live.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MainButton
              text="Back to Library"
              variant="outline"
              onClick={() => navigate("/reviews")}
            />
            <MainButton
              text={isEditing ? "Save Changes" : "Create Testimonial"}
              isLoading={mutating}
              headIcon={<Save className="h-4 w-4" />}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Display Name"
              name="displayName"
              value={form.displayName}
              placeholder="Aarav Singh"
              onChange={(event) =>
                setForm((current) => ({ ...current, displayName: event.target.value }))
              }
            />
            <InputField
              label="Role Label"
              name="roleLabel"
              value={form.roleLabel}
              placeholder="Reflective learner"
              onChange={(event) =>
                setForm((current) => ({ ...current, roleLabel: event.target.value }))
              }
            />
            <InputField
              label="Headline"
              name="headline"
              value={form.headline}
              placeholder="A calmer way to understand myself"
              onChange={(event) =>
                setForm((current) => ({ ...current, headline: event.target.value }))
              }
              className="md:col-span-2"
            />
            <div className="md:col-span-2">
              <ImagePickerField
                label="Avatar"
                value={form.avatar}
                onChange={(value) =>
                  setForm((current) => ({ ...current, avatar: value }))
                }
                onUpload={uploadAvatar}
                previewAlt="Testimonial avatar"
                aspectHint="Square crops work best for the testimonial avatar."
                helpText="Upload a portrait to Cloudinary or paste an image URL."
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                element="textarea"
                label="Quote"
                name="quote"
                value={form.quote}
                rows={6}
                placeholder="This program helped me pause, reflect, and understand patterns I had been carrying for years."
                onChange={(event) =>
                  setForm((current) => ({ ...current, quote: event.target.value }))
                }
              />
            </div>
            <InputField
              label="Rating"
              name="rating"
              type="number"
              value={String(form.rating)}
              placeholder="5"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  rating: Number(event.target.value || 0),
                }))
              }
            />
            <InputField
              label="Featured Order"
              name="featuredOrder"
              value={form.featuredOrder}
              placeholder="Optional number"
              onChange={(event) =>
                setForm((current) => ({ ...current, featuredOrder: event.target.value }))
              }
            />
            <AnimatedDropdown
              label="Status"
              name="status"
              value={form.status}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
                { label: "Hidden", value: "hidden" },
              ]}
              className="w-full"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  status: value as TestimonialItem["status"],
                }))
              }
            />
            <AnimatedDropdown
              label="Source"
              name="source"
              value={form.source}
              options={[
                { label: "Admin Added", value: "admin" },
                { label: "User Submitted", value: "user" },
              ]}
              className="w-full"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  source: value as TestimonialItem["source"],
                }))
              }
            />
            <AnimatedDropdown
              label="Course"
              name="courseId"
              value={form.courseId}
              options={[
                { label: "General platform testimonial", value: "" },
                ...courses.map((course) => ({
                  label: course.title,
                  value: course._id,
                })),
              ]}
              className="w-full md:col-span-2"
              onChange={(value) =>
                setForm((current) => ({ ...current, courseId: value }))
              }
            />
            <div className="md:col-span-2 rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
              <label className="flex items-center gap-3 text-sm font-medium text-[#304132]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      featured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Feature this testimonial publicly
              </label>
            </div>
            <div className="md:col-span-2">
              <InputField
                element="textarea"
                label="Admin Notes"
                name="adminNotes"
                value={form.adminNotes}
                rows={4}
                placeholder="Optional internal moderation notes"
                onChange={(event) =>
                  setForm((current) => ({ ...current, adminNotes: event.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                element="textarea"
                label="Rejection Reason"
                name="rejectionReason"
                value={form.rejectionReason}
                rows={4}
                placeholder="Optional rejection rationale if the testimonial is not approved"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    rejectionReason: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <motion.div
            layout
            className="overflow-hidden rounded-[28px] border border-[#e7eadf] bg-gradient-to-br from-[#f4f8ef] via-white to-[#e8f0df] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d6e6e]">
                  Live Preview
                </p>
                <p className="mt-1 text-sm text-[#5f6f5d]">
                  See how the testimonial will read before you save it.
                </p>
              </div>
              <StatusPill
                variant={
                  form.status === "approved"
                    ? "success"
                    : form.status === "rejected"
                      ? "danger"
                      : form.status === "hidden"
                        ? "muted"
                        : "warning"
                }
                dot
              >
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
              </StatusPill>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/70 bg-white/85 p-5 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#dfe8d6] bg-[#fbfcf8]">
                  <AnimatePresence mode="wait">
                    {form.avatar ? (
                      <motion.img
                        key={form.avatar}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        src={form.avatar}
                        alt={form.displayName || "Preview avatar"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <motion.div
                        key="empty-avatar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full w-full items-center justify-center"
                      >
                        <ImageIcon className="h-5 w-5 text-[#7b8b76]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-semibold text-[#203321]">
                    {form.displayName || "Display name"}
                  </p>
                  <p className="mt-1 text-sm text-[#74816f]">
                    {form.roleLabel || "Role label"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusPill variant="info">{courseTitle}</StatusPill>
                    {form.featured ? (
                      <StatusPill variant="primary">Featured</StatusPill>
                    ) : null}
                    <StatusPill variant="muted">
                      {form.source === "admin" ? "Admin Added" : "User Submitted"}
                    </StatusPill>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-1">{renderStars(form.rating)}</div>

              <div className="mt-5 rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
                  <Quote className="h-4 w-4 text-[#0d6e6e]" />
                  Quote preview
                </div>
                <p className="mt-3 text-sm leading-7 text-[#445342]">
                  {form.quote ||
                    "The testimonial quote will appear here as you type it."}
                </p>
              </div>

              {form.headline ? (
                <div className="mt-4 rounded-[22px] border border-[#e7eadf] bg-white p-4">
                  <p className="text-sm font-semibold text-[#203321]">
                    Headline
                  </p>
                  <p className="mt-2 text-sm text-[#445342]">{form.headline}</p>
                </div>
              ) : null}

              {(form.adminNotes || form.rejectionReason) ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {form.adminNotes ? (
                    <div className="rounded-[22px] border border-[#e7eadf] bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
                        <ShieldCheck className="h-4 w-4 text-[#0d6e6e]" />
                        Admin Notes
                      </div>
                      <p className="mt-2 text-sm text-[#445342]">
                        {form.adminNotes}
                      </p>
                    </div>
                  ) : null}
                  {form.rejectionReason ? (
                    <div className="rounded-[22px] border border-[#e7eadf] bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
                        <Undo2 className="h-4 w-4 text-[#0d6e6e]" />
                        Rejection Reason
                      </div>
                      <p className="mt-2 text-sm text-[#445342]">
                        {form.rejectionReason}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
