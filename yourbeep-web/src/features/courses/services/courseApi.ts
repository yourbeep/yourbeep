import api from "@services/api";
import type {
  CourseCardItem,
  CourseDetailPageData,
  CourseTrailerStream,
} from "./courseTypes";

type RawCourseListItem = {
  _id: string;
  title: string;
  subtitle?: string | null;
  shortDescription?: string | null;
  thumbnail?: string | null;
  bannerImage?: string | null;
  overview?: string | null;
  durationMinutes?: number | null;
  estimatedDurationText?: string | null;
  difficultyLevel?: "beginner" | "intermediate" | "advanced" | null;
  language?: string | null;
  certificateIncluded?: boolean | null;
  communityAccess?: boolean | null;
  instructor?: {
    name?: string | null;
    title?: string | null;
    bio?: string | null;
    avatar?: string | null;
  } | null;
  whatYouWillLearn?: string[] | null;
  courseHighlights?: string[] | null;
  whoItsFor?: string[] | null;
  whoItsNotFor?: string[] | null;
  faq?: Array<{ question?: string | null; answer?: string | null }> | null;
  featuredTestimonial?: {
    quote?: string | null;
    name?: string | null;
    role?: string | null;
    avatar?: string | null;
  } | null;
  pricing?: {
    sixMonthAmount?: number;
    annualAmount?: number;
    amount?: number;
    displayPrice?: string | null;
    currency?: string | null;
    region?: string | null;
  } | null;
  userProgress?: {
    hasPurchase?: boolean;
    planType?: string | null;
    expiresAt?: string | null;
    gamesCompleted?: number;
    gamesTotal?: number;
    percentComplete?: number;
  } | null;
};

type RawPurchase = {
  courseId: string;
  accessGranted?: boolean;
  status?: string;
};

type RawCourseDetail = {
  _id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  thumbnail?: string | null;
  bannerImage?: string | null;
  overview?: string | null;
  durationMinutes?: number | null;
  estimatedDurationText?: string | null;
  difficultyLevel?: "beginner" | "intermediate" | "advanced" | null;
  language?: string | null;
  certificateIncluded?: boolean | null;
  communityAccess?: boolean | null;
  trailerVideoId?: string | null;
  instructor?: {
    name?: string | null;
    title?: string | null;
    bio?: string | null;
    avatar?: string | null;
  } | null;
  whatYouWillLearn?: string[] | null;
  courseHighlights?: string[] | null;
  whoItsFor?: string[] | null;
  whoItsNotFor?: string[] | null;
  faq?: Array<{ question?: string | null; answer?: string | null }> | null;
  featuredTestimonial?: {
    quote?: string | null;
    name?: string | null;
    role?: string | null;
    avatar?: string | null;
  } | null;
  lessonCount?: number | null;
  practiceCount?: number | null;
  games?: Array<{
    _id?: string;
    gameId?: string;
    title?: string;
    type?: string;
    gameKey?: string;
  }>;
  contentItems?: Array<{
    _id: string;
    title?: string;
    type?: string;
    description?: string | null;
  }>;
};

const fallbackCourseImage =
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80";

const buildBuyLabel = (
  pricing: RawCourseListItem["pricing"],
  durationMinutes: number,
) => {
  if (pricing?.annualAmount) {
    return `Unlock from INR ${pricing.annualAmount}`;
  }

  if (pricing?.sixMonthAmount) {
    return `Unlock from INR ${pricing.sixMonthAmount}`;
  }

  if (pricing?.displayPrice) {
    return `Unlock from ${pricing.displayPrice}`;
  }

  if (durationMinutes > 0) {
    return `${durationMinutes} min journey`;
  }

  return "Course access";
};

const buildModules = (detail: RawCourseDetail) => {
  if (detail.contentItems?.length) {
    return detail.contentItems.slice(0, 4).map((item, index) => ({
      id: item._id,
      title: item.title || `Module ${index + 1}`,
      type: item.type || "lesson",
      description:
        item.description ||
        "A guided step in your journey toward deeper self-observation and embodied clarity.",
      points: [
        "Guided exploration",
        "Embodied reflection",
        "Practical integration",
      ],
    }));
  }

  return (
    detail.games?.map((game, index) => ({
      id: String(game._id || game.gameId || index),
      title: game.title || `Module ${index + 1}`,
      type: game.type || "game",
      description:
        "Interactive practice designed to turn insight into embodied action.",
      points: ["Somatic awareness", "Pattern recognition", "Reflect and act"],
    })) ?? []
  );
};

const getAccessibleCourseIds = (purchases: RawPurchase[]) =>
  new Set(
    purchases
      .filter((purchase) => purchase.accessGranted && purchase.status === "active")
      .map((purchase) => String(purchase.courseId)),
  );

export const courseApi = {
  async getCourseLibrary(): Promise<CourseCardItem[]> {
    const [courseResponse, purchasesResponse] = await Promise.all([
      api.get("/courses"),
      api.get("/users/me/purchases").catch(() => null),
    ]);

    const rawCourses = (courseResponse.data?.data?.courses ?? []) as RawCourseListItem[];
    const purchases = (purchasesResponse?.data?.data?.purchases ?? []) as RawPurchase[];
    const accessibleCourseIds = getAccessibleCourseIds(purchases);

    const courseDetails = await Promise.all(
      rawCourses.map((course) =>
        api
          .get(`/courses/${course._id}`)
          .then((response) => response.data?.data as RawCourseDetail)
          .catch(() => null),
      ),
    );

    return rawCourses.map((course, index) => {
      const detail = courseDetails[index];
      const hasAccess = accessibleCourseIds.has(String(course._id));
      const durationMinutes = Number(
        course.durationMinutes ?? detail?.durationMinutes ?? 0,
      );

      return {
        id: String(course._id),
        title: course.title,
        subtitle: course.subtitle ?? buildBuyLabel(course.pricing, durationMinutes),
        description:
          course.shortDescription ??
          detail?.shortDescription ??
          "A guided course designed for calm, clarity, and deeper self-observation.",
        thumbnail: course.thumbnail || detail?.thumbnail || fallbackCourseImage,
        bannerImage:
          course.bannerImage ||
          detail?.bannerImage ||
          course.thumbnail ||
          detail?.thumbnail ||
          fallbackCourseImage,
        durationMinutes,
        estimatedDurationText:
          course.estimatedDurationText ?? detail?.estimatedDurationText ?? undefined,
        difficultyLevel:
          course.difficultyLevel ?? detail?.difficultyLevel ?? undefined,
        language: course.language ?? detail?.language ?? undefined,
        certificateIncluded: Boolean(
          course.certificateIncluded ?? detail?.certificateIncluded,
        ),
        communityAccess: Boolean(
          course.communityAccess ?? detail?.communityAccess,
        ),
        instructor: detail?.instructor
          ? {
              name: detail.instructor.name || "",
              title: detail.instructor.title || undefined,
              bio: detail.instructor.bio || undefined,
              avatar: detail.instructor.avatar || undefined,
            }
          : undefined,
        pricing: course.pricing ?? {},
        hasAccess,
        progressPercent: Number(course.userProgress?.percentComplete ?? 0),
        planType: course.userProgress?.planType ?? null,
        gamesCompleted: Number(course.userProgress?.gamesCompleted ?? 0),
        gamesTotal: Number(course.userProgress?.gamesTotal ?? 0),
        gamesCount: detail?.games?.length ?? 0,
      };
    });
  },

  async getCourseDetail(courseId: string): Promise<CourseDetailPageData> {
    const [listResponse, detailResponse, purchasesResponse] = await Promise.all([
      api.get("/courses"),
      api.get(`/courses/${courseId}`),
      api.get("/users/me/purchases").catch(() => null),
    ]);

    const rawCourses = (listResponse.data?.data?.courses ?? []) as RawCourseListItem[];
    const detail = detailResponse.data?.data as RawCourseDetail;
    const purchases = (purchasesResponse?.data?.data?.purchases ?? []) as RawPurchase[];
    const accessibleCourseIds = getAccessibleCourseIds(purchases);
    const listItem = rawCourses.find((course) => String(course._id) === courseId);

    const durationMinutes = Number(
      listItem?.durationMinutes ?? detail.durationMinutes ?? 0,
    );

    return {
      id: String(detail._id),
      title: detail.title,
      subtitle:
        detail.subtitle ??
        listItem?.subtitle ??
        buildBuyLabel(listItem?.pricing, durationMinutes),
      description:
        detail.description ??
        listItem?.shortDescription ??
        "A somatic approach to decoding the unspoken narratives of the nervous system.",
      thumbnail: detail.thumbnail || listItem?.thumbnail || fallbackCourseImage,
      bannerImage:
        detail.bannerImage ||
        listItem?.bannerImage ||
        detail.thumbnail ||
        listItem?.thumbnail ||
        fallbackCourseImage,
      durationMinutes,
      estimatedDurationText:
        detail.estimatedDurationText ?? listItem?.estimatedDurationText ?? undefined,
      difficultyLevel:
        detail.difficultyLevel ?? listItem?.difficultyLevel ?? undefined,
      language: detail.language ?? listItem?.language ?? undefined,
      certificateIncluded: Boolean(
        detail.certificateIncluded ?? listItem?.certificateIncluded,
      ),
      communityAccess: Boolean(
        detail.communityAccess ?? listItem?.communityAccess,
      ),
      instructor: detail.instructor
        ? {
            name: detail.instructor.name || "",
            title: detail.instructor.title || undefined,
            bio: detail.instructor.bio || undefined,
            avatar: detail.instructor.avatar || undefined,
          }
        : undefined,
      pricing: listItem?.pricing ?? {},
      hasAccess: accessibleCourseIds.has(courseId),
      progressPercent: Number(listItem?.userProgress?.percentComplete ?? 0),
      planType: listItem?.userProgress?.planType ?? null,
      gamesCompleted: Number(listItem?.userProgress?.gamesCompleted ?? 0),
      gamesTotal: Number(listItem?.userProgress?.gamesTotal ?? 0),
      gamesCount: detail.games?.length ?? 0,
      overview: detail.overview ?? listItem?.overview ?? undefined,
      trailerVideoId: detail.trailerVideoId ?? undefined,
      whatYouWillLearn: detail.whatYouWillLearn?.filter(Boolean) ?? [],
      courseHighlights: detail.courseHighlights?.filter(Boolean) ?? [],
      whoItsFor: detail.whoItsFor?.filter(Boolean) ?? [],
      whoItsNotFor: detail.whoItsNotFor?.filter(Boolean) ?? [],
      faq:
        detail.faq?.flatMap((item) =>
          item.question && item.answer
            ? [{ question: item.question, answer: item.answer }]
            : [],
        ) ?? [],
      featuredTestimonial:
        detail.featuredTestimonial?.quote && detail.featuredTestimonial?.name
          ? {
              quote: detail.featuredTestimonial.quote,
              name: detail.featuredTestimonial.name,
              role: detail.featuredTestimonial.role || undefined,
              avatar: detail.featuredTestimonial.avatar || undefined,
            }
          : undefined,
      lessonCount: Number(detail.lessonCount ?? 0),
      practiceCount: Number(detail.practiceCount ?? 0),
      gameTitles:
        detail.games?.map((game) => game.title).filter(Boolean) as
          | string[]
          | undefined,
      contentPreview:
        detail.contentItems?.map((item) => ({
          id: item._id,
          title: item.title || "Untitled lesson",
          type: item.type || "lesson",
          description:
            item.description ||
            "A guided step in your journey toward deeper self-observation.",
        })) ?? [],
      modules: buildModules(detail),
    };
  },

  async getCourseTrailerStream(courseId: string): Promise<CourseTrailerStream> {
    const response = await api.get(`/courses/${courseId}/trailer/stream`);
    const data = response.data?.data ?? {};

    return {
      streamUrl: String(data.streamUrl || ""),
      expiresIn: Number(data.expiresIn ?? 0),
      title: String(data.title || "Course trailer"),
      durationSeconds: Number(data.durationSeconds ?? 0),
      thumbnailUrl: typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : null,
    };
  },
};
