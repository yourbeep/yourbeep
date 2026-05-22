import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createCourseContentItem,
  createCourseDraft,
  createCourseTrailerUploadUrl,
  createCourseVideoUploadUrl,
  deleteCoursePricing,
  deleteAdminVideo,
  createVideoCue,
  deleteCourseContentItem,
  deleteVideoCue,
  getAdminCourseVideoStream,
  getCourseDetail,
  getCourseTrailerStream,
  listCourseContent,
  listCoursePricing,
  listVideoCues,
  reorderCourseContentItems,
  updateCourseDraft,
  updateAdminVideo,
  upsertCoursePricing,
  uploadVideoToBunny,
} from "../services/courseAdminApi";
import { showToast } from "../../../utils/showToast";

export type CourseGameWeight = {
  gameId: string;
  weight: number;
};

export type CourseInstructorForm = {
  name: string;
  title: string;
  bio: string;
  avatar: string;
};

export type CourseFaqFormItem = {
  question: string;
  answer: string;
};

export type CourseFeaturedTestimonialForm = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type CourseSectionForm = {
  key: string;
  title: string;
  description: string;
  order: number;
};

export type CourseFormState = {
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  bannerImage: string;
  overview: string;
  trailerVideoId: string;
  instructor: CourseInstructorForm;
  games: CourseGameWeight[];
  sections: CourseSectionForm[];
  durationMinutes: string;
  estimatedDurationText: string;
  difficultyLevel: string;
  language: string;
  certificateIncluded: boolean;
  communityAccess: boolean;
  whatYouWillLearn: string[];
  courseHighlights: string[];
  whoItsFor: string[];
  whoItsNotFor: string[];
  faq: CourseFaqFormItem[];
  featuredTestimonial: CourseFeaturedTestimonialForm;
  isPublished: boolean;
};

const defaultCourseForm: CourseFormState = {
  title: "",
  subtitle: "",
  description: "",
  shortDescription: "",
  thumbnail: "",
  bannerImage: "",
  overview: "",
  trailerVideoId: "",
  instructor: {
    name: "",
    title: "",
    bio: "",
    avatar: "",
  },
  games: [],
  sections: [],
  durationMinutes: "",
  estimatedDurationText: "",
  difficultyLevel: "beginner",
  language: "English",
  certificateIncluded: false,
  communityAccess: false,
  whatYouWillLearn: [],
  courseHighlights: [],
  whoItsFor: [],
  whoItsNotFor: [],
  faq: [],
  featuredTestimonial: {
    quote: "",
    name: "",
    role: "",
    avatar: "",
  },
  isPublished: false,
};

const defaultPricingForm = {
  region: "IN",
  currency: "INR",
  amount6mo: "",
  amount1yr: "",
  stripeProductId6mo: "",
  stripeProductId1yr: "",
  stripePriceId6mo: "",
  stripePriceId1yr: "",
};

export type PricingFormState = typeof defaultPricingForm;

const defaultVideoForm = {
  title: "",
  description: "",
  sectionKey: "",
  order: 1,
  file: null,
  thumbnailUrl: "",
};

const defaultContentForm = {
  refId: "",
  sectionKey: "",
  order: 1,
  title: "",
  description: "",
  durationMinutes: "",
  isFree: false,
};

const slugifySectionKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);


const defaultCueForm = {
  gameId: "",
  subActivityKey: "",
  triggerAtSeconds: "",
  title: "",
  description: "",
  ctaLabel: "Start Activity",
  pauseVideo: true,
  isSkippable: false,
};

const toCourseForm = (course) => ({
  title: course?.title ?? "",
  subtitle: course?.subtitle ?? "",
  description: course?.description ?? "",
  shortDescription: course?.shortDescription ?? "",
  thumbnail: course?.thumbnail ?? "",
  bannerImage: course?.bannerImage ?? "",
  overview: course?.overview ?? "",
  trailerVideoId: course?.trailerVideoId ?? "",
  instructor: {
    name: course?.instructor?.name ?? "",
    title: course?.instructor?.title ?? "",
    bio: course?.instructor?.bio ?? "",
    avatar: course?.instructor?.avatar ?? "",
  },
  games:
    course?.games?.map((item) => ({
      gameId: String(item.gameId?._id || item.gameId),
      weight: Number(item.weight || 0),
    })) ?? [],
  sections:
    course?.sections?.map((item, index) => ({
      key: item.key ?? `section_${index + 1}`,
      title: item.title ?? "",
      description: item.description ?? "",
      order: Number(item.order ?? index + 1),
    })) ?? [],
  durationMinutes: course?.durationMinutes ? String(course.durationMinutes) : "",
  estimatedDurationText: course?.estimatedDurationText ?? "",
  difficultyLevel: course?.difficultyLevel ?? "beginner",
  language: course?.language ?? "English",
  certificateIncluded: Boolean(course?.certificateIncluded),
  communityAccess: Boolean(course?.communityAccess),
  whatYouWillLearn: course?.whatYouWillLearn ?? [],
  courseHighlights: course?.courseHighlights ?? [],
  whoItsFor: course?.whoItsFor ?? [],
  whoItsNotFor: course?.whoItsNotFor ?? [],
  faq:
    course?.faq?.map((item) => ({
      question: item.question ?? "",
      answer: item.answer ?? "",
    })) ?? [],
  featuredTestimonial: {
    quote: course?.featuredTestimonial?.quote ?? "",
    name: course?.featuredTestimonial?.name ?? "",
    role: course?.featuredTestimonial?.role ?? "",
    avatar: course?.featuredTestimonial?.avatar ?? "",
  },
  isPublished: Boolean(course?.isPublished),
});

const toPricingForm = (pricing) => ({
  region: pricing?.region ?? "IN",
  currency: pricing?.currency ?? "INR",
  amount6mo: pricing?.amount6mo ? String(pricing.amount6mo) : "",
  amount1yr: pricing?.amount1yr ? String(pricing.amount1yr) : "",
  stripeProductId6mo: pricing?.stripeProductId6mo ?? "",
  stripeProductId1yr: pricing?.stripeProductId1yr ?? "",
  stripePriceId6mo: pricing?.stripePriceId6mo ?? "",
  stripePriceId1yr: pricing?.stripePriceId1yr ?? "",
});

export const courseSteps = [
  { id: "basics", title: "Course Basics", subtitle: "Create the draft and assign games" },
  { id: "pricing", title: "Pricing", subtitle: "Set region pricing and Stripe IDs" },
  { id: "sections", title: "Sections", subtitle: "Create the course sections and their order" },
  { id: "videos", title: "Videos", subtitle: "Create Bunny upload URLs and upload lesson files" },
  { id: "content", title: "Content Flow", subtitle: "Arrange visible course lessons and game activities" },
  { id: "cues", title: "Interactive Cues", subtitle: "Trigger games from video timestamps" },
  { id: "publish", title: "Publish", subtitle: "Review readiness and publish the course" },
];

export const useCourseBuilder = ({ courseId, games, onCourseSaved }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [activeCourseId, setActiveCourseId] = useState(courseId || null);
  const [courseForm, setCourseForm] = useState(defaultCourseForm);
  const [pricingForm, setPricingForm] = useState(defaultPricingForm);
  const [videoForm, setVideoForm] = useState(defaultVideoForm);
  const [contentForm, setContentForm] = useState(defaultContentForm);
  const [cueForm, setCueForm] = useState(defaultCueForm);
  const [courseDetail, setCourseDetail] = useState(null);
  const [pricingItems, setPricingItems] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [editingVideoId, setEditingVideoId] = useState<string>("");
  const [videoCues, setVideoCues] = useState([]);
  const [cuePreviewLoading, setCuePreviewLoading] = useState(false);
  const [cuePreviewStreamUrl, setCuePreviewStreamUrl] = useState<string | null>(null);
  const [cuePreviewThumbnailUrl, setCuePreviewThumbnailUrl] = useState<string | null>(null);
  const [cuePreviewStatus, setCuePreviewStatus] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [trailerUploadStatus, setTrailerUploadStatus] = useState<string | null>(null);
  const [trailerUploading, setTrailerUploading] = useState(false);
  const [trailerStreamUrl, setTrailerStreamUrl] = useState<string | null>(null);
  const [trailerThumbnailUrl, setTrailerThumbnailUrl] = useState<string | null>(null);
  const [deletingPricingRegion, setDeletingPricingRegion] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedGamesTotal = useMemo(
    () =>
      courseForm.games.reduce((sum, item) => {
        const nextWeight = Number(item.weight || 0);
        return sum + (Number.isFinite(nextWeight) ? nextWeight : 0);
      }, 0),
    [courseForm.games],
  );

  const videoItems = useMemo(
    () => contentItems.filter((item) => item.type === "video"),
    [contentItems],
  );

  const gameItems = useMemo(
    () => games.filter((game) => courseForm.games.some((item) => item.gameId === game._id)),
    [courseForm.games, games],
  );

  const resetFlash = () => {
    setError("");
    setSuccess("");
  };

  const getNextOrderForSection = useCallback(
    (sectionKey: string) =>
      contentItems.filter((item) => item.sectionKey === sectionKey).length + 1,
    [contentItems],
  );

  const resetVideoDraft = useCallback(
    (items = videoItems) => {
      const defaultSectionKey = courseForm.sections[0]?.key ?? "";
      setEditingVideoId("");
      setVideoForm({
        ...defaultVideoForm,
        sectionKey: defaultSectionKey,
        order: defaultSectionKey ? getNextOrderForSection(defaultSectionKey) : items.length + 1,
      });
    },
    [courseForm.sections, getNextOrderForSection, videoItems],
  );

  const buildCoursePayload = useCallback(() => {
    return {
      title: courseForm.title.trim(),
      subtitle: courseForm.subtitle.trim() || undefined,
      description: courseForm.description.trim(),
      shortDescription: courseForm.shortDescription.trim() || undefined,
      thumbnail: courseForm.thumbnail.trim() || undefined,
      bannerImage: courseForm.bannerImage.trim() || undefined,
      overview: courseForm.overview.trim() || undefined,
      trailerVideoId: courseForm.trailerVideoId.trim() || undefined,
      instructor: courseForm.instructor.name.trim()
        ? {
            name: courseForm.instructor.name.trim(),
            title: courseForm.instructor.title.trim() || undefined,
            bio: courseForm.instructor.bio.trim() || undefined,
            avatar: courseForm.instructor.avatar.trim() || undefined,
          }
        : undefined,
      games: courseForm.games.map((item) => ({
        gameId: item.gameId,
        weight: Number(item.weight || 0),
      })),
      sections: courseForm.sections
        .map((section, index) => ({
          key: section.key.trim() || slugifySectionKey(section.title),
          title: section.title.trim(),
          description: section.description.trim() || undefined,
          order: index + 1,
        }))
        .filter((section) => section.key && section.title),
      durationMinutes: courseForm.durationMinutes
        ? Number(courseForm.durationMinutes)
        : undefined,
      estimatedDurationText: courseForm.estimatedDurationText.trim() || undefined,
      difficultyLevel: courseForm.difficultyLevel || undefined,
      language: courseForm.language.trim() || undefined,
      certificateIncluded: courseForm.certificateIncluded,
      communityAccess: courseForm.communityAccess,
      whatYouWillLearn: courseForm.whatYouWillLearn
        .map((item) => item.trim())
        .filter(Boolean),
      courseHighlights: courseForm.courseHighlights
        .map((item) => item.trim())
        .filter(Boolean),
      whoItsFor: courseForm.whoItsFor.map((item) => item.trim()).filter(Boolean),
      whoItsNotFor: courseForm.whoItsNotFor
        .map((item) => item.trim())
        .filter(Boolean),
      faq: courseForm.faq
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }))
        .filter((item) => item.question && item.answer),
      featuredTestimonial: courseForm.featuredTestimonial.quote.trim()
        ? {
            quote: courseForm.featuredTestimonial.quote.trim(),
            name: courseForm.featuredTestimonial.name.trim(),
            role: courseForm.featuredTestimonial.role.trim() || undefined,
            avatar: courseForm.featuredTestimonial.avatar.trim() || undefined,
          }
        : undefined,
      isPublished: false,
    };
  }, [courseForm]);

  const getBasicsValidationError = useCallback(() => {
    if (!courseForm.title.trim()) {
      return "Add a course title before continuing.";
    }

    if (!courseForm.description.trim()) {
      return "Add a full course description before continuing.";
    }

    if (!courseForm.games.length) {
      return "Select at least one game before saving the course draft.";
    }

    if (selectedGamesTotal !== 100) {
      return "Game weights must total exactly 100% before saving.";
    }

    if (courseForm.games.some((item) => Number(item.weight || 0) < 1)) {
      return "Each selected game must have a weight of at least 1%.";
    }

    return "";
  }, [courseForm.description, courseForm.games, courseForm.title, selectedGamesTotal]);

  const hydrateCourse = useCallback(async (targetCourseId) => {
    if (!targetCourseId) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [detail, pricing, content] = await Promise.all([
        getCourseDetail(targetCourseId),
        listCoursePricing(targetCourseId),
        listCourseContent(targetCourseId),
      ]);

      setCourseDetail(detail);
      setCourseForm(toCourseForm(detail));
      setPricingItems(pricing);
      setPricingForm(pricing.length ? toPricingForm(pricing[0]) : defaultPricingForm);
      setContentItems(content);
      setContentForm((current) => ({
        ...current,
        sectionKey: detail?.sections?.[0]?.key ?? current.sectionKey,
        order:
          detail?.sections?.[0]?.key
            ? content.filter((item) => item.sectionKey === detail.sections[0].key).length + 1
            : content.length + 1,
      }));

      const firstVideoId =
        content.find((item) => item.type === "video")?.refId ?? "";
      setSelectedVideoId(firstVideoId);
      setEditingVideoId("");
      setVideoForm({
        ...defaultVideoForm,
        sectionKey: detail?.sections?.[0]?.key ?? "",
        order: content.filter((item) => item.type === "video").length + 1,
      });

      if (firstVideoId) {
        const cues = await listVideoCues(firstVideoId);
        setVideoCues(cues);
      } else {
        setVideoCues([]);
      }

      if (detail?.trailerVideoId) {
        try {
          const trailer = await getCourseTrailerStream(targetCourseId);
          setTrailerStreamUrl(trailer?.streamUrl ?? null);
          setTrailerThumbnailUrl(trailer?.thumbnailUrl ?? null);
          setTrailerUploadStatus("Saved trailer preview is ready to review.");
        } catch (trailerError) {
          setTrailerStreamUrl(null);
          setTrailerThumbnailUrl(null);
          if (trailerError instanceof Error) {
            setTrailerUploadStatus(trailerError.message);
          } else {
            setTrailerUploadStatus("Trailer preview is not ready yet.");
          }
        }
      } else {
        setTrailerStreamUrl(null);
        setTrailerThumbnailUrl(null);
        setTrailerUploadStatus(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load course builder data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      hydrateCourse(courseId);
    }
  }, [courseId, hydrateCourse]);

  useEffect(() => {
    if (!selectedVideoId) {
      setVideoCues([]);
      setCuePreviewStreamUrl(null);
      setCuePreviewThumbnailUrl(null);
      setCuePreviewStatus(null);
      setCuePreviewLoading(false);
      return;
    }

    let isCancelled = false;
    setCuePreviewLoading(true);

    Promise.allSettled([
      listVideoCues(selectedVideoId),
      getAdminCourseVideoStream(selectedVideoId),
    ])
      .then(([cuesResult, streamResult]) => {
        if (isCancelled) {
          return;
        }

        if (cuesResult.status === "fulfilled") {
          setVideoCues(cuesResult.value);
        } else {
          setVideoCues([]);
        }

        if (streamResult.status === "fulfilled") {
          setCuePreviewStreamUrl(streamResult.value?.streamUrl ?? null);
          setCuePreviewThumbnailUrl(streamResult.value?.thumbnailUrl ?? null);
          setCuePreviewStatus(
            streamResult.value?.streamUrl
              ? null
              : "Preview will appear after Bunny finishes processing the lesson.",
          );
        } else {
          const message =
            streamResult.reason instanceof Error
              ? streamResult.reason.message
              : "Preview is not ready yet.";
          setCuePreviewStreamUrl(null);
          setCuePreviewThumbnailUrl(null);
          setCuePreviewStatus(message);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setCuePreviewLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedVideoId]);

  const setStep = (index) => {
    setStepIndex(index);
  };

  const nextStep = () => {
    setStepIndex((current) => Math.min(current + 1, courseSteps.length - 1));
  };

  const previousStep = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const toggleGame = (gameId) => {
    resetFlash();
    setCourseForm((current) => {
      const exists = current.games.some((item) => item.gameId === gameId);
      if (exists) {
        return {
          ...current,
          games: current.games.filter((item) => item.gameId !== gameId),
        };
      }

      return {
        ...current,
        games: [...current.games, { gameId, weight: 0 }],
      };
    });
  };

  const updateGameWeight = (gameId, weight) => {
    resetFlash();
    setCourseForm((current) => ({
      ...current,
      games: current.games.map((item) =>
        item.gameId === gameId ? { ...item, weight } : item,
      ),
    }));
  };

  const saveBasics = async () => {
    resetFlash();

    const validationError = getBasicsValidationError();
    if (validationError) {
      setError(validationError);
      showToast({
        type: "warning",
        message: "Course basics are incomplete.",
        options: { description: validationError },
      });
      return;
    }

    setLoading(true);

    try {
      const payload = buildCoursePayload();
      const course = activeCourseId
        ? await updateCourseDraft(activeCourseId, payload)
        : await createCourseDraft(payload);

      const nextCourseId = String(course._id);
      setActiveCourseId(nextCourseId);
      setCourseDetail(course);
      const successMessage = activeCourseId ? "Course draft updated." : "Course draft created.";
      setSuccess(successMessage);
      showToast({
        type: "success",
        message: successMessage,
        options: {
          description: "The first course step is saved and you can continue to pricing.",
        },
      });
      onCourseSaved?.(nextCourseId);
      await hydrateCourse(nextCourseId);
      nextStep();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save course draft.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to save course draft.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setLoading(false);
    }
  };

  const ensureCourseDraftForMediaUpload = useCallback(async () => {
    if (activeCourseId) {
      return activeCourseId;
    }

    const validationError = getBasicsValidationError();
    if (validationError) {
      showToast({
        type: "warning",
        message: "Finish the basics before uploading media.",
        options: { description: validationError },
      });
      throw new Error(`Save the course basics first. ${validationError}`);
    }

    const course = await createCourseDraft(buildCoursePayload());
    const nextCourseId = String(course._id);
    setActiveCourseId(nextCourseId);
    setCourseDetail(course);
    onCourseSaved?.(nextCourseId);
    return nextCourseId;
  }, [activeCourseId, buildCoursePayload, getBasicsValidationError, onCourseSaved]);

  const uploadTrailerVideo = async (file: File) => {
    resetFlash();
    setTrailerUploading(true);
    setTrailerUploadStatus("Preparing course trailer upload...");

    try {
      const targetCourseId = await ensureCourseDraftForMediaUpload();
      const upload = await createCourseTrailerUploadUrl(targetCourseId, {
        title: `${courseForm.title.trim()} Trailer`,
        description:
          courseForm.shortDescription.trim() ||
          courseForm.description.trim().slice(0, 240) ||
          undefined,
      });

      setTrailerUploadStatus("Uploading trailer to Bunny...");
      await uploadVideoToBunny({
        uploadUrl: upload.uploadUrl,
        headers: upload.headers,
        file,
      });

      await updateCourseDraft(targetCourseId, { trailerVideoId: upload.videoId });

      setCourseForm((current) => ({
        ...current,
        trailerVideoId: upload.videoId,
      }));
      setTrailerStreamUrl(null);
      setTrailerThumbnailUrl(null);
      setTrailerUploadStatus("Trailer uploaded. Bunny is processing the preview.");
      setSuccess("Trailer upload started successfully.");
    } catch (err) {
      setTrailerUploadStatus(null);
      const message = err instanceof Error ? err.message : "Unable to upload the trailer.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to upload trailer.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setTrailerUploading(false);
    }
  };

  const savePricing = async () => {
    if (!activeCourseId) {
      setError("Create the course draft first.");
      showToast({
        type: "warning",
        message: "Create the course draft first.",
      });
      return;
    }

    resetFlash();
    setLoading(true);
    try {
      const pricing = await upsertCoursePricing(activeCourseId, {
        region: pricingForm.region,
        currency: pricingForm.currency,
        amount6mo: Number(pricingForm.amount6mo),
        amount1yr: Number(pricingForm.amount1yr),
        stripeProductId6mo: pricingForm.stripeProductId6mo || undefined,
        stripeProductId1yr: pricingForm.stripeProductId1yr || undefined,
        stripePriceId6mo: pricingForm.stripePriceId6mo || undefined,
        stripePriceId1yr: pricingForm.stripePriceId1yr || undefined,
      });
      const items = await listCoursePricing(activeCourseId);
      setPricingItems(items);
      setPricingForm(toPricingForm(pricing));
      setSuccess("Pricing saved.");
      showToast({
        type: "success",
        message: "Pricing saved.",
        options: {
          description: `${pricing.region} pricing is ready and will be shown first when you reopen this step.`,
        },
      });
      nextStep();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save pricing.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to save pricing.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSections = async () => {
    if (!activeCourseId) {
      setError("Create the course draft first.");
      showToast({
        type: "warning",
        message: "Create the course draft first.",
      });
      return;
    }

    const normalizedSections = courseForm.sections
      .map((section, index) => ({
        key: section.key.trim() || slugifySectionKey(section.title),
        title: section.title.trim(),
        description: section.description.trim(),
        order: index + 1,
      }))
      .filter((section) => section.key && section.title);

    if (!normalizedSections.length) {
      setError("Add at least one section before continuing.");
      showToast({
        type: "warning",
        message: "Add at least one section.",
      });
      return;
    }

    resetFlash();
    setLoading(true);
    try {
      await updateCourseDraft(activeCourseId, { sections: normalizedSections });
      setCourseForm((current) => ({
        ...current,
        sections: normalizedSections,
      }));
      setSuccess("Sections saved.");
      showToast({
        type: "success",
        message: "Sections saved.",
        options: {
          description: "You can now assign videos and activities into those sections.",
        },
      });
      nextStep();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save sections.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to save sections.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPricingIntoForm = (pricing) => {
    resetFlash();
    setPricingForm(toPricingForm(pricing));
    showToast({
      type: "info",
      message: `${pricing.region} pricing loaded.`,
      options: {
        description: "You can now update the saved amounts or Stripe IDs and save again.",
      },
    });
  };

  const removePricing = async (region: string) => {
    if (!activeCourseId) {
      return;
    }

    resetFlash();
    setDeletingPricingRegion(region);

    try {
      await deleteCoursePricing(activeCourseId, region);
      const items = await listCoursePricing(activeCourseId);
      setPricingItems(items);

      if (items.length) {
        setPricingForm(toPricingForm(items[0]));
      } else {
        setPricingForm(defaultPricingForm);
      }

      showToast({
        type: "success",
        message: "Pricing deleted.",
        options: {
          description: `${region} pricing was removed from this course.`,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete pricing.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to delete pricing.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setDeletingPricingRegion(null);
    }
  };

  const createVideoUpload = async () => {
    if (!activeCourseId) {
      setError("Create the course draft first.");
      showToast({
        type: "warning",
        message: "Create the course draft first.",
      });
      return;
    }

    if (!videoForm.file) {
      setError("Choose a video file before starting the upload.");
      showToast({
        type: "warning",
        message: "Choose a video file before uploading.",
      });
      return;
    }

    if (!videoForm.title.trim()) {
      setError("Add a video title before starting the upload.");
      showToast({
        type: "warning",
        message: "Add a video title before uploading.",
      });
      return;
    }

    if (!videoForm.sectionKey) {
      setError("Select a section before uploading a lesson video.");
      showToast({
        type: "warning",
        message: "Select a section before uploading.",
      });
      return;
    }

    resetFlash();
    setLoading(true);
    try {
      setUploadStatus("Creating upload URL...");
      const upload = await createCourseVideoUploadUrl(activeCourseId, {
        title: videoForm.title.trim(),
        description: videoForm.description.trim() || undefined,
        sectionKey: videoForm.sectionKey,
        order: Number(videoForm.order),
      });
      setUploadStatus("Uploading video to Bunny...");
      await uploadVideoToBunny({
        uploadUrl: upload.uploadUrl,
        headers: upload.headers,
        file: videoForm.file,
      });
      if (videoForm.thumbnailUrl.trim()) {
        await updateAdminVideo(upload.videoId, {
          thumbnailUrl: videoForm.thumbnailUrl.trim(),
        });
      }
      setUploadStatus("Upload sent. Wait for Bunny webhook to mark it ready.");
      const content = await listCourseContent(activeCourseId);
      setContentItems(content);
      setSelectedVideoId(upload.videoId);
      resetVideoDraft(content.filter((item) => item.type === "video"));
      setSuccess("Video upload started successfully.");
      showToast({
        type: "success",
        message: "Video upload started.",
        options: {
          description: "The lesson video is uploading to Bunny and the thumbnail has been saved.",
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start video upload.";
      setError(message);
      setUploadStatus(null);
      showToast({
        type: "error",
        message: "Unable to start video upload.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVideoIntoEditor = (video) => {
    resetFlash();
    setEditingVideoId(video.videoId || video.refId);
    setSelectedVideoId(video.videoId || video.refId);
    setVideoForm({
      title: video.title ?? "",
      description: video.description ?? "",
      sectionKey: video.sectionKey ?? "",
      order: video.order ?? 1,
      file: null,
      thumbnailUrl: video.thumbnailUrl ?? "",
    });
    showToast({
      type: "info",
      message: "Video loaded into editor.",
      options: {
        description: "Update the metadata in the main panel and save your changes.",
      },
    });
  };

  const saveVideoMetadata = async () => {
    if (!editingVideoId) {
      showToast({
        type: "warning",
        message: "Select a saved video first.",
        options: {
          description: "Use Edit on a row, or upload a new video instead.",
        },
      });
      return;
    }

    if (!videoForm.title.trim()) {
      showToast({
        type: "warning",
        message: "Add a video title first.",
      });
      return;
    }

    resetFlash();
    setLoading(true);

    try {
      await updateAdminVideo(editingVideoId, {
        title: videoForm.title.trim(),
        description: videoForm.description.trim() || undefined,
        sectionKey: videoForm.sectionKey,
        order: Number(videoForm.order),
        thumbnailUrl: videoForm.thumbnailUrl.trim() || undefined,
      });

      const content = await listCourseContent(activeCourseId);
      setContentItems(content);
      setSuccess("Video updated.");
      showToast({
        type: "success",
        message: "Video updated.",
        options: {
          description: "The lesson metadata and thumbnail were saved.",
        },
      });
      const refreshedVideo = content.find(
        (item) => item.type === "video" && (item.videoId || item.refId) === editingVideoId,
      );
      if (refreshedVideo) {
        setVideoForm({
          title: refreshedVideo.title ?? "",
          description: refreshedVideo.description ?? "",
          sectionKey: refreshedVideo.sectionKey ?? "",
          order: refreshedVideo.order ?? 1,
          file: null,
          thumbnailUrl: refreshedVideo.thumbnailUrl ?? "",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update the video.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to update the video.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = async (videoId: string) => {
    if (!activeCourseId) {
      return;
    }

    if (!contentForm.sectionKey) {
      setError("Select a section before adding a content item.");
      showToast({
        type: "warning",
        message: "Select a section before adding content.",
      });
      return;
    }

    resetFlash();
    setDeletingVideoId(videoId);

    try {
      await deleteAdminVideo(videoId);
      const content = await listCourseContent(activeCourseId);
      setContentItems(content);
      if (editingVideoId === videoId) {
        resetVideoDraft(content.filter((item) => item.type === "video"));
      }
      if (selectedVideoId === videoId) {
        setSelectedVideoId("");
      }
      showToast({
        type: "success",
        message: "Video deleted.",
        options: {
          description: "The lesson and its linked content row were removed from the course.",
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete the video.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to delete the video.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  const addGameContent = async () => {
    if (!activeCourseId) {
      setError("Create the course draft first.");
      showToast({
        type: "warning",
        message: "Create the course draft first.",
      });
      return;
    }

    resetFlash();
    setLoading(true);
    try {
      await createCourseContentItem(activeCourseId, {
        type: "game",
        refId: contentForm.refId,
        sectionKey: contentForm.sectionKey,
        order: Number(contentForm.order),
        title: contentForm.title.trim(),
        description: contentForm.description.trim() || undefined,
        durationMinutes: contentForm.durationMinutes
          ? Number(contentForm.durationMinutes)
          : undefined,
        isFree: contentForm.isFree,
      });
      const items = await listCourseContent(activeCourseId);
      setContentItems(items);
      setContentForm({
        ...defaultContentForm,
        sectionKey: courseForm.sections[0]?.key ?? "",
        order:
          courseForm.sections[0]?.key
            ? items.filter((item) => item.sectionKey === courseForm.sections[0].key).length + 1
            : items.length + 1,
      });
      setSuccess("Game content item added.");
      showToast({
        type: "success",
        message: "Content item added.",
        options: {
          description: "The standalone game activity is now part of the course flow.",
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to add content item.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to add content item.",
        options: { description: message, duration: 4500 },
      });
    } finally {
      setLoading(false);
    }
  };

  const reorderContentFlow = async (items) => {
    if (!activeCourseId) {
      return;
    }

    const payload = {
      items: items.map((item, itemIndex) => ({
        itemId: item._id,
        order: itemIndex + 1,
      })),
    };

    resetFlash();
    try {
      const response = await reorderCourseContentItems(activeCourseId, payload);
      setContentItems(response);
      showToast({
        type: "success",
        message: "Content order saved.",
        options: {
          description: "The course flow has been updated to match the new drag order.",
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reorder content.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to reorder content.",
        options: { description: message, duration: 4500 },
      });
    }
  };

  const moveContentItem = async (itemId, direction) => {
    if (!activeCourseId) {
      return;
    }

    const sorted = [...contentItems].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((item) => item._id === itemId);
    if (index < 0) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) {
      return;
    }

    const swapped = [...sorted];
    const temp = swapped[index];
    swapped[index] = swapped[targetIndex];
    swapped[targetIndex] = temp;

    const payload = {
      items: swapped.map((item, itemIndex) => ({
        itemId: item._id,
        order: itemIndex + 1,
      })),
    };

    resetFlash();
    try {
      const items = await reorderCourseContentItems(activeCourseId, payload);
      setContentItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reorder content.");
    }
  };

  const removeContentItem = async (itemId) => {
    resetFlash();
    try {
      await deleteCourseContentItem(itemId);
      const items = await listCourseContent(activeCourseId);
      setContentItems(items);
      showToast({
        type: "success",
        message: "Content item deleted.",
        options: {
          description: "The item was removed and the remaining course flow was compacted.",
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete content item.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to delete content item.",
        options: { description: message, duration: 4500 },
      });
    }
  };

  const addCue = async () => {
    if (!selectedVideoId) {
      const message = "Select a video first.";
      setError(message);
      showToast({ type: "warning", message, options: { duration: 3500 } });
      return;
    }

    if (!cueForm.gameId) {
      const message = "Choose a course game for this cue.";
      setError(message);
      showToast({ type: "warning", message, options: { duration: 3500 } });
      return;
    }

    const triggerAtSeconds = Number(cueForm.triggerAtSeconds);
    if (!Number.isFinite(triggerAtSeconds) || triggerAtSeconds < 0) {
      const message = "Enter a valid cue time in seconds.";
      setError(message);
      showToast({ type: "warning", message, options: { duration: 3500 } });
      return;
    }

    resetFlash();
    setLoading(true);
    try {
      await createVideoCue(selectedVideoId, {
        gameId: cueForm.gameId,
        subActivityKey: cueForm.subActivityKey || undefined,
        triggerAtSeconds,
        title: cueForm.title.trim() || undefined,
        description: cueForm.description.trim() || undefined,
        ctaLabel: cueForm.ctaLabel.trim() || undefined,
        pauseVideo: cueForm.pauseVideo,
        isSkippable: cueForm.isSkippable,
      });
      const items = await listVideoCues(selectedVideoId);
      setVideoCues(items);
      setCueForm(defaultCueForm);
      setSuccess("Video cue added.");
      showToast({
        type: "success",
        message: "Cue added to the lesson timeline.",
        options: {
          description: "The interactive marker is ready in the preview.",
          duration: 3200,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to add cue.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to add cue.",
        options: { description: message, duration: 4200 },
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCue = async (cueId) => {
    if (!selectedVideoId) {
      return;
    }

    resetFlash();
    try {
      await deleteVideoCue(cueId);
      const items = await listVideoCues(selectedVideoId);
      setVideoCues(items);
      showToast({
        type: "success",
        message: "Cue removed from the timeline.",
        options: { duration: 2800 },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete cue.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to delete cue.",
        options: { description: message, duration: 4200 },
      });
    }
  };

  const publishCourse = async () => {
    if (!activeCourseId) {
      const message = "Create the course draft first.";
      setError(message);
      showToast({ type: "warning", message, options: { duration: 3500 } });
      return;
    }

    resetFlash();
    setLoading(true);
    try {
      await updateCourseDraft(activeCourseId, { isPublished: true });
      setSuccess("Course published.");
      showToast({
        type: "success",
        message: "Course published.",
        options: {
          description: "The course is now visible to learners.",
          duration: 3200,
        },
      });
      await hydrateCourse(activeCourseId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to publish course.";
      setError(message);
      showToast({
        type: "error",
        message: "Unable to publish course.",
        options: { description: message, duration: 4200 },
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    activeCourseId,
    stepIndex,
    setStep,
    nextStep,
    previousStep,
    courseForm,
    setCourseForm,
    pricingForm,
    setPricingForm,
    videoForm,
    setVideoForm,
    contentForm,
    setContentForm,
    cueForm,
    setCueForm,
    courseDetail,
    pricingItems,
    contentItems,
    videoItems,
    selectedVideoId,
    setSelectedVideoId,
    editingVideoId,
    videoCues,
    cuePreviewLoading,
    cuePreviewStreamUrl,
    cuePreviewThumbnailUrl,
    cuePreviewStatus,
    uploadStatus,
    trailerUploadStatus,
    trailerUploading,
    trailerStreamUrl,
    trailerThumbnailUrl,
    deletingPricingRegion,
    deletingVideoId,
    loading,
    error,
    success,
    selectedGamesTotal,
    gameItems,
    toggleGame,
    updateGameWeight,
    saveBasics,
    uploadTrailerVideo,
    savePricing,
    saveSections,
    loadPricingIntoForm,
    removePricing,
    createVideoUpload,
    loadVideoIntoEditor,
    saveVideoMetadata,
    removeVideo,
    resetVideoDraft,
    addGameContent,
    reorderContentFlow,
    moveContentItem,
    removeContentItem,
    addCue,
    removeCue,
    publishCourse,
  };
};
