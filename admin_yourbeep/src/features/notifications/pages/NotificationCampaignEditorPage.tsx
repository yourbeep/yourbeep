import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  ImageIcon,
  Save,
  Send,
  Sparkles,
  Target,
  Undo2,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedDropdown } from "../../../components/ui/AnimatedDropdown";
import { ImagePickerField } from "../../../components/ui/ImagePickerField";
import { InputField } from "../../../components/ui/InputField";
import { MainButton } from "../../../components/ui/MainButton";
import { ShimmerBlock } from "../../../components/ui/ShimmerBlock";
import { StatusPill } from "../../../components/ui/StatusPill";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import {
  clearAudiencePreview,
  clearSelectedCampaign,
  createNotificationCampaign,
  fetchNotificationCampaignDetail,
  fetchNotificationCampaigns,
  previewNotificationAudience,
  updateNotificationCampaign,
  type NotificationAudienceType,
  type NotificationCampaign,
  type NotificationCampaignType,
} from "../../../store/slices/notifications";
import { uploadCloudinaryImage } from "../../../services/media/cloudinaryUpload";
import { showToast } from "../../../utils/showToast";
import {
  audienceLabel,
  notificationAudienceOptions,
  notificationTypeOptions,
} from "../services/notificationFormatters";

type NotificationCampaignFormState = {
  title: string;
  body: string;
  imageUrl: string;
  type: NotificationCampaignType;
  audienceType: NotificationAudienceType;
  courseId: string;
  userIdsText: string;
  regionsText: string;
  dataText: string;
  sendNow: boolean;
};

function createEmptyForm(): NotificationCampaignFormState {
  return {
    title: "",
    body: "",
    imageUrl: "",
    type: "admin_broadcast",
    audienceType: "all_users",
    courseId: "",
    userIdsText: "",
    regionsText: "",
    dataText: "",
    sendNow: false,
  };
}

function createFormFromCampaign(
  campaign: NotificationCampaign,
): NotificationCampaignFormState {
  return {
    title: campaign.title || "",
    body: campaign.body || "",
    imageUrl: campaign.imageUrl || "",
    type: campaign.type || "admin_broadcast",
    audienceType: campaign.audience.type || "all_users",
    courseId: campaign.audience.courseId || "",
    userIdsText: campaign.audience.userIds.join(", "),
    regionsText: campaign.audience.regions.join(", "),
    dataText:
      campaign.data && Object.keys(campaign.data).length
        ? JSON.stringify(campaign.data, null, 2)
        : "",
    sendNow: false,
  };
}

export default function NotificationCampaignEditorPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { campaignId } = useParams();
  const isEditing = Boolean(campaignId);

  const { courses, hasLoadedCourses } = useAppSelector((state) => state.courses);
  const {
    selectedCampaign,
    audiencePreview,
    loadingDetail,
    previewLoading,
    mutating,
  } = useAppSelector((state) => state.notifications);

  const [form, setForm] = useState<NotificationCampaignFormState>(createEmptyForm);

  useEffect(() => {
    if (!hasLoadedCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses]);

  useEffect(() => {
    dispatch(clearAudiencePreview());

    if (campaignId) {
      dispatch(fetchNotificationCampaignDetail(campaignId));
    } else {
      dispatch(clearSelectedCampaign());
      setForm(createEmptyForm());
    }

    return () => {
      dispatch(clearSelectedCampaign());
      dispatch(clearAudiencePreview());
    };
  }, [campaignId, dispatch]);

  useEffect(() => {
    if (campaignId && selectedCampaign?._id === campaignId) {
      setForm(createFormFromCampaign(selectedCampaign));
    }
  }, [campaignId, selectedCampaign]);

  const parsedData = useMemo(() => {
    if (!form.dataText.trim()) return {};

    try {
      const parsed = JSON.parse(form.dataText);
      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return null;
    }
  }, [form.dataText]);

  const payload = useMemo(() => {
    const dataEntries =
      parsedData && typeof parsedData === "object"
        ? Object.entries(parsedData).reduce<Record<string, string>>(
            (accumulator, [key, value]) => ({
              ...accumulator,
              [key]: String(value),
            }),
            {},
          )
        : {};

    return {
      title: form.title.trim(),
      body: form.body.trim(),
      ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
      type: form.type,
      audience: {
        type: form.audienceType,
        ...(form.courseId.trim() ? { courseId: form.courseId.trim() } : {}),
        userIds: form.userIdsText
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        regions: form.regionsText
          .split(",")
          .map((value) => value.trim().toUpperCase())
          .filter(Boolean),
      },
      ...(Object.keys(dataEntries).length ? { data: dataEntries } : {}),
      ...(isEditing ? {} : { sendNow: form.sendNow }),
    };
  }, [form, isEditing, parsedData]);

  const courseTitle = useMemo(() => {
    if (!form.courseId) return "General audience";
    return courses.find((course) => course._id === form.courseId)?.title || form.courseId;
  }, [courses, form.courseId]);

  const dataIsValid = parsedData !== null;

  const uploadCampaignImage = async (file: File) => {
    const uploaded = await uploadCloudinaryImage(file, {
      folder: "yourbeep/notifications",
      tags: ["admin", "campaign"],
    });

    return uploaded.secureUrl;
  };

  const handlePreview = async () => {
    const loadingId = showToast({
      type: "loading",
      message: "Previewing audience...",
      options: {
        description: "Calculating the recipients for this campaign.",
      },
    });

    try {
      await dispatch(
        previewNotificationAudience({
          audience: {
            type: payload.audience.type,
            ...(payload.audience.courseId
              ? { courseId: payload.audience.courseId }
              : {}),
            userIds: payload.audience.userIds,
            regions: payload.audience.regions,
          },
        }),
      ).unwrap();

      showToast({
        type: "success",
        message: "Audience preview ready.",
        options: {
          id: loadingId,
          description: "The sample users and delivery totals have been refreshed.",
        },
      });
    } catch (previewError) {
      showToast({
        type: "error",
        message: "Unable to preview audience.",
        options: {
          id: loadingId,
          description:
            typeof previewError === "string"
              ? previewError
              : "Please review the audience fields and try again.",
        },
      });
    }
  };

  const handleSubmit = async () => {
    const loadingId = showToast({
      type: "loading",
      message: isEditing ? "Saving campaign..." : "Creating campaign...",
      options: {
        description: "Please wait while the campaign is saved.",
      },
    });

    try {
      if (isEditing && campaignId) {
        await dispatch(
          updateNotificationCampaign({
            campaignId,
            payload,
          }),
        ).unwrap();
      } else {
        await dispatch(createNotificationCampaign(payload)).unwrap();
      }

      await dispatch(fetchNotificationCampaigns({ page: 1, limit: 10 })).unwrap();

      showToast({
        type: "success",
        message: isEditing ? "Campaign updated." : "Campaign created.",
        options: {
          id: loadingId,
          description: isEditing
            ? "The draft campaign changes were saved successfully."
            : form.sendNow
              ? "The campaign was created and queued to send."
              : "The campaign draft was saved successfully.",
        },
      });

      navigate("/notifications");
    } catch (submitError) {
      showToast({
        type: "error",
        message: isEditing
          ? "Unable to update campaign."
          : "Unable to create campaign.",
        options: {
          id: loadingId,
          description:
            typeof submitError === "string"
              ? submitError
              : "Please review the form and try again.",
          duration: 5000,
        },
      });
    }
  };

  if (isEditing && loadingDetail && !selectedCampaign) {
    return (
      <div className="space-y-6">
        <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <ShimmerBlock className="h-8 w-60" />
              <ShimmerBlock className="h-4 w-[460px] max-w-full" />
            </div>
            <div className="flex gap-3">
              <ShimmerBlock className="h-11 w-28" />
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
                  className={
                    index === 1 || index === 2 || index > 5
                      ? "md:col-span-2 space-y-2"
                      : "space-y-2"
                  }
                >
                  <ShimmerBlock className="h-3 w-24" />
                  <ShimmerBlock
                    className={
                      index === 1 || index === 2 || index > 5
                        ? "h-32 w-full"
                        : "h-11 w-full"
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <ShimmerBlock className="h-[300px] w-full rounded-[28px]" />
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
              {isEditing ? "Edit Campaign" : "Create Campaign"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Compose a polished notification campaign with artwork, targeted audience
              rules, preview counts, and payload data before it reaches users.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MainButton
              text="Back to campaigns"
              variant="outline"
              onClick={() => navigate("/notifications")}
            />
            <MainButton
              text={isEditing ? "Save Campaign" : "Create Campaign"}
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
              label="Campaign Title"
              value={form.title}
              placeholder="Renewal reminder for premium users"
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="md:col-span-2"
              inputClassName="bg-white"
            />

            <InputField
              element="textarea"
              label="Message Body"
              value={form.body}
              rows={5}
              placeholder="Your annual access ends soon. Renew now to keep your course progress and premium tools active."
              onChange={(event) =>
                setForm((current) => ({ ...current, body: event.target.value }))
              }
              className="md:col-span-2"
              inputClassName="min-h-[180px] bg-white"
            />

            <div className="md:col-span-2">
              <ImagePickerField
                label="Campaign Image"
                value={form.imageUrl}
                onChange={(value) =>
                  setForm((current) => ({ ...current, imageUrl: value }))
                }
                onUpload={uploadCampaignImage}
                previewAlt="Campaign artwork"
                aspectHint="Use a wide hero crop for push previews and campaign banners."
                helpText="Upload to Cloudinary or paste a direct image URL."
              />
            </div>

            <AnimatedDropdown
              label="Campaign Type"
              name="campaign-type"
              value={form.type}
              options={notificationTypeOptions}
              className="w-full"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  type: value as NotificationCampaignType,
                }))
              }
            />

            <AnimatedDropdown
              label="Audience Type"
              name="audience-type"
              value={form.audienceType}
              options={notificationAudienceOptions}
              className="w-full"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  audienceType: value as NotificationAudienceType,
                  ...(value !== "course_purchasers" ? { courseId: "" } : {}),
                }))
              }
            />

            {form.audienceType === "course_purchasers" ? (
              <AnimatedDropdown
                label="Course"
                name="course-id"
                value={form.courseId}
                options={[
                  { label: "Select course", value: "" },
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
            ) : null}

            {form.audienceType === "specific_users" ? (
              <InputField
                element="textarea"
                label="User IDs"
                value={form.userIdsText}
                rows={4}
                placeholder="userId_1, userId_2"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    userIdsText: event.target.value,
                  }))
                }
                className="md:col-span-2"
                helpText="Enter comma-separated user ids for a direct send."
                inputClassName="bg-white"
              />
            ) : null}

            {form.audienceType === "region_users" ? (
              <InputField
                label="Regions"
                value={form.regionsText}
                placeholder="IN, US, AE"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    regionsText: event.target.value,
                  }))
                }
                className="md:col-span-2"
                helpText="Use comma-separated ISO region codes."
                inputClassName="bg-white"
              />
            ) : null}

            <InputField
              element="textarea"
              label="Data Payload (JSON)"
              value={form.dataText}
              rows={6}
              placeholder='{"screen":"orders","cta":"renew"}'
              onChange={(event) =>
                setForm((current) => ({ ...current, dataText: event.target.value }))
              }
              className="md:col-span-2"
              helpText="Optional key-value data payload sent with the notification."
              inputClassName={`min-h-[180px] bg-white ${
                dataIsValid ? "" : "border-[#e8b0a6] bg-[#fff7f6]"
              }`}
            />

            {!isEditing ? (
              <div className="md:col-span-2 rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <label className="flex items-center gap-3 text-sm font-medium text-[#304132]">
                  <input
                    type="checkbox"
                    checked={form.sendNow}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        sendNow: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  Send immediately after creating this campaign
                </label>
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-5">
          <motion.div
            layout
            className="overflow-hidden rounded-[28px] border border-[#e7eadf] bg-gradient-to-br from-[#f4f8ef] via-white to-[#e7f2ff] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d6e6e]">
                  Live Preview
                </p>
                <p className="mt-1 text-sm text-[#5f6f5d]">
                  Check the campaign presentation before saving or sending.
                </p>
              </div>
              <StatusPill variant={isEditing ? "info" : "primary"} dot>
                {isEditing ? "Editing draft" : form.sendNow ? "Create and send" : "Draft mode"}
              </StatusPill>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/70 bg-white/85 p-5 backdrop-blur">
              <AnimatePresence mode="wait">
                {form.imageUrl ? (
                  <motion.div
                    key={form.imageUrl}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="overflow-hidden rounded-[22px] border border-[#dfe8d6]"
                  >
                    <img
                      src={form.imageUrl}
                      alt={form.title || "Campaign preview"}
                      className="h-48 w-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-48 items-center justify-center rounded-[22px] border border-dashed border-[#dfe8d6] bg-[#fbfcf8]"
                  >
                    <div className="text-center text-[#7b8b76]">
                      <ImageIcon className="mx-auto h-6 w-6" />
                      <p className="mt-2 text-sm">No campaign image yet</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 flex items-start gap-3">
                <span className="rounded-2xl bg-[#eef5ea] p-3 text-[#3e6f47]">
                  <BellRing className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#203321]">
                    {form.title || "Campaign title"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#445342]">
                    {form.body ||
                      "Your notification body preview will appear here as you type."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill variant="info">{audienceLabel(form.type)}</StatusPill>
                <StatusPill variant="primary">{audienceLabel(form.audienceType)}</StatusPill>
                <StatusPill variant="muted">{courseTitle}</StatusPill>
              </div>

              {!dataIsValid ? (
                <div className="mt-4 rounded-[20px] border border-[#f0d5cf] bg-[#fff7f6] px-4 py-3 text-sm text-[#b35d4c]">
                  Fix the JSON payload before previewing or saving this campaign.
                </div>
              ) : null}
            </div>
          </motion.div>

          <div className="rounded-[28px] border border-[#e7eadf] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-bold text-[#203321]">Audience preview</p>
                <p className="mt-1 text-sm text-[#72806e]">
                  See how many users and tokens this campaign will target.
                </p>
              </div>
              <MainButton
                text="Preview Audience"
                variant="soft"
                isLoading={previewLoading}
                headIcon={<Target className="h-4 w-4" />}
                disabled={!dataIsValid}
                onClick={() => void handlePreview()}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <div className="flex items-center gap-2 text-[#65745f]">
                  <Users className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Targeted Users
                  </p>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-[#203321]">
                  {Number(audiencePreview?.targetedUsers || 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
                <div className="flex items-center gap-2 text-[#65745f]">
                  <Send className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#83907e]">
                    Targeted Tokens
                  </p>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-[#203321]">
                  {Number(audiencePreview?.targetedTokens || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-[#e7eadf] bg-[#fbfcf8] p-4">
              <div className="flex items-center gap-2 text-[#203321]">
                <Sparkles className="h-4 w-4 text-[#0d6e6e]" />
                <p className="text-sm font-semibold">Sample recipients</p>
              </div>

              <div className="mt-3 space-y-3">
                {audiencePreview?.sampleUsers?.length ? (
                  audiencePreview.sampleUsers.map((user) => (
                    <div
                      key={user._id}
                      className="rounded-[18px] border border-[#e7eadf] bg-white px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#203321]">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-[#72806e]">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          {user.region ? (
                            <StatusPill variant="muted">{user.region}</StatusPill>
                          ) : null}
                          <StatusPill variant="info">
                            {user.tokenCount} tokens
                          </StatusPill>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#72806e]">
                    Preview the audience to see sample recipients here.
                  </p>
                )}
              </div>
            </div>

            {parsedData && Object.keys(parsedData).length ? (
              <div className="mt-4 rounded-[22px] border border-[#e7eadf] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#203321]">
                  <Undo2 className="h-4 w-4 text-[#0d6e6e]" />
                  Parsed payload
                </div>
                <pre className="mt-3 overflow-x-auto rounded-[18px] bg-[#f7f8f3] p-4 text-xs text-[#304132]">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
